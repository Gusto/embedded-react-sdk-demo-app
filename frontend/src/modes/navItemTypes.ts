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
  path: string;
  childGroups?: NavChildGroup[];
};
