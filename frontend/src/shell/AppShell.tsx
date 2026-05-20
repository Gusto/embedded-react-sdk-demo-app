import { Navigate, Route, Routes } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ContractorsPage } from "../pages/ContractorsPage";
import { EmployeesPage } from "../pages/EmployeesPage";
import { HomePage } from "../pages/HomePage";
import { PayContractorsPage } from "../pages/PayContractorsPage";
import { RunPayrollPage } from "../pages/RunPayrollPage";

export function AppShell() {
  return (
    <div className="flex h-screen flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-white p-6 dark:bg-neutral-950">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/payroll"
              element={<Navigate to="/payroll/run" replace />}
            />
            <Route path="/payroll/run" element={<RunPayrollPage />} />
            <Route
              path="/payroll/pay-contractors"
              element={<PayContractorsPage />}
            />
            <Route path="/payroll/employees" element={<EmployeesPage />} />
            <Route path="/payroll/contractors" element={<ContractorsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
