import { Link } from "react-router-dom";

/**
 * Hooks mode home page. Hooks-mode demos build forms entirely from the SDK's
 * hook API: a `useXxxForm` hook returns the data, fields, errors, and submit
 * handler; <SDKFormProvider> publishes those to descendants; pre-bound field
 * components from `partner-hook-utils` render the inputs. No SDK Flow or
 * block components are used — the host owns the layout, copy, and navigation.
 */
export function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-blue-500">
          Hooks demo
        </p>
        <h1 className="m-0 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Build forms with SDK hooks
        </h1>
        <p className="m-0 text-neutral-600 dark:text-neutral-400">
          When you need maximum control — bespoke layouts, your own validation
          UX, custom multi-step orchestration — the SDK's hook API gives you
          the underlying form state and submission without rendering any UI.
          Drop in pre-bound field components or render your own inputs against
          the same form internals.
        </p>
      </header>

      <section className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="m-0 text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Try an example
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          <Link
            to="/hooks/employee-form"
            className="text-blue-500 hover:underline"
          >
            Open the employee details form →
          </Link>{" "}
          uses{" "}
          <code className="font-mono text-xs">useEmployeeDetailsForm</code> +{" "}
          <code className="font-mono text-xs">SDKFormProvider</code> + the
          hook field components.
        </p>
      </section>
    </div>
  );
}
