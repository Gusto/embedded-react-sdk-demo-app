import { Route, Routes } from "react-router-dom";
import { ExampleLayout } from "../../../exampleLayout";
import type { Example } from "../../../types";
import { ConfigurationPage } from "./ConfigurationPage";
import { PayrollListPage } from "./PayrollListPage";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

const payrollListSnippet = `// Fetch payrolls straight from the Gusto API and render your own list.
// Each row routes the chosen payroll id to the SDK's configuration block.

const COMPANY_ID = "${COMPANY_ID}";

useEffect(() => {
  fetch(
    \`/v1/companies/\${COMPANY_ID}/payrolls?\` +
      new URLSearchParams({
        start_date: today,
        end_date: threeMonthsOut,
        processing_statuses: "unprocessed",
      })
  )
    .then((r) => r.json())
    .then(setPayrolls);
}, []);

return payrolls.map((p) => (
  <button key={p.payroll_uuid} onClick={() => navigate(p.payroll_uuid)}>
    {formatPayPeriod(p.pay_period)} — {formatDate(p.check_date)}
  </button>
));
`;

const configurationSnippet = `import { Payroll, componentEvents } from "@gusto/embedded-react-sdk";

<Payroll.PayrollConfiguration
  companyId={COMPANY_ID}
  payrollId={payrollId}
  onEvent={(eventType) => {
    if (eventType === componentEvents.RUN_PAYROLL_CALCULATED) {
      navigate("..");
    }
  }}
/>;
`;

function CustomListFromApiRoutes() {
  return (
    <ExampleLayout
      mode="blocks"
      example={customListFromApiExample}
      code={[
        { name: "PayrollListPage.tsx", source: payrollListSnippet },
        { name: "ConfigurationPage.tsx", source: configurationSnippet },
      ]}
    >
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
