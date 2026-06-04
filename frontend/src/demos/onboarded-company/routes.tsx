import { Route } from "react-router-dom";
import { AppShell } from "./components/AppShell/AppShell";
import { BankAccount } from "./pages/BankAccount";
import { Documents } from "./pages/Documents";
import { Employees } from "./pages/Employees";
import { FederalTaxes } from "./pages/FederalTaxes";
import { Locations } from "./pages/Locations";
import { PaySchedule } from "./pages/PaySchedule";
import { RunPayroll } from "./pages/RunPayroll";
import { StateTaxes } from "./pages/StateTaxes";
import { TimeOff } from "./pages/TimeOff";

export const OnboardedCompanyRoutes = (
  <Route element={<AppShell />}>
    <Route path="/run-payroll" element={<RunPayroll />} />
    <Route path="/time-off" element={<TimeOff />} />
    <Route path="/employees/*" element={<Employees />} />
    <Route path="/bank-account" element={<BankAccount />} />
    <Route path="/locations" element={<Locations />} />
    <Route path="/federal-taxes" element={<FederalTaxes />} />
    <Route path="/state-taxes" element={<StateTaxes />} />
    <Route path="/pay-schedule" element={<PaySchedule />} />
    <Route path="/documents" element={<Documents />} />
  </Route>
);
