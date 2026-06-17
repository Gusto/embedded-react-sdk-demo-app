import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Typography,
} from "@mui/material";
import type { FileInputProps } from "@gusto/embedded-react-sdk";
import { visuallyHidden } from "../shared";

export function MuiFileInput({
  label,
  description,
  errorMessage,
  isRequired,
  isDisabled,
  isInvalid,
  id,
  value,
  accept,
  onChange,
  onBlur,
  className,
  "aria-describedby": ariaDescribedby,
}: FileInputProps) {
  const inputId = id || "file-input";

  return (
    <FormControl
      error={isInvalid}
      disabled={isDisabled}
      required={isRequired}
      className={className}
    >
      <FormLabel htmlFor={inputId} sx={visuallyHidden}>
        {label}
      </FormLabel>
      {value ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">
            {value.name} ({Math.round(value.size / 1024)} KB)
          </Typography>
          <Button size="small" onClick={() => onChange(null)} disabled={isDisabled}>
            Remove
          </Button>
        </Box>
      ) : (
        <Button component="label" variant="outlined" disabled={isDisabled}>
          Choose file
          <input
            id={inputId}
            type="file"
            hidden
            accept={accept?.join(",")}
            aria-describedby={ariaDescribedby}
            onBlur={onBlur}
            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          />
        </Button>
      )}
      {(errorMessage ?? description) && (
        <FormHelperText>{errorMessage ?? description}</FormHelperText>
      )}
    </FormControl>
  );
}
