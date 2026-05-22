import { GustoProvider } from "@gusto/embedded-react-sdk";
import { type ReactNode } from "react";
import { adapters } from "./adapters";
import { useAdapters } from "./adapterContext";
import { useTheme } from "./themeContext";

interface SdkBoundaryProps {
  children: ReactNode;
}

/**
GustoProvider accepts a `theme` prop that overrides the SDK's color tokens
(e.g. `colorBody`, `colorPrimary`, `colorBorderPrimary`). Internally the SDK
exposes each token as a CSS custom property (`var(--g-colorBody)`, etc.) that
every default SDK component reads, so passing a new palette here re-skins the
whole SDK without touching individual components.
 
 Below is the dark palette we hand to GustoProvider when the host app is in
 dark mode. Passing `undefined` (light mode) lets the SDK fall back to its
 built-in defaults.
 */
const darkTheme = {
  colorBody: "#0a0a0a",
  colorBodyAccent: "#171717",
  colorBodyContent: "#fafafa",
  colorBodySubContent: "#a3a3a3",
  colorPrimary: "#3b82f6",
  colorPrimaryAccent: "#2563eb",
  colorPrimaryContent: "#ffffff",
  colorSecondary: "#262626",
  colorSecondaryAccent: "#404040",
  colorSecondaryContent: "#fafafa",
  colorInfo: "#1e3a8a",
  colorInfoAccent: "#1e40af",
  colorInfoContent: "#bfdbfe",
  colorWarning: "#78350f",
  colorWarningAccent: "#92400e",
  colorWarningContent: "#fde68a",
  colorError: "#7f1d1d",
  colorErrorAccent: "#991b1b",
  colorErrorContent: "#fecaca",
  colorSuccess: "#14532d",
  colorSuccessAccent: "#166534",
  colorSuccessContent: "#bbf7d0",
  colorBorderPrimary: "#262626",
  colorBorderSecondary: "#262626",
  colorButtonIcon: "#a3a3a3",
  colorBodyHover: "#171717",
  inputBorderColor: "#262626",
  inputBackgroundColor: "#0a0a0a",
};

/**
 * The SDK's default light palette does not define `colorBodyHover`, so some
 * components (e.g. the Select popover's selected ListBoxItem) read an
 * undefined CSS variable and the browser falls back to an unrelated value
 * (often a near-black). We provide a light-mode value to keep the popover
 * selected state legible.
 */
const lightTheme = {
  colorBodyHover: "#f5f5f5",
};

export function SdkBoundary({ children }: SdkBoundaryProps) {
  const { adaptersEnabled } = useAdapters();
  const { resolvedTheme } = useTheme();
  return (
    <GustoProvider
      config={{ baseUrl: "http://localhost:3001" }}
      components={adaptersEnabled ? adapters : undefined}
      theme={resolvedTheme === "dark" ? darkTheme : lightTheme}
    >
      {children}
    </GustoProvider>
  );
}
