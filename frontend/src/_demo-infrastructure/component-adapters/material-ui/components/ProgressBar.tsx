import { Box, LinearProgress, Typography } from "@mui/material";
import type { ProgressBarProps } from "@gusto/embedded-react-sdk";

export function MuiProgressBar({
  totalSteps,
  currentStep,
  className,
  label,
  cta: Cta,
}: ProgressBarProps) {
  const percent =
    totalSteps > 0
      ? Math.min(100, Math.round((currentStep / totalSteps) * 100))
      : 0;

  return (
    <Box className={className}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        {Cta && <Cta />}
      </Box>
      <LinearProgress variant="determinate" value={percent} aria-label={label} />
    </Box>
  );
}
