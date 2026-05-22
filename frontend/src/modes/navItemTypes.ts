export type NavChild = {
  key: string;
  label: string;
  path: string;
};

export type NavChildGroup = {
  key: string;
  label: string;
  items: NavChild[];
};

export type NavItem = {
  key: string;
  label: string;
  /** Path the parent links to. Omit when `asSection` is true. */
  path?: string;
  childGroups?: NavChildGroup[];
  /**
   * When true, the parent renders as a small section heading (no NavLink) and
   * its child groups are always shown. Use for sidebar dividers that group
   * children without competing with sibling routes.
   */
  asSection?: boolean;
};
