import { Box, Card, CardContent, Stack } from "@mui/material";
import type { CardProps } from "@gusto/embedded-react-sdk";

export function MuiCard({ children, menu, className, action }: CardProps) {
  return (
    <Card variant="outlined" className={className} sx={{ width: "100%" }}>
      <CardContent>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "flex-start", flex: 1, minWidth: 0 }}
          >
            {action && <Box>{action}</Box>}
            <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
          </Stack>
          {menu && <Box>{menu}</Box>}
        </Stack>
      </CardContent>
    </Card>
  );
}
