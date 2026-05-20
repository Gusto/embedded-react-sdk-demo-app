import type { DatePickerProps } from "@gusto/embedded-react-sdk";

function toIsoDate(d: Date | null | undefined): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DatePicker({
  label,
  description,
  errorMessage,
  isRequired,
  isInvalid,
  isDisabled,
  shouldVisuallyHideLabel,
  value,
  onChange,
  onBlur,
  inputRef,
  name,
  id,
  placeholder,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  const shellClasses = [
    "flex w-full items-center rounded-full border bg-white px-4 py-2 transition-colors",
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
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="date"
          value={toIsoDate(value)}
          placeholder={placeholder}
          disabled={isDisabled}
          required={isRequired}
          min={toIsoDate(minDate) || undefined}
          max={toIsoDate(maxDate) || undefined}
          aria-invalid={isInvalid || undefined}
          onChange={(e) => {
            const next = e.target.value;
            onChange?.(next ? new Date(`${next}T00:00:00`) : null);
          }}
          onBlur={onBlur}
          className="min-w-0 flex-1 bg-transparent text-sm tabular-nums text-neutral-900 placeholder-neutral-400 focus:outline-none disabled:cursor-not-allowed"
        />
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
