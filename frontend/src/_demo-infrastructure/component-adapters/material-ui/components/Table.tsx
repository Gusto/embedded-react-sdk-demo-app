import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import type { TableProps } from "@gusto/embedded-react-sdk";

export function MuiTable({
  headers,
  rows,
  footer,
  className,
  "aria-label": ariaLabel,
  emptyState,
  isWithinBox,
  id,
  role,
}: TableProps) {
  const table = (
    <Table aria-label={ariaLabel} id={id} role={role}>
      <TableHead>
        <TableRow>
          {headers.map((header) => (
            <TableCell key={header.key}>{header.content}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.length === 0 && emptyState ? (
          <TableRow>
            <TableCell colSpan={headers.length}>{emptyState}</TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={row.key} hover>
              {row.data.map((cell) => (
                <TableCell key={cell.key}>{cell.content}</TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
      {footer && footer.length > 0 && (
        <TableFooter>
          <TableRow>
            {footer.map((cell) => (
              <TableCell key={cell.key}>{cell.content}</TableCell>
            ))}
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );

  if (isWithinBox) {
    return table;
  }

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      className={className}
      sx={{ width: "100%" }}
    >
      {table}
    </TableContainer>
  );
}
