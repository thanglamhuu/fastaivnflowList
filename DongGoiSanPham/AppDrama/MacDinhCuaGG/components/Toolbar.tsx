import React, { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import { Icon } from './Icon';
interface ToolbarProps {
  editor: Editor | null;
}
const IconButton: React.FC<{
  iconName: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}> = ({ iconName, onClick, active, disabled, title }) => (
  <button
    onMouseDown={(e) => {
      // CRITICAL: preventDefault on mousedown stops the editor from losing focus
      e.preventDefault();
      onClick();
    }}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded-lg transition-all flex items-center justify-center flex-shrink-0 ${
      active 
        ? 'bg-white/10 text-white' 
        : 'text-zinc-500 hover:text-white hover:bg-white/5'
    } disabled:opacity-30 disabled:cursor-not-allowed`}
  >
    <Icon name={iconName} size={18} className={active ? 'text-white' : ''} />
  </button>
);
const TextButton: React.FC<{
  label: string;
  onClick: () => void;
  active?: boolean;
}> = ({ label, onClick, active }) => (
  <button
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all [text-shadow:none] ${
      active 
        ? 'text-white bg-white/10' 
        : 'text-[#DADCE0]/[0.72] hover:text-white hover:bg-white/5'
    }`}
  >
    {label}
  </button>
);
const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  const [_, setTick] = useState(0);
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const handler = () => setTick(t => t + 1);
    editor.on('selectionUpdate', handler);
    editor.on('transaction', handler);
    editor.on('update', handler);
    return () => {
      editor.off('selectionUpdate', handler);
      editor.off('transaction', handler);
      editor.off('update', handler);
    };
  }, [editor]);
  if (!editor || editor.isDestroyed) return null;
  // Safety check for view availability
  let isReady = false;
  try {
    isReady = !!(editor.view && editor.view.dom);
  } catch (e) {
    isReady = false;
  }
  const isActive = (name: string, attributes?: any) => {
    if (!isReady) return false;
    try {
      return editor.isActive(name, attributes);
    } catch (e) {
      return false;
    }
  };
  const canUndo = () => {
    if (!isReady) return false;
    try {
      return editor.can().undo();
    } catch (e) {
      return false;
    }
  };
  const canRedo = () => {
    if (!isReady) return false;
    try {
      return editor.can().redo();
    } catch (e) {
      return false;
    }
  };
  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex items-center gap-1">
        {/* Screenplay Block Types — Desktop */}
        <div className="hidden md:flex items-center gap-1 pr-3 border-r border-[#DADCE0]/[0.16]">
          <span className="text-[12px] text-[#DADCE0]/[0.48] font-medium pr-1 select-none">Format:</span>
          <TextButton 
            label="Title" 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
            active={isActive('heading', { level: 1 })}
          />
          <TextButton 
            label="Scene" 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
            active={isActive('heading', { level: 3 })}
          />
          <TextButton 
            label="Dialog" 
            onClick={() => {
              if (!isReady) return;
              // If cursor is on a bold name, select the whole paragraph and remove bold
              if (isActive('bold')) {
                const { $from } = editor.state.selection;
                const parentStart = $from.start($from.depth);
                const parentEnd = $from.end($from.depth);
                editor.chain().focus()
                  .setTextSelection({ from: parentStart, to: parentEnd })
                  .unsetBold()
                  .run();
                return;
              }
              
              const { from, to } = editor.state.selection;
              const selectedText = editor.state.doc.textBetween(from, to, '\x0a').trim();
              
              if (selectedText) {
                // Split into first line (name) and rest (dialog)
                const lines = selectedText.split('\x0a');
                const name = lines[0].trim().toUpperCase();
                const dialog = lines.slice(1).join('\x0a').trim();
                
                const content: any[] = [
                  { type: 'paragraph', content: [{ type: 'text', text: name, marks: [{ type: 'bold' }] }] },
                ];
                if (dialog) {
                  content.push({ type: 'paragraph', content: [{ type: 'text', text: dialog }] });
                } else {
                  content.push({ type: 'paragraph' });
                }
                
                editor.chain().focus().deleteSelection().insertContent(content).run();
              } else {
                // No selection — insert placeholder
                editor.chain().focus()
                  .insertContent([
                    { type: 'paragraph', content: [{ type: 'text', text: 'NAME', marks: [{ type: 'bold' }] }] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Dialog goes here...' }] },
                  ])
                  .run();
              }
            }} 
            active={isActive('bold')}
          />
          <TextButton 
            label="Transition" 
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} 
            active={isActive('heading', { level: 5 })}
          />
        </div>
        {/* Screenplay Block Types — Mobile Dropdown */}
        <div className="flex md:hidden items-center pr-3 border-r border-[#DADCE0]/[0.16]">
          <select
            value={
              isActive('heading', { level: 1 }) ? 'title'
              : isActive('heading', { level: 3 }) ? 'scene'
              : isActive('bold') ? 'dialog'
              : isActive('heading', { level: 5 }) ? 'transition'
              : ''
            }
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'title') {
                editor.chain().focus().toggleHeading({ level: 1 }).run();
              } else if (val === 'scene') {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
              } else if (val === 'dialog') {
                if (!isReady) return;
                const { from, to } = editor.state.selection;
                const selectedText = editor.state.doc.textBetween(from, to, '\x0a').trim();
                if (selectedText) {
                  const lines = selectedText.split('\x0a');
                  const name = lines[0].trim().toUpperCase();
                  const dialog = lines.slice(1).join('\x0a').trim();
                  const content: any[] = [
                    { type: 'paragraph', content: [{ type: 'text', text: name, marks: [{ type: 'bold' }] }] },
                  ];
                  if (dialog) {
                    content.push({ type: 'paragraph', content: [{ type: 'text', text: dialog }] });
                  } else {
                    content.push({ type: 'paragraph' });
                  }
                  editor.chain().focus().deleteSelection().insertContent(content).run();
                } else {
                  editor.chain().focus()
                    .insertContent([
                      { type: 'paragraph', content: [{ type: 'text', text: 'NAME', marks: [{ type: 'bold' }] }] },
                      { type: 'paragraph', content: [{ type: 'text', text: 'Dialog goes here...' }] },
                    ])
                    .run();
                }
              } else if (val === 'transition') {
                editor.chain().focus().toggleHeading({ level: 5 }).run();
              }
              // Reset so re-selecting the same value fires onChange again
              e.target.value = '';
              editor.commands.focus();
            }}
            className="bg-transparent border border-[#DADCE0]/[0.24] rounded-lg py-1.5 px-2 pr-7 text-[13px] font-bold text-[#DADCE0]/[0.72] focus:outline-none appearance-none cursor-pointer font-sans"
          >
            <option value="" disabled className="bg-zinc-900">Format</option>
            <option value="title" className="bg-zinc-900">Title</option>
            <option value="scene" className="bg-zinc-900">Scene</option>
            <option value="dialog" className="bg-zinc-900">Dialog</option>
            <option value="transition" className="bg-zinc-900">Transition</option>
          </select>
        </div>
        {/* Formatting Icons */}
        <div className="flex items-center gap-1 px-3 border-r border-[#DADCE0]/[0.16]">
          <IconButton 
            iconName="format_italic" 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            active={isActive('italic')} 
            title="Italic" 
          />
          <IconButton 
            iconName="format_underlined" 
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
            active={isActive('underline')} 
            title="Underline" 
          />
          <IconButton 
            iconName="format_list_bulleted" 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            active={isActive('bulletList')} 
            title="Bullet List" 
          />
          <IconButton 
            iconName="mode_comment" 
            onClick={() => editor.chain().focus().toggleBlockquote().run()} 
            active={isActive('blockquote')}
            title="Add Feedback Comment" 
          />
        </div>
        {/* History Icons */}
        <div className="flex items-center gap-1 pl-3">
          <IconButton 
            iconName="undo" 
            onClick={() => editor.chain().focus().undo().run()} 
            disabled={!canUndo()} 
            title="Undo" 
          />
          <IconButton 
            iconName="redo" 
            onClick={() => editor.chain().focus().redo().run()} 
            disabled={!canRedo()} 
            title="Redo" 
          />
        </div>
      </div>
    </div>
  );
};
export default Toolbar;