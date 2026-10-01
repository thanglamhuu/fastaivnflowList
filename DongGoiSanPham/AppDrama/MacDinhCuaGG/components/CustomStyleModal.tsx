import React, { useState } from 'react';
import { Flow } from 'flow-sdk';
import { Icon } from './Icon';
import { VISUAL_STYLE_PROMPTS } from '../services/ai';
const Loader2: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);
interface CustomStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, prompt: string) => void;
  initialName?: string;
  initialPrompt?: string;
}
export const CustomStyleModal: React.FC<CustomStyleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialName = '',
  initialPrompt = ''
}) => {
  const [name, setName] = useState(initialName);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const handleAutofill = async () => {
    if (!name.trim() || isAutofilling) return;
    setIsAutofilling(true);
    try {
      const exampleStyles = Object.entries(VISUAL_STYLE_PROMPTS)
        .map(([k, v]) => `"${k}": "${v}"`)
        .join('\x0a');
      const systemInstruction = `You are a visual style description writer for a storyboard tool. Given a style name and optional seed description, write a rich, detailed visual style description.
Here are examples of the format, length, and detail level to match:
${exampleStyles}
Rules:
- Write exactly 2-3 sentences
- Include specific details about textures, lighting, color palette, and mood
- End with "Characters ignore the camera. Uncropped full frame, textless, no letterboxing."
- Return ONLY the description text, no quotes or labels`;
      const userPrompt = `Style name: "${name.trim()}"
${prompt.trim() ? `Seed description: ${prompt.trim()}` : 'No seed description provided.'}
Write the visual style description.`;
      const { text } = await Flow.generate.text(userPrompt, {
        systemInstruction,
        modelDisplayName: 'Gemini 3.0 Flash Preview',
        thinkingLevel: 'low'
      });
      if (text) setPrompt(text.trim());
    } catch (e) {
      console.error('Autofill style failed:', e);
    } finally {
      setIsAutofilling(false);
    }
  };
  // Sync with initial values when modal opens or initial values change
  React.useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setPrompt(initialPrompt);
    }
  }, [isOpen, initialName, initialPrompt]);
  if (!isOpen) return null;
  const isEditing = !!initialName;
  const handleSave = () => {
    if (!name.trim() || !prompt.trim()) return;
    onSave(name.trim(), prompt.trim());
    setName('');
    setPrompt('');
    onClose();
  };
  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="w-full max-w-md bg-black border border-[rgba(218,220,224,0.15)] rounded-[24px] p-6 pt-8 shadow-2xl animate-in zoom-in-95 duration-300 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <Icon name="close" size={18} className="text-white/40" />
        </button>
        <div className="flex flex-col items-center gap-3 mb-6 text-center">
          <Icon name="palette" size={48} className="opacity-[0.24]" />
          <div>
            <h3 className="text-[18px] font-bold text-white font-sans tracking-tight mb-2">
              {isEditing ? 'Edit custom style' : 'Create custom style'}
            </h3>
            <p className="text-[14px] text-zinc-500 font-sans leading-relaxed">
              Define the visual style for your storyboard.
            </p>
          </div>
        </div>
        <div className="space-y-6 font-sans">
          <div className="flex flex-col gap-0.5">
            <label className="text-[11px] font-medium text-[#DADCE0]/[0.48] font-sans ml-1">Style Name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Neon Cyberpunk"
              className="w-full bg-transparent border border-[#DADCE0]/[0.40] hover:border-white/20 focus:border-white/30 rounded-[8px] py-[0.4rem] px-3 text-[12px] font-flex text-white/90 focus:outline-none transition-all placeholder:text-white/[0.38]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-[#DADCE0]/[0.48] font-sans ml-1">Style Description</label>
              <button
                onClick={handleAutofill}
                disabled={!name.trim() || isAutofilling}
                className="px-3 py-[0.4rem] rounded-full border border-[#DADCE0]/[0.24] text-[11px] font-medium text-zinc-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 font-sans flex items-center gap-1"
              >
                {isAutofilling ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Icon name="astrophotography_mode" size={16} />
                )}
                {isAutofilling ? 'Generating...' : 'Autofill style'}
              </button>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe visual style, texture and lighting..."
              className="w-full h-32 bg-transparent border border-[#DADCE0]/[0.40] hover:border-white/20 focus:border-white/30 rounded-[8px] py-[0.4rem] px-3 text-[12px] font-flex text-white/90 focus:outline-none transition-all resize-none refined-scrollbar leading-relaxed placeholder:text-white/[0.38]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-full border border-[#595959] text-[rgba(218,220,224,0.9)] font-bold hover:border-zinc-400 transition-all font-sans text-[13px]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !prompt.trim()}
              className="flex-1 h-10 rounded-full bg-[#DADCE0]/[0.72] text-black/90 text-[13px] font-bold hover:bg-white transition-all disabled:opacity-30 font-sans"
            >
              Save Style
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};