import { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, AlertCircle } from 'lucide-react';

type ToastVariant = 'success' | 'info' | 'error';

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  /** Show a transient toast notification. */
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const VARIANT_META: Record<ToastVariant, { icon: typeof Check; accent: string }> = {
  success: { icon: Check, accent: 'text-sage' },
  info: { icon: Info, accent: 'text-terracotta' },
  error: { icon: AlertCircle, accent: 'text-red-400' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed left-1/2 -translate-x-1/2 bottom-24 sm:bottom-8 z-[120] flex flex-col items-center gap-2 pointer-events-none"
            aria-live="polite"
            role="status"
          >
            <AnimatePresence>
              {toasts.map((toast) => {
                const meta = VARIANT_META[toast.variant];
                const Icon = meta.icon;
                return (
                  <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-charcoal/95 backdrop-blur-md border border-white/10 shadow-xl"
                  >
                    <Icon className={`w-4 h-4 ${meta.accent}`} />
                    <span className="text-sand text-xs font-hud tracking-wide">{toast.message}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Safe no-op fallback so components work even outside the provider.
    return { showToast: () => {} };
  }
  return ctx;
}
