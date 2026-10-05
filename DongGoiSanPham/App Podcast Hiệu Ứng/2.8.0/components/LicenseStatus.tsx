import React from 'react';
import { getLicenseInfo } from '../license/aifastLicenseManager';
export function LicenseStatus() {
  const info = getLicenseInfo();
  if (!info) return null;
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
      <div className="flex justify-between items-center gap-4 text-[10px]">
        <span className="text-slate-500 font-bold uppercase shrink-0">Ngày hết hạn license</span>
        <span className="text-[#F31B17] font-mono font-black text-right">
          {new Date(info.expiresAt * 1000).toLocaleDateString('vi-VN')}
        </span>
      </div>
    </div>
  );
}