import { List, ListItem } from "@mui/material";
import type {
  OrderedListProps,
  UnorderedListProps,
} from "@gusto/embedded-react-sdk";

const listItemSx = { display: "list-item", py: 0.25, px: 0 } as const;

export function MuiOrderedList({
  items,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
}: OrderedListProps) {
  return (
    <List
      component="ol"
      className={className}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      sx={{ listStyleType: "decimal", pl: 3 }}
    >
      {items.map((item, index) => (
        <ListItem key={index} disableGutters sx={listItemSx}>
          {item}
        </ListItem>
      ))}
    </List>
  );
}

export function MuiUnorderedList({
  items,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
}: UnorderedListProps) {
  return (
    <List
      component="ul"
      className={className}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      sx={{ listStyleType: "disc", pl: 3 }}
    >
      {items.map((item, index) => (
        <ListItem key={index} disableGutters sx={listItemSx}>
          {item}
        </ListItem>
      ))}
    </List>
  );
}
