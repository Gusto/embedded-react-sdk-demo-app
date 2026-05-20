import type { NavItem } from "../navItemTypes";

export const blocksNavItems: NavItem[] = [
  { key: "home", label: "Home", path: "/blocks" },
  {
    key: "payroll",
    label: "Payroll",
    path: "/blocks/payroll",
    childGroups: [
      {
        key: "pay",
        label: "Pay",
        items: [
          {
            key: "pay-employees",
            label: "Pay employees",
            path: "/blocks/payroll/run",
          },
          {
            key: "pay-contractors",
            label: "Pay contractors",
            path: "/blocks/payroll/pay-contractors",
          },
        ],
      },
      {
        key: "people",
        label: "People",
        items: [
          {
            key: "employees",
            label: "W-2 Employees",
            path: "/blocks/payroll/employees",
          },
          {
            key: "contractors",
            label: "Contractors",
            path: "/blocks/payroll/contractors",
          },
        ],
      },
    ],
  },
];
