import type { DatePickerProps } from "@gusto/embedded-react-sdk";
import { useEffect, useState } from "react";

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
  // Drive the input with local string state so the browser can manage its
  // internal MM/DD/YYYY subfields freely while the user is typing. The prop
  // `value` only syncs back in when it changes externally (e.g. a form reset).
  const [localValue, setLocalValue] = useState(() => toIsoDate(value));
  const propIso = toIsoDate(value);
  useEffect(() => {
    setLocalValue(propIso);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propIso]);

  const shellClasses = [
    "flex w-full items-center rounded-md border bg-white px-3 py-2 transition-colors dark:bg-neutral-900",
    isInvalid
      ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
      : "border-neutral-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-neutral-700 dark:focus-within:border-indigo-400",
    isDisabled
      ? "cursor-not-allowed bg-neutral-50 opacity-60 dark:bg-neutral-800"
      : "",
  ].join(" ");

  return (
    <div className={`flex w-full flex-col gap-1.5 font-sans ${className ?? ""}`}>
      {label ? (
        <label
          htmlFor={id}
          className={
            shouldVisuallyHideLabel
              ? "sr-only"
              : "text-xs font-medium text-neutral-700 dark:text-neutral-300"
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
          value={localValue}
          placeholder={placeholder}
          disabled={isDisabled}
          required={isRequired}
          min={toIsoDate(minDate) || undefined}
          max={toIsoDate(maxDate) || undefined}
          aria-invalid={isInvalid || undefined}
          onChange={(e) => {
            const next = e.target.value;
            setLocalValue(next);
            if (!next) { onChange?.(null); return; }
            const date = new Date(`${next}T00:00:00`);
            // Don't propagate until the year is fully typed (4 digits) —
            // otherwise the SDK updates value, React resets the input, and
            // the browser loses its in-progress subfield state.
            if (date.getFullYear() < 1000) return;
            onChange?.(date);
          }}
          onBlur={onBlur}
          className="min-w-0 flex-1 bg-transparent text-sm tabular-nums text-neutral-900 placeholder-neutral-400 focus:outline-none disabled:cursor-not-allowed dark:text-neutral-100 dark:placeholder-neutral-500 dark:scheme-dark"
        />
      </div>
      {description ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
      ) : null}
    </div>
  );
}
