import { Employee } from "@gusto/embedded-react-sdk";
import { useState } from "react";
import { FeatureLayout } from "../featureLayout";
import { FeaturePreview } from "../FeaturePreview";
import { useTheme } from "../../sdk/themeContext";
import type { Feature } from "../types";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

const themes = {
  default: {
    light: undefined,
    dark: undefined,
  },
  forest: {
    light: {
      colorPrimary: "#16a34a",
      colorPrimaryAccent: "#15803d",
      colorPrimaryContent: "#ffffff",
      colorBody: "#f0fdf4",
      colorBodyAccent: "#dcfce7",
      colorBodyContent: "#14532d",
      colorBodySubContent: "#166534",
      colorBorderPrimary: "#86efac",
      colorBorderSecondary: "#bbf7d0",
      colorBodyHover: "#dcfce7",
      colorSecondary: "#dcfce7",
      colorSecondaryAccent: "#bbf7d0",
      colorSecondaryContent: "#166534",
      focusRingColor: "#16a34a",
      inputBorderColor: "#86efac",
      inputBackgroundColor: "#f0fdf4",
      inputRadius: "10px",
      buttonRadius: "999px",
      cardRadius: "16px",
      fontFamily: '"Google Sans", system-ui, sans-serif',
    },
    dark: {
      colorPrimary: "#4ade80",
      colorPrimaryAccent: "#22c55e",
      colorPrimaryContent: "#052e16",
      colorBody: "#071811",
      colorBodyAccent: "#0d2818",
      colorBodyContent: "#bbf7d0",
      colorBodySubContent: "#86efac",
      colorBorderPrimary: "#14532d",
      colorBorderSecondary: "#166534",
      colorBodyHover: "#0d2818",
      colorSecondary: "#0d2818",
      colorSecondaryAccent: "#14532d",
      colorSecondaryContent: "#86efac",
      focusRingColor: "#4ade80",
      inputBorderColor: "#166534",
      inputBackgroundColor: "#071811",
      inputRadius: "10px",
      buttonRadius: "999px",
      cardRadius: "16px",
      fontFamily: '"Google Sans", system-ui, sans-serif',
    },
  },
  sunset: {
    light: {
      colorPrimary: "#e11d48",
      colorPrimaryAccent: "#be123c",
      colorPrimaryContent: "#ffffff",
      colorBody: "#fff1f2",
      colorBodyAccent: "#ffe4e6",
      colorBodyContent: "#881337",
      colorBodySubContent: "#9f1239",
      colorBorderPrimary: "#fda4af",
      colorBorderSecondary: "#fecdd3",
      colorBodyHover: "#ffe4e6",
      colorSecondary: "#ffe4e6",
      colorSecondaryAccent: "#fecdd3",
      colorSecondaryContent: "#9f1239",
      focusRingColor: "#e11d48",
      inputBorderColor: "#fda4af",
      inputBackgroundColor: "#fff1f2",
      inputRadius: "2px",
      buttonRadius: "6px",
      cardRadius: "6px",
      fontFamily: '"Google Sans", system-ui, sans-serif',
    },
    dark: {
      colorPrimary: "#fb7185",
      colorPrimaryAccent: "#f43f5e",
      colorPrimaryContent: "#fff1f2",
      colorBody: "#180a0d",
      colorBodyAccent: "#2d0f16",
      colorBodyContent: "#fda4af",
      colorBodySubContent: "#fb7185",
      colorBorderPrimary: "#9f1239",
      colorBorderSecondary: "#881337",
      colorBodyHover: "#2d0f16",
      colorSecondary: "#2d0f16",
      colorSecondaryAccent: "#9f1239",
      colorSecondaryContent: "#fda4af",
      focusRingColor: "#fb7185",
      inputBorderColor: "#9f1239",
      inputBackgroundColor: "#180a0d",
      inputRadius: "2px",
      buttonRadius: "6px",
      cardRadius: "6px",
      fontFamily: '"Google Sans", system-ui, sans-serif',
    },
  },
} as const;

type ThemeKey = keyof typeof themes;

const snippet = `import { GustoProvider, Employee } from "@gusto/embedded-react-sdk";

// The \`theme\` prop on GustoProvider accepts a partial map of theme
// tokens — colors, border radii, fonts, focus ring, input chrome.
// Each token is exposed as a CSS custom property the SDK's default
// components read, so changing them re-skins the whole SDK at once.
const theme = {
  colorPrimary: "#16a34a",
  colorPrimaryAccent: "#15803d",
  colorBody: "#f0fdf4",
  colorBodyAccent: "#dcfce7",
  colorBorderPrimary: "#86efac",
  inputBorderColor: "#86efac",
  inputRadius: "10px",
  buttonRadius: "999px",
  cardRadius: "16px",
  focusRingColor: "#16a34a",
  fontFamily: '"Google Sans", system-ui, sans-serif',
};

<GustoProvider
  config={{ baseUrl: "..." }}
  theme={theme}
>
  <Employee.Profile companyId={COMPANY_ID} isAdmin onEvent={...} />
</GustoProvider>;
`;

function Page() {
  const [active, setActive] = useState<ThemeKey>("forest");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const theme = themes[active][isDark ? "dark" : "light"];

  const controls = (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          Theme tokens
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Swap palettes, radii, and the font passed to GustoProvider.
        </span>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-sm dark:bg-neutral-800">
        {(Object.keys(themes) as ThemeKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              active === key
                ? "bg-blue-500 text-white dark:bg-[#E15A43]"
                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
            }`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <FeatureLayout
      eyebrow="Feature"
      title="Theming"
      summary="Re-skin every SDK component at once with a single theme object — colors, border radii, focus rings, fonts."
      description={
        <>
          <p className="m-0">
            <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">
              GustoProvider
            </code>{" "}
            accepts a{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">
              theme
            </code>{" "}
            prop that maps to CSS custom properties consumed by every SDK
            component. Pass just the tokens you want to change — anything you
            omit keeps its SDK default.
          </p>
          <p className="m-0">
            Theming is the right tool when the SDK's default chrome is fine
            but the colors, corners, or typography need to match your brand.
            For control beyond what tokens expose, reach for component
            adapters instead.
          </p>
        </>
      }
      previewControls={controls}
      code={[{ name: "GustoProvider.tsx", source: snippet }]}
    >
      <FeaturePreview key={`${active}-${isDark}`} theme={theme}>
        <Employee.Profile
          companyId={COMPANY_ID}
          isAdmin
          onEvent={(eventType, eventPayload) => {
            console.log(eventType, eventPayload);
          }}
        />
      </FeaturePreview>
    </FeatureLayout>
  );
}

export const themingFeature: Feature = {
  key: "theming",
  label: "Theming",
  path: "/features/theming",
  summary:
    "Swap colors, border radii, focus rings, and fonts across every SDK component with one theme object.",
  Page,
};
