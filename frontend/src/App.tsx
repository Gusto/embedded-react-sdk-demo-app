import { GustoProvider } from "@gusto/embedded-react-sdk";
import "@gusto/embedded-react-sdk/style.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell/AppShell";
import { BankAccount } from "./pages/BankAccount";
import { Contractors } from "./pages/Contractors";
import { Documents } from "./pages/Documents";
import { Employees } from "./pages/Employees";
import { FederalTaxes } from "./pages/FederalTaxes";
import { Locations } from "./pages/Locations";
import { PayContractors } from "./pages/PayContractors";
import { PaySchedule } from "./pages/PaySchedule";
import { RunPayroll } from "./pages/RunPayroll";
import { StateTaxes } from "./pages/StateTaxes";
import { TimeOff } from "./pages/TimeOff";
import "./App.css";

function App() {
  return (
    <GustoProvider config={{ baseUrl: "http://localhost:3001" }}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/run-payroll" replace />} />
            <Route path="/run-payroll" element={<RunPayroll />} />
            <Route path="/pay-contractors" element={<PayContractors />} />
            <Route path="/time-off" element={<TimeOff />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/contractors" element={<Contractors />} />
            <Route path="/bank-account" element={<BankAccount />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/federal-taxes" element={<FederalTaxes />} />
            <Route path="/state-taxes" element={<StateTaxes />} />
            <Route path="/pay-schedule" element={<PaySchedule />} />
            <Route path="/documents" element={<Documents />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GustoProvider>
  );
}

export default App;
