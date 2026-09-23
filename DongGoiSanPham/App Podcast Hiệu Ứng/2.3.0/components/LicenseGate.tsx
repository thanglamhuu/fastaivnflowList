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
      <div className="w-full max-w-md bg-[#12101a] border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col items-center my-auto">
        <img src="https://fastaivn.com/baner.png" alt="FastAI Logo" className="h-[60px] w-[180px] object-contain mb-2" />
        <a href="https://fastaivn.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 hover:text-[#F31B17] transition-colors mb-8">fastaivn.com</a>
        
        <h2 className="text-xl font-black uppercase text-center mb-2">Nhập Lisence</h2>
        <p className="text-xs text-white text-center mb-8 leading-relaxed">
          Vui lòng nhập mã kích hoạt để sử dụng App <br />
          <span className="opacity-80">(Nếu chưa có thì chat zalo với hotline trên web fastaivn.com)</span>
        </p>
        <div className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Mã máy (gửi hotline để nhận lisence)</label>
            <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-center items-center">
              <span className="font-mono text-xs text-[#F31B17] font-bold select-all cursor-text">{machineId}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Nhập License Key</label>
            <textarea 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Nhập lisence được cấp vào đây rồi bấm Kích Hoạt Ngay"
              className="w-full h-32 bg-slate-900 border border-slate-800 rounded-xl p-3 text-[10px] font-mono focus:border-[#F31B17] outline-none resize-none"
            />
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold text-center">
              {error}
            </div>
          )}
          <button 
            disabled={!token.trim() || loading}
            onClick={handleActivate}
            className="w-full py-4 bg-[#F31B17] hover:bg-[#d11713] disabled:opacity-30 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg shadow-red-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "KÍCH HOẠT NGAY"}
          </button>
        </div>
      </div>
    </div>
  );
}