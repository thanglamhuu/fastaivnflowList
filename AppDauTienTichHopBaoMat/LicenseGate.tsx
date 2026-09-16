import React, { useState, useEffect } from 'react';
import { getOrCreateMachineId, verifyLicense, saveLicenseKey, PROJECT_ID } from '../services/licenseService';
interface LicenseGateProps {
  onVerified: () => void;
}
export const LicenseGate: React.FC<LicenseGateProps> = ({ onVerified }) => {
  const [keyInput, setKeyInput] = useState('');
  const [machineId, setMachineId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setMachineId(getOrCreateMachineId());
  }, []);
  const handleCheck = async () => {
    if (!keyInput.trim()) return;
    
    setIsVerifying(true);
    setError(null);
    
    const isValid = await verifyLicense(keyInput.trim());
    
    if (isValid) {
      saveLicenseKey(keyInput.trim());
      onVerified();
    } else {
      setError("License không tồn tại hoặc không còn hiệu lực.");
    }
    setIsVerifying(false);
  };
  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4">
             <span className="material-symbols-outlined text-[32px] text-white/40">vpn_key</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Kích hoạt ứng dụng</h1>
          <p className="text-white/40 text-sm">Vui lòng nhập License Key để tiếp tục sử dụng.</p>
        </div>
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">Project ID</label>
              <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/60">
                {PROJECT_ID}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">Mã thiết bị (Machine ID)</label>
              <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 break-all">
                {machineId}
              </div>
              <p className="text-[10px] text-white/20 mt-1 ml-1">Gửi mã này cho Admin để được cấp phép.</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1 mb-1.5 block">License Key</label>
              <input 
                type="text" 
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Nhập khóa bản quyền của bạn..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none transition-all placeholder-white/20"
              />
            </div>
          </div>
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center">
              {error}
            </div>
          )}
          <button 
            onClick={handleCheck}
            disabled={isVerifying || !keyInput.trim()}
            className="w-full bg-white text-black h-12 rounded-xl font-bold text-sm hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                ĐANG KIỂM TRA...
              </>
            ) : "KIỂM TRA LICENSE"}
          </button>
        </div>
      </div>
    </div>
  );
};