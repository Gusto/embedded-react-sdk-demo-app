import type { TableProps } from "@gusto/embedded-react-sdk";

export function Table({
  headers,
  rows,
  footer,
  emptyState,
  isWithinBox,
  className,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: TableProps) {
  if (rows.length === 0 && emptyState) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-10 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 ${className ?? ""}`}
        id={id}
      >
        {emptyState}
      </div>
    );
  }

  const columnCount = headers.length;
  const gridStyle = {
    gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
  };

  return (
    <div
      role="table"
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className={`flex flex-col gap-2 font-sans ${isWithinBox ? "" : "p-1"} ${className ?? ""}`}
    >
      <div
        role="row"
        className="grid items-center gap-4 px-5 pb-2 pt-1"
        style={gridStyle}
      >
        {headers.map((header) => (
          <div
            key={header.key}
            role="columnheader"
            className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500"
          >
            {header.content}
          </div>
        ))}
      </div>

      {rows.map((row) => (
        <div
          key={row.key}
          role="row"
          className="group relative grid items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-all duration-150 hover:-translate-y-px hover:shadow-[0_4px_16px_-4px_rgba(15,23,42,0.12)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none dark:hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.6)]"
          style={gridStyle}
        >
          <span
            aria-hidden
            className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-blue-400 to-blue-600 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          />
          {row.data.map((cell, cellIndex) => (
            <div
              key={cell.key}
              role="cell"
              className={
                cellIndex === 0
                  ? "text-sm font-semibold text-neutral-900 dark:text-neutral-100"
                  : "text-sm font-normal text-neutral-600 dark:text-neutral-400"
              }
            >
              {cell.content}
            </div>
          ))}
        </div>
      ))}

      {footer ? (
        <div
          role="row"
          className="mt-1 grid items-center gap-4 rounded-2xl bg-neutral-50 px-5 py-3 dark:bg-neutral-900"
          style={gridStyle}
        >
          {footer.map((cell) => (
            <div
              key={cell.key}
              role="cell"
              className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
            >
              {cell.content}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
