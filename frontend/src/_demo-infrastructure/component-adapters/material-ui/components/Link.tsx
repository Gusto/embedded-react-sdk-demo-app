import { Link } from "@mui/material";
import type { LinkProps } from "@gusto/embedded-react-sdk";

export function MuiLink({ children, ...props }: LinkProps) {
  return <Link {...props}>{children}</Link>;
}
