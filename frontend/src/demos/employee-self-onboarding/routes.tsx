import { Navigate, Outlet, Route } from "react-router-dom";
import { EMPLOYEE_ID } from "../../config";
import { CenteredPage } from "../../shared/CenteredPage/CenteredPage";
import {
  DocumentSigner,
  FederalTaxes,
  Landing,
  PaymentMethod,
  Profile,
  StateTaxes,
  Summary,
} from "./pages/EmployeeSelfOnboarding";

export const EmployeeSelfOnboardingRoutes = (
  <Route
    path="/employee-self-onboarding"
    // This demo runs against a single configured employee, so it can't do
    // anything useful until EMPLOYEE_ID is set in config.ts — redirect home
    // until then (create one via the Employee onboarding demo).
    element={
      EMPLOYEE_ID ? (
        <CenteredPage>
          <Outlet />
        </CenteredPage>
      ) : (
        <Navigate to="/" replace />
      )
    }
  >
    <Route index element={<Landing />} />
    <Route path="profile" element={<Profile />} />
    <Route path="federal-taxes" element={<FederalTaxes />} />
    <Route path="state-taxes" element={<StateTaxes />} />
    <Route path="payment-method" element={<PaymentMethod />} />
    <Route path="documents/*" element={<DocumentSigner />} />
    <Route path="summary" element={<Summary />} />
  </Route>
);
