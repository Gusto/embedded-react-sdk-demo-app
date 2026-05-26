import { Route, Routes } from "react-router-dom";
import type { NavItem } from "../modes/navItemTypes";
import { HomePage } from "./HomePage";
import { features, featuresBasePath } from "./registry";

export const featuresNavItems: NavItem[] = [
  { key: "home", label: "Features", path: featuresBasePath },
  {
    key: "all",
    label: "Features",
    asSection: true,
    childGroups: [
      {
        key: "all",
        label: "",
        items: features.map((f) => ({
          key: f.key,
          label: f.label,
          path: f.path,
        })),
      },
    ],
  },
];

export function FeaturesRoutes() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      {features.map((feature) => {
        const rel = feature.path.slice(featuresBasePath.length + 1);
        return (
          <Route
            key={feature.key}
            path={`${rel}/*`}
            element={<feature.Page />}
          />
        );
      })}
    </Routes>
  );
}

export { featuresBasePath };
