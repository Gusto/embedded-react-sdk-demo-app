import { Route, Routes } from "react-router-dom";
import type { NavItem } from "../navItemTypes";
import type { Example, ModeConfig } from "../types";
import { HomePage } from "./HomePage";
import { composePayrollFlowExample } from "./examples/compose-payroll-flow";
import { customListFromApiExample } from "./examples/custom-list-from-api";
import { intermediateHostStepExample } from "./examples/intermediate-host-step";

const basePath = "/blocks";

const examples: Example[] = [
  composePayrollFlowExample,
  intermediateHostStepExample,
  customListFromApiExample,
];

const navItems: NavItem[] = [
  { key: "home", label: "Home", path: basePath },
  {
    key: "examples",
    label: "Examples",
    asSection: true,
    childGroups: [
      {
        key: "all",
        label: "",
        items: examples.map((e) => ({
          key: e.key,
          label: e.label,
          path: e.path,
        })),
      },
    ],
  },
];

function BlocksRoutes() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      {examples.map((example) => {
        const rel = example.path.slice(basePath.length + 1);
        return (
          <Route
            key={example.key}
            path={`${rel}/*`}
            element={<example.Routes />}
          />
        );
      })}
    </Routes>
  );
}

export const blocksConfig: ModeConfig = {
  key: "blocks",
  label: "Blocks",
  basePath,
  about: {
    what: "Individual SDK building blocks (lists, profiles, forms) you wire together with your own routing and UI.",
    when: "You need the SDK's data and form logic but your product's navigation, branding, or step ordering differs from a stock flow.",
    tradeoffs:
      "You own routing and transitions between blocks; more code, more flexibility.",
  },
  examples,
  navItems,
  Routes: BlocksRoutes,
};
