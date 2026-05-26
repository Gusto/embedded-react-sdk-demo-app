import { Link, useNavigate } from "react-router-dom";
import { blocksConfig } from "../modes/blocks";
import { hooksConfig } from "../modes/hooks";
import { writeLastMode } from "../modes/modeStorage";
import { workflowsConfig } from "../modes/workflows";
import { NavDropdown } from "./NavDropdown";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function TopBar() {
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
        <div className="flex items-center gap-2">
          <NavDropdown label="Build methods" items={buildMethodItems} />
          <Link
            to="/features"
            className="inline-flex h-7 cursor-pointer items-center rounded-full px-3 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            Features
          </Link>
          <Link
            to="/showcase"
            className="inline-flex h-7 cursor-pointer items-center rounded-full px-3 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            Showcase
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <ThemeSwitcher />
      </div>
    </header>
  );
}
