import { Button, CircularProgress } from "@mui/material";
import type { ButtonProps } from "@gusto/embedded-react-sdk";

const variantMap = {
  primary: { variant: "contained", color: "primary" },
  secondary: { variant: "outlined", color: "primary" },
  tertiary: { variant: "text", color: "primary" },
  error: { variant: "contained", color: "error" },
} as const;

export function MuiButton({
  isLoading = false,
  isDisabled = false,
  buttonRef,
  onClick,
  icon,
  children,
  variant = "primary",
  onBlur,
  onFocus,
  ...props
}: ButtonProps) {
  const { variant: muiVariant, color } = variantMap[variant];
  return (
    <Button
      ref={buttonRef}
      variant={muiVariant}
      color={color}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      onBlur={onBlur}
      onFocus={onFocus}
      startIcon={
        isLoading ? <CircularProgress size={16} color="inherit" /> : icon
      }
      {...props}
    >
      {children}
    </Button>
  );
}
