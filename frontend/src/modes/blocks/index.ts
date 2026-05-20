import type { ModeConfig } from "../types";
import { blocksNavItems } from "./navItems";
import { BlocksRoutes } from "./routes";

export const blocksConfig: ModeConfig = {
  key: "blocks",
  label: "Blocks",
  basePath: "/blocks",
  navItems: blocksNavItems,
  Routes: BlocksRoutes,
};
