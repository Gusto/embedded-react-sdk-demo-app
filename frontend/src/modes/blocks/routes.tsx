import { Navigate, Route, Routes } from "react-router-dom";
import { ContractorsPage } from "./pages/ContractorsPage";
import { EditEmployeePage } from "./pages/EditEmployeePage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { HomePage } from "./pages/HomePage";
import { NewEmployeePage } from "./pages/NewEmployeePage";
import { PayContractorsPage } from "./pages/PayContractorsPage";
import { PayrollConfigurationPage } from "./pages/PayrollConfigurationPage";
import { PayrollReviewPage } from "./pages/PayrollReviewPage";
import { RunPayrollPage } from "./pages/RunPayrollPage";

/**
 * Blocks mode routes — mounted under `/blocks/*` by AppShell, so each path
 * here is relative to that prefix.
 */
export function BlocksRoutes() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="payroll" element={<Navigate to="run" replace />} />
      <Route path="payroll/run" element={<RunPayrollPage />} />
      <Route
        path="payroll/configuration/:payrollUuid"
        element={<PayrollConfigurationPage />}
      />
      <Route
        path="payroll/review/:payrollUuid"
        element={<PayrollReviewPage />}
      />
      <Route path="payroll/pay-contractors" element={<PayContractorsPage />} />
      <Route path="payroll/employees" element={<EmployeesPage />} />
      <Route path="payroll/employees/new" element={<NewEmployeePage />} />
      <Route
        path="payroll/employees/:employeeId"
        element={<EditEmployeePage />}
      />
      <Route path="payroll/contractors" element={<ContractorsPage />} />
    </Routes>
  );
}
