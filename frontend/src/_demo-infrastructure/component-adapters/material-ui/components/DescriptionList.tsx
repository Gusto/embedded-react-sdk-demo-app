import { Box, Divider, Typography } from "@mui/material";
import { Fragment } from "react";
import type { DescriptionListProps } from "@gusto/embedded-react-sdk";

export function MuiDescriptionList({
  items,
  layout = "stacked",
  showSeparators = true,
  className,
}: DescriptionListProps) {
  const isHorizontal = layout === "horizontal";

  return (
    <Box component="dl" className={className} sx={{ m: 0, width: "100%" }}>
      {items.map((item, index) => {
        const terms = Array.isArray(item.term) ? item.term : [item.term];
        const descriptions = Array.isArray(item.description)
          ? item.description
          : [item.description];

        return (
          <Fragment key={index}>
            <Box
              sx={{
                display: isHorizontal ? "flex" : "block",
                justifyContent: "space-between",
                gap: 2,
                py: 1,
              }}
            >
              <Box>
                {terms.map((term, i) => (
                  <Typography
                    key={i}
                    component="dt"
                    variant="body2"
                    color="text.secondary"
                  >
                    {term}
                  </Typography>
                ))}
              </Box>
              <Box>
                {descriptions.map((description, i) => (
                  <Typography
                    key={i}
                    component="dd"
                    variant="body2"
                    sx={{ m: 0 }}
                  >
                    {description}
                  </Typography>
                ))}
              </Box>
            </Box>
            {showSeparators && index < items.length - 1 && <Divider />}
          </Fragment>
        );
      })}
    </Box>
  );
}
