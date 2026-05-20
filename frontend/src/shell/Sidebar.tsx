import { NavLink, useLocation } from "react-router-dom";
import { navItems, type NavItem } from "./navItems";

function isWithin(pathname: string, path: string) {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function itemClasses(isActive: boolean) {
  return [
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-blue-500 text-white"
      : "text-neutral-700 hover:bg-neutral-200",
  ].join(" ");
}

function childClasses(isActive: boolean) {
  return [
    "px-3 py-1.5 text-sm transition-colors",
    isActive
      ? "text-blue-500 font-medium"
      : "text-neutral-600 hover:text-blue-500",
  ].join(" ");
}

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-200 bg-white">
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => (
          <SidebarItem key={item.key} item={item} pathname={pathname} />
        ))}
      </nav>
    </aside>
  );
}

function SidebarItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const isParentActive = isWithin(pathname, item.path);
  const hasChildren = !!item.childGroups?.length;
  const showChildren = hasChildren && isParentActive;

  return (
    <div className="flex flex-col gap-1">
      <NavLink
        to={item.path}
        end={item.path === "/" && !hasChildren}
        className={() => itemClasses(isParentActive)}
      >
        {item.label}
      </NavLink>
      {showChildren ? (
        <div className="ml-3 flex flex-col gap-5 border-l border-neutral-200 pl-3 pt-1">
          {item.childGroups!.map((group) => (
            <div key={group.key} className="flex flex-col">
              <span className="px-3 mb-2 text-xs font-semibold text-gray-500">
                {group.label}
              </span>
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
      ) : null}
    </div>
  );
}
