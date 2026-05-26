import type { MouseEvent } from "react";
import type { ButtonProps } from "@gusto/embedded-react-sdk";

const base =
  "inline-flex h-10 items-center justify-center gap-2 px-5 font-sans text-sm font-semibold cursor-pointer transition border whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses = {
  primary:
    "rounded-full border-transparent bg-linear-to-br from-indigo-500 to-fuchsia-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40",
  secondary:
    "rounded-full border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800",
  tertiary:
    "rounded-full border-transparent bg-transparent text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-neutral-800",
  error:
    "rounded-full border-transparent bg-red-500 text-white shadow-md shadow-red-500/20 hover:bg-red-600",
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
