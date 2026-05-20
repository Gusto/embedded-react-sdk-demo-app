import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export interface ToastOptions {
  title: string;
  description?: ReactNode;
  /** Time in ms before the toast auto-dismisses. Defaults to 4500. */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 4500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, ...options }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {typeof document !== "undefined"
        ? createPortal(
            <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
              {toasts.map((t) => (
                <Toast key={t.id} item={t} onRemove={() => remove(t.id)} />
              ))}
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

interface ToastProps {
  item: ToastItem;
  onRemove: () => void;
}

const ENTER_MS = 220;
const EXIT_MS = 220;

function Toast({ item, onRemove }: ToastProps) {
  const duration = item.duration ?? DEFAULT_DURATION;
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const remainingRef = useRef(duration);
  const startedAtRef = useRef<number | null>(null);
  const dismissTimerRef = useRef<number | null>(null);
  const removeTimerRef = useRef<number | null>(null);

  const beginLeave = useCallback(() => {
    if (isLeaving) return;
    setIsLeaving(true);
    removeTimerRef.current = window.setTimeout(onRemove, EXIT_MS);
  }, [isLeaving, onRemove]);

  const startDismissTimer = useCallback(() => {
    if (dismissTimerRef.current) {
      window.clearTimeout(dismissTimerRef.current);
    }
    if (remainingRef.current <= 0) {
      beginLeave();
      return;
    }
    startedAtRef.current = Date.now();
    dismissTimerRef.current = window.setTimeout(beginLeave, remainingRef.current);
  }, [beginLeave]);

  const pauseDismissTimer = useCallback(() => {
    if (dismissTimerRef.current) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    if (startedAtRef.current != null) {
      const elapsed = Date.now() - startedAtRef.current;
      remainingRef.current = Math.max(remainingRef.current - elapsed, 0);
      startedAtRef.current = null;
    }
  }, []);

  // Mount → trigger enter transition, then start the dismiss timer.
  useEffect(() => {
    const showFrame = requestAnimationFrame(() => setIsVisible(true));
    const startTimerFrame = window.setTimeout(startDismissTimer, ENTER_MS);
    return () => {
      cancelAnimationFrame(showFrame);
      window.clearTimeout(startTimerFrame);
      if (dismissTimerRef.current) window.clearTimeout(dismissTimerRef.current);
      if (removeTimerRef.current) window.clearTimeout(removeTimerRef.current);
    };
  }, [startDismissTimer]);

  const isShown = isVisible && !isLeaving;

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => {
        setIsHovered(true);
        pauseDismissTimer();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        startDismissTimer();
      }}
      style={{
        transition: `opacity ${isLeaving ? EXIT_MS : ENTER_MS}ms ease, transform ${
          isLeaving ? EXIT_MS : ENTER_MS
        }ms ease`,
        opacity: isShown ? 1 : 0,
        transform: isShown
          ? `translateY(0) scale(${isHovered && !isLeaving ? 1.03 : 1})`
          : "translateY(8px) scale(1)",
      }}
      className="pointer-events-auto w-80 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg shadow-black/5 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/40"
    >
      <p className="m-0 font-mono text-[11px] font-semibold uppercase tracking-wide text-blue-500">
        {item.title}
      </p>
      {item.description ? (
        <div className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
          {item.description}
        </div>
      ) : null}
    </div>
  );
}
