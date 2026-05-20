import { Navigate, Route, Routes } from "react-router-dom";
import { blocksConfig } from "../modes/blocks";
import { hooksConfig } from "../modes/hooks";
import { readLastMode } from "../modes/modeStorage";
import type { Mode, ModeConfig } from "../modes/types";
import { useCurrentMode } from "../modes/useCurrentMode";
import { workflowsConfig } from "../modes/workflows";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

const configs: Record<Mode, ModeConfig> = {
  workflows: workflowsConfig,
  blocks: blocksConfig,
  hooks: hooksConfig,
};

export function AppShell() {
  const mode = useCurrentMode();
  const activeConfig = configs[mode];

  return (
    <div className="flex h-screen flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={activeConfig.navItems} />
        <main className="flex-1 overflow-auto bg-white p-6 dark:bg-neutral-950">
          <Routes>
            <Route
              path="/"
              element={<Navigate to={configs[readLastMode()].basePath} replace />}
            />
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
          </Routes>
        </main>
      </div>
    </div>
  );
}
