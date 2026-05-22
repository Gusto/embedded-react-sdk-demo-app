import { NavLink, useLocation } from "react-router-dom";
import type { NavItem } from "../modes/navItemTypes";

interface SidebarProps {
  items: NavItem[];
}

function isWithin(pathname: string, path: string) {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function itemClasses(isActive: boolean) {
  return [
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-blue-500 text-white"
      : "text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800",
  ].join(" ");
}

function childClasses(isActive: boolean) {
  return [
    "px-3 py-1.5 text-sm transition-colors",
    isActive
      ? "text-blue-500 font-medium"
      : "text-neutral-600 hover:text-blue-500 dark:text-neutral-400 dark:hover:text-blue-400",
  ].join(" ");
}

export function Sidebar({ items }: SidebarProps) {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <nav className="flex flex-col gap-1 p-3">
        {items.map((item) => (
          <SidebarItem key={item.key} item={item} pathname={pathname} />
        ))}
      </nav>
    </aside>
  );
}

function SidebarItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const hasChildren = !!item.childGroups?.length;
  const showChildren =
    hasChildren && (item.asSection || isWithin(pathname, item.path ?? "/"));

  if (item.asSection) {
    // Section header: not a link, children always visible. Render the heading
    // with a top margin so it sits clearly below the previous nav block.
    return (
      <div className="mt-4 flex flex-col gap-1">
        <span className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {item.label}
        </span>
        {showChildren ? renderChildGroups(item) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {item.path ? (
        <NavLink
          to={item.path}
          end={!hasChildren}
          className={({ isActive }) => itemClasses(isActive)}
        >
          {item.label}
        </NavLink>
      ) : null}
      {showChildren ? renderChildGroups(item) : null}
    </div>
  );
}

function renderChildGroups(item: NavItem) {
  return (
    <div className="ml-3 flex flex-col gap-5 border-l border-neutral-200 pl-3 pt-1 dark:border-neutral-800">
      {item.childGroups!.map((group) => (
        <div key={group.key} className="flex flex-col">
          {group.label ? (
            <span className="mb-2 px-3 text-xs font-semibold text-gray-500 dark:text-neutral-500">
              {group.label}
            </span>
          ) : null}
          {group.items.map((child) => (
            <NavLink
              key={child.key}
              to={child.path}
              end
              className={({ isActive }) => childClasses(isActive)}
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      ))}
    </div>
  );
}
