import { Route } from "react-router-dom";
import {
  Blockers,
  Configuration,
  EditEmployee,
  OffCycleCreate,
  Overview,
  PayrollLanding,
  Receipts,
} from "./pages/RunPayroll";

// Nested inside the onboarded-company AppShell route, so every step renders in
// the dashboard shell (sidebar/header) and is its own URL. The `:payrollId`
// route has no element — it just groups the per-payroll steps so each child
// inherits the param and renders into the AppShell's <Outlet />.
export const RunPayrollRoutes = (
  <Route path="run-payroll">
    <Route index element={<PayrollLanding />} />
    <Route path="blockers" element={<Blockers />} />
    <Route path="off-cycle" element={<OffCycleCreate />} />
    <Route path=":payrollId">
      <Route path="configuration" element={<Configuration />} />
      <Route path="overview" element={<Overview />} />
      <Route path="edit-employee/:employeeId" element={<EditEmployee />} />
      <Route path="receipts" element={<Receipts />} />
    </Route>
  </Route>
);
