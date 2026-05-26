import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import {
  FeaturesRoutes,
  featuresBasePath,
  featuresNavItems,
} from "../features";
import { blocksConfig } from "../modes/blocks";
import { hooksConfig } from "../modes/hooks";
import type { Mode, ModeConfig } from "../modes/types";
import { useCurrentMode } from "../modes/useCurrentMode";
import { workflowsConfig } from "../modes/workflows";
import { ExistingCompanyDemo } from "../showcase/existingCompany/ExistingCompanyDemo";
import { NewCompanyDemo } from "../showcase/newCompany/NewCompanyDemo";
import { ShowcasePage } from "../showcase/ShowcasePage";
import { AppHome } from "./AppHome";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

const configs: Record<Mode, ModeConfig> = {
  workflows: workflowsConfig,
  blocks: blocksConfig,
  hooks: hooksConfig,
};

export function AppShell() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div
      className={`flex h-screen flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 ${
        isHome ? "dark home-bg" : ""
      }`}
    >
      <Routes>
        <Route path="/" element={<AppHome />} />
        <Route path="/showcase/new-company/*" element={<NewCompanyDemo />} />
        <Route
          path="/showcase/existing-company/*"
          element={<ExistingCompanyDemo />}
        />
        <Route element={<ShowcaseLayout />}>
          <Route path="/showcase" element={<ShowcasePage />} />
        </Route>
        <Route element={<FeaturesLayout />}>
          <Route
            path={`${featuresBasePath}/*`}
            element={<FeaturesRoutes />}
          />
        </Route>
        <Route element={<ModeLayout />}>
          <Route
            path={`${workflowsConfig.basePath}/*`}
            element={<workflowsConfig.Routes />}
          />
          <Route
            path={`${blocksConfig.basePath}/*`}
            element={<blocksConfig.Routes />}
          />
          <Route
            path={`${hooksConfig.basePath}/*`}
            element={<hooksConfig.Routes />}
          />
        </Route>
      </Routes>
    </div>
  );
}

function ModeLayout() {
  const mode = useCurrentMode();
  const activeConfig = configs[mode];

  return (
    <>
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={activeConfig.navItems} />
        <main className="flex-1 overflow-auto bg-white p-6 dark:bg-neutral-950">
          <Outlet />
        </main>
      </div>
    </>
  );
}

function ShowcaseLayout() {
  return (
    <>
      <TopBar />
      <main className="flex-1 overflow-auto bg-white p-6 dark:bg-neutral-950">
        <Outlet />
      </main>
    </>
  );
}

function FeaturesLayout() {
  return (
    <>
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={featuresNavItems} />
        <main className="flex-1 overflow-auto bg-white p-6 dark:bg-neutral-950">
          <Outlet />
        </main>
      </div>
    </>
  );
}
