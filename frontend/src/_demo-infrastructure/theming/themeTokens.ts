// Runtime discovery of the SDK's theme tokens.
//
// The SDK's ThemeProvider injects a <style data-testid="GSDK"> element into
// document.head containing `.GSDK { --g-<token>: <default>; ... }` for every
// theme token, with defaults merged in. We parse that stylesheet to derive the
// full token list and their default values at runtime. This means new tokens
// added in a future SDK release appear automatically with no code changes here.

import type { GustoSDKTheme } from "@gusto/embedded-react-sdk";

export type ThemeTokenKey = keyof GustoSDKTheme;

export interface ThemeToken {
  /** Theme-prop key, e.g. `colorPrimary` (the CSS var name minus the `--g-` prefix). */
  key: ThemeTokenKey;
  /** SDK default value, used as the input placeholder. */
  defaultValue: string;
  /** Whether to render a color picker alongside the text input. */
  isColor: boolean;
  /** Display group label. */
  group: string;
}

const STYLE_SELECTOR = 'style[data-testid="GSDK"]';
// Matches `--g-<key>: <value>;` capturing the key and trimmed value.
const CSS_VAR_RE = /--g-([A-Za-z0-9]+)\s*:\s*([^;]+);/g;

// Ordered prefix/suffix rules. The first matching rule wins; anything that
// matches nothing falls into "Other" so newly-introduced tokens still render.
const GROUP_RULES: Array<{ label: string; test: (key: string) => boolean }> = [
  { label: "Inputs", test: (k) => k.startsWith("input") },
  { label: "Focus", test: (k) => k.startsWith("focusRing") },
  { label: "Colors", test: (k) => k.toLowerCase().includes("color") },
  { label: "Radius", test: (k) => k.endsWith("Radius") },
  { label: "Typography", test: (k) => k.startsWith("font") },
  { label: "Shadows", test: (k) => k.startsWith("shadow") },
  { label: "Transitions", test: (k) => k.startsWith("transition") },
];

const COLOR_VALUE_RE = /^(#|rgb|rgba|hsl|hsla)\b|^#/i;

function isColorToken(key: string, value: string): boolean {
  if (key.toLowerCase().includes("color")) return true;
  const v = value.trim();
  return COLOR_VALUE_RE.test(v);
}

function groupFor(key: string): string {
  for (const rule of GROUP_RULES) {
    if (rule.test(key)) return rule.label;
  }
  return "Other";
}

/**
 * Reads the SDK's injected theme stylesheet and returns the discovered tokens.
 * Returns an empty array if the stylesheet is not present yet (e.g. before the
 * GustoProvider has mounted). Callers should invoke this after mount.
 */
export function discoverThemeTokens(): ThemeToken[] {
  if (typeof document === "undefined") return [];

  const styleEl = document.querySelector(STYLE_SELECTOR);
  const css = styleEl?.textContent ?? "";
  if (!css) return [];

  const tokens: ThemeToken[] = [];
  const seen = new Set<string>();

  CSS_VAR_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = CSS_VAR_RE.exec(css)) !== null) {
    const key = match[1];
    const value = match[2].trim();
    if (seen.has(key)) continue;
    seen.add(key);
    tokens.push({
      key: key as ThemeTokenKey,
      defaultValue: value,
      isColor: isColorToken(key, value),
      group: groupFor(key),
    });
  }

  return tokens;
}

/** Stable, display-ordered group labels. Unknown groups (incl. "Other") are appended. */
const GROUP_ORDER = [
  "Colors",
  "Inputs",
  "Radius",
  "Typography",
  "Shadows",
  "Focus",
  "Transitions",
  "Other",
];

export interface ThemeTokenGroup {
  label: string;
  tokens: ThemeToken[];
}

/** Groups discovered tokens into display-ordered sections. */
export function groupThemeTokens(tokens: ThemeToken[]): ThemeTokenGroup[] {
  const byGroup = new Map<string, ThemeToken[]>();
  for (const token of tokens) {
    const list = byGroup.get(token.group) ?? [];
    list.push(token);
    byGroup.set(token.group, list);
  }

  const orderedLabels = [
    ...GROUP_ORDER.filter((label) => byGroup.has(label)),
    ...[...byGroup.keys()].filter((label) => !GROUP_ORDER.includes(label)),
  ];

  return orderedLabels.map((label) => ({
    label,
    tokens: byGroup.get(label) ?? [],
  }));
}

/** Humanizes a token key, e.g. `colorPrimaryAccent` -> `Color Primary Accent`. */
export function tokenLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
