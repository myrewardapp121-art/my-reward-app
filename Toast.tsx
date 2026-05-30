import { useState, createContext, useContext, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage, ToastType } from '../../types';

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  toasts: ToastMessage[];
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'success', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      
      {/* Toast viewport overlay: constrained within our mobile-first bounds */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-[400px] px-4 pointer-events-none flex flex-col gap-2.5 items-stretch">
        <AnimatePresence>
          {toasts.map((item) => (
            <ToastItem key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastItem({ item, onDismiss }: { item: ToastMessage; onDismiss: (id: string) => void }) {
  const config = {
    success: {
      bg: 'bg-[#12121A] border-[#22C55E]/30',
      text: 'text-[#22C55E]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
    },
    error: {
      bg: 'bg-[#12121A] border-[#EF4444]/30',
      text: 'text-[#EF4444]',
      icon: <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
    },
    warning: {
      bg: 'bg-[#12121A] border-[#F59E0B]/30',
      text: 'text-[#F59E0B]',
      icon: <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0" />
    },
    info: {
      bg: 'bg-[#12121A] border-[#4F8EF7]/30',
      text: 'text-[#4F8EF7]',
      icon: <Info className="w-5 h-5 text-[#4F8EF7] flex-shrink-0" />
    }
  };

  const style = config[item.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      layout
      className={`pointer-events-auto border rounded-xl p-3.5 flex items-start gap-3 shadow-lg shadow-black/80 glass-effect ${style.bg}`}
    >
      {style.icon}
      
      <div className="flex-1 text-xs font-medium text-gray-200 text-left line-clamp-2 pt-0.5 leading-relaxed">
        {item.message}
      </div>

      <button
        onClick={() => onDismiss(item.id)}
        className="text-gray-500 hover:text-gray-300 transition-colors p-0.5 rounded-md hover:bg-gray-800"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
