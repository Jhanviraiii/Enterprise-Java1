import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X, ShieldAlert } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'alert' | 'warning' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-slate-900/95 border-emerald-500/40 text-emerald-400',
          icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
        };
      case 'alert':
        return {
          bg: 'bg-slate-900/95 border-red-500/50 text-red-400',
          icon: <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />,
        };
      case 'warning':
        return {
          bg: 'bg-slate-900/95 border-amber-500/40 text-amber-400',
          icon: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
        };
      default:
        return {
          bg: 'bg-slate-900/95 border-cyan-500/40 text-cyan-400',
          icon: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 ${style.bg}`}
    >
      {style.icon}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-100">{toast.title}</h4>
        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-200 p-1 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
