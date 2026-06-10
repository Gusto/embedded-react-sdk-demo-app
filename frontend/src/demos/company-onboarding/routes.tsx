import { Navigate, Outlet, Route } from "react-router-dom";
import { CenteredPage } from "../../shared/CenteredPage/CenteredPage";
import {
  BankAccount,
  Documents,
  Employees,
  FederalTaxes,
  Industry,
  Locations,
  Overview,
  PaySchedule,
  StateTaxes,
} from "./pages/CompanyOnboarding";

export const CompanyOnboardingRoutes = (
  <Route
    path="/company-onboarding"
    element={
      <CenteredPage>
        <Outlet />
      </CenteredPage>
    }
  >
    <Route index element={<Navigate to="locations" replace />} />
    <Route path="locations" element={<Locations />} />
    <Route path="federal-taxes" element={<FederalTaxes />} />
    <Route path="industry" element={<Industry />} />
    <Route path="bank-account" element={<BankAccount />} />
    <Route path="employees" element={<Employees />} />
    <Route path="pay-schedule" element={<PaySchedule />} />
    <Route path="state-taxes" element={<StateTaxes />} />
    <Route path="documents" element={<Documents />} />
    <Route path="overview" element={<Overview />} />
  </Route>
);
