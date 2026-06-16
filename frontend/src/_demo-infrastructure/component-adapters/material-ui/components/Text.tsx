import { Typography } from "@mui/material";
import type { TextProps } from "@gusto/embedded-react-sdk";

const sizeMap = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
} as const;

const weightMap = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export function MuiText({
  as = "p",
  size = "md",
  textAlign,
  weight,
  className,
  id,
  children,
  variant,
}: TextProps) {
  return (
    <Typography
      component={as}
      className={className}
      id={id}
      color={variant === "supporting" ? "text.secondary" : undefined}
      sx={{
        m: 0,
        fontSize: sizeMap[size],
        fontWeight: weight ? weightMap[weight] : undefined,
        textAlign,
      }}
    >
      {children}
    </Typography>
  );
}
