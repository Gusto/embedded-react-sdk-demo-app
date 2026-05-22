import { Route, Routes } from "react-router-dom";
import { ExampleLayout } from "../../../exampleLayout";
import type { Example } from "../../../types";
import { ConfigurationPage } from "./ConfigurationPage";
import { PayrollListPage } from "./PayrollListPage";
import { ReviewPage } from "./ReviewPage";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

const payrollListSnippet = `import { Payroll, componentEvents } from "@gusto/embedded-react-sdk";
import { useNavigate } from "react-router-dom";

const COMPANY_ID = "${COMPANY_ID}";

<Payroll.PayrollList
  companyId={COMPANY_ID}
  onEvent={(eventType, eventPayload) => {
    if (eventType === componentEvents.RUN_PAYROLL_SELECTED) {
      const { payrollUuid } = eventPayload;
      navigate(\`configuration/\${payrollUuid}\`);
    }
  }}
/>;
`;

const configurationSnippet = `import { Payroll, componentEvents } from "@gusto/embedded-react-sdk";

<Payroll.PayrollConfiguration
  companyId={COMPANY_ID}
  payrollId={payrollUuid}
  onEvent={(eventType) => {
    if (eventType === componentEvents.RUN_PAYROLL_CALCULATED) {
      navigate(\`../review/\${payrollUuid}\`, { replace: true });
    }
  }}
/>;
`;

const reviewSnippet = `import { Payroll, componentEvents } from "@gusto/embedded-react-sdk";

<Payroll.PayrollOverview
  companyId={COMPANY_ID}
  payrollId={payrollUuid}
  onEvent={(eventType) => {
    if (
      eventType === componentEvents.RUN_PAYROLL_EDIT ||
      eventType === componentEvents.RUN_PAYROLL_PROCESSING_FAILED
    ) {
      navigate(\`../configuration/\${payrollUuid}\`);
    }
  }}
/>;
`;

function ComposePayrollFlowRoutes() {
  return (
    <ExampleLayout
      mode="blocks"
      example={composePayrollFlowExample}
      code={[
        { name: "PayrollListPage.tsx", source: payrollListSnippet },
        { name: "ConfigurationPage.tsx", source: configurationSnippet },
        { name: "ReviewPage.tsx", source: reviewSnippet },
      ]}
    >
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
