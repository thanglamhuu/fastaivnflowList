import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { VISUAL_STYLE_PROMPTS } from '../services/ai';
interface StyleSelectorProps {
  globalStyle: string;
  onGlobalStyleChange: (style: string) => void;
  customStyleLibrary: Record<string, string>;
  onOpenCustomStyleModal?: (editingName?: string) => void;
  onRemoveCustomStyle?: (name: string) => void;
  hideLabel?: boolean;
}
export const StyleSelector: React.FC<StyleSelectorProps> = ({
  globalStyle,
  onGlobalStyleChange,
  customStyleLibrary,
  onOpenCustomStyleModal,
  onRemoveCustomStyle,
  hideLabel
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const portalContentRef = useRef<HTMLDivElement>(null);
  const allStyleNames = useMemo(() => {
    return Array.from(new Set([
      ...Object.keys(customStyleLibrary),
      ...Object.keys(VISUAL_STYLE_PROMPTS)
    ])).sort();
  }, [customStyleLibrary]);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        (!portalContentRef.current || !portalContentRef.current.contains(e.target as Node))
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  // Close menu on scroll to prevent disconnected positioning
  useEffect(() => {
    const handleScroll = () => setIsMenuOpen(false);
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);
  const handleToggleMenu = () => {
    if (!isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const modalRoot = document.getElementById('story-studio-modal-root');
      const rootRect = modalRoot ? modalRoot.getBoundingClientRect() : { top: 0, left: 0 };
      // Position aligned to the right edge of the button, similar to top-full mt-2 right-0
      setMenuPosition({ 
        top: rect.bottom + 8 - rootRect.top, 
        left: rect.right - 220 - rootRect.left // 220 is the width of the menu
      });
    }
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="flex items-center gap-2.5 relative" ref={menuRef}>
      {!hideLabel && <span className="text-[13px] font-medium text-[#DADCE0]/[0.48] font-sans hidden md:inline">Style</span>}
      <button 
        ref={buttonRef}
        onClick={handleToggleMenu}
        className={`h-[36px] px-4 rounded-[8px] border border-[#DADCE0]/[0.40] flex items-center justify-between gap-3 text-[13px] font-bold transition-all ${
          isMenuOpen ? 'bg-zinc-800 border-white/20' : 'bg-transparent hover:bg-white/5'
        }`}
      >
        <span className="text-white truncate">{globalStyle}</span>
        <Icon name="expand_more" size={20} className={`opacity-[0.48] transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isMenuOpen && menuPosition && createPortal(
        <div 
          ref={portalContentRef}
          style={{ top: menuPosition.top, left: menuPosition.left }}
          className="fixed w-[220px] bg-[#000000] border border-[#DADCE0]/[0.24] rounded-[8px] shadow-2xl overflow-hidden z-[200] animate-dropdown origin-top-right py-2"
        >
          {onOpenCustomStyleModal && (
            <>
              <button
                onClick={() => {
                  onOpenCustomStyleModal();
                  setIsMenuOpen(false);
                }}
                className="w-full px-5 py-3 text-left text-[12px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
              >
                <Icon name="add" size={20} className="opacity-[0.48]" />
                Create custom style
              </button>
              <div className="h-px bg-white/5 my-1 mx-2" />
            </>
          )}
          
          {allStyleNames.map(style => {
            const isCustom = style in customStyleLibrary;
            const isSelected = globalStyle === style;
            
            return (
              <div key={style} className="group relative">
                <button
                  onClick={() => {
                    onGlobalStyleChange(style);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full pl-5 py-2.5 text-left text-[12px] font-bold flex items-center gap-2 transition-all duration-200 ${
                    isCustom ? 'pr-10 group-hover:pr-[68px]' : 'pr-10'
                  } ${
                    isSelected ? 'bg-white/5 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isSelected && <Icon name="check" size={20} className="opacity-[0.48]" />}
                  <span className="truncate">{style}</span>
                </button>
                
                {isCustom && (
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all z-20">
                    {onOpenCustomStyleModal && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCustomStyleModal(style);
                          setIsMenuOpen(false);
                        }}
                        title="Edit custom style"
                        className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-600 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Icon name="edit" size={20} className="opacity-[0.48]" />
                      </button>
                    )}
                    {onRemoveCustomStyle && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveCustomStyle(style);
                          setIsMenuOpen(false);
                        }}
                        title="Remove custom style"
                        className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-600 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Icon name="close" size={20} className="opacity-[0.48]" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
};