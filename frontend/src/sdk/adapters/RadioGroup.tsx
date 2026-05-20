import type { RadioGroupProps } from "@gusto/embedded-react-sdk";

export function RadioGroup({
  label,
  description,
  errorMessage,
  isRequired,
  isInvalid,
  isDisabled,
  shouldVisuallyHideLabel,
  options,
  value,
  defaultValue,
  onChange,
  inputRef,
  className,
}: RadioGroupProps) {
  const selected = value ?? defaultValue ?? null;

  return (
    <fieldset
      disabled={isDisabled}
      aria-invalid={isInvalid || undefined}
      className={`flex w-full flex-col gap-2 font-sans ${className ?? ""}`}
    >
      <legend
        className={
          shouldVisuallyHideLabel
            ? "sr-only"
            : "mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
        }
      >
        {label}
        {isRequired ? (
          <span className="ml-0.5 text-red-500">*</span>
        ) : null}
      </legend>
      <div className="flex flex-col gap-2.5">
        {options.map((opt, i) => {
          const optionDisabled = isDisabled || opt.isDisabled;
          const isChecked = selected === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-3 text-sm ${
                optionDisabled ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              <span className="relative mt-0.5 inline-flex shrink-0">
                <input
                  ref={i === 0 ? inputRef : undefined}
                  type="radio"
                  value={opt.value}
                  checked={isChecked}
                  disabled={optionDisabled}
                  onChange={() => onChange?.(opt.value)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-neutral-300 bg-white transition-colors checked:border-blue-500 disabled:cursor-not-allowed dark:border-neutral-600 dark:bg-neutral-900"
                />
                <span className="pointer-events-none absolute inset-0 m-auto h-2 w-2 rounded-full bg-blue-500 opacity-0 peer-checked:opacity-100" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {opt.label}
                </span>
                {opt.description ? (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {opt.description}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {description ? (
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      ) : null}
    </fieldset>
  );
}
