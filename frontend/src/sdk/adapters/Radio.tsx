import type { RadioProps } from "@gusto/embedded-react-sdk";

export function Radio({
  value,
  onChange,
  onBlur,
  inputRef,
  isInvalid,
  isDisabled,
  label,
  description,
  errorMessage,
  name,
  id,
  className,
}: RadioProps) {
  return (
    <div className={`flex flex-col gap-1 font-sans ${className ?? ""}`}>
      <label
        htmlFor={id}
        className={`flex cursor-pointer items-start gap-3 text-sm ${
          isDisabled ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        <span className="relative mt-0.5 inline-flex shrink-0">
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="radio"
            checked={value ?? false}
            disabled={isDisabled}
            onChange={(e) => onChange?.(e.target.checked)}
            onBlur={onBlur}
            aria-invalid={isInvalid || undefined}
            className={`peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 bg-white transition-colors checked:border-indigo-500 disabled:cursor-not-allowed dark:bg-neutral-900 ${
              isInvalid
                ? "border-red-500"
                : "border-neutral-300 dark:border-neutral-600"
            }`}
          />
          <span className="pointer-events-none absolute inset-0 m-auto h-2 w-2 rounded-full bg-indigo-500 opacity-0 peer-checked:opacity-100" />
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {label}
          </span>
          {description ? (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {description}
            </span>
          ) : null}
        </span>
      </label>
      {errorMessage ? (
        <p className="ml-8 text-xs text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
