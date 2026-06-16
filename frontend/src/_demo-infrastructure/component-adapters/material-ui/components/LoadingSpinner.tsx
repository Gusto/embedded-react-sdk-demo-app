import { Box, CircularProgress } from "@mui/material";
import type { LoadingSpinnerProps } from "@gusto/embedded-react-sdk";

export function MuiLoadingSpinner({
  size = "lg",
  style = "block",
  className,
  id,
  ...props
}: LoadingSpinnerProps) {
  return (
    <Box
      className={className}
      id={id}
      role="status"
      aria-label={props["aria-label"] ?? "Loading"}
      sx={{
        display: style === "inline" ? "inline-flex" : "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={size === "lg" ? 48 : 24} />
    </Box>
  );
}
