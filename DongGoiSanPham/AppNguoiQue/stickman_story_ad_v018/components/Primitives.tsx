import React, { useState, useRef, useEffect } from 'react';
// --- Types ---
interface SectionLabelProps {
  children: React.ReactNode;
}
interface PillButtonProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'filled' | 'outline' | 'solid';
  onClick?: () => void;
  disabled?: boolean;
}
interface FieldDropdownProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  className?: string;
}
interface SegmentedToggleProps {
  value: string;
  items: { value: string; label: string; icon?: React.ReactNode }[];
  onChange: (val: string) => void;
}
// --- Components ---
export const SectionLabel: React.FC<SectionLabelProps> = ({ children }) => (
  <div className="flex items-center px-2">
    <span className="text-[11px] font-medium text-[rgba(218,220,224,0.9)] tracking-[0.1px] normal-case">
      {children}
    </span>
  </div>
);
export const PillButton: React.FC<PillButtonProps> = ({ 
  icon, children, variant = 'filled', onClick, disabled 
}) => {
  const base = "flex items-center gap-[2px] justify-center w-full h-[34px] rounded-xl font-medium tracking-[0.1px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    filled: "bg-[#969696] hover:bg-[#a6a6a6] active:bg-[#868686] text-black text-[11px] pl-[8px] pr-[24px] py-1 select-none",
    outline: "border border-[#595959] hover:bg-white/5 active:bg-white/10 backdrop-blur-[40px] text-[12px] pl-[8px] pr-[16px] py-2 text-white select-none",
    solid: "bg-white hover:bg-gray-200 active:bg-gray-300 text-black text-[12px] pl-[8px] pr-[16px] py-2 select-none",
  };
  return (
    <button className={`${base} ${variants[variant]}`} onClick={onClick} disabled={disabled}>
      {icon && <span className="flex items-center justify-center w-6 h-6">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
export const FieldDropdown: React.FC<FieldDropdownProps> = ({ 
  value, options, onChange, className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, []);
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[34px] text-left border border-[#595959] hover:border-[#7a7a7a] transition-colors rounded-xl flex items-center justify-between px-3 select-none focus:outline-none"
      >
        <span className="text-[11px] font-medium text-white tracking-[0.1px] truncate pr-2">{value}</span>
        <span className={`material-symbols-outlined text-[16px] text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          keyboard_arrow_down
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-50 top-[calc(100%+4px)] left-0 w-full bg-[#1a1a1a] border border-[#595959] rounded-xl overflow-hidden shadow-2xl backdrop-blur-md animate-dropdown origin-top">
          <div className="max-h-40 overflow-y-auto dark-scrollbar">
            {options.map((opt) => {
              const isSelected = value === opt;
              return (
                <button 
                  key={opt} 
                  type="button"
                  className={`w-full text-left px-3 py-2 text-[11px] font-medium tracking-[0.1px] hover:bg-white/10 transition-colors ${isSelected ? 'bg-white/10 text-white' : 'text-white/70'}`}
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export const SegmentedToggle: React.FC<SegmentedToggleProps> = ({ 
  value, items, onChange 
}) => {
  return (
    <div className="flex w-full items-center border border-[#595959] rounded-xl overflow-hidden bg-transparent">
      {items.map((item) => {
        const isActive = value === item.value;
        return (
          <button 
            key={item.value} 
            type="button" 
            onClick={() => onChange(item.value)}
            className={`flex-1 flex items-center justify-center gap-1 h-[34px] px-3 py-2 rounded-xl text-[11px] font-medium tracking-[0.1px] transition-all cursor-pointer ${
              isActive ? 'bg-[#969696] text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};