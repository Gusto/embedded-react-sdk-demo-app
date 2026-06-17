import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
} from "@mui/material";
import type { SwitchProps } from "@gusto/embedded-react-sdk";
import { visuallyHidden } from "../shared";

export function MuiSwitch({
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
}: SwitchProps) {
  return (
    <FormControl
      error={isInvalid}
      disabled={isDisabled}
      required={isRequired}
      className={className}
    >
      <FormControlLabel
        control={
          <Switch
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
