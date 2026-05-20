import type { ModeConfig } from "../types";
import { workflowsNavItems } from "./navItems";
import { WorkflowsRoutes } from "./routes";

export const workflowsConfig: ModeConfig = {
  key: "workflows",
  label: "Workflows",
  basePath: "/workflows",
  navItems: workflowsNavItems,
  Routes: WorkflowsRoutes,
};
