import { type ReactNode } from "react";
import type { Example, Mode } from "./types";

interface ExampleLayoutProps {
  mode: Mode;
  example: Example;
  children: ReactNode;
}

const modeLabels: Record<Mode, string> = {
  workflows: "Workflows",
  blocks: "Blocks",
  hooks: "Hooks",
};

/**
 * Shared hero wrapper rendered above every example's body. Provides a
 * consistent header (eyebrow / title / summary / description / primitive
 * chips) so the demo's pedagogical framing reads the same across modes.
 */
export function ExampleLayout({ mode, example, children }: ExampleLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-blue-500">
          {modeLabels[mode]} · Example
        </p>
        <div className="flex flex-col gap-2">
          <h1 className="m-0 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {example.label}
          </h1>
          <p className="m-0 text-base text-neutral-600 dark:text-neutral-400">
            {example.summary}
          </p>
        </div>
        <p className="m-0 max-w-3xl text-sm text-neutral-600 dark:text-neutral-400">
          {example.description}
        </p>
        {example.sdkPrimitives.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {example.sdkPrimitives.map((primitive) => (
              <span
                key={primitive}
                className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 font-mono text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
              >
                {primitive}
              </span>
            ))}
          </div>
        ) : null}
      </header>
      <div>{children}</div>
    </div>
  );
}
