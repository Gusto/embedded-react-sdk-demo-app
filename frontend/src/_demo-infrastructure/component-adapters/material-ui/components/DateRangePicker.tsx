import { FormControl, FormLabel, Stack, TextField } from "@mui/material";
import type { DateRangePickerProps } from "@gusto/embedded-react-sdk";
import { formatDateInput, visuallyHidden } from "../shared";

export function MuiDateRangePicker({
  label,
  shouldVisuallyHideLabel,
  value,
  onChange,
  startDateLabel,
  endDateLabel,
  minValue,
  maxValue,
}: DateRangePickerProps) {
  const handleStart = (next: string) => {
    if (!next) {
      onChange(null);
      return;
    }
    const start = new Date(`${next}T00:00:00`);
    onChange({ start, end: value?.end ?? start });
  };

  const handleEnd = (next: string) => {
    if (!next) {
      onChange(null);
      return;
    }
    const end = new Date(`${next}T00:00:00`);
    onChange({ start: value?.start ?? end, end });
  };

  const bounds = { min: formatDateInput(minValue), max: formatDateInput(maxValue) };

  return (
    <FormControl component="fieldset" variant="standard" sx={{ width: "100%", p: 2 }}>
      <FormLabel
        component="legend"
        sx={shouldVisuallyHideLabel ? visuallyHidden : undefined}
      >
        {label}
      </FormLabel>
      <Stack direction="row" spacing={2} sx={{ mt: 1, width: "100%" }}>
        <TextField
          type="date"
          size="small"
          fullWidth
          label={startDateLabel}
          value={formatDateInput(value?.start)}
          onChange={(e) => handleStart(e.target.value)}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: bounds }}
          sx={{ flex: 1, minWidth: 0 }}
        />
        <TextField
          type="date"
          size="small"
          fullWidth
          label={endDateLabel}
          value={formatDateInput(value?.end)}
          onChange={(e) => handleEnd(e.target.value)}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: bounds }}
          sx={{ flex: 1, minWidth: 0 }}
        />
      </Stack>
    </FormControl>
  );
}
