import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Plugin } from '@tiptap/pm/state';
import Editor from './Editor';
import Toolbar from './Toolbar';
import { ScriptScene, ScriptContext, Asset, CharacterAsset, LocationAsset, PropAsset } from '../types';
import { parseScriptToScenes, joinScenes, validateAndCleanScenes } from '../services/sceneParser';
import { Flow } from 'flow-sdk';
import { turndownService } from '../services/turndown';
import { Icon } from './Icon';
const Loader2: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);
/** Generate a stable scene UUID */
const generateSceneId = () => {
  try {
    return `scene-${crypto.randomUUID()}`;
  } catch (e) {
    return `scene-${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;
  }
};
const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'scene-id': {
        default: null,
        parseHTML: element => element.getAttribute('data-scene-id'),
        renderHTML: attributes => {
          if (!attributes['scene-id']) return {};
          return { 'data-scene-id': attributes['scene-id'] };
        },
      },
      id: {
        default: null,
        parseHTML: element => element.getAttribute('id'),
        renderHTML: attributes => {
          if (!attributes.id) return {};
          return { id: attributes.id };
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        // Auto-assign a stable scene-id to any H3 heading that doesn't have one,
        // AND fix duplicates (e.g. from copy-paste which preserves attributes).
        appendTransaction(_transactions, _oldState, newState) {
          // Skip traversal on cursor-only movements — only process when doc changed
          if (!_transactions.some(tr => tr.docChanged)) return null;
          let tr: ReturnType<typeof newState.tr.setNodeMarkup> | null = null;
          const seenIds = new Set<string>();
          newState.doc.descendants((node, pos) => {
            if (node.type.name === 'heading' && node.attrs.level === 3) {
              const existingId = node.attrs['scene-id'];
              if (!existingId || seenIds.has(existingId)) {
                // Missing ID or duplicate (from copy-paste) — assign a fresh one
                if (!tr) tr = newState.tr;
                const newId = generateSceneId();
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  'scene-id': newId,
                  id: newId,
                });
                seenIds.add(newId);
              } else {
                seenIds.add(existingId);
              }
            }
          });
          return tr;
        },
      }),
    ];
  },
});
interface ScriptViewProps {
  onTitleChange?: (title: string) => void;
  fullMarkdown: string;
  onMarkdownChange: (markdown: string) => void;
  assets?: Asset[];
  globalStyle?: string;
  onGlobalStyleChange?: (style: string) => void;
  customStyleLibrary?: Record<string, string>;
  onOpenCustomStyleModal?: (editingName?: string) => void;
  onRemoveCustomStyle?: (name: string) => void;
}
export function ScriptView({ onTitleChange, fullMarkdown, onMarkdownChange, assets = [], globalStyle = 'Realistic', onGlobalStyleChange, customStyleLibrary = {}, onOpenCustomStyleModal, onRemoveCustomStyle }: ScriptViewProps) {
  const [scenes, setScenes] = useState<ScriptScene[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scriptFont, setScriptFont] = useState<'helvetica' | 'courier'>('helvetica');
  const [agentPrompt, setAgentPrompt] = useState('');
  const agentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Build asset context string from pre-created assets
  const assetContextString = useMemo(() => {
    if (assets.length === 0) return '';
    const formatAsset = (a: Asset) => {
      const parts = [`- ${a.name} (${a.type})`];
      const desc = (a as CharacterAsset | LocationAsset | PropAsset).physicalCharacteristics;
      if (desc) parts.push(`  Description: ${desc}`);
      if (a.type === 'character') {
        const ca = a as CharacterAsset;
        if (ca.clothingAccessories) parts.push(`  Clothing: ${ca.clothingAccessories}`);
        if (ca.backstory) parts.push(`  Backstory: ${ca.backstory}`);
      }
      if (a.type === 'location') {
        const la = a as LocationAsset;
        if (la.timeOfDay) parts.push(`  Time of Day: ${la.timeOfDay}`);
      }
      return parts.join('\x0a');
    };
    const chars = assets.filter(a => a.type === 'character').map(formatAsset).join('\x0a');
    const locs = assets.filter(a => a.type === 'location').map(formatAsset).join('\x0a');
    const props = assets.filter(a => a.type === 'prop').map(formatAsset).join('\x0a');
    const sections = [];
    if (chars) sections.push(`Characters:\x0a${chars}`);
    if (locs) sections.push(`Locations:\x0a${locs}`);
    if (props) sections.push(`Props:\x0a${props}`);
    return sections.join('\x0a\x0a');
  }, [assets]);
  const [context, setContext] = useState<ScriptContext>({ brief: '', scratchpad: '', assets: '' });
  useEffect(() => {
    const parsed = parseScriptToScenes(fullMarkdown);
    const cleaned = validateAndCleanScenes(parsed);
    setScenes(cleaned);
  }, [fullMarkdown]);
  const isHydratedRef = useRef(false);
  const editor = useEditor({
    autofocus: true,
    extensions: [
      StarterKit.configure({ heading: false }),
      CustomHeading.configure({ levels: [1, 2, 3, 5] }),
      Underline,
      Placeholder.configure({
        placeholder: 'Write your script or prompt story ideas below...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[80vh] cursor-text',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = turndownService.turndown(html);
      
      // Extract title from markdown (first # Heading)
      const titleMatch = markdown.match(/^#\s+(.*)$/m);
      if (titleMatch && onTitleChange) {
        onTitleChange(titleMatch[1].trim());
      } else if (!titleMatch && onTitleChange) {
        onTitleChange('Untitled Story');
      }
      // Only update the parent if we've already hydrated from the parent once
      if (isHydratedRef.current) {
        onMarkdownChange(markdown);
      }
    },
  });
  useEffect(() => {
    let isMounted = true;
    if (editor && fullMarkdown && !isHydratedRef.current) {
      const timer = setTimeout(() => {
        if (!isMounted || !editor || editor.isDestroyed) return;
        isHydratedRef.current = true;
      }, 50);
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    } else if (editor && !fullMarkdown && !isHydratedRef.current) {
      isHydratedRef.current = true;
    }
    return () => { isMounted = false; };
  }, [editor, fullMarkdown]);
  // Handle clicks on the blockquote X (::after) button to remove comment styling
  useEffect(() => {
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl || !editor) return;
    const handleClick = (e: MouseEvent) => {
      if (!editor || editor.isDestroyed) return;
      
      const target = e.target as HTMLElement;
      const bq = target.closest('blockquote');
      if (!bq) return;
      
      const rect = bq.getBoundingClientRect();
      const clickX = e.clientX;
      const clickY = e.clientY;
      // Check if click is in the top-right area where the X button is (20x20 at top:8 right:8)
      if (clickX >= rect.right - 28 && clickY <= rect.top + 28) {
        e.preventDefault();
        e.stopPropagation();
        
        try {
          // Find the blockquote node position and delete the entire block
          const pos = editor.view.posAtDOM(bq, 0);
          if (pos !== undefined) {
            const resolved = editor.state.doc.resolve(pos);
            // Walk up to find the blockquote node
            for (let d = resolved.depth; d > 0; d--) {
              if (resolved.node(d).type.name === 'blockquote') {
                const from = resolved.before(d);
                const to = resolved.after(d);
                editor.chain().focus().deleteRange({ from, to }).run();
                break;
              }
            }
          }
        } catch (err) {
          console.error('Failed to delete blockquote:', err);
        }
      }
    };
    scrollEl.addEventListener('click', handleClick);
    return () => scrollEl.removeEventListener('click', handleClick);
  }, [editor]);
  const isEmpty = !fullMarkdown || fullMarkdown.trim().length === 0;
  const handleAgentSubmit = async () => {
    if (!agentPrompt.trim() || isGenerating) return;
    const currentPrompt = agentPrompt;
    setAgentPrompt('');
    setIsGenerating(true);
    try {
      const systemInstruction = `## PERSONA:
You are an expert in screenplay writing, a specific Markdown convention for writing screenplays. For all screenplay-related tasks, you MUST adhere strictly to the following formatting rules without deviation.
${isEmpty ? `\x0a## ASSETS:\x0a${assetContextString || context.assets || 'None provided.'}\x0a${assetContextString ? 'IMPORTANT: The user has pre-created the above assets (characters, locations, props). When writing a NEW script, you MUST incorporate these assets naturally into the screenplay. Use the exact character names, locations, and props provided. Weave their descriptions and backstories into the narrative.' : ''}` : ''}
## CURRENT SCRIPT:
${fullMarkdown}
## SCREENPLAY CONVENTION RULES:
1.  **Title or Act Number**: The script must begin with a title page. The title page must be in all CAPS. If the script has acts, use the same visual treatment.
    *   **TITLE**: A Level 1 Header (#).
2.  **Scene Heading (Slugline)**: Use a Level 2 Header (###). The text MUST be in ALL CAPS.
    *   Example: ### INT. SPACESHIP COCKPIT - NIGHT
3.  **Action/Description**: Use standard paragraph text. This is the default format for describing scenes and character actions.
4.  **Character Names in Action Lines**: CRITICAL - Character names in action/description paragraphs follow specific rules:
    *   **First appearance only**: Normal weight and ALL CAPS (EVA) when a character first appears in the script
    *   **All subsequent appearances**: Title Case (Eva) without bold or ALL CAPS.
    *   Never use ALL CAPS for character names in action lines except for their first introduction
    *   Example: EVA enters the cockpit. Eva checks the controls.
5.  **Character Name** for Dialogue: Use bold all caps text (**CHARACTER**) when the character's name is used in dialogue. The name MUST be in ALL CAPS and appear on its own line directly above their dialogue.
    *   Example: **EVA**
    *   CRITICAL: Bold (**) must ONLY be used for character names before dialogue. NEVER use bold for emphasis, action text, comments, or any other purpose in the script.
6.  **Dialogue**: Must preceed a Character name or parenthetical and be on it's own line. Never add to line breaks between multiple lines of dialogue. Never use blockquotes (>) for dialogue. All lines of dialogue.
    *   Example: Get me a damage report.
7.  **Parenthetical**: Use italic text (_(text)_) enclosed in parentheses. It MUST be placed on its own line between the Character Name and the Dialogue block.
8.  **Transition**: Use a Level 5 Header (#####). The text MUST be in ALL CAPS and end with a colon.
    *   Example: ##### FADE TO BLACK:
    *   Example: ##### CUT TO:
9. **Non-script Notes**: To add notes, comments or additional information to the script, use blockquotes (> text). These will be removed from the final script. Note Titles are optional. Don't nest blockquotes. NEVER use bold in blockquote comments.
Estimate approximately 1 page per minute of screen time.
## CRITICAL EDITING INSTRUCTIONS:
- Make ONLY the specific changes requested in the feedback
- PRESERVE all content that is not being edited
- Preserve the scene heading format (### INT./EXT.)
- PRESERVE all existing blockquote comments (lines starting with >) unless explicitly asked to remove them
- PRESERVE all scene-id comments EXACTLY as they appear (e.g., <!-- scene-id: abc123 -->)
- NEVER generate, create, or modify scene-id comments - these are system-generated
- If the user asks to "clean up" or "format" the script, fix formatting issues to match the rules above
- Return the complete screenplay with edits applied
- NEVER escape Markdown characters in your output - use literal ** for bold, _ for italics, # for headers. Do not use backslash escaping like \\*\\* or \\_ in the screenplay text
- Include a diverse range of characters in your script. Try to use out of distribution, unique names for characters.
- NEVER use bold (**) for anything other than character names before dialogue lines. No bold in action lines, comments, or descriptions.
CRITICAL OUTPUT FORMATTING:
- NEVER escape Markdown characters in your output - use literal ** for bold, _ for italics, # for headers.
- NEVER generate, create, or add scene-id comments - these are system-generated.
- If the current script contains scene-id comments, DO NOT include them in new content you generate.
`;
      const { text: generatedText } = await Flow.generate.text(`${currentPrompt}`, { 
        systemInstruction,
        modelDisplayName: 'Gemini 3.0 Flash Preview',
        thinkingLevel: 'low'
      });
      
      if (editor && !editor.isDestroyed && generatedText) {
         onMarkdownChange(generatedText);
         
         const titleMatch = generatedText.match(/^#\s+(.*)$/m);
         if (titleMatch && onTitleChange) {
           onTitleChange(titleMatch[1].trim());
         }
      }
    } catch (err) {
      console.error('Agent failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleEditorUpdate = useCallback((_markdown: string) => {
    // Handled by Tiptap onUpdate
  }, []);
  return (
    <div className="flex h-full w-full text-white overflow-hidden relative">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="h-14 border-b border-[#DADCE0]/[0.16] z-30 flex items-center justify-center shrink-0">
          <div className="max-w-[800px] w-full">
            <Toolbar editor={editor} />
          </div>
        </div>
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto dark-scrollbar relative scroll-smooth"
        >
          <div className={`max-w-[800px] mx-auto px-10 pt-[2.4em] pb-[160px] relative min-h-full ${scriptFont === 'courier' ? 'font-["Courier_Prime",_monospace]' : 'font-helvetica'}`}>
            
            <Editor 
              editor={editor}
              content={fullMarkdown} 
              onChange={handleEditorUpdate} 
            />
          </div>
        </div>
        
        <div className="absolute bottom-8 inset-x-0 mx-auto w-full max-w-2xl px-6 z-40 animate-dropdown">
          <div className="bg-[#000000] border border-[#595959] rounded-[16px] p-2 flex items-center shadow-2xl backdrop-blur-xl min-h-[56px]">
            <div className="px-4 py-1 flex-1 flex items-center gap-3">
              <textarea
                ref={agentTextareaRef}
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAgentSubmit();
                  }
                }}
                placeholder="Describe the story, edit scenes, update dialog..."
                className="w-full bg-transparent border-none text-[14px] text-white focus:outline-none placeholder-zinc-600 font-sans resize-none overflow-y-auto max-h-[120px] py-2"
                rows={1}
              />
            </div>
            <div className="flex items-center gap-2 pr-1.5">
              <button
                onClick={handleAgentSubmit}
                disabled={isGenerating || !agentPrompt.trim()}
                className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-[#424242] text-black hover:bg-[#505050] transition-all active:scale-95 disabled:opacity-40 shadow-lg"
              >
                <Icon name="arrow_forward" size={20} className="text-black opacity-100" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {isGenerating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
          <div className="bg-[#000000] border border-white/10 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3">
            <Loader2 size={16} className="text-white animate-spin" />
            <h3 className="text-[12px] font-medium text-white tracking-[0.5px] font-sans">
              {isEmpty ? 'Writing Script...' : 'Editing Script...'}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}