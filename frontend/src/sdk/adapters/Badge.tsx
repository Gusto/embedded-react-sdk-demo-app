import type { BadgeProps } from "@gusto/embedded-react-sdk";
import { X } from "lucide-react";

const statusClasses = {
  success:
    "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  warning:
    "border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  info: "border border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300",
  error:
    "border border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
} as const;

export function Badge({
  children,
  status = "info",
  onDismiss,
  dismissAriaLabel,
  isDisabled,
  className,
  id,
  "aria-label": ariaLabel,
}: BadgeProps) {
  return (
    <span
      id={id}
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold **:font-semibold! ${statusClasses[status]} ${className ?? ""}`}
    >
      {children}
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          disabled={isDisabled}
          aria-label={dismissAriaLabel ?? "Dismiss"}
          className="-mr-0.5 inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-current opacity-70 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X aria-hidden className="h-3 w-3" />
        </button>
      ) : null}
    </span>
  );
}
