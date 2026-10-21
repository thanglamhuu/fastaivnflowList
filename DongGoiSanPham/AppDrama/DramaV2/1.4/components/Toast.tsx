import React from 'react';
export type ToastType = 'info' | 'success' | 'warning' | 'error';
export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}
interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}
export default function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isSuccess = toast.type === 'success';
        const bgClass = isError
          ? 'bg-red-950/95 border-red-500/50 text-red-200'
          : isWarning
          ? 'bg-amber-950/95 border-amber-500/50 text-amber-200'
          : isSuccess
          ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200'
          : 'bg-slate-900/95 border-indigo-500/50 text-slate-200';
        const icon = isError
          ? 'error'
          : isWarning
          ? 'warning'
          : isSuccess
          ? 'check_circle'
          : 'info';
        const iconColor = isError
          ? 'text-red-400'
          : isWarning
          ? 'text-amber-400'
          : isSuccess
          ? 'text-emerald-400'
          : 'text-indigo-400';
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-3 duration-300 ${bgClass}`}
          >
            <span className={`material-symbols-outlined text-xl mt-0.5 shrink-0 ${iconColor}`}>
              {icon}
            </span>
            <div className="flex-1 text-xs leading-relaxed font-medium break-words">
              {toast.message}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
              title="Đóng thông báo"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}