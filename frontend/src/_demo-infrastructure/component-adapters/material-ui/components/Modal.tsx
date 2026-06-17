import { Dialog, DialogActions, DialogContent } from "@mui/material";
import type { ModalProps } from "@gusto/embedded-react-sdk";

export function MuiModal({
  isOpen = false,
  onClose,
  shouldCloseOnBackdropClick = false,
  children,
  footer,
}: ModalProps) {
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
      {children && <DialogContent>{children}</DialogContent>}
      {footer && <DialogActions>{footer}</DialogActions>}
    </Dialog>
  );
}
