import { useAdapters } from "../sdk/adapterContext";

export function TopBar() {
  const { adaptersEnabled, setAdaptersEnabled } = useAdapters();

  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <h2 className="m-0 text-lg font-semibold">Acme Pay</h2>
      <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-neutral-700 select-none">
        <span>Component adapters</span>
        <button
          type="button"
          role="switch"
          aria-checked={adaptersEnabled}
          onClick={() => setAdaptersEnabled(!adaptersEnabled)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
            adaptersEnabled ? "bg-blue-500" : "bg-neutral-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              adaptersEnabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </label>
    </header>
  );
}
