import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPersistedStore } from "../../shared/persistedStore";
import {
  ThemingContext,
  type ThemeOverrides,
  type ThemingContextValue,
} from "./context";
import { ThemeTray } from "./ThemeTray";
import { ThemeTrayToggle } from "./ThemeTrayToggle";
import {
  discoverThemeTokens,
  type ThemeToken,
  type ThemeTokenKey,
} from "./themeTokens";

const overridesStore = createPersistedStore<ThemeOverrides>("demo:theming:");
const defaultsStore = createPersistedStore<Record<string, string>>(
  "demo:theming:defaults:",
);
const STORE_ID = "v1";

interface ThemeStateProviderProps {
  children: ReactNode;
}

export function ThemeStateProvider({ children }: ThemeStateProviderProps) {
  const [overrides, setOverrides] = useState<ThemeOverrides>(
    () => overridesStore.load(STORE_ID) ?? {},
  );
  const [isOpen, setIsOpen] = useState(false);
  const [tokens, setTokens] = useState<ThemeToken[]>([]);

  // Genuine SDK defaults, learned over time and persisted. A token's value in the
  // injected stylesheet equals its true default whenever that token is NOT
  // overridden, so any non-overridden token teaches us its default. This keeps
  // placeholders accurate even when overrides are active, and any token added in
  // a future SDK release is learned automatically the first time it appears.
  const pristineDefaults = useRef<Record<string, string>>(
    defaultsStore.load(STORE_ID) ?? {},
  );

  const refreshTokens = useCallback((currentOverrides: ThemeOverrides) => {
    const discovered = discoverThemeTokens();
    if (discovered.length === 0) return;

    let changed = false;
    for (const token of discovered) {
      if (!(token.key in currentOverrides)) {
        if (pristineDefaults.current[token.key] !== token.defaultValue) {
          pristineDefaults.current[token.key] = token.defaultValue;
          changed = true;
        }
      }
    }
    if (changed) defaultsStore.save(STORE_ID, pristineDefaults.current);

    setTokens(
      discovered.map((token) => ({
        ...token,
        defaultValue: pristineDefaults.current[token.key] ?? token.defaultValue,
      })),
    );
  }, []);

  // Re-discover whenever overrides change: tokens that stop being overridden
  // reveal their true default, and newly-applied overrides are reflected.
  useEffect(() => {
    refreshTokens(overrides);
  }, [overrides, refreshTokens]);

  const setOverride = useCallback((key: ThemeTokenKey, value: string) => {
    setOverrides((prev) => {
      const next: ThemeOverrides = { ...prev };
      if (value.trim() === "") {
        delete next[key];
      } else {
        next[key] = value;
      }
      overridesStore.save(STORE_ID, next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setOverrides({});
    overridesStore.save(STORE_ID, {});
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const value = useMemo<ThemingContextValue>(
    () => ({
      overrides,
      setOverride,
      reset,
      hasOverrides: Object.keys(overrides).length > 0,
      tokens,
      isOpen,
      open,
      close,
      toggle,
    }),
    [overrides, setOverride, reset, tokens, isOpen, open, close, toggle],
  );

  return (
    <ThemingContext.Provider value={value}>
      {children}
      <ThemeTrayToggle />
      <ThemeTray />
    </ThemingContext.Provider>
  );
}
