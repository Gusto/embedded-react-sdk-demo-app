import { CircularProgress, IconButton } from "@mui/material";
import type { ButtonIconProps } from "@gusto/embedded-react-sdk";

export function MuiButtonIcon({
  isLoading = false,
  isDisabled = false,
  buttonRef,
  onClick,
  icon,
  children,
  variant: _variant,
  onBlur,
  onFocus,
  ...props
}: ButtonIconProps) {
  return (
    <IconButton
      ref={buttonRef}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      onBlur={onBlur}
      onFocus={onFocus}
      {...props}
    >
      {isLoading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        (icon ?? children)
      )}
    </IconButton>
  );
}
