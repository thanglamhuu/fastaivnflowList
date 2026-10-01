import React, { useEffect, useRef } from 'react';
import { EditorContent, Editor as TiptapEditor } from '@tiptap/react';
import { SCENE_ID_REGEX } from '../types';
import { turndownService } from '../services/turndown';
interface EditorProps {
  editor: TiptapEditor | null;
  content: string;
  onChange: (markdown: string) => void;
}
const Editor: React.FC<EditorProps> = ({ editor, content }) => {
  const lastSetMarkdownRef = useRef('');
  useEffect(() => {
    if (!editor || editor.isDestroyed || content === undefined) return;
    // Safety: check if the editor view is actually available yet.
    // Tiptap's proxy will throw if we access view or view-related properties too early.
    try {
      if (!editor.view || !editor.view.dom) return;
    } catch (e) {
      return;
    }
    const normalizedIncoming = content.trim();
    let currentMarkdown = '';
    try {
      currentMarkdown = turndownService.turndown(editor.getHTML()).trim();
    } catch (e) {
      return;
    }
    
    // Safety check: if content hasn't actually changed, don't force a re-render/set
    if (normalizedIncoming === currentMarkdown && lastSetMarkdownRef.current !== '') {
      return;
    }
    let isFocused = false;
    try {
      isFocused = editor.isFocused;
    } catch (e) {
      // Ignore focus check if view is not ready
    }
    if (isFocused) {
      // Normalize whitespace for a loose comparison to avoid interrupting active typing
      const cleanForCompare = (str: string) => 
        str.replace(/<!--\s*scene-id:.*?-->/g, '')
           .replace(/\s+/g, ' ')
           .trim();
      if (cleanForCompare(normalizedIncoming) === cleanForCompare(currentMarkdown)) {
        return;
      }
    }
    // Split incoming markdown by line to process blocks more robustly than double-newline splitting
    const lines = content.split('\x0a');
    let htmlBlocks: string[] = [];
    let currentParagraphLines: string[] = [];
    let lastSceneId: string | null = null;
    const processParagraph = (linesArr: string[]) => {
      if (linesArr.length === 0) return '';
      
      // Split lines into separate blocks when a character name or parenthetical is encountered,
      // so each gets its own <p> and CSS :has() selectors can match correctly.
      const blocks: string[] = [];
      let currentLines: string[] = [];
      const flushCurrent = () => {
        if (currentLines.length === 0) return;
        let html = '';
        for (let i = 0; i < currentLines.length; i++) {
          html += (html ? '<br>' : '') + currentLines[i];
        }
        blocks.push(`<p>${html}</p>`);
        currentLines = [];
      };
      
      for (let i = 0; i < linesArr.length; i++) {
        const line = linesArr[i];
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        // Character names (Exact matches for **NAME**) — own paragraph
        if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
          flushCurrent();
          blocks.push(`<p><strong>${trimmed.slice(2, -2)}</strong></p>`);
          continue;
        }
        // Character name with inline parenthetical (e.g. **NAME**_(action)_)
        const inlineParenMatch = trimmed.match(/^\*\*(.+?)\*\*\s*[_*]\(?(.*?)\)?[_*]$/);
        if (inlineParenMatch) {
          flushCurrent();
          blocks.push(`<p><strong>${inlineParenMatch[1]}</strong><em>(${inlineParenMatch[2].replace(/^\(|\)$/g, '')})</em></p>`);
          continue;
        }
        
        // Parentheticals (Exact matches for _(text)_ or *(text)*) — own paragraph
        const parentheticalMatch = trimmed.match(/^[_*]\s*\((.*?)\)\s*[_*]$/);
        if (parentheticalMatch) {
          flushCurrent();
          blocks.push(`<p><em>(${parentheticalMatch[1]})</em></p>`);
          continue;
        }
        
        // Inline formatting (Bold/Italic)
        let parsedLine = line;
        parsedLine = parsedLine.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        parsedLine = parsedLine.replace(/__(.+?)__/g, '<strong>$1</strong>');
        parsedLine = parsedLine.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        parsedLine = parsedLine.replace(/_([^_]+)_/g, '<em>$1</em>');
        currentLines.push(parsedLine);
      }
      flushCurrent();
      
      return blocks.join('');
    };
    const flushParagraph = () => {
      if (currentParagraphLines.length > 0) {
        htmlBlocks.push(processParagraph(currentParagraphLines));
        currentParagraphLines = [];
      }
    };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      // Skip ID comments but store for the next heading
      const idMatch = line.match(SCENE_ID_REGEX);
      if (idMatch) {
        lastSceneId = idMatch[1];
        continue;
      }
      if (!trimmed) {
        flushParagraph();
        continue;
      }
      // Title (H1)
      if (line.startsWith('# ')) {
        flushParagraph();
        htmlBlocks.push(`<h1>${line.replace('# ', '').trim()}</h1>`);
        continue;
      }
      // Scene Heading (H3)
      if (line.startsWith('### ')) {
        flushParagraph();
        const heading = line.replace('### ', '').trim();
        const idAttr = lastSceneId ? `data-scene-id="${lastSceneId}" id="${lastSceneId}"` : '';
        lastSceneId = null; 
        htmlBlocks.push(`<h3 ${idAttr}>${heading}</h3>`);
        continue;
      }
      // Transitions (H5)
      if (line.startsWith('##### ')) {
        flushParagraph();
        htmlBlocks.push(`<h5>${line.replace('##### ', '').trim()}</h5>`);
        continue;
      }
      // Blockquotes
      if (line.startsWith('>')) {
        flushParagraph();
        const text = line.replace(/^>\s*/, '').trim();
        htmlBlocks.push(`<blockquote><p>${text}</p></blockquote>`);
        continue;
      }
      // If we got here, it's part of a paragraph
      currentParagraphLines.push(line);
    }
    flushParagraph();
    const incomingHtml = htmlBlocks.filter(b => b !== '').join('');
    // Preserve selection if the user is currently editing
    let from = 0, to = 0;
    if (isFocused) {
      const selection = editor.state.selection;
      from = selection.from;
      to = selection.to;
    }
    try {
      editor.commands.setContent(incomingHtml, { emitUpdate: false });
      lastSetMarkdownRef.current = normalizedIncoming;
      if (isFocused) {
        try {
          editor.commands.setTextSelection({ from, to });
        } catch (e) {
          // Fallback for out-of-bounds selection errors
        }
      }
    } catch (e) {
      // Failed to set content, likely because the view is not ready or was destroyed
    }
  }, [editor, content]);
  return <EditorContent editor={editor} />;
};
export default Editor;