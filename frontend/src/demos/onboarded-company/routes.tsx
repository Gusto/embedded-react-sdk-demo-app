import { Route } from "react-router-dom";
import { AppShell } from "./components/AppShell/AppShell";
import { ManageEmployeesRoutes } from "./manage-employees/routes";
import { BankAccount } from "./pages/BankAccount";
import { Documents } from "./pages/Documents";
import { FederalTaxes } from "./pages/FederalTaxes";
import { Locations } from "./pages/Locations";
import { PaySchedule } from "./pages/PaySchedule";
import { StateTaxes } from "./pages/StateTaxes";
import { RunPayrollRoutes } from "./run-payroll/routes";
import { TerminationsRoutes } from "./terminations/routes";
import { TimeOffRoutes } from "./time-off/routes";

export const OnboardedCompanyRoutes = (
  <Route element={<AppShell />}>
    {RunPayrollRoutes}
    {ManageEmployeesRoutes}
    {TerminationsRoutes}
    {TimeOffRoutes}
    <Route path="/bank-account" element={<BankAccount />} />
    <Route path="/locations" element={<Locations />} />
    <Route path="/federal-taxes" element={<FederalTaxes />} />
    <Route path="/state-taxes/*" element={<StateTaxes />} />
    <Route path="/pay-schedule" element={<PaySchedule />} />
    <Route path="/documents/*" element={<Documents />} />
  </Route>
);
