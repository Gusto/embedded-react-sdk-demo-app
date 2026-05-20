import type { BadgeProps } from "@gusto/embedded-react-sdk";

const statusClasses = {
  success:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  warning:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  error: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
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
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 font-sans text-xs font-medium ${statusClasses[status]} ${className ?? ""}`}
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
          ×
        </button>
      ) : null}
    </span>
  );
}
