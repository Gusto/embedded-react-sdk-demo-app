import { GustoProvider } from "@gusto/embedded-react-sdk";
import type { ComponentProps, ReactNode } from "react";
import { useTheme } from "../sdk/themeContext";

type ProviderProps = ComponentProps<typeof GustoProvider>;

interface FeaturePreviewProps {
  /** Component adapter overrides for this preview only. */
  components?: ProviderProps["components"];
  /** Translation dictionary overrides for this preview only. */
  dictionary?: ProviderProps["dictionary"];
  /** Override the SDK language code. */
  lng?: ProviderProps["lng"];
  /** Replace the default theme entirely (skips light/dark resolution). */
  theme?: ProviderProps["theme"];
  children: ReactNode;
}

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

const lightTheme = {
  colorBodyHover: "#f5f5f5",
};

/**
 * SDK boundary for feature previews. Unlike the global SdkBoundary, this
 * one accepts per-page overrides (components, dictionary, lng) so each
 * feature page can demonstrate its prop in isolation.
 */
export function FeaturePreview({
  components,
  dictionary,
  lng,
  theme,
  children,
}: FeaturePreviewProps) {
  const { resolvedTheme } = useTheme();
  const resolved = theme ?? (resolvedTheme === "dark" ? darkTheme : lightTheme);
  return (
    <GustoProvider
      config={{ baseUrl: "http://localhost:3001" }}
      components={components}
      dictionary={dictionary}
      lng={lng}
      theme={resolved}
    >
      {children}
    </GustoProvider>
  );
}
