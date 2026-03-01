import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore, Toast as ToastType } from '../../store/uiStore';
import { useReducedMotion } from '../../hooks/useDebounce';

const ToastItem = memo(function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useUIStore((state) => state.removeToast);
  const prefersReducedMotion = useReducedMotion();

  const styles = {
    success: {
      bg: 'bg-white',
      border: 'border-emerald-200',
      icon: 'bg-emerald-100 text-emerald-600',
      text: 'text-gray-900',
    },
    error: {
      bg: 'bg-white',
      border: 'border-red-200',
      icon: 'bg-red-100 text-red-600',
      text: 'text-gray-900',
    },
    info: {
      bg: 'bg-white',
      border: 'border-blue-200',
      icon: 'bg-blue-100 text-blue-600',
      text: 'text-gray-900',
    },
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const style = styles[toast.type];

  return (
    <motion.div
      layout={!prefersReducedMotion}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        ${style.bg} ${style.border} ${style.text}
        px-4 py-3 rounded-xl border shadow-lg
        flex items-center gap-3 min-w-[320px] max-w-[420px]
      `}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${style.icon}`}>
        {icons[toast.type]}
      </div>
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
});

export const ToastContainer = memo(function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
});
