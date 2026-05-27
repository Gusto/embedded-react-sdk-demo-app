import { type ReactNode } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

export interface NavChild {
  key: string;
  label: string;
  to: string;
}

export interface NavGroup {
  key: string;
  label: string;
  to: string;
  children?: NavChild[];
}

interface AppLayoutProps {
  /** Sidebar navigation. Each demo passes its own so we can include or
   * omit demo-specific sections (e.g. Pay employees / Pay contractors
   * only show in the existing-company demo). */
  nav: NavGroup[];
  /** Optional node anchored to the bottom of the sidebar — the
   * new-company demo uses this to render the onboarding checklist. */
  sidebarFooter?: ReactNode;
}

export function buildSharedNav(basePath: string): NavGroup[] {
  return [
    { key: "dashboard", label: "Dashboard", to: `${basePath}/dashboard` },
    {
      key: "payroll",
      label: "Payroll",
      to: `${basePath}/payroll`,
      children: [
        { key: "people", label: "People", to: `${basePath}/payroll/people` },
        { key: "settings", label: "Settings", to: `${basePath}/payroll/settings` },
        { key: "taxes", label: "Taxes", to: `${basePath}/payroll/settings/taxes` },
        {
          key: "documents",
          label: "Documents",
          to: `${basePath}/payroll/documents`,
        },
      ],
    },
  ];
}

/** Shared post-onboarding layout: sticky sidebar + scrolling outlet. */
export function AppLayout({ nav, sidebarFooter }: AppLayoutProps) {
  const { pathname } = useLocation();

  function isWithin(to: string) {
    return pathname === to || pathname.startsWith(`${to}/`);
  }

  return (
    <div className="flex min-h-full bg-neutral-50">
      <aside className="sticky top-0 flex h-[calc(100vh-4rem)] w-64 shrink-0 flex-col overflow-hidden border-r border-neutral-200 bg-white">
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-1">
          {nav.map((group) => {
            const groupActive = group.children
              ? group.children.some((c) => isWithin(c.to))
              : pathname === group.to;
            return (
              <div key={group.key} className="flex flex-col gap-1">
                {group.children ? (
                  <span
                    className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                      groupActive ? "text-indigo-600" : "text-neutral-500"
                    }`}
                  >
                    {group.label}
                  </span>
                ) : (
                  <NavLink
                    to={group.to}
                    end
                    className={({ isActive }) =>
                      `relative px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-indigo-600 before:absolute before:left-0 before:top-1/2 before:h-4 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-indigo-500"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`
                    }
                  >
                    {group.label}
                  </NavLink>
                )}
                {group.children ? (
                  <div className="ml-3 flex flex-col border-l border-neutral-200 pl-3">
                    {group.children.map((child) => (
                      <NavLink
                        key={child.key}
                        to={child.to}
                        end
                        className={({ isActive }) =>
                          `relative px-3 py-1.5 text-sm transition-colors ${
                            isActive
                              ? "font-medium text-indigo-600 before:absolute before:-left-3.25 before:top-1/2 before:h-4 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-indigo-500"
                              : "text-neutral-500 hover:text-neutral-900"
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
          </div>
        </nav>
        {sidebarFooter ? (
          <div className="shrink-0 border-t border-neutral-100 p-4">
            {sidebarFooter}
          </div>
        ) : null}
      </aside>
      <main className="flex-1 px-8 py-10">
        <div className="mx-auto w-full max-w-4xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
