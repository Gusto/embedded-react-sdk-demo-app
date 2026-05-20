import { Navigate, Route, Routes } from "react-router-dom";
import { ContractorsPage } from "./pages/ContractorsPage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { HomePage } from "./pages/HomePage";
import { PayContractorsPage } from "./pages/PayContractorsPage";
import { RunPayrollPage } from "./pages/RunPayrollPage";

/**
 * Workflows mode routes — mounted under `/workflows/*` by AppShell, so each
 * path here is relative to that prefix.
 */
export function WorkflowsRoutes() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="payroll" element={<Navigate to="run" replace />} />
      <Route path="payroll/run" element={<RunPayrollPage />} />
      <Route path="payroll/pay-contractors" element={<PayContractorsPage />} />
      <Route path="payroll/employees" element={<EmployeesPage />} />
      <Route path="payroll/contractors" element={<ContractorsPage />} />
    </Routes>
  );
}
