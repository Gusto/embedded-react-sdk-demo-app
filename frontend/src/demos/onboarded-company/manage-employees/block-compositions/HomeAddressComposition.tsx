import { Route, Routes, useNavigate } from "react-router-dom";
import { EmployeeManagement, componentEvents } from "@gusto/embedded-react-sdk";

/**
 * Fine-grained rebuild of the HomeAddress management block from its individual
 * sub-components (HomeAddressCard + HomeAddressEditForm), routed so each owns a URL.
 *
 * If you don't need this control, render <EmployeeManagement.HomeAddress />
 * instead - it composes these same sub-blocks behind its own internal flow.
 *
 * This composition demonstrates:
 * - Using HomeAddressCard as the main view
 * - Routing to the edit form
 * - Handling all the event-driven navigation between components
 */

type HomeAddressCompositionProps = {
  employeeId: string;
};

export function HomeAddressComposition({
  employeeId,
}: HomeAddressCompositionProps) {
  const navigate = useNavigate();
  const basePath = `/employees/${employeeId}/home-address-composition`;

  return (
    <Routes>
      <Route
        index
        element={
          <EmployeeManagement.HomeAddressCard
            employeeId={employeeId}
            onEvent={(type) => {
              if (type === componentEvents.EMPLOYEE_MANAGEMENT_HOME_ADDRESS_EDIT_REQUESTED) {
                navigate(`${basePath}/edit`);
              }
            }}
          />
        }
      />
      <Route
        path="edit"
        element={
          <EmployeeManagement.HomeAddressEditForm
            employeeId={employeeId}
            onEvent={(type) => {
              if (type === componentEvents.EMPLOYEE_MANAGEMENT_HOME_ADDRESS_EDIT_CANCELLED) {
                navigate(basePath);
              }
            }}
          />
        }
      />
    </Routes>
  );
}
