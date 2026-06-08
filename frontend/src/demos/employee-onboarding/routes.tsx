import { Route } from "react-router-dom";
import {
  Compensation,
  Deductions,
  EmployeeDocuments,
  EmployeeList,
  FederalTaxes,
  OnboardingFlow,
  OnboardingShell,
  PaymentMethod,
  Profile,
  StateTaxes,
  Summary,
} from "./pages/EmployeeOnboarding";

export const EmployeeOnboardingRoutes = (
  <Route path="/employee-onboarding" element={<OnboardingShell />}>
    <Route index element={<EmployeeList />} />
    <Route path="new/profile" element={<Profile />} />
    <Route path=":employeeId" element={<OnboardingFlow />}>
      <Route path="profile" element={<Profile />} />
      <Route path="compensation" element={<Compensation />} />
      <Route path="federal-taxes" element={<FederalTaxes />} />
      <Route path="state-taxes" element={<StateTaxes />} />
      <Route path="payment-method" element={<PaymentMethod />} />
      <Route path="deductions" element={<Deductions />} />
      <Route path="employee-documents" element={<EmployeeDocuments />} />
      <Route path="summary" element={<Summary />} />
    </Route>
  </Route>
);
