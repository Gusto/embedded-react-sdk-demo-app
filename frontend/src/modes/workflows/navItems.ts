import type { NavItem } from "../navItemTypes";

export const workflowsNavItems: NavItem[] = [
  { key: "home", label: "Home", path: "/workflows" },
  {
    key: "payroll",
    label: "Payroll",
    path: "/workflows/payroll",
    childGroups: [
      {
        key: "pay",
        label: "Pay",
        items: [
          {
            key: "pay-employees",
            label: "Pay employees",
            path: "/workflows/payroll/run",
          },
          {
            key: "pay-contractors",
            label: "Pay contractors",
            path: "/workflows/payroll/pay-contractors",
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
            path: "/workflows/payroll/employees",
          },
          {
            key: "contractors",
            label: "Contractors",
            path: "/workflows/payroll/contractors",
          },
        ],
      },
    ],
  },
];
