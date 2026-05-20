import { Route, Routes } from "react-router-dom";
import { EmployeeFormPage } from "./pages/EmployeeFormPage";
import { HomePage } from "./pages/HomePage";

export function HooksRoutes() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="employee-form" element={<EmployeeFormPage />} />
    </Routes>
  );
}
