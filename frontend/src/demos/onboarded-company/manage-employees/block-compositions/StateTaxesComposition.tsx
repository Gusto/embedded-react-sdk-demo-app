import { Route, Routes, useNavigate } from "react-router-dom";
import { EmployeeManagement, componentEvents } from "@gusto/embedded-react-sdk";

/**
 * Fine-grained rebuild of the StateTaxes management block from its individual
 * sub-components (StateTaxesCard + StateTaxesEditForm), routed so each owns a URL.
 *
 * If you don't need this control, render <EmployeeManagement.StateTaxes />
 * instead - it composes these same sub-blocks behind its own internal flow.
 *
 * This composition demonstrates:
 * - Using StateTaxesCard as the main view
 * - Routing to the edit form
 * - Handling all the event-driven navigation between components
 */

type StateTaxesCompositionProps = {
  employeeId: string;
};

export function StateTaxesComposition({
  employeeId,
}: StateTaxesCompositionProps) {
  const navigate = useNavigate();
  const basePath = `/employees/${employeeId}/state-taxes-composition`;

  return (
    <Routes>
      <Route
        index
        element={
          <EmployeeManagement.StateTaxesCard
            employeeId={employeeId}
            onEvent={(type) => {
              if (type === componentEvents.EMPLOYEE_MANAGEMENT_STATE_TAXES_EDIT_REQUESTED) {
                navigate(`${basePath}/edit`);
              }
            }}
          />
        }
      />
      <Route
        path="edit"
        element={
          <EmployeeManagement.StateTaxesEditForm
            employeeId={employeeId}
            onEvent={(type) => {
              if (
                type === componentEvents.EMPLOYEE_MANAGEMENT_STATE_TAXES_UPDATED ||
                type === componentEvents.EMPLOYEE_MANAGEMENT_STATE_TAXES_EDIT_CANCELLED
              ) {
                navigate(basePath);
              }
            }}
          />
        }
      />
    </Routes>
  );
}
