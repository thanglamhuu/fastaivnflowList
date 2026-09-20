import React, { useState, useRef, useEffect } from 'react';
export const SectionLabel = ({ children }) => <div className="flex items-center px-2"><span className="text-[11px] font-medium text-white/90 tracking-[0.1px]">{children}</span></div>;
export const PillButton = ({ icon, children, variant = 'filled', onClick, disabled }) => {
  const base = "flex items-center gap-[2px] justify-center w-full h-[34px] rounded-xl font-medium transition-all cursor-pointer disabled:opacity-50";
  const variants = { filled: "bg-[#969696] text-black text-[11px]", outline: "border border-[#595959] text-white text-[12px]", solid: "bg-white text-black text-[12px]" };
  return <button className={`${base} ${variants[variant]}`} onClick={onClick} disabled={disabled}>{icon && <span className="w-6 h-6">{icon}</span>}<span>{children}</span></button>;
};
export const FieldDropdown = ({ label, value, options, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const l = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); }; document.addEventListener('mousedown', l); return () => document.removeEventListener('mousedown', l); }, []);
  return <div ref={ref} className={`relative ${className}`}><button onClick={() => setIsOpen(!isOpen)} className="w-full text-left border border-[#595959] rounded-xl pb-2 pl-2.5 pr-1 pt-[5px]"><p className="text-[11px] text-white/35">{label}</p><div className="flex justify-between items-center"><span className="text-[11px] text-white truncate">{value}</span><span className="material-symbols-outlined text-[16px] text-white/50">keyboard_arrow_down</span></div></button>{isOpen && <div className="absolute z-50 top-[calc(100%+4px)] left-0 w-full bg-[#0e0e0e] border border-[#595959] rounded-xl overflow-hidden">{options.map(o => <button key={o} onClick={() => { onChange(o); setIsOpen(false); }} className="w-full text-left px-2.5 py-2 text-[11px] hover:bg-[#1a1a1a] text-white">{o}</button>)}</div>}</div>;
};
export const SegmentedToggle = ({ value, items, onChange }) => <div className="flex w-full items-center border border-[#595959] rounded-xl overflow-hidden">{items.map(i => <button key={i.value} onClick={() => onChange(i.value)} className={`flex-1 h-[34px] text-[11px] ${value === i.value ? 'bg-[#969696] text-black' : 'text-white/60'}`}>{i.label}</button>)}</div>;