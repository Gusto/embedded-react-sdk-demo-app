import { Route } from "react-router-dom";
import {
  PayPeriodSelection,
  Summary,
  TerminateForm,
} from "./pages/Terminations";

// Mounted under `employees/` (not its own top-level path) so the Employees nav
// stays highlighted, while keeping these files separate from manage-employees.
export const TerminationsRoutes = (
  <Route path="employees/terminations">
    <Route path=":employeeId">
      <Route index element={<TerminateForm />} />
      <Route path="summary" element={<Summary />} />
      <Route path="pay-period" element={<PayPeriodSelection />} />
    </Route>
  </Route>
);
