import { Contractor } from "@gusto/embedded-react-sdk";
import { Route, Routes } from "react-router-dom";
import { ExampleLayout } from "../../../exampleLayout";
import { SdkBoundary } from "../../../../sdk/SdkBoundary";
import type { Example } from "../../../types";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

const snippet = `import { Contractor } from "@gusto/embedded-react-sdk";

const COMPANY_ID = "${COMPANY_ID}";

<Contractor.OnboardingFlow
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
      example={onboardContractorExample}
      code={[{ name: "index.tsx", source: snippet }]}
    >
      <SdkBoundary>
        <Contractor.OnboardingFlow
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

export const onboardContractorExample: Example = {
  key: "onboard-contractor",
  label: "Onboard a contractor",
  path: "/workflows/onboard-contractor",
  summary: "Drop in the full 1099 contractor onboarding flow.",
  description:
    "Contractor.OnboardingFlow handles 1099 onboarding end-to-end: contractor type, profile, payment method, and new-hire report. Reach for this when you want Gusto's stock onboarding UX with no customisation.",
  sdkPrimitives: ["Contractor.OnboardingFlow"],
  Routes: () => (
    <Routes>
      <Route index element={<Page />} />
    </Routes>
  ),
};
