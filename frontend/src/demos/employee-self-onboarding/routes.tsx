import { Outlet, Route } from "react-router-dom";
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
    element={
      <CenteredPage>
        <Outlet />
      </CenteredPage>
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
