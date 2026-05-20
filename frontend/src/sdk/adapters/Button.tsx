import type { MouseEvent } from "react";
import type { ButtonProps } from "@gusto/embedded-react-sdk";

const base =
  "inline-flex items-center justify-center gap-2 px-4 py-2 font-sans text-sm font-medium cursor-pointer transition border whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses = {
  primary:
    "rounded-full border-transparent bg-blue-500 text-white hover:bg-blue-600",
  secondary:
    "rounded-full border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800",
  tertiary:
    "rounded-md border-transparent bg-transparent text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800",
  error:
    "rounded-full border-transparent bg-red-500 text-white hover:bg-red-600",
} as const;

export function Button({
  variant = "primary",
  isLoading,
  isDisabled,
  icon,
  children,
  onClick,
  onBlur,
  onFocus,
  onKeyDown,
  onKeyUp,
  buttonRef,
  name,
  id,
  className,
  type = "button",
  form,
  title,
  tabIndex,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: ButtonProps) {
  return (
    <button
      ref={buttonRef}
      type={type}
      name={name}
      id={id}
      form={form}
      title={title}
      tabIndex={tabIndex}
      disabled={isDisabled || isLoading}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-busy={isLoading || undefined}
      onClick={onClick as (e: MouseEvent<HTMLButtonElement>) => void}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      className={`${base} ${variantClasses[variant]} ${className ?? ""}`}
    >
      {icon ? <span className="inline-flex shrink-0">{icon}</span> : null}
      {isLoading ? <span aria-hidden>…</span> : children}
    </button>
  );
}
