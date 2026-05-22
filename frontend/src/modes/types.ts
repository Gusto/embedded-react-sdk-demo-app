import type { ReactNode } from "react";
import type { NavItem } from "./navItemTypes";

export const MODES = ["workflows", "blocks", "hooks"] as const;
export type Mode = (typeof MODES)[number];

export interface Example {
  /** Unique slug within the mode. */
  key: string;
  /** Display label for sidebar + example card. */
  label: string;
  /** Absolute mode-prefixed path (e.g. "/blocks/compose-payroll-flow"). */
  path: string;
  /** One-liner for cards + example hero. */
  summary: string;
  /** Longer paragraph shown on the example hero. */
  description: string;
  /** SDK exports / APIs the example touches (rendered as chips on the hero). */
  sdkPrimitives: string[];
  /** Renders <Routes> nested under `${path}/*`. */
  Routes: () => ReactNode;
}

export interface ModeAbout {
  what: string;
  when: string;
  tradeoffs: string;
}

export interface ModeConfig {
  /** Internal key matching the URL prefix segment. */
  key: Mode;
  /** Display label for the ModeSwitcher. */
  label: string;
  /** Absolute base path, e.g. "/workflows". Matches the mode key. */
  basePath: string;
  /** Short positioning content rendered on the mode home page. */
  about: ModeAbout;
  /** Examples shown on the home grid and mounted as routes. */
  examples: Example[];
  /** Sidebar entries — derived from `examples` in the mode's index. */
  navItems: NavItem[];
  /** Returns the mode's top-level <Routes> tree. */
  Routes: () => ReactNode;
}

export function isMode(value: unknown): value is Mode {
  return typeof value === "string" && (MODES as readonly string[]).includes(value);
}
