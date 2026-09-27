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
  const filteredItems = items.filter(Boolean);
  
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <p className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-tighter px-1">{label}</p>
      
      <div className="flex flex-col gap-2">
        {/* Hiển thị ảnh đầu tiên hoặc nút Upload nếu chưa có ảnh */}
        {filteredItems.length === 0 ? (
          <button 
            onClick={onUpload}
            className="w-full aspect-square border-2 border-dashed border-[#D1D1D6] rounded-xl flex flex-col items-center justify-center text-[#8E8E93] hover:border-[#F31B17] hover:text-[#F31B17] hover:bg-[#F31B17]/5 transition-all active:scale-95 group"
          >
            <span className="material-symbols-outlined text-[28px] mb-1 group-hover:scale-110 transition-transform">{icon}</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Tải lên</span>
          </button>
        ) : (
          <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-[#D1D1D6] group shadow-sm bg-slate-50">
            <img src={filteredItems[0]} className="w-full h-full object-cover" alt={label} />
            <button 
              onClick={() => onClear?.(0)}
              className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black transition-all active:scale-90 z-10"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}
        {/* Hiển thị danh sách ảnh phụ nếu là mode Multiple */}
        {multiple && filteredItems.length > 0 && (
          <div className="grid grid-cols-3 gap-1.5">
            {filteredItems.slice(1).map((src, idx) => (
              <div key={idx + 1} className="relative aspect-square rounded-lg overflow-hidden border border-[#E5E5EA] group shadow-sm">
                <img src={src} className="w-full h-full object-cover" />
                <button 
                  onClick={() => onClear?.(idx + 1)}
                  className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                </button>
              </div>
            ))}
            <button 
              onClick={onUpload}
              className="aspect-square border border-dashed border-[#D1D1D6] rounded-lg flex items-center justify-center text-[#8E8E93] hover:border-[#F31B17] hover:text-[#F31B17] hover:bg-[#F31B17]/5 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};