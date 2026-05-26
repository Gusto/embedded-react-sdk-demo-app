import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAdapters } from "../sdk/adapterContext";

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
  // Demos always render in light mode regardless of the app theme switcher.
  // Strip `.dark` from <html> while the demo is mounted, restoring it
  // (and any prior color-scheme) on unmount so the rest of the app keeps
  // the user's preference.
  useEffect(() => {
    const html = document.documentElement;
    const wasDark = html.classList.contains("dark");
    const prevScheme = html.style.colorScheme;
    if (wasDark) html.classList.remove("dark");
    html.style.colorScheme = "light";
    return () => {
      if (wasDark) html.classList.add("dark");
      html.style.colorScheme = prevScheme;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white font-sans text-neutral-900">
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
        <div className="flex items-center gap-3">
          <AdapterToggle />
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

function AdapterToggle() {
  const { adaptersEnabled, setAdaptersEnabled } = useAdapters();
  return (
    <label className="flex cursor-pointer items-center gap-2 select-none">
      <span className="text-xs font-medium text-neutral-600">
        Component adapters
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={adaptersEnabled}
        onClick={() => setAdaptersEnabled(!adaptersEnabled)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
          adaptersEnabled
            ? "bg-linear-to-br from-indigo-500 to-fuchsia-500"
            : "bg-neutral-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            adaptersEnabled ? "translate-x-4.5" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}
