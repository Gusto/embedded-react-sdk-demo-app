import type { ReactNode } from "react";
import type { NavItem } from "./navItemTypes";

export const MODES = ["workflows", "blocks", "hooks"] as const;
export type Mode = (typeof MODES)[number];

export interface ModeConfig {
  /** Internal key matching the URL prefix segment. */
  key: Mode;
  /** Display label for the ModeSwitcher. */
  label: string;
  /** Absolute base path, e.g. "/workflows". Matches the mode key. */
  basePath: string;
  /** Sidebar entries for this mode. Paths are absolute under basePath. */
  navItems: NavItem[];
  /** Returns the mode's nested <Routes> tree. */
  Routes: () => ReactNode;
}

export function isMode(value: unknown): value is Mode {
  return typeof value === "string" && (MODES as readonly string[]).includes(value);
}
