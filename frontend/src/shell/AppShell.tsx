import { Navigate, Route, Routes } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ContractorsPage } from "../pages/ContractorsPage";
import { EmployeesPage } from "../pages/EmployeesPage";
import { HomePage } from "../pages/HomePage";
import { Nav2Page } from "../pages/Nav2Page";
import { Nav3Page } from "../pages/Nav3Page";
import { PayContractorsPage } from "../pages/PayContractorsPage";
import { RunPayrollPage } from "../pages/RunPayrollPage";

export function AppShell() {
  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-white p-6">
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
            <Route path="/nav-2" element={<Nav2Page />} />
            <Route path="/nav-3" element={<Nav3Page />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
