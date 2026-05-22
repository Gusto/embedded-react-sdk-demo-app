import { Route, Routes } from "react-router-dom";
import { ExampleLayout } from "../../../exampleLayout";
import type { Example } from "../../../types";
import { CustomDataPage } from "./CustomDataPage";
import { DonePage } from "./DonePage";
import { ProfilePage } from "./ProfilePage";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

const profileSnippet = `import { Employee, componentEvents } from "@gusto/embedded-react-sdk";
import { useNavigate } from "react-router-dom";

const COMPANY_ID = "${COMPANY_ID}";

<Employee.Profile
  companyId={COMPANY_ID}
  onEvent={(eventType, eventPayload) => {
    if (eventType === componentEvents.EMPLOYEE_PROFILE_DONE) {
      // EMPLOYEE_PROFILE_DONE spreads the Employee model; the id lives on \`uuid\`.
      const { uuid } = eventPayload;
      navigate(\`extra-data/\${uuid}\`);
    }
  }}
/>;
`;

const customDataSnippet = `// Pure host UI — no SDK component. Capture data Gusto doesn't store, then
// hand control back to the next SDK step.

<form
  onSubmit={(e) => {
    e.preventDefault();
    saveInternalRecord({ employeeId, badgeId, lockerNumber });
    navigate(\`../done/\${employeeId}\`);
  }}
>
  <input value={badgeId} onChange={(e) => setBadgeId(e.target.value)} />
  <input value={lockerNumber} onChange={(e) => setLockerNumber(e.target.value)} />
  <button type="submit">Save and continue</button>
</form>;
`;

function IntermediateHostStepRoutes() {
  return (
    <ExampleLayout
      mode="blocks"
      example={intermediateHostStepExample}
      code={[
        { name: "ProfilePage.tsx", source: profileSnippet },
        { name: "CustomDataPage.tsx", source: customDataSnippet },
      ]}
    >
      <Routes>
        <Route index element={<ProfilePage />} />
        <Route path="extra-data/:employeeId" element={<CustomDataPage />} />
        <Route path="done/:employeeId" element={<DonePage />} />
      </Routes>
    </ExampleLayout>
  );
}

export const intermediateHostStepExample: Example = {
  key: "intermediate-host-step",
  label: "Insert a custom step into onboarding",
  path: "/blocks/intermediate-host-step",
  summary:
    "Splice host-owned UI between SDK blocks using events as the handoff.",
  description:
    "Employee.Profile runs first. When it emits its done event we route to a host-owned page that collects data unique to your system (badge ID, locker number) and persists it however you like. The example finishes on a host-rendered confirmation, but in a real product you'd continue into the next SDK block.",
  sdkPrimitives: ["Employee.Profile", "Host-owned form"],
  Routes: IntermediateHostStepRoutes,
};
