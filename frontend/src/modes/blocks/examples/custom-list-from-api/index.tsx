import { Route, Routes } from "react-router-dom";
import { ExampleLayout } from "../../../exampleLayout";
import type { Example } from "../../../types";
import { ConfigurationPage } from "./ConfigurationPage";
import { PayrollListPage } from "./PayrollListPage";

function CustomListFromApiRoutes() {
  return (
    <ExampleLayout mode="blocks" example={customListFromApiExample}>
      <Routes>
        <Route index element={<PayrollListPage />} />
        <Route path=":payrollId" element={<ConfigurationPage />} />
      </Routes>
    </ExampleLayout>
  );
}

export const customListFromApiExample: Example = {
  key: "custom-list-from-api",
  label: "Custom list, SDK detail",
  path: "/blocks/custom-list-from-api",
  summary:
    "Fetch payrolls from the Gusto API yourself, then hand the selected one to an SDK block.",
  description:
    "Sometimes you want full control of the list UI — your own columns, filters, sorting — but you don't want to reimplement the configuration step. This example calls the Gusto payrolls endpoint directly through our proxy, renders a small bespoke list, and routes each row into Payroll.PayrollConfiguration so the user gets Gusto's calculation flow without ever seeing Payroll.PayrollList.",
  sdkPrimitives: ["Gusto API (direct)", "Payroll.PayrollConfiguration"],
  Routes: CustomListFromApiRoutes,
};
