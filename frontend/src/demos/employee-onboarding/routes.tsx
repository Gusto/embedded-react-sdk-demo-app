import { Route } from "react-router-dom";
import { EmployeeOnboarding } from "./pages/EmployeeOnboarding";

export const EmployeeOnboardingRoutes = (
  <Route path="/employee-onboarding/*" element={<EmployeeOnboarding />} />
);
