import Flow from "./Flow";
import CustomFlow from "./CustomFlow";
import EmployeeDetails from "./hooks/EmployeeDetails";
import HomeAddress from "./hooks/HomeAddress";
import FederalTaxes from "./hooks/FederalTaxes";
import type { Domain } from "../types";

const domain: Domain = {
  name: "Employee Onboarding",
  examples: [
    { name: "Flow", component: Flow },
    { name: "Custom flow", component: CustomFlow },
    {
      name: "Hooks",
      children: [
        { name: "Employee Details", component: EmployeeDetails },
        { name: "Home Address", component: HomeAddress },
        { name: "Federal Taxes", component: FederalTaxes },
      ],
    },
  ],
};

export default domain;
