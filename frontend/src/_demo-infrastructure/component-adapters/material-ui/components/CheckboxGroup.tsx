import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from "@mui/material";
import type { CheckboxGroupProps } from "@gusto/embedded-react-sdk";
import { visuallyHidden } from "../shared";

export function MuiCheckboxGroup({
  label,
  description,
  errorMessage,
  isRequired,
  isDisabled,
  isInvalid,
  options,
  value = [],
  onChange,
  inputRef,
  shouldVisuallyHideLabel,
  className,
}: CheckboxGroupProps) {
  const toggle = (optionValue: string, checked: boolean) => {
    if (!onChange) return;
    onChange(
      checked
        ? [...value, optionValue]
        : value.filter((v) => v !== optionValue),
    );
  };

  return (
    <FormControl
      component="fieldset"
      variant="standard"
      error={isInvalid}
      disabled={isDisabled}
      required={isRequired}
      className={className}
    >
      <FormLabel
        component="legend"
        sx={shouldVisuallyHideLabel ? visuallyHidden : undefined}
      >
        {label}
      </FormLabel>
      {description && (
        <FormHelperText sx={{ ml: 0 }}>{description}</FormHelperText>
      )}
      <FormGroup>
        {options.map((option, index) => (
          <FormControlLabel
            key={option.value}
            disabled={isDisabled || option.isDisabled}
            control={
              <Checkbox
                value={option.value}
                checked={value.includes(option.value)}
                slotProps={{
                  input: { ref: index === 0 ? inputRef : undefined },
                }}
                onChange={(e) => toggle(option.value, e.target.checked)}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
      {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
}
