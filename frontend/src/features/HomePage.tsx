import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { features } from "./registry";

export function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-16">
      <header className="flex flex-col gap-4">
        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-blue-500 dark:text-[#E15A43]">
          Features
        </p>
        <h1 className="m-0 text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Make the SDK yours
        </h1>
        <p className="m-0 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          The SDK ships with sensible defaults, but everything that affects
          how it looks, reads, and behaves can be overridden at the
          GustoProvider boundary. Each feature below is a single prop on
          GustoProvider (or a single SDK component) that lets you bend the
          SDK around your product instead of the other way around.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <h2 className="m-0 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Available features
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <Link
              key={feature.key}
              to={feature.path}
              className="group flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-blue-300 hover:bg-blue-50/30 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-[#E15A43]/40 dark:hover:bg-[#E15A43]/5"
            >
              <h3 className="m-0 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {feature.label}
              </h3>
              <p className="m-0 text-sm text-neutral-600 dark:text-neutral-400">
                {feature.summary}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-500 transition group-hover:gap-2 dark:text-[#E15A43]">
                See it in action <ArrowRight aria-hidden className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
