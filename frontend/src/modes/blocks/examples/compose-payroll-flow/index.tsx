import { Route, Routes } from "react-router-dom";
import { ExampleLayout } from "../../../exampleLayout";
import type { Example } from "../../../types";
import { ConfigurationPage } from "./ConfigurationPage";
import { PayrollListPage } from "./PayrollListPage";
import { ReviewPage } from "./ReviewPage";

function ComposePayrollFlowRoutes() {
  return (
    <ExampleLayout mode="blocks" example={composePayrollFlowExample}>
      <Routes>
        <Route index element={<PayrollListPage />} />
        <Route path="configuration/:payrollUuid" element={<ConfigurationPage />} />
        <Route path="review/:payrollUuid" element={<ReviewPage />} />
      </Routes>
    </ExampleLayout>
  );
}

export const composePayrollFlowExample: Example = {
  key: "compose-payroll-flow",
  label: "Compose a payroll flow from blocks",
  path: "/blocks/compose-payroll-flow",
  summary:
    "Stitch together PayrollList, PayrollConfiguration, and PayrollOverview with your own routing.",
  description:
    "Re-create the workflow yourself: each row in PayrollList emits an event with the chosen payroll id, your app routes to a configuration page that calculates the payroll, then auto-routes to an overview page for review and submit. You own every transition — toasts in this demo surface the events the SDK fires so you can see the seams.",
  sdkPrimitives: [
    "Payroll.PayrollList",
    "Payroll.PayrollConfiguration",
    "Payroll.PayrollOverview",
  ],
  Routes: ComposePayrollFlowRoutes,
};
