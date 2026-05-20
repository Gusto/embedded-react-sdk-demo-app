import type { TextInputProps } from "@gusto/embedded-react-sdk";

export function TextInput({
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
  type = "text",
  className,
  maxLength,
  min,
  max,
  adornmentStart,
  adornmentEnd,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
}: TextInputProps) {
  const hasAdornment = !!(adornmentStart || adornmentEnd);

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
        {adornmentStart ? (
          <span className="shrink-0 text-sm text-neutral-500">
            {adornmentStart}
          </span>
        ) : null}
        <input
          ref={inputRef}
          id={id}
          name={name}
          type={type}
          value={value ?? ""}
          placeholder={placeholder}
          disabled={isDisabled}
          required={isRequired}
          maxLength={maxLength}
          min={min}
          max={max}
          aria-invalid={isInvalid || undefined}
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabelledBy}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          className={`min-w-0 flex-1 bg-transparent text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none disabled:cursor-not-allowed ${
            hasAdornment ? "" : ""
          }`}
        />
        {adornmentEnd ? (
          <span className="shrink-0 text-sm text-neutral-500">
            {adornmentEnd}
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
