import { TextField } from "@mui/material";
import type { TextAreaProps } from "@gusto/embedded-react-sdk";
import { hiddenLabelSx, nonNativeRequired } from "../shared";

export function MuiTextArea({
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
  rows = 4,
  cols,
  className,
  "aria-describedby": ariaDescribedby,
}: TextAreaProps) {
  return (
    <TextField
      fullWidth
      multiline
      rows={rows}
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
          cols,
          "aria-describedby": ariaDescribedby,
          ...nonNativeRequired,
        },
      }}
    />
  );
}
