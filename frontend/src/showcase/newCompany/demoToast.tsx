import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { HatchwellToast } from "./ui";

interface ToastContextValue {
  toast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function DemoToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 3500);
    return () => window.clearTimeout(timer);
  }, [message]);

  const toast = useCallback((next: string) => setMessage(next), []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {message ? <HatchwellToast message={message} /> : null}
    </ToastContext.Provider>
  );
}

export function useDemoToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useDemoToast must be used inside DemoToastProvider");
  return ctx;
}
