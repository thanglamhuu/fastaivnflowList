import React from 'react';
import { getLicenseInfo } from '../license/aifastLicenseManager';
export function LicenseStatus() {
  const info = getLicenseInfo();
  if (!info) return null;
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-1">
        <span className="material-symbols-outlined text-[#F31B17] text-sm">verified</span>
        <h3 className="text-[10px] font-black uppercase text-[#F31B17]">LICENSE ACTIVE</h3>
      </div>
      
      <div className="space-y-1.5 text-[10px]">
        <div className="flex justify-between items-center gap-4">
          <span className="text-slate-500 font-bold uppercase shrink-0">Mã máy</span>
          <span className="text-slate-200 font-mono text-right break-all">{info.machineId}</span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <span className="text-slate-500 font-bold uppercase shrink-0">Ngày hết hạn</span>
          <span className="text-slate-200 font-mono text-right">
            {new Date(info.expiresAt * 1000).toLocaleDateString('vi-VN')}
          </span>
        </div>
      </div>
    </div>
  );
}