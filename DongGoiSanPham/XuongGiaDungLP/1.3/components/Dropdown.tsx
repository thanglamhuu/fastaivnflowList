import React from 'react';
interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  icon?: string;
  disabled?: boolean;
}
export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options,
  onChange,
  icon,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full text-xs">
      <label className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
        {icon && <span className="material-symbols-outlined text-[14px] text-amber-400">{icon}</span>}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-700/80 rounded-md py-2 pl-3 pr-8 text-zinc-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500/80 focus:border-amber-500/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-zinc-900 text-zinc-200 py-1">
              {opt}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-[18px]">
          expand_more
        </span>
      </div>
    </div>
  );
};