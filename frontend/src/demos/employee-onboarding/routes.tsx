import { Outlet, Route } from "react-router-dom";
import { CenteredPage } from "../../shared/CenteredPage/CenteredPage";
import {
  Compensation,
  Deductions,
  EmployeeDocuments,
  EmployeeList,
  FederalTaxes,
  PaymentMethod,
  ProfileCreate,
  ProfileEdit,
  StateTaxes,
  Summary,
} from "./pages/EmployeeOnboarding";

export const EmployeeOnboardingRoutes = (
  <Route
    path="/employee-onboarding"
    element={
      <CenteredPage>
        <Outlet />
      </CenteredPage>
    }
  >
    <Route index element={<EmployeeList />} />
    <Route path="new" element={<ProfileCreate />} />
    <Route path=":employeeId">
      <Route path="profile" element={<ProfileEdit />} />
      <Route path="compensation/*" element={<Compensation />} />
      <Route path="federal-taxes" element={<FederalTaxes />} />
      <Route path="state-taxes" element={<StateTaxes />} />
      <Route path="payment-method" element={<PaymentMethod />} />
      <Route path="deductions" element={<Deductions />} />
      <Route path="employee-documents" element={<EmployeeDocuments />} />
      <Route path="summary" element={<Summary />} />
    </Route>
  </Route>
);
