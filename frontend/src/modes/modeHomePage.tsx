import { Link } from "react-router-dom";
import type { ModeConfig } from "./types";

interface ModeHomePageProps {
  config: ModeConfig;
}

/**
 * Shared home page for every mode. Renders an "About this mode" panel
 * (what / when / tradeoffs) above a grid of example cards. Each mode's
 * own HomePage.tsx is a thin wrapper that passes its config to this.
 */
export function ModeHomePage({ config }: ModeHomePageProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <header className="flex flex-col gap-2">
        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-blue-500">
          Build method
        </p>
        <h1 className="m-0 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {config.label}
        </h1>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AboutCard heading="What" body={config.about.what} />
        <AboutCard heading="When" body={config.about.when} />
        <AboutCard heading="Tradeoffs" body={config.about.tradeoffs} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="m-0 text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Examples
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {config.examples.map((example) => (
            <Link
              key={example.key}
              to={example.path}
              className="group flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-black/40"
            >
              <div className="flex flex-col gap-1">
                <h3 className="m-0 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  {example.label}
                </h3>
                <p className="m-0 text-sm text-neutral-600 dark:text-neutral-400">
                  {example.summary}
                </p>
              </div>
              {example.sdkPrimitives.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {example.sdkPrimitives.map((primitive) => (
                    <span
                      key={primitive}
                      className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[11px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
                    >
                      {primitive}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function AboutCard({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="m-0 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {heading}
      </p>
      <p className="m-0 text-sm text-neutral-700 dark:text-neutral-300">
        {body}
      </p>
    </div>
  );
}
