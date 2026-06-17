import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import type { CheckboxProps } from "@gusto/embedded-react-sdk";
import { visuallyHidden } from "../shared";

export function MuiCheckbox({
  label,
  description,
  errorMessage,
  isRequired,
  isDisabled,
  isInvalid,
  id,
  name,
  value,
  onChange,
  onBlur,
  inputRef,
  shouldVisuallyHideLabel,
  className,
}: CheckboxProps) {
  return (
    <FormControl
      error={isInvalid}
      disabled={isDisabled}
      required={isRequired}
      className={className}
    >
      <FormControlLabel
        control={
          <Checkbox
            id={id}
            name={name}
            checked={!!value}
            slotProps={{ input: { ref: inputRef } }}
            onChange={(e) => onChange?.(e.target.checked)}
            onBlur={onBlur}
          />
        }
        label={label}
        sx={
          shouldVisuallyHideLabel
            ? { "& .MuiFormControlLabel-label": visuallyHidden }
            : undefined
        }
      />
      {(errorMessage ?? description) && (
        <FormHelperText>{errorMessage ?? description}</FormHelperText>
      )}
    </FormControl>
  );
}
