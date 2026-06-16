import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import type { CalendarPreviewProps } from "@gusto/embedded-react-sdk";

const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export function MuiCalendarPreview({
  dateRange,
  highlightDates,
}: CalendarPreviewProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle2">{dateRange.label}</Typography>
      <Typography variant="body2" color="text.secondary">
        {formatDate(dateRange.start)} – {formatDate(dateRange.end)}
      </Typography>
      {highlightDates && highlightDates.length > 0 && (
        <List dense disablePadding sx={{ mt: 1 }}>
          {highlightDates.map((highlight, index) => (
            <ListItem key={index} disableGutters>
              <ListItemText
                primary={`${formatDate(highlight.date)} – ${highlight.label}`}
                slotProps={{
                  primary: {
                    color:
                      highlight.highlightColor === "primary"
                        ? "primary"
                        : "secondary",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
