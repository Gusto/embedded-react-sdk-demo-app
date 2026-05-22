import { Employee } from "@gusto/embedded-react-sdk";
import { Route, Routes } from "react-router-dom";
import { ExampleLayout } from "../../../exampleLayout";
import { SdkBoundary } from "../../../../sdk/SdkBoundary";
import type { Example } from "../../../types";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

const snippet = `import { Employee } from "@gusto/embedded-react-sdk";

const COMPANY_ID = "${COMPANY_ID}";

<Employee.OnboardingFlow
  companyId={COMPANY_ID}
  onEvent={(eventType, eventPayload) => {
    console.log(eventType, eventPayload);
  }}
/>;
`;

function Page() {
  return (
    <ExampleLayout
      mode="workflows"
      example={onboardEmployeeExample}
      code={[{ name: "index.tsx", source: snippet }]}
    >
      <SdkBoundary>
        <Employee.OnboardingFlow
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

export const onboardEmployeeExample: Example = {
  key: "onboard-employee",
  label: "Onboard an employee",
  path: "/workflows/onboard-employee",
  summary: "Drop in the full W-2 employee onboarding flow.",
  description:
    "Employee.OnboardingFlow renders every step required to add a W-2 employee — profile, addresses, compensation, federal/state taxes, signatures — orchestrated by the SDK. Use this when Gusto's flow UX is acceptable and you want the fastest possible integration.",
  sdkPrimitives: ["Employee.OnboardingFlow"],
  Routes: () => (
    <Routes>
      <Route index element={<Page />} />
    </Routes>
  ),
};
