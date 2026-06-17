import { Box, Divider, Paper } from "@mui/material";
import type { BoxProps } from "@gusto/embedded-react-sdk";

export function MuiBox({
  children,
  header,
  footer,
  withPadding = true,
  className,
}: BoxProps) {
  return (
    <Paper
      variant="outlined"
      className={className}
      sx={{ overflow: "hidden", width: "100%" }}
    >
      {header && (
        <>
          <Box sx={{ p: 2 }}>{header}</Box>
          <Divider />
        </>
      )}
      <Box sx={{ p: withPadding ? 2 : 0 }}>{children}</Box>
      {footer && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>{footer}</Box>
        </>
      )}
    </Paper>
  );
}
