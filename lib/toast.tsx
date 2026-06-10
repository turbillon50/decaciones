"use client";
import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Toast = { id: number; text: string; icon?: string };
const ToastContext = createContext<{ notify: (text: string, icon?: string) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notify = useCallback((text: string, icon?: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
  }, []);
  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div style={{ position: "fixed", left: 0, right: 0, top: "calc(env(safe-area-inset-top) + 16px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 90, pointerEvents: "none" }}>
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: -24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="glass"
              style={{ borderRadius: 999, padding: "14px 22px", display: "flex", alignItems: "center", gap: 10, fontSize: "calc(1.05rem * var(--fz))", fontWeight: 600, boxShadow: "var(--shadow)", maxWidth: "90vw" }}>
              {t.icon && <span style={{ fontSize: "1.3em" }}>{t.icon}</span>}
              <span>{t.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
export function useToast() {
  const c = useContext(ToastContext);
  return c ?? { notify: () => {} };
}
