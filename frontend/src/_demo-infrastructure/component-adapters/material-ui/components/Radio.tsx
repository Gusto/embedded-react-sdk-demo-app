import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
} from "@mui/material";
import type { RadioProps } from "@gusto/embedded-react-sdk";
import { visuallyHidden } from "../shared";

export function MuiRadio({
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
}: RadioProps) {
  return (
    <FormControl
      error={isInvalid}
      disabled={isDisabled}
      required={isRequired}
      className={className}
    >
      <FormControlLabel
        control={
          <Radio
            id={id}
            name={name}
            checked={!!value}
            slotProps={{ input: { ref: inputRef, onBlur } }}
            onChange={(e) => onChange?.(e.target.checked)}
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
