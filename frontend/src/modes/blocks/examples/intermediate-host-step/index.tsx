import { Route, Routes } from "react-router-dom";
import { ExampleLayout } from "../../../exampleLayout";
import type { Example } from "../../../types";
import { CustomDataPage } from "./CustomDataPage";
import { DonePage } from "./DonePage";
import { ProfilePage } from "./ProfilePage";

function IntermediateHostStepRoutes() {
  return (
    <ExampleLayout mode="blocks" example={intermediateHostStepExample}>
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
