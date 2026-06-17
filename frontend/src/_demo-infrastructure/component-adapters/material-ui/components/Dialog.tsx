import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import type { DialogProps } from "@gusto/embedded-react-sdk";

export function MuiDialog({
  isOpen = false,
  onClose,
  onPrimaryActionClick,
  isDestructive = false,
  isPrimaryActionLoading = false,
  primaryActionLabel,
  closeActionLabel,
  title,
  children,
  shouldCloseOnBackdropClick = false,
}: DialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={(_, reason) => {
        if (reason === "backdropClick" && !shouldCloseOnBackdropClick) return;
        onClose?.();
      }}
      maxWidth="sm"
      fullWidth
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      {children && <DialogContent>{children}</DialogContent>}
      <DialogActions>
        <Button onClick={onClose} disabled={isPrimaryActionLoading}>
          {closeActionLabel}
        </Button>
        <Button
          variant="contained"
          color={isDestructive ? "error" : "primary"}
          onClick={onPrimaryActionClick}
          disabled={isPrimaryActionLoading}
          startIcon={
            isPrimaryActionLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : undefined
          }
        >
          {primaryActionLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
