import { ArrowRight, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blocksConfig } from "../modes/blocks";
import { hooksConfig } from "../modes/hooks";
import { workflowsConfig } from "../modes/workflows";
import { writeLastMode } from "../modes/modeStorage";
import type { ModeConfig } from "../modes/types";
import { HomeTopBar } from "./HomeTopBar";

const buildMethods: ModeConfig[] = [workflowsConfig, blocksConfig, hooksConfig];

const features: { key: string; title: string; description: string; path: string }[] = [
  {
    key: "component-adapters",
    title: "Component adapters",
    description:
      "Swap the SDK's default components for your own so every rendered control matches your design system.",
    path: "/features/component-adapters",
  },
  {
    key: "theming",
    title: "Theming",
    description:
      "Re-skin every SDK component at once via theme tokens — colors, border radii, focus rings, fonts.",
    path: "/features/theming",
  },
  {
    key: "translations",
    title: "Translations",
    description:
      "Override any SDK string — field labels, descriptions, validation messages — by passing a partial dictionary.",
    path: "/features/translations",
  },
  {
    key: "bring-your-own-data",
    title: "Bring your own data",
    description:
      "Pre-fill SDK forms with values you already have so users don't re-type information you collected elsewhere.",
    path: "/features/bring-your-own-data",
  },
];

export function AppHome() {
  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);

  // Match the document background to the forced-dark home page so iOS
  // Safari's rubber-band overscroll doesn't reveal a white strip below.
  useEffect(() => {
    const prevBg = document.body.style.backgroundColor;
    const prevScheme = document.documentElement.style.colorScheme;
    document.body.style.backgroundColor = "rgb(10 10 10)";
    document.documentElement.style.colorScheme = "dark";
    return () => {
      document.body.style.backgroundColor = prevBg;
      document.documentElement.style.colorScheme = prevScheme;
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <HomeTopBar scrollContainer={scrollEl} />
      <main
        ref={setScrollEl}
        className="scrollbar-hide flex-1 overflow-auto overscroll-none bg-white p-6 pb-24 pt-24 dark:bg-transparent"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-20">
          <div className="relative flex flex-col">
            <p
              style={{ animationDuration: "1400ms" }}
              className="pointer-events-none absolute md:-top-22 -top-10 left-0 animate-card-in select-none md:text-[8rem] text-[4rem] font-black leading-none text-neutral-900/70 dark:text-white/6"
            >
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
                  path={feature.path}
                  index={i}
                />
              ))}
            </div>
          </section>

          <ShowcaseSection />
        </div>
      </main>
    </div>
  );
}

function ShowcaseSection() {
  return (
    <section
      style={{ animationDelay: "200ms" }}
      className="animate-card-in relative overflow-hidden rounded-3xl"
    >
      {/* Layered background: deep base + roaming spotlight glows + grid */}
      <div className="absolute inset-0 -z-10 bg-[#140a08]" />
      {/* Spotlight 1 — large primary glow, slow drift */}
      <div
        aria-hidden
        className="showcase-spot-1 absolute -z-10 h-[70%] w-[60%] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(225,90,67,0.7) 0%, transparent 70%)",
          filter: "blur(40px)",
          top: "-10%",
          left: "-5%",
        }}
      />
      {/* Spotlight 2 — warm secondary glow, medium drift, opposite phase */}
      <div
        aria-hidden
        className="showcase-spot-2 absolute -z-10 h-[55%] w-[50%] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(255,130,95,0.65) 0%, transparent 70%)",
          filter: "blur(50px)",
          bottom: "-15%",
          right: "-5%",
        }}
      />
      {/* Spotlight 3 — deep accent, slow cross-fade wander */}
      <div
        aria-hidden
        className="showcase-spot-3 absolute -z-10 h-[45%] w-[45%] rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(180,55,40,0.8) 0%, transparent 70%)",
          filter: "blur(60px)",
          top: "30%",
          left: "35%",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 40%, black 35%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at 50% 40%, black 35%, transparent 80%)",
        }}
      />

      <div className="flex flex-col gap-10 p-10 md:p-14">
        <div className="flex flex-col gap-4 md:max-w-2xl">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#E15A43]/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#E15A43]" />
            </span>
            Try it live
          </span>
          <h2 className="m-0 text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
            See the SDK{" "}
            <span className="bg-linear-to-br from-[#FFB199] via-[#FF8266] to-[#E15A43] bg-clip-text text-transparent">
              in action
            </span>
            .
          </h2>
          <p className="m-0 text-lg leading-relaxed text-white/70">
            Two end-to-end product environments built on the SDK — drop into
            a fictional payroll app and see the same components you've been
            reading about running in a believable host context.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ShowcaseLaunchCard
            to="/showcase/new-company"
            eyebrow="Demo 01"
            title="New company"
            description="A first-time customer working through onboarding — locations, taxes, signatory, employees."
          />
          <ShowcaseLaunchCard
            to="/showcase/existing-company"
            eyebrow="Demo 02"
            title="Existing company"
            description="An established company managing live payroll, people, and documents."
          />
        </div>

        <Link
          to="/showcase"
          className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          Or visit the showcase index
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
}

function ShowcaseLaunchCard({
  to,
  eyebrow,
  title,
  description,
}: {
  to: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:border-white/25 hover:bg-white/10"
    >
      {/* Hover sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(135deg, rgba(225,90,67,0.22), transparent 55%), linear-gradient(315deg, rgba(255,130,95,0.18), transparent 55%)",
        }}
      />
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-white/50">
          {eyebrow}
        </span>
        <span
          aria-hidden
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-[#FF8266] to-[#E15A43] text-white shadow-lg shadow-[#E15A43]/30 transition-transform group-hover:scale-110"
        >
          <Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
        </span>
      </div>
      <h3 className="relative m-0 text-2xl font-semibold tracking-tight text-white">
        {title}
      </h3>
      <p className="relative m-0 text-sm leading-relaxed text-white/65">
        {description}
      </p>
      <span className="relative mt-2 inline-flex items-center gap-1 text-sm font-medium text-white/80 transition group-hover:gap-2">
        Launch demo
        <ArrowRight aria-hidden className="h-4 w-4" />
      </span>
    </Link>
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
        <ArrowRight aria-hidden className="h-4 w-4" />
      </span>
    </Link>
  );
}

function FeatureCard({
  title,
  description,
  path,
  index,
}: {
  title: string;
  description: string;
  path: string;
  index: number;
}) {
  return (
    <Link
      to={path}
      style={{ animationDelay: `${(index + 3) * 70}ms` }}
      className="glass-shine flex animate-card-in flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition duration-200 group-hover/features:opacity-50 hover:scale-[1.03] hover:opacity-100! dark:border-0 dark:bg-white/3 dark:shadow-xl dark:shadow-black/40 dark:backdrop-blur-3xl cursor-pointer"
    >
      <div className="flex flex-col gap-2 p-5">
        <h3 className="m-0 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
        </h3>
        <p className="m-0 text-sm text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      </div>
    </Link>
  );
}
