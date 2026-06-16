import { Breadcrumbs, Link, Typography } from "@mui/material";
import type { BreadcrumbsProps } from "@gusto/embedded-react-sdk";

export function MuiBreadcrumbs({
  breadcrumbs,
  currentBreadcrumbId,
  "aria-label": ariaLabel = "Breadcrumbs",
  className,
  onClick,
}: BreadcrumbsProps) {
  return (
    <Breadcrumbs aria-label={ariaLabel} className={className}>
      {breadcrumbs.map((breadcrumb) => {
        const isCurrent = breadcrumb.id === currentBreadcrumbId;
        const isClickable =
          (breadcrumb.isClickable ?? true) && !isCurrent && Boolean(onClick);

        if (!isClickable) {
          return (
            <Typography
              key={breadcrumb.id}
              color={isCurrent ? "text.primary" : "text.secondary"}
              aria-current={isCurrent ? "page" : undefined}
            >
              {breadcrumb.label}
            </Typography>
          );
        }

        return (
          <Link
            key={breadcrumb.id}
            component="button"
            type="button"
            color="inherit"
            underline="hover"
            onClick={() => onClick?.(breadcrumb.id)}
          >
            {breadcrumb.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
