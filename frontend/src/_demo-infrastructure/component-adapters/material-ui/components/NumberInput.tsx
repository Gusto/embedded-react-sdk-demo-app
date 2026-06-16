import { InputAdornment, TextField } from "@mui/material";
import type { NumberInputProps } from "@gusto/embedded-react-sdk";
import { hiddenLabelSx } from "../shared";

export function MuiNumberInput({
  label,
  description,
  errorMessage,
  isRequired,
  isDisabled,
  isInvalid,
  id,
  name,
  value,
  placeholder,
  onChange,
  onBlur,
  inputRef,
  shouldVisuallyHideLabel,
  adornmentStart,
  adornmentEnd,
  min,
  max,
  className,
  format,
}: NumberInputProps) {
  const startAdornment =
    adornmentStart ?? (format === "currency" ? "$" : undefined);
  const endAdornment = adornmentEnd ?? (format === "percent" ? "%" : undefined);

  return (
    <TextField
      fullWidth
      size="small"
      type="number"
      id={id}
      name={name}
      label={label}
      value={value ?? ""}
      placeholder={placeholder}
      required={isRequired}
      disabled={isDisabled}
      error={isInvalid}
      helperText={errorMessage ?? description}
      onChange={(e) => onChange?.(parseFloat(e.target.value))}
      onBlur={onBlur}
      inputRef={inputRef}
      className={className}
      sx={hiddenLabelSx(shouldVisuallyHideLabel)}
      slotProps={{
        htmlInput: { min, max },
        input: {
          startAdornment: startAdornment ? (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ) : undefined,
          endAdornment: endAdornment ? (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}
