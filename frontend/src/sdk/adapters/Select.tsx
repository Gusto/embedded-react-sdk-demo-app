import type { SelectProps } from "@gusto/embedded-react-sdk";

export function Select({
  label,
  description,
  errorMessage,
  isRequired,
  isInvalid,
  isDisabled,
  shouldVisuallyHideLabel,
  options,
  value,
  onChange,
  onBlur,
  placeholder,
  name,
  id,
  className,
}: SelectProps) {
  const shellClasses = [
    "relative flex w-full items-center rounded-full border bg-white pl-4 pr-10 transition-colors",
    isInvalid
      ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
      : "border-neutral-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20",
    isDisabled ? "cursor-not-allowed bg-neutral-50 opacity-60" : "",
  ].join(" ");

  return (
    <div className={`flex w-full flex-col gap-1.5 font-sans ${className ?? ""}`}>
      {label ? (
        <label
          htmlFor={id}
          className={
            shouldVisuallyHideLabel
              ? "sr-only"
              : "text-sm font-medium text-neutral-700"
          }
        >
          {label}
          {isRequired ? (
            <span className="ml-0.5 text-red-500">*</span>
          ) : null}
        </label>
      ) : null}
      <div className={shellClasses}>
        <select
          id={id}
          name={name}
          value={value ?? ""}
          disabled={isDisabled}
          required={isRequired}
          aria-invalid={isInvalid || undefined}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent py-2 text-sm text-neutral-900 focus:outline-none disabled:cursor-not-allowed"
        >
          {placeholder ? (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          ) : null}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-4 h-4 w-4 text-neutral-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
        </svg>
      </div>
      {description ? (
        <p className="text-xs text-neutral-500">{description}</p>
      ) : null}
      {errorMessage ? (
        <p className="text-xs text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}
