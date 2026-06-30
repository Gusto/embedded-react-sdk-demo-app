import { Route, Routes, useNavigate } from "react-router-dom";
import { EmployeeManagement, componentEvents } from "@gusto/embedded-react-sdk";

/**
 * Fine-grained rebuild of the FederalTaxes management block from its individual
 * sub-components (FederalTaxesCard + FederalTaxesEditForm), routed so each owns a URL.
 *
 * If you don't need this control, render <EmployeeManagement.FederalTaxes />
 * instead - it composes these same sub-blocks behind its own internal flow.
 *
 * This composition demonstrates:
 * - Using FederalTaxesCard as the main view
 * - Routing to the edit form
 * - Handling all the event-driven navigation between components
 */

type FederalTaxesCompositionProps = {
  employeeId: string;
};

export function FederalTaxesComposition({
  employeeId,
}: FederalTaxesCompositionProps) {
  const navigate = useNavigate();
  const basePath = `/employees/${employeeId}/federal-taxes-composition`;

  return (
    <Routes>
      <Route
        index
        element={
          <EmployeeManagement.FederalTaxesCard
            employeeId={employeeId}
            onEvent={(type) => {
              if (type === componentEvents.EMPLOYEE_MANAGEMENT_FEDERAL_TAXES_CARD_EDIT_REQUESTED) {
                navigate(`${basePath}/edit`);
              }
            }}
          />
        }
      />
      <Route
        path="edit"
        element={
          <EmployeeManagement.FederalTaxesEditForm
            employeeId={employeeId}
            onEvent={(type) => {
              if (
                type === componentEvents.EMPLOYEE_MANAGEMENT_FEDERAL_TAXES_EDIT_FORM_SUBMITTED ||
                type === componentEvents.EMPLOYEE_MANAGEMENT_FEDERAL_TAXES_EDIT_FORM_CANCELLED
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
