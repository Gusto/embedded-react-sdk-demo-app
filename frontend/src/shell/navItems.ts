export type NavItem = {
  key: string;
  label: string;
  path: string;
};

export const navItems: NavItem[] = [
  { key: "home", label: "Home", path: "/" },
  { key: "nav-1", label: "Nav 1", path: "/nav-1" },
  { key: "nav-2", label: "Nav 2", path: "/nav-2" },
  { key: "nav-3", label: "Nav 3", path: "/nav-3" },
];
