import type { GustoSDKTheme } from "@gusto/embedded-react-sdk";
import { createContext, useContext } from "react";
import type { ThemeToken, ThemeTokenKey } from "./themeTokens";

export type ThemeOverrides = Partial<GustoSDKTheme>;

export interface ThemingContextValue {
  overrides: ThemeOverrides;
  setOverride: (key: ThemeTokenKey, value: string) => void;
  reset: () => void;
  hasOverrides: boolean;
  tokens: ThemeToken[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const ThemingContext = createContext<ThemingContextValue | null>(null);

export function useTheming(): ThemingContextValue {
  const ctx = useContext(ThemingContext);
  if (!ctx) {
    throw new Error("useTheming must be used within a ThemeStateProvider");
  }
  return ctx;
}

/** Returns the current theme overrides to pass to GustoProvider's `theme` prop. */
export function useThemeOverrides(): ThemeOverrides {
  return useTheming().overrides;
}
