import type { ModeConfig } from "../types";
import { hooksNavItems } from "./navItems";
import { HooksRoutes } from "./routes";

export const hooksConfig: ModeConfig = {
  key: "hooks",
  label: "Hooks",
  basePath: "/hooks",
  navItems: hooksNavItems,
  Routes: HooksRoutes,
};
