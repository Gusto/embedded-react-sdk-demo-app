import { Autocomplete, TextField } from "@mui/material";
import type { ComboBoxOption, ComboBoxProps } from "@gusto/embedded-react-sdk";
import { hiddenLabelSx, nonNativeRequired } from "../shared";

export function MuiComboBox({
  label,
  description,
  errorMessage,
  isRequired,
  isDisabled,
  isInvalid,
  id,
  name,
  placeholder,
  options,
  value,
  onChange,
  onBlur,
  inputRef,
  shouldVisuallyHideLabel,
  allowsCustomValue,
  className,
}: ComboBoxProps) {
  const selected: ComboBoxOption | null =
    options.find((o) => o.value === value) ??
    (allowsCustomValue && value ? { label: value, value } : null);

  return (
    <Autocomplete<ComboBoxOption, false, false, boolean>
      fullWidth
      options={options}
      value={selected}
      freeSolo={allowsCustomValue}
      disabled={isDisabled}
      className={className}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      isOptionEqualToValue={(option, val) => {
        const optionValue = typeof option === "string" ? option : option.value;
        const compareValue = typeof val === "string" ? val : val.value;
        return optionValue === compareValue;
      }}
      onChange={(_, newValue) => {
        if (newValue == null) onChange?.("");
        else if (typeof newValue === "string") onChange?.(newValue);
        else onChange?.(newValue.value);
      }}
      onInputChange={
        allowsCustomValue
          ? (_, inputValue) => onChange?.(inputValue)
          : undefined
      }
      onBlur={onBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          id={id}
          label={label}
          placeholder={placeholder}
          required={isRequired}
          error={isInvalid}
          helperText={errorMessage ?? description}
          inputRef={inputRef}
          sx={hiddenLabelSx(shouldVisuallyHideLabel)}
          slotProps={{
            ...params.slotProps,
            htmlInput: {
              ...params.slotProps.htmlInput,
              ...nonNativeRequired,
            },
          }}
        />
      )}
    />
  );
}
