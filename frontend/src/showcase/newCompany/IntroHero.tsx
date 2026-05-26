import type { Phase } from "./NewCompanyDemo";
import { BRAND_NAME } from "./types";

interface IntroHeroProps {
  phase: Phase;
  onStart: () => void;
}

export function IntroHero({ phase, onStart }: IntroHeroProps) {
  const isCreating = phase.status === "creating";
  return (
    <div className="relative isolate flex min-h-full items-center justify-center overflow-hidden px-6 py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 15% 0%, rgba(99, 102, 241, 0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(236, 72, 153, 0.14), transparent 65%)",
        }}
      />
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-indigo-600">
          New on {BRAND_NAME}
        </p>
        <h1 className="m-0 text-5xl font-semibold tracking-tight text-neutral-900 md:text-6xl">
          Pay your US employees by signing up for {BRAND_NAME} payroll.
        </h1>
        <p className="m-0 max-w-2xl text-lg leading-relaxed text-neutral-600">
          Full-service payroll, tax filings, and benefits in one place. Get set
          up in minutes — we'll walk you through every step.
        </p>
        <button
          type="button"
          onClick={onStart}
          disabled={isCreating}
          className="mt-4 inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 px-7 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreating ? "Setting things up…" : "Get started"}
          {!isCreating ? (
            <span className="ml-2" aria-hidden>
              →
            </span>
          ) : null}
        </button>
        {phase.status === "error" ? (
          <p className="m-0 max-w-md rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {phase.reason}
          </p>
        ) : null}
      </div>
    </div>
  );
}
