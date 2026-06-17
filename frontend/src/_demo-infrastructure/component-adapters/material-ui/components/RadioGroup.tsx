import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import type { RadioGroupProps } from "@gusto/embedded-react-sdk";
import { visuallyHidden } from "../shared";

export function MuiRadioGroup({
  label,
  description,
  errorMessage,
  isRequired,
  isDisabled,
  isInvalid,
  options,
  value,
  defaultValue,
  onChange,
  inputRef,
  shouldVisuallyHideLabel,
  className,
}: RadioGroupProps) {
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
      <RadioGroup
        value={value ?? ""}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {options.map((option, index) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            disabled={isDisabled || option.isDisabled}
            control={
              <Radio
                slotProps={{
                  input: { ref: index === 0 ? inputRef : undefined },
                }}
              />
            }
            label={option.label}
          />
        ))}
      </RadioGroup>
      {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
}
