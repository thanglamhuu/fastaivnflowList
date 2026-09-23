import React, { useState, useEffect } from 'react';
import { getOrCreateMachineId } from '../license/aifastMachine';
import { activateLicense } from '../license/aifastLicenseManager';
interface LicenseGateProps {
  onSuccess: () => void;
}
export function LicenseGate({ onSuccess }: LicenseGateProps) {
  const [token, setToken] = useState('');
  const [machineId, setMachineId] = useState('Đang tạo...');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getOrCreateMachineId().then(setMachineId);
  }, []);
  const handleActivate = async () => {
    if (!token.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await activateLicense(token.trim());
      if (result.valid) {
        onSuccess();
      } else {
        setError(result.reason || "Lỗi xác thực");
      }
    } catch (err) {
      setError("Không thể kết nối dịch vụ xác thực");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[200] bg-[#0d0b14] flex items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-md bg-[#12101a] border border-white/5 rounded-3xl p-8 pt-6 shadow-2xl flex flex-col items-center">
        {/* Logo and Domain */}
        <img src="https://fastaivn.com/baner.png" alt="FastAI Logo" className="h-[60px] w-[180px] object-contain" />
        <a 
          href="https://fastaivn.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs text-white font-bold hover:text-[#F31B17] transition-colors mb-6"
        >
          fastaivn.com
        </a>
        
        {/* Version and Credits */}
        <div className="flex gap-4 mb-6">
          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
            <span className="text-[9px] font-bold text-slate-500">VERSION</span>
            <span className="text-[9px] font-black text-white">2.3.0</span>
          </div>
          <div className="px-3 py-1 bg-[#F31B17]/10 rounded-full border border-[#F31B17]/20 flex items-center gap-2">
            <span className="text-[9px] font-bold text-[#F31B17]">CREDITS</span>
            <span className="text-[9px] font-black text-[#F31B17]">99,999</span>
          </div>
        </div>
        <h2 className="text-xl font-black uppercase text-center mb-1">Nhập License</h2>
        <p className="text-[11px] text-white/70 text-center mb-6 leading-relaxed">
          Vui lòng nhập mã kích hoạt để sử dụng App <br />
          <span className="opacity-80 italic">(Nếu chưa có thì chat zalo với hotline trên web fastaivn.com)</span>
        </p>
        <div className="w-full space-y-4">
          {/* Machine ID Section */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-white uppercase px-1 mb-1">
              Mã máy (gửi hotline để nhận license)
            </label>
            <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-center items-center shadow-inner">
              <span className="font-mono text-xs text-[#F31B17] font-black select-all cursor-text tracking-wider">{machineId}</span>
            </div>
          </div>
          {/* License Token Section */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-white uppercase px-1 mb-1">
              Nhập License Key
            </label>
            <textarea 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Nhập license được cấp vào đây rồi bấm Kích Hoạt Ngay"
              className="w-full h-32 bg-slate-900 border border-slate-800 rounded-xl p-3 text-[10px] font-mono focus:border-[#F31B17] outline-none resize-none shadow-inner"
            />
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold text-center animate-pulse">
              {error}
            </div>
          )}
          <button 
            disabled={!token.trim() || loading}
            onClick={handleActivate}
            className="w-full py-4 bg-[#F31B17] hover:bg-[#d11713] disabled:opacity-30 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg shadow-red-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "KÍCH HOẠT NGAY"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}