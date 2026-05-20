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

export const navItems: NavItem[] = [
  { key: "home", label: "Home", path: "/" },
  {
    key: "payroll",
    label: "Payroll",
    path: "/payroll",
    childGroups: [
      {
        key: "pay",
        label: "Pay",
        items: [
          { key: "pay-employees", label: "Pay employees", path: "/payroll/run" },
          {
            key: "pay-contractors",
            label: "Pay contractors",
            path: "/payroll/pay-contractors",
          },
        ],
      },
      {
        key: "people",
        label: "People",
        items: [
          { key: "employees", label: "W-2 Employees", path: "/payroll/employees" },
          { key: "contractors", label: "Contractors", path: "/payroll/contractors" },
        ],
      },
    ],
  },
];
