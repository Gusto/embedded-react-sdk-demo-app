import type { CheckboxProps } from "@gusto/embedded-react-sdk";

export function Checkbox({
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
}: CheckboxProps) {
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
            type="checkbox"
            checked={value ?? false}
            disabled={isDisabled}
            onChange={(e) => onChange?.(e.target.checked)}
            onBlur={onBlur}
            aria-invalid={isInvalid || undefined}
            className={`peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 bg-white transition-colors checked:border-blue-500 checked:bg-blue-500 disabled:cursor-not-allowed dark:bg-neutral-900 ${
              isInvalid
                ? "border-red-500"
                : "border-neutral-300 dark:border-neutral-600"
            }`}
          />
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l3.5 3.5L15 7" />
          </svg>
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
