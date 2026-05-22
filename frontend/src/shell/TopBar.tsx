import { Link, useNavigate } from "react-router-dom";
import { blocksConfig } from "../modes/blocks";
import { hooksConfig } from "../modes/hooks";
import { writeLastMode } from "../modes/modeStorage";
import { workflowsConfig } from "../modes/workflows";
import { useAdapters } from "../sdk/adapterContext";
import { NavDropdown } from "./NavDropdown";
import { ThemeSwitcher } from "./ThemeSwitcher";

const featureItems = [
  { key: "component-adapters", label: "Component adapters" },
  { key: "theming", label: "Theming" },
  { key: "translations", label: "Translations" },
  { key: "data", label: "Data" },
];

export function TopBar() {
  const { adaptersEnabled, setAdaptersEnabled } = useAdapters();
  const navigate = useNavigate();

  const buildMethodItems = [workflowsConfig, blocksConfig, hooksConfig].map(
    (config) => ({
      key: config.key,
      label: config.label,
      onClick: () => {
        writeLastMode(config.key);
        navigate(config.basePath);
      },
    }),
  );

  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="m-0 text-lg font-semibold text-neutral-900 transition-colors hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-400"
        >
          Demo
        </Link>
        <div className="flex gap-2">
          <NavDropdown label="Build methods" items={buildMethodItems} />
          <NavDropdown label="Features" items={featureItems} />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-neutral-700 select-none dark:text-neutral-300">
          <span>Component adapters</span>
          <button
            type="button"
            role="switch"
            aria-checked={adaptersEnabled}
            onClick={() => setAdaptersEnabled(!adaptersEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
              adaptersEnabled
                ? "bg-blue-500 dark:bg-[#E15A43]"
                : "bg-neutral-300 dark:bg-neutral-700"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                adaptersEnabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </label>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
