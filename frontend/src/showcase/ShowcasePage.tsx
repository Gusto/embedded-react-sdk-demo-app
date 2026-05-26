import { Link } from "react-router-dom";

interface ShowcaseTile {
  key: string;
  label: string;
  description: string;
  to: string;
}

const tiles: ShowcaseTile[] = [
  {
    key: "new-company",
    label: "New company",
    description:
      "Run through the demo as a company onboarding to Gusto for the first time.",
    to: "/showcase/new-company",
  },
  {
    key: "existing-company",
    label: "Existing company",
    description:
      "Run through the demo as a company that already has payroll, employees, and runs to review.",
    to: "/showcase/existing-company",
  },
];

export function ShowcasePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-12 py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-blue-500 dark:text-[#E15A43]">
          Showcase
        </p>
        <h1 className="m-0 text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Pick a demo
        </h1>
        <p className="m-0 max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          Experience the SDK inside a "real" payroll application. Each path
          starts from a different company state so you can see how the same
          components adapt to the data they're handed.
        </p>
      </div>
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        {tiles.map((tile) => (
          <Link
            key={tile.key}
            to={tile.to}
            className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-black/40"
          >
            <div className="aspect-4/3 w-full bg-neutral-100 transition group-hover:bg-neutral-200 dark:bg-neutral-950 dark:group-hover:bg-neutral-800" />
            <div className="flex flex-col gap-2 border-t border-neutral-200 p-6 dark:border-neutral-800">
              <h3 className="m-0 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                {tile.label}
              </h3>
              <p className="m-0 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {tile.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
