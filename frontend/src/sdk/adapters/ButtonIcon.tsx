import type { MouseEvent } from "react";
import type { ButtonIconProps } from "@gusto/embedded-react-sdk";

const base =
  "inline-flex shrink-0 h-9 w-9 items-center justify-center font-sans cursor-pointer transition border whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses = {
  primary:
    "rounded-full border-blue-600 bg-blue-500 text-white hover:bg-blue-600",
  secondary:
    "rounded-full border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100",
  tertiary:
    "rounded-full border-neutral-200 bg-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
  error:
    "rounded-full border-red-600 bg-red-500 text-white hover:bg-red-600",
} as const;

export function ButtonIcon({
  variant = "tertiary",
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
}: ButtonIconProps) {
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
      {isLoading ? (
        <span aria-hidden>…</span>
      ) : (
        <span className="inline-flex">{icon ?? children}</span>
      )}
    </button>
  );
}
