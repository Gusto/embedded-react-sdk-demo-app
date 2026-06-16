import { Alert, AlertTitle } from "@mui/material";
import type { AlertProps } from "@gusto/embedded-react-sdk";

export function MuiAlert({
  status = "info",
  label,
  children,
  action,
  icon,
  className,
  onDismiss,
}: AlertProps) {
  return (
    <Alert
      severity={status}
      icon={icon ?? undefined}
      action={action}
      onClose={!action ? onDismiss : undefined}
      className={className}
    >
      <AlertTitle>{label}</AlertTitle>
      {children}
    </Alert>
  );
}
