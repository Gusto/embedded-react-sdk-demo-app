import { Box, Stack, Typography } from "@mui/material";
import type { BoxHeaderProps } from "@gusto/embedded-react-sdk";

const fontSizeMap = {
  h1: "2rem",
  h2: "1.5rem",
  h3: "1.25rem",
  h4: "1.125rem",
  h5: "1rem",
  h6: "0.875rem",
} as const;

export function MuiBoxHeader({
  title,
  description,
  action,
  headingLevel = "h3",
}: BoxHeaderProps) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <Box>
        <Typography
          variant={headingLevel}
          component={headingLevel}
          sx={{ fontSize: fontSizeMap[headingLevel], fontWeight: 600 }}
        >
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Stack>
  );
}
