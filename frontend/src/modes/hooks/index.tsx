import { Route, Routes } from "react-router-dom";
import type { NavItem } from "../navItemTypes";
import type { Example, ModeConfig } from "../types";
import { HomePage } from "./HomePage";
import { composeMultipleFormsExample } from "./examples/compose-multiple-forms";
import { customEmployeeFormExample } from "./examples/custom-employee-form";

const basePath = "/hooks";

const examples: Example[] = [
  customEmployeeFormExample,
  composeMultipleFormsExample,
];

const navItems: NavItem[] = [
  { key: "home", label: "Hooks", path: basePath },
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

function HooksRoutes() {
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

export const hooksConfig: ModeConfig = {
  key: "hooks",
  label: "Hooks",
  basePath,
  about: {
    what: "Low-level hooks that hand you SDK data, form state, and submit handlers without rendering any UI.",
    when: "You need full design control, custom field components, novel layouts, or want to compose multiple forms with your own orchestration.",
    tradeoffs:
      "Most code to write; no SDK-rendered UI at all — you own every visible element.",
  },
  examples,
  navItems,
  Routes: HooksRoutes,
};
