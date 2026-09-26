import React from 'react';
export const SectionLabel: React.FC<{ children: React.ReactNode; dotColor?: string }> = ({ children, dotColor }) => (
  <div className="flex items-center gap-1.5 px-1">
    {dotColor && <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
    <span className="text-[10px] font-bold text-[#1A1A1A] tracking-wider uppercase">
      {children}
    </span>
  </div>
);
export const Badge: React.FC<{ children: React.ReactNode; color?: 'red' | 'blue' | 'gray' }> = ({ children, color = 'gray' }) => {
  const styles = {
    red: 'bg-[#F31B17]/10 text-[#F31B17] border-[#F31B17]/20',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    gray: 'bg-gray-100 text-gray-500 border-gray-200'
  };
  return (
    <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter border ${styles[color === 'red' ? 'red' : color]}`}>
      {children}
    </span>
  );
};
export const IconButton: React.FC<{ 
  icon: string; 
  onClick: () => void; 
  disabled?: boolean;
  className?: string;
  title?: string;
}> = ({ icon, onClick, disabled, className = '', title }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }} 
    disabled={disabled}
    title={title}
    className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/5 active:scale-90 transition-all text-[#8E8E93] disabled:opacity-30 ${className}`}
  >
    <span className="material-symbols-outlined text-[18px]">{icon}</span>
  </button>
);
export const ActionButton: React.FC<{
  icon?: string;
  children: React.ReactNode;
  variant?: 'outline' | 'solid' | 'primary' | 'success' | 'navy';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}> = ({ icon, children, variant = 'outline', onClick, disabled, className = '', fullWidth }) => {
  const base = `flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 select-none ${fullWidth ? 'w-full' : ''}`;
  
  const variants = {
    outline: 'border border-[#D1D1D6] hover:bg-black/5 active:scale-95 text-[#1A1A1A]',
    solid: 'bg-[#F31B17] hover:bg-[#d11713] text-white active:scale-95',
    primary: 'bg-[#F31B17] hover:bg-[#d11713] text-white active:scale-95 shadow-sm',
    success: 'border border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E]/5 active:scale-95',
    navy: 'bg-[#1E2A4A] hover:bg-[#151D33] text-white active:scale-95'
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'} ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
};
export const UploadBox: React.FC<{
  label: string;
  icon: string;
  onUpload: () => void;
  onClear?: (index?: number) => void;
  items: (string | undefined)[];
  multiple?: boolean;
}> = ({ label, icon, onUpload, onClear, items, multiple }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-[12px] font-bold text-[#1A1A1A]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.filter(Boolean).map((src, idx) => (
          <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#D1D1D6] group">
            <img src={src} className="w-full h-full object-cover" />
            <button 
              onClick={() => onClear?.(idx)}
              className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-black opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined text-[12px]">close</span>
            </button>
          </div>
        ))}
        {(multiple || items.filter(Boolean).length === 0) && (
          <button 
            onClick={onUpload}
            className="w-16 h-16 border-2 border-dashed border-[#D1D1D6] rounded-lg flex flex-col items-center justify-center text-[#D1D1D6] hover:border-[#F31B17] hover:text-[#F31B17] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            <span className="material-symbols-outlined text-[14px]">upload</span>
          </button>
        )}
      </div>
    </div>
  );
};