import { Route } from "react-router-dom";
import {
  Compensation,
  Deductions,
  EmployeeDocuments,
  EmployeeList,
  FederalTaxes,
  OnboardingShell,
  PaymentMethod,
  ProfileCreate,
  ProfileEdit,
  StateTaxes,
  Summary,
} from "./pages/EmployeeOnboarding";

export const EmployeeOnboardingRoutes = (
  <Route path="/employee-onboarding" element={<OnboardingShell />}>
    <Route index element={<EmployeeList />} />
    <Route path="new" element={<ProfileCreate />} />
    <Route path=":employeeId">
      <Route path="profile" element={<ProfileEdit />} />
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
