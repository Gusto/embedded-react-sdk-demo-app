import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemeMode } from "../sdk/themeContext";

const iconClass = "h-4 w-4";

const options: Array<{ id: ThemeMode; label: string; icon: JSX.Element }> = [
  {
    id: "light",
    label: "Light",
    icon: <Sun aria-hidden className={iconClass} />,
  },
  {
    id: "dark",
    label: "Dark",
    icon: <Moon aria-hidden className={iconClass} />,
  },
  {
    id: "system",
    label: "System",
    icon: <Monitor aria-hidden className={iconClass} />,
  },
];

export function ThemeSwitcher() {
  const { mode, setMode } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900"
    >
      {options.map((opt) => {
        const isActive = opt.id === mode;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => setMode(opt.id)}
            className={`inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors ${
              isActive
                ? "bg-blue-500 text-white dark:bg-[#E15A43]"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            }`}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}
