import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
// ── UTILITIES ──
export function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
// ── 1. SECTION LABEL ──
export const SectionLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex items-center ${className}`}>
    <span className="text-[12px] font-medium text-[rgba(255,255,255,0.35)] select-none">
      {children}
    </span>
  </div>
);
// ── 2. PILL BUTTON ──
export const PillButton: React.FC<{
  icon?: React.ReactNode; 
  children: React.ReactNode;
  variant?: 'filled' | 'outline' | 'solid' | 'dark'; 
  onClick?: (e?: any) => void;
  className?: string;
  disabled?: boolean;
}> = ({ icon, children, variant = 'filled', onClick, className = "", disabled }) => {
  const base = 'flex items-center gap-[2px] justify-center rounded-[40px] font-bold transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed text-[13px]';
  const variants: Record<string, string> = {
    filled: `bg-white text-black border-none py-[0.4rem] hover:opacity-90 ${icon ? 'pl-2 pr-4' : 'px-4'}`,
    solid:  `bg-[#969696] text-black border-none py-[0.4rem] hover:opacity-90 ${icon ? 'pl-2 pr-4' : 'px-4'}`,
    outline:`bg-transparent text-white border border-[#595959] py-[0.4rem] hover:bg-white/5 ${icon ? 'pl-2 pr-4' : 'px-4'}`,
    dark:   `bg-[#1a1a1a] border border-[#595959] hover:bg-[#222222] text-white py-[0.4rem] ${icon ? 'pl-2 pr-4' : 'px-4'}`,
  };
  return (
    <button disabled={disabled} className={`${base} ${variants[variant]} ${className}`} onClick={onClick}>
      {icon && <span className="flex items-center justify-center w-6 h-6">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};
// ── 3. FIELD DROPDOWN ──
export const FieldDropdown: React.FC<{
  label?: string; 
  value: string; 
  options: string[];
  customOptions?: string[];
  onEditOption?: (opt: string) => void;
  onDeleteOption?: (opt: string) => void;
  onChange: (val: string) => void; 
  className?: string;
}> = ({ label, value, options, customOptions, onEditOption, onDeleteOption, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button type="button" onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left border border-[#595959] hover:border-white/20 transition-colors rounded-lg flex flex-col gap-0.5 justify-center pb-2 pl-2.5 pr-1 pt-[5px] select-none focus:outline-none h-[49px]">
        {label && <p className="text-[12px] font-medium text-[rgba(255,255,255,0.35)]">{label}</p>}
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-white truncate"> {value}</span>
          <Icon name="expand_more" size={18} className={`text-[rgba(218,220,224,0.75)] mr-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {isOpen && (
        <div className="absolute z-50 top-[calc(100%+4px)] left-0 w-full bg-[#000000] border border-[#595959] rounded-lg overflow-hidden shadow-xl backdrop-blur-md animate-dropdown origin-top">
          <div className="max-h-60 overflow-y-auto refined-scrollbar">
            {options.includes('Add your own style') && (
              <>
                <button 
                  type="button"
                  className="w-full text-left px-2.5 py-2 text-[13px] font-medium hover:bg-[#1a1a1a] transition-colors text-[rgba(218,220,224,0.9)] flex items-center gap-2"
                  onClick={() => { onChange('Add your own style'); setIsOpen(false); }}
                >
                  <Icon name="add" size={16} className="text-[rgba(218,220,224,0.75)]" />
                  Add your own style
                </button>
                <div className="border-b border-[rgba(218,220,224,0.15)] my-1"></div>
              </>
            )}
            {options.filter(opt => opt !== 'Add your own style').map((opt) => (
              <div key={opt} className="group relative flex items-center justify-between">
                <button type="button"
                  className={`w-full text-left px-2.5 py-2 pr-12 text-[13px] font-medium hover:bg-[#1a1a1a] transition-colors ${value === opt ? 'bg-[#1a1a1a] text-white' : 'text-[rgba(218,220,224,0.9)]'}`}
                  onClick={() => { onChange(opt); setIsOpen(false); }}>
                  {opt}
                </button>
                {customOptions?.includes(opt) && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEditOption?.(opt); setIsOpen(false); }}
                      className="p-1 text-zinc-400 hover:text-white transition-colors"
                      title="Edit Style"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteOption?.(opt); setIsOpen(false); }}
                      className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
                      title="Delete Style"
                    >
                      <Icon name="delete" size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};