import { Route, Routes, useNavigate } from "react-router-dom";
import { EmployeeManagement, componentEvents } from "@gusto/embedded-react-sdk";

/**
 * Fine-grained rebuild of the Profile management block from its individual
 * sub-components (ProfileCard + ProfileEditForm), routed so each owns a URL.
 *
 * If you don't need this control, render <EmployeeManagement.Profile />
 * instead - it composes these same sub-blocks behind its own internal flow.
 *
 * This composition demonstrates:
 * - Using ProfileCard as the main view
 * - Routing to the edit form
 * - Handling all the event-driven navigation between components
 */

type ProfileCompositionProps = {
  employeeId: string;
};

export function ProfileComposition({
  employeeId,
}: ProfileCompositionProps) {
  const navigate = useNavigate();
  const basePath = `/employees/${employeeId}/profile-composition`;

  return (
    <Routes>
      <Route
        index
        element={
          <EmployeeManagement.ProfileCard
            employeeId={employeeId}
            onEvent={(type) => {
              if (type === componentEvents.EMPLOYEE_MANAGEMENT_PROFILE_EDIT_REQUESTED) {
                navigate(`${basePath}/edit`);
              }
            }}
          />
        }
      />
      <Route
        path="edit"
        element={
          <EmployeeManagement.ProfileEditForm
            employeeId={employeeId}
            onEvent={(type) => {
              if (
                type === componentEvents.EMPLOYEE_MANAGEMENT_PROFILE_UPDATED ||
                type === componentEvents.EMPLOYEE_MANAGEMENT_PROFILE_EDIT_CANCELLED
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
