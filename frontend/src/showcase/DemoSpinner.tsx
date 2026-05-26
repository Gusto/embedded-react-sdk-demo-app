/**
 * Hatchwell-styled spinner used as a placeholder while a demo screen
 * is loading. Conic gradient on a circular mask gives an indigo→fuchsia
 * sweeping arc that matches the demo's adapter palette.
 */
export function DemoSpinner() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(99,102,241,0) 0deg, rgb(99 102 241) 200deg, rgb(217 70 239) 340deg, rgba(217,70,239,0) 360deg)",
          WebkitMask:
            "radial-gradient(circle, transparent 55%, black 56%)",
          mask: "radial-gradient(circle, transparent 55%, black 56%)",
        }}
      />
    </div>
  );
}
