import { Route } from "react-router-dom";
import {
  Compensation,
  Deductions,
  EmployeeDocuments,
  EmployeeList,
  FederalTaxes,
  OnboardingFlow,
  PaymentMethod,
  Profile,
  StateTaxes,
  Summary,
} from "./pages/EmployeeOnboarding";

// State machine table: each route maps a URL to a step block. OnboardingFlow
// is the parent layout route so all steps share Outlet context for cross-step
// state.
export const EmployeeOnboardingRoutes = (
  <Route path="/employee-onboarding" element={<OnboardingFlow />}>
    <Route index element={<EmployeeList />} />
    <Route path="new/profile" element={<Profile />} />
    <Route path=":employeeId/profile" element={<Profile />} />
    <Route path=":employeeId/compensation" element={<Compensation />} />
    <Route path=":employeeId/federal-taxes" element={<FederalTaxes />} />
    <Route path=":employeeId/state-taxes" element={<StateTaxes />} />
    <Route path=":employeeId/payment-method" element={<PaymentMethod />} />
    <Route path=":employeeId/deductions" element={<Deductions />} />
    <Route
      path=":employeeId/employee-documents"
      element={<EmployeeDocuments />}
    />
    <Route path=":employeeId/summary" element={<Summary />} />
  </Route>
);
