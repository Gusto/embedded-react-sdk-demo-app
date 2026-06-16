import { TextField } from "@mui/material";
import type { DatePickerProps } from "@gusto/embedded-react-sdk";
import { formatDateInput, hiddenLabelSx } from "../shared";

export function MuiDatePicker({
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
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  return (
    <TextField
      fullWidth
      size="small"
      type="date"
      id={id}
      name={name}
      label={label}
      value={formatDateInput(value)}
      required={isRequired}
      disabled={isDisabled}
      error={isInvalid}
      helperText={errorMessage ?? description}
      onChange={(e) => {
        const next = e.target.value;
        onChange?.(next ? new Date(`${next}T00:00:00`) : null);
      }}
      onBlur={onBlur}
      inputRef={inputRef}
      className={className}
      sx={hiddenLabelSx(shouldVisuallyHideLabel)}
      slotProps={{
        inputLabel: { shrink: true },
        htmlInput: {
          min: formatDateInput(minDate),
          max: formatDateInput(maxDate),
        },
      }}
    />
  );
}
