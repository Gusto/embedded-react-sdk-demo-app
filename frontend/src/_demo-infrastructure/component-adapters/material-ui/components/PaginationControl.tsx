import { Box, IconButton, MenuItem, Select, Typography } from "@mui/material";
import type {
  PaginationControlProps,
  PaginationItemsPerPage,
} from "@gusto/embedded-react-sdk";

const PAGE_SIZES: PaginationItemsPerPage[] = [5, 10, 25, 50];

export function MuiPaginationControl({
  currentPage,
  totalPages,
  handleFirstPage,
  handlePreviousPage,
  handleNextPage,
  handleLastPage,
  handleItemsPerPageChange,
  itemsPerPage = 5,
}: PaginationControlProps) {
  if (totalPages < 2) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        py: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2">Items per page:</Typography>
        <Select
          size="small"
          value={itemsPerPage}
          onChange={(e) =>
            handleItemsPerPageChange(
              Number(e.target.value) as PaginationItemsPerPage,
            )
          }
        >
          {PAGE_SIZES.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <IconButton
          size="small"
          aria-label="Go to first page"
          disabled={currentPage === 1}
          onClick={handleFirstPage}
        >
          {"\u00AB"}
        </IconButton>
        <IconButton
          size="small"
          aria-label="Go to previous page"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          {"\u2039"}
        </IconButton>
        <Typography variant="body2">
          {currentPage} / {totalPages}
        </Typography>
        <IconButton
          size="small"
          aria-label="Go to next page"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          {"\u203A"}
        </IconButton>
        <IconButton
          size="small"
          aria-label="Go to last page"
          disabled={currentPage === totalPages}
          onClick={handleLastPage}
        >
          {"\u00BB"}
        </IconButton>
      </Box>
    </Box>
  );
}
