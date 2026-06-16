import { Typography } from "@mui/material";
import type { HeadingProps } from "@gusto/embedded-react-sdk";

// MUI's default h1–h6 are display-sized (h1 = 6rem). Scale them down to sizes
// appropriate for embedded forms while keeping the relative hierarchy.
const fontSizeMap = {
  h1: "2rem",
  h2: "1.5rem",
  h3: "1.25rem",
  h4: "1.125rem",
  h5: "1rem",
  h6: "0.875rem",
} as const;

export function MuiHeading({
  as,
  styledAs,
  textAlign,
  children,
  className,
  id,
}: HeadingProps) {
  const level = styledAs ?? as;
  return (
    <Typography
      component={as}
      variant={level}
      className={className}
      id={id}
      sx={{ textAlign, fontSize: fontSizeMap[level], fontWeight: 600 }}
    >
      {children}
    </Typography>
  );
}
