import { useState } from "react";
import { Link } from "react-router-dom";
import { blocksConfig } from "../modes/blocks";
import { hooksConfig } from "../modes/hooks";
import { workflowsConfig } from "../modes/workflows";
import { writeLastMode } from "../modes/modeStorage";
import type { ModeConfig } from "../modes/types";
import { HomeTopBar } from "./HomeTopBar";

const buildMethods: ModeConfig[] = [workflowsConfig, blocksConfig, hooksConfig];

const features: { key: string; title: string; description: string }[] = [
  {
    key: "component-adapters",
    title: "Component adapters",
    description:
      "Swap the SDK's default components for your own so every rendered control matches your design system.",
  },
  {
    key: "theming",
    title: "Theming",
    description:
      "Override SDK theme tokens to match brand colors, typography, and dark mode without forking components.",
  },
  {
    key: "translations",
    title: "Translations",
    description:
      "Localize SDK copy and field labels across languages by supplying your own translation resources.",
  },
  {
    key: "data",
    title: "Data",
    description:
      "Read and write Gusto data directly via the SDK's typed API client or your own backend proxy.",
  },
];

export function AppHome() {
  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <HomeTopBar scrollContainer={scrollEl} />
      <main
        ref={setScrollEl}
        className="scrollbar-hide flex-1 overflow-auto bg-white p-6 pb-24 pt-24 dark:bg-transparent"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-20">
          <div className="relative flex flex-col">
            <p className="pointer-events-none absolute -top-22 left-0 select-none md:text-[8rem] text-[4rem] font-black leading-none text-neutral-900/70 dark:text-white/6">
              Explore
            </p>
            <h1 className="relative text-neutral-900 dark:text-white text-5xl font-semibold tracking-tight">
              Gusto Embedded React SDK
            </h1>
          </div>
          <section className="flex flex-col gap-12">
            <div className="flex flex-col gap-2">
              <h2 className="m-0 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-[#E15A43]">
                Build methods
              </h2>
              <p className="text-xl text-neutral-500 dark:text-neutral-400">
                Explore your options for building with the Embedded React SDK
              </p>
            </div>
            <div className="group/methods grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {buildMethods.map((method, i) => (
                <BuildMethodRow key={method.key} method={method} index={i} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-12">
            <h2 className="m-0 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-[#E15A43]">
              Features
            </h2>
            <div className="group/features grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <FeatureCard
                  key={feature.key}
                  title={feature.title}
                  description={feature.description}
                  index={i}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function BuildMethodRow({
  method,
  index,
}: {
  method: ModeConfig;
  index: number;
}) {
  return (
    <Link
      to={method.basePath}
      onClick={() => writeLastMode(method.key)}
      style={{ animationDelay: `${index * 90}ms` }}
      className="group glass-shine flex animate-card-in flex-col gap-3 rounded-2xl bg-neutral-50 p-6 transition duration-200 group-hover/methods:opacity-50 hover:scale-[1.03] hover:bg-neutral-100 hover:opacity-100! md:p-8 dark:bg-white/3 dark:shadow-xl dark:shadow-black/40 dark:backdrop-blur-3xl dark:hover:bg-white/6"
    >
      <h3 className="m-0 text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl dark:text-neutral-100">
        {method.label}
      </h3>
      <p className="m-0 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
        {method.about.what}
      </p>
      <span className="mt-auto pt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-500 dark:text-[#E15A43] transition group-hover:gap-2">
        See examples
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}

function FeatureCard({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) {
  return (
    <div
      style={{ animationDelay: `${(index + 3) * 70}ms` }}
      className="glass-shine flex animate-card-in flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition duration-200 group-hover/features:opacity-50 hover:scale-[1.03] hover:opacity-100! dark:border-0 dark:bg-white/3 dark:shadow-xl dark:shadow-black/40 dark:backdrop-blur-3xl cursor-pointer"
    >
      <div className="aspect-16/10 w-full bg-white dark:bg-transparent" />
      <div className="flex flex-col gap-2 border-t border-neutral-200 p-5 dark:border-t-0">
        <h3 className="m-0 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
        </h3>
        <p className="m-0 text-sm text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      </div>
    </div>
  );
}
