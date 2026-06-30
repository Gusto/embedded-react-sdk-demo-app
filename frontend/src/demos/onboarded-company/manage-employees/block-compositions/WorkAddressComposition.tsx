import { Route, Routes, useNavigate } from "react-router-dom";
import { EmployeeManagement, componentEvents } from "@gusto/embedded-react-sdk";

/**
 * Fine-grained rebuild of the WorkAddress management block from its individual
 * sub-components (WorkAddressCard + WorkAddressEditForm), routed so each owns a URL.
 *
 * If you don't need this control, render <EmployeeManagement.WorkAddress />
 * instead - it composes these same sub-blocks behind its own internal flow.
 *
 * This composition demonstrates:
 * - Using WorkAddressCard as the main view
 * - Routing to the edit form
 * - Handling all the event-driven navigation between components
 */

type WorkAddressCompositionProps = {
  employeeId: string;
};

export function WorkAddressComposition({
  employeeId,
}: WorkAddressCompositionProps) {
  const navigate = useNavigate();
  const basePath = `/employees/${employeeId}/work-address-composition`;

  return (
    <Routes>
      <Route
        index
        element={
          <EmployeeManagement.WorkAddressCard
            employeeId={employeeId}
            onEvent={(type) => {
              if (type === componentEvents.EMPLOYEE_MANAGEMENT_WORK_ADDRESS_EDIT_REQUESTED) {
                navigate(`${basePath}/edit`);
              }
            }}
          />
        }
      />
      <Route
        path="edit"
        element={
          <EmployeeManagement.WorkAddressEditForm
            employeeId={employeeId}
            onEvent={(type) => {
              if (type === componentEvents.EMPLOYEE_MANAGEMENT_WORK_ADDRESS_EDIT_CANCELLED) {
                navigate(basePath);
              }
            }}
          />
        }
      />
    </Routes>
  );
}
