import type { SxProps, Theme } from "@mui/material";

// Hides an element visually while keeping it available to assistive tech.
// Used to honor `shouldVisuallyHideLabel` without dropping the accessible name.
export const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
} as const;

/** sx that visually hides the floating label of an MUI input when requested. */
export function hiddenLabelSx(hide?: boolean): SxProps<Theme> | undefined {
  return hide ? { "& .MuiInputLabel-root": visuallyHidden } : undefined;
}

/**
 * Formats a Date as the `YYYY-MM-DD` value an `<input type="date">` expects,
 * using the Date's LOCAL parts. Using `toISOString()` (UTC) here would shift the
 * day across the timezone boundary and cause an off-by-one (e.g. picking the
 * 23rd renders as the 22nd) since the SDK reads the Date in local time.
 */
export function formatDateInput(date?: Date | null): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
