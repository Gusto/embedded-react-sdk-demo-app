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

// Nested in the onboarded-company AppShell so each step renders in the
// dashboard shell at its own URL. The `:payrollId` route just groups the
// per-payroll steps that share the param.
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
