import { Chip } from "@mui/material";
import type { BadgeProps } from "@gusto/embedded-react-sdk";

const colorMap = {
  info: "info",
  success: "success",
  warning: "warning",
  error: "error",
} as const;

export function MuiBadge({
  children,
  status = "info",
  onDismiss,
  dismissAriaLabel: _dismissAriaLabel = "Dismiss",
  isDisabled,
  className,
  id,
  ...props
}: BadgeProps) {
  return (
    <Chip
      label={children}
      color={colorMap[status]}
      size="small"
      variant="outlined"
      disabled={isDisabled}
      onDelete={onDismiss}
      className={className}
      id={id}
      {...props}
    />
  );
}
