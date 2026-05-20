import { useNavigate } from "react-router-dom";
import { blocksConfig } from "../modes/blocks";
import { hooksConfig } from "../modes/hooks";
import { writeLastMode } from "../modes/modeStorage";
import { useCurrentMode } from "../modes/useCurrentMode";
import { workflowsConfig } from "../modes/workflows";
import type { ModeConfig } from "../modes/types";

const options: ModeConfig[] = [workflowsConfig, blocksConfig, hooksConfig];

export function ModeSwitcher() {
  const current = useCurrentMode();
  const navigate = useNavigate();

  return (
    <div
      role="radiogroup"
      aria-label="Demo mode"
      className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900"
    >
      {options.map((opt) => {
        const isActive = opt.key === current;
        return (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => {
              writeLastMode(opt.key);
              navigate(opt.basePath);
            }}
            className={`inline-flex h-7 cursor-pointer items-center rounded-full px-3 text-xs font-medium transition-colors ${
              isActive
                ? "bg-blue-500 text-white"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
