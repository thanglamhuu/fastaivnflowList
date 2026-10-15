import React, { useState, useRef, useEffect } from 'react';
export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center px-1 py-1">
    <span className="text-[10px] font-bold text-gray-400 tracking-[0.1em] uppercase">
      {children}
    </span>
  </div>
);
export const PillButton: React.FC<{
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'filled' | 'outline' | 'solid';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
}> = ({ icon, children, variant = 'filled', onClick, disabled, className = '', loading }) => {
  const base = 'flex items-center gap-[6px] justify-center w-full h-[42px] rounded-xl font-semibold tracking-[0.2px] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] select-none';
  const variants = {
    filled: 'bg-black hover:bg-gray-800 text-white text-[12px] px-4 shadow-sm',
    outline: 'border border-gray-200 bg-white hover:bg-gray-50 text-[12px] px-4 text-black shadow-sm',
    solid: 'bg-blue-600 hover:bg-blue-700 text-white text-[12px] px-4 shadow-md',
  };
  
  return (
    <button 
      className={`${base} ${variants[variant]} ${className}`} 
      onClick={onClick} 
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
      ) : (
        <>
          {icon && <span className="flex items-center justify-center">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
export const TextInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}> = ({ value, onChange, placeholder, label, className = '' }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">{label}</p>}
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-gray-200 hover:border-gray-300 focus:border-black rounded-xl w-full h-[46px] px-4 bg-white text-[13px] font-medium text-black placeholder-gray-400 outline-none transition-all shadow-sm"
    />
  </div>
);
export const TextArea: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}> = ({ value, onChange, placeholder, label, className = '' }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">{label}</p>}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-gray-200 hover:border-gray-300 focus:border-black rounded-xl w-full h-[100px] p-4 bg-white text-[13px] font-medium text-black placeholder-gray-400 outline-none transition-all resize-none no-scrollbar shadow-sm"
    />
  </div>
);
export const SegmentedToggle: React.FC<{
  value: string;
  items: { value: string; label: string; icon?: React.ReactNode }[];
  onChange: (val: any) => void;
  className?: string;
}> = ({ value, items, onChange, className = '' }) => (
  <div className={`flex w-full items-center border border-gray-100 rounded-xl overflow-hidden bg-gray-50 p-1 ${className}`}>
    {items.map((item) => (
      <button
        key={item.value}
        type="button"
        onClick={() => onChange(item.value)}
        className={`flex-1 flex items-center justify-center gap-1.5 h-[34px] px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
          value === item.value 
            ? 'bg-white text-black shadow-sm border border-gray-100' 
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
        }`}
      >
        {item.icon}
        <span>{item.label}</span>
      </button>
    ))}
  </div>
);
export const FieldDropdown: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  className?: string;
}> = ({ label, value, options, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, []);
  return (
    <div ref={ref} className={`relative flex flex-col gap-1.5 ${className}`}>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">{label}</p>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left border border-gray-200 hover:border-gray-300 rounded-xl flex items-center justify-between px-4 h-[46px] bg-white text-[13px] font-medium text-black select-none outline-none transition-all shadow-sm"
      >
        <span>{value}</span>
        <span className={`material-symbols-outlined text-[18px] text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>
      {isOpen && (
        <div className="absolute z-50 top-[calc(100%+6px)] left-0 w-full bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xl animate-dropdown origin-top">
          <div className="max-h-48 overflow-y-auto no-scrollbar">
            {options.map((opt) => (
              <button 
                key={opt}
                type="button"
                className={`w-full text-left px-4 py-3 text-[13px] font-medium hover:bg-gray-50 transition-colors ${value === opt ? 'bg-gray-50 text-blue-600 font-bold' : 'text-gray-700'}`}
                onClick={() => { onChange(opt); setIsOpen(false); }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};