import { type ReactNode } from "react";
import { Link } from "react-router-dom";

interface DemoShellProps {
  /** The pretend product name shown in the demo top bar. */
  brandName: string;
  /** Tagline rendered next to the brand name. Optional. */
  brandTagline?: string;
  /** Optional action rendered to the left of "Exit demo". */
  headerAction?: ReactNode;
  children: ReactNode;
}

/**
 * Full-bleed shell rendered as an overlay over the rest of the app. The
 * visual style is intentionally distinct from the main app chrome so the
 * user feels like they've stepped into a different product. Re-used by
 * both showcase demos.
 */
export function DemoShell({
  brandName,
  brandTagline,
  headerAction,
  children,
}: DemoShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white text-neutral-900">
      <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-fuchsia-500 text-sm font-semibold text-white">
            {brandName.charAt(0)}
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-neutral-900">
              {brandName}
            </span>
            {brandTagline ? (
              <span className="text-xs text-neutral-500">{brandTagline}</span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {headerAction}
          <Link
            to="/showcase"
            className="inline-flex h-8 items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            <span aria-hidden>×</span>
            Exit demo
          </Link>
        </div>
      </header>
      <main className="flex-1 overflow-auto bg-neutral-50">{children}</main>
    </div>
  );
}
