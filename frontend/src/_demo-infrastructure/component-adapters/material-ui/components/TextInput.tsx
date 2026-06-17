import { InputAdornment, TextField } from "@mui/material";
import type { TextInputProps } from "@gusto/embedded-react-sdk";
import { hiddenLabelSx } from "../shared";

export function MuiTextInput({
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
  type = "text",
  className,
  min,
  max,
  maxLength,
  "aria-describedby": ariaDescribedby,
  "aria-labelledby": ariaLabelledby,
}: TextInputProps) {
  return (
    <TextField
      fullWidth
      size="small"
      type={type}
      id={id}
      name={name}
      label={label}
      value={value ?? ""}
      placeholder={placeholder}
      required={isRequired}
      disabled={isDisabled}
      error={isInvalid}
      helperText={errorMessage ?? description}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={onBlur}
      inputRef={inputRef}
      className={className}
      sx={hiddenLabelSx(shouldVisuallyHideLabel)}
      slotProps={{
        htmlInput: {
          min,
          max,
          maxLength,
          "aria-describedby": ariaDescribedby,
          "aria-labelledby": ariaLabelledby,
        },
        input: {
          startAdornment: adornmentStart ? (
            <InputAdornment position="start">{adornmentStart}</InputAdornment>
          ) : undefined,
          endAdornment: adornmentEnd ? (
            <InputAdornment position="end">{adornmentEnd}</InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}
