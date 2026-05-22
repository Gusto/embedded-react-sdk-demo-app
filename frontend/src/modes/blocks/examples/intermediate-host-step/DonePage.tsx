import { Link, useParams } from "react-router-dom";

export function DonePage() {
  const { employeeId } = useParams<{ employeeId: string }>();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <p className="m-0 text-sm text-neutral-600 dark:text-neutral-400">
        Step 3 of 3 — done. In a real app you'd hand off to the next SDK
        block (compensation, federal taxes, etc.) and continue the
        onboarding sequence.
      </p>
      <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="m-0 text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Employee saved
        </p>
        <p className="m-0 text-sm text-neutral-600 dark:text-neutral-400">
          Gusto record:{" "}
          <span className="font-mono text-xs">{employeeId ?? "unknown"}</span>
          {" "}plus your host-owned data is now persisted.
        </p>
        <div className="pt-2">
          <Link
            to="/blocks/intermediate-host-step"
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            Run again
          </Link>
        </div>
      </div>
    </div>
  );
}
