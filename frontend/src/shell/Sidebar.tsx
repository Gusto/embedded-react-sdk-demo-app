import { NavLink } from "react-router-dom";
import { navItems } from "./navItems";

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-neutral-200 bg-white">
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              [
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? " bg-blue-500 text-white"
                  : "text-neutral-700 hover:bg-neutral-200",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
