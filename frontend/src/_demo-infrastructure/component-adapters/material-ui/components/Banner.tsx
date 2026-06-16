import { Alert, AlertTitle } from "@mui/material";
import type { BannerProps } from "@gusto/embedded-react-sdk";

export function MuiBanner({
  title,
  children,
  status = "warning",
  className,
  id,
  "aria-label": ariaLabel,
}: BannerProps) {
  return (
    <Alert
      severity={status}
      variant="filled"
      className={className}
      id={id}
      aria-label={ariaLabel}
    >
      <AlertTitle>{title}</AlertTitle>
      {children}
    </Alert>
  );
}
