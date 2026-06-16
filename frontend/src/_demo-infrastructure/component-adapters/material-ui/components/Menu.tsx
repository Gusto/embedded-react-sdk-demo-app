import {
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import type { MenuProps } from "@gusto/embedded-react-sdk";

export function MuiMenu({
  triggerRef,
  items = [],
  isOpen = false,
  onClose,
  "aria-label": ariaLabel,
}: MenuProps) {
  const anchorEl = triggerRef?.current ?? null;

  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen && Boolean(anchorEl)}
      onClose={onClose}
      slotProps={{ list: { "aria-label": ariaLabel } }}
    >
      {items.map((item, index) => (
        <MenuItem
          key={index}
          disabled={item.isDisabled}
          onClick={() => {
            item.onClick();
            onClose?.();
          }}
        >
          {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
          <ListItemText>
            {item.href ? (
              <Link href={item.href} underline="none" color="inherit">
                {item.label}
              </Link>
            ) : (
              item.label
            )}
          </ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
}
