import { Autocomplete, TextField } from "@mui/material";
import type {
  MultiSelectComboBoxOption,
  MultiSelectComboBoxProps,
} from "@gusto/embedded-react-sdk";
import { hiddenLabelSx, nonNativeRequired } from "../shared";

export function MuiMultiSelectComboBox({
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
  value = [],
  onChange,
  onBlur,
  inputRef,
  shouldVisuallyHideLabel,
  isLoading,
  className,
}: MultiSelectComboBoxProps) {
  const selected = options.filter((o) => value.includes(o.value));

  return (
    <Autocomplete<MultiSelectComboBoxOption, true, false, false>
      fullWidth
      multiple
      options={options}
      value={selected}
      disabled={isDisabled}
      loading={isLoading}
      className={className}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      onChange={(_, newValues) => onChange?.(newValues.map((v) => v.value))}
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
