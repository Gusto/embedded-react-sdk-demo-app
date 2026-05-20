import type { NumberInputProps } from "@gusto/embedded-react-sdk";

const adornmentByFormat = {
  currency: { start: "$", end: null },
  percent: { start: null, end: "%" },
  decimal: { start: null, end: null },
} as const;

export function NumberInput({
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
  className,
  min,
  max,
  format,
  adornmentStart,
  adornmentEnd,
}: NumberInputProps) {
  const formatDefaults = format ? adornmentByFormat[format] : null;
  const startAdornment = adornmentStart ?? formatDefaults?.start ?? null;
  const endAdornment = adornmentEnd ?? formatDefaults?.end ?? null;

  const shellClasses = [
    "flex w-full items-center gap-2 rounded-full border bg-white px-4 py-2 transition-colors",
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
        {startAdornment ? (
          <span className="shrink-0 text-sm text-neutral-500">
            {startAdornment}
          </span>
        ) : null}
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="number"
          inputMode="decimal"
          value={value ?? ""}
          placeholder={placeholder}
          disabled={isDisabled}
          required={isRequired}
          min={min}
          max={max}
          aria-invalid={isInvalid || undefined}
          onChange={(e) => {
            const next = e.target.value;
            if (next === "") return;
            const parsed = Number(next);
            if (!Number.isNaN(parsed)) onChange?.(parsed);
          }}
          onBlur={onBlur}
          className="min-w-0 flex-1 bg-transparent text-sm tabular-nums text-neutral-900 placeholder-neutral-400 focus:outline-none disabled:cursor-not-allowed"
        />
        {endAdornment ? (
          <span className="shrink-0 text-sm text-neutral-500">
            {endAdornment}
          </span>
        ) : null}
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
