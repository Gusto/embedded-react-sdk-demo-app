import { Payroll } from "@gusto/embedded-react-sdk";
import { Route, Routes } from "react-router-dom";
import { ExampleLayout } from "../../../exampleLayout";
import { SdkBoundary } from "../../../../sdk/SdkBoundary";
import type { Example } from "../../../types";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

function Page() {
  return (
    <ExampleLayout mode="workflows" example={runPayrollExample}>
      <SdkBoundary>
        <Payroll.PayrollFlow
          companyId={COMPANY_ID}
          onEvent={(eventType, eventPayload) => {
            console.log("eventType", eventType);
            console.log("eventPayload", eventPayload);
          }}
        />
      </SdkBoundary>
    </ExampleLayout>
  );
}

export const runPayrollExample: Example = {
  key: "run-payroll",
  label: "Run payroll",
  path: "/workflows/run-payroll",
  summary: "Drop in the full payroll-run flow.",
  description:
    "Payroll.PayrollFlow lists the upcoming payrolls, walks the user through configuration, review, and submit, and surfaces results — all in one orchestrated component. Best when you want a complete end-to-end payroll experience without owning the page transitions yourself.",
  sdkPrimitives: ["Payroll.PayrollFlow"],
  Routes: () => (
    <Routes>
      <Route index element={<Page />} />
    </Routes>
  ),
};
