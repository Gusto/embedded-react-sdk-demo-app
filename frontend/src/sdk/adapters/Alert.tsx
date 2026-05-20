import type { AlertProps } from "@gusto/embedded-react-sdk";

const statusClasses = {
  info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-100",
  success:
    "bg-green-50 border-green-200 text-green-900 dark:bg-green-950/40 dark:border-green-900 dark:text-green-100",
  warning:
    "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-100",
  error:
    "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-900 dark:text-red-100",
} as const;

const dotClasses = {
  info: "bg-blue-500",
  success: "bg-green-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
} as const;

export function Alert({
  status = "info",
  label,
  children,
  icon,
  className,
  onDismiss,
}: AlertProps) {
  return (
    <div
      role="alert"
      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 font-sans text-sm ${statusClasses[status]} ${className ?? ""}`}
    >
      <span className="mt-1.5 inline-flex shrink-0" aria-hidden>
        {icon ?? (
          <span className={`block h-2 w-2 rounded-full ${dotClasses[status]}`} />
        )}
      </span>
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="m-0 font-medium">{label}</p>
        {children ? <div className="opacity-80">{children}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-mr-1 -mt-1 cursor-pointer rounded-md p-1 text-current opacity-60 transition hover:bg-black/5 hover:opacity-100"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
