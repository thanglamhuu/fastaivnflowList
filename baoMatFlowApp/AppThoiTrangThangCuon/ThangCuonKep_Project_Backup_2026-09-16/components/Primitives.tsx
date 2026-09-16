import React from 'react';

export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center px-2">
    <span className="text-[11px] font-medium text-[rgba(218,220,224,0.9)] tracking-[0.1px] normal-case">
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
}> = ({ icon, children, variant = 'filled', onClick, disabled, className = '' }) => {
  const base = 'flex items-center gap-[2px] justify-center h-[34px] rounded-xl font-medium tracking-[0.1px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    filled: 'bg-[#969696] hover:bg-[#a6a6a6] active:bg-[#868686] text-black text-[11px] px-4 select-none',
    outline: 'border border-[#595959] hover:bg-white/5 active:bg-white/10 backdrop-blur-[40px] text-[12px] px-4 text-white select-none',
    solid: 'bg-white hover:bg-gray-200 active:bg-gray-300 text-black text-[12px] px-4 select-none',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} onClick={onClick} disabled={disabled}>
      {icon && <span className="flex items-center justify-center w-6 h-6">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-[#1a1a1a] border border-[#595959] rounded-2xl overflow-hidden ${className}`}>
    {children}
  </div>
);

export const LoadingSpinner: React.FC<{ size?: string; color?: string }> = ({ size = '24px', color = 'white' }) => (
  <div className="animate-spin" style={{ width: size, height: size }}>
    <span className="material-symbols-outlined" style={{ fontSize: size, color }}>
      refresh
    </span>
  </div>
);