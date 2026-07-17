import { Box, Typography } from "@mui/material";
import type { FormBoxHeaderProps } from "@gusto/embedded-react-sdk";

export function MuiFormBoxHeader({
  title,
  action,
}: FormBoxHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}
