import { Route, Routes } from "react-router-dom";
import type { NavItem } from "../navItemTypes";
import type { Example, ModeConfig } from "../types";
import { HomePage } from "./HomePage";
import { onboardContractorExample } from "./examples/onboard-contractor";
import { onboardEmployeeExample } from "./examples/onboard-employee";
import { payContractorExample } from "./examples/pay-contractor";
import { runPayrollExample } from "./examples/run-payroll";

const basePath = "/workflows";

const examples: Example[] = [
  onboardEmployeeExample,
  onboardContractorExample,
  runPayrollExample,
  payContractorExample,
];

const navItems: NavItem[] = [
  { key: "home", label: "Workflows", path: basePath },
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

function WorkflowsRoutes() {
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

export const workflowsConfig: ModeConfig = {
  key: "workflows",
  label: "Workflows",
  basePath,
  about: {
    what: "Drop-in multi-step flows that orchestrate a full SDK feature end-to-end.",
    when: "You want the fastest, fully-supported integration and Gusto's stock UX is acceptable.",
    tradeoffs:
      "Least control over layout, navigation, and intermediate steps; UX changes ship with the SDK.",
  },
  examples,
  navItems,
  Routes: WorkflowsRoutes,
};
