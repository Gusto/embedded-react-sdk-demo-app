import { MenuItem, TextField } from "@mui/material";
import type { SelectProps } from "@gusto/embedded-react-sdk";
import { hiddenLabelSx, nonNativeRequired } from "../shared";

export function MuiSelect({
  label,
  description,
  errorMessage,
  isRequired,
  isDisabled,
  isInvalid,
  id,
  name,
  value,
  options,
  placeholder,
  onChange,
  onBlur,
  shouldVisuallyHideLabel,
  className,
}: SelectProps) {
  return (
    <TextField
      select
      fullWidth
      size="small"
      id={id}
      name={name}
      label={label}
      value={value ?? ""}
      required={isRequired}
      disabled={isDisabled}
      error={isInvalid}
      helperText={errorMessage ?? description}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={onBlur}
      className={className}
      sx={hiddenLabelSx(shouldVisuallyHideLabel)}
      slotProps={{ htmlInput: { ...nonNativeRequired } }}
    >
      {placeholder && (
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
      )}
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
