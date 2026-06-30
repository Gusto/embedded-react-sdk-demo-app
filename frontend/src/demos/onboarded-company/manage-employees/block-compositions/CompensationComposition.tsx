import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { EmployeeManagement, componentEvents } from "@gusto/embedded-react-sdk";

/**
 * Fine-grained rebuild of the Compensation management block from its individual
 * sub-components (CompensationCard + CompensationEditForm + CompensationAddJobForm
 * + CompensationAddAnotherJobForm), routed so each owns a URL.
 *
 * If you don't need this control, render <EmployeeManagement.Compensation />
 * instead - it composes these same sub-blocks behind its own internal flow.
 *
 * This composition demonstrates:
 * - Using CompensationCard as the main view
 * - Routing to separate forms for add/edit/add-another actions
 * - Handling all the event-driven navigation between components
 */

type CompensationCompositionProps = {
  employeeId: string;
};

export function CompensationComposition({
  employeeId,
}: CompensationCompositionProps) {
  const navigate = useNavigate();
  const basePath = `/employees/${employeeId}/compensation-composition`;

  return (
    <Routes>
      <Route
        index
        element={
          <EmployeeManagement.CompensationCard
            employeeId={employeeId}
            onEvent={(type, payload) => {
              switch (type) {
                case componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_CARD_ADD_REQUESTED:
                  navigate(`${basePath}/add`);
                  break;
                case componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_CARD_ADD_ANOTHER_REQUESTED:
                  navigate(`${basePath}/add-another`);
                  break;
                case componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_CARD_EDIT_REQUESTED: {
                  const { jobId } = payload as { jobId: string };
                  navigate(`${basePath}/edit/${jobId}`);
                  break;
                }
              }
            }}
          />
        }
      />
      <Route
        path="add"
        element={
          <EmployeeManagement.CompensationAddJobForm
            employeeId={employeeId}
            onEvent={(type) => {
              if (
                type === componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_ADD_JOB_FORM_SUBMITTED ||
                type === componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_ADD_JOB_FORM_CANCELLED
              ) {
                navigate(basePath);
              }
            }}
          />
        }
      />
      <Route
        path="add-another"
        element={
          <EmployeeManagement.CompensationAddAnotherJobForm
            employeeId={employeeId}
            onEvent={(type) => {
              if (
                type === componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_ADD_ANOTHER_JOB_FORM_SUBMITTED ||
                type === componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_ADD_ANOTHER_JOB_FORM_CANCELLED
              ) {
                navigate(basePath);
              }
            }}
          />
        }
      />
      <Route
        path="edit/:jobId"
        element={<EditCompensation employeeId={employeeId} basePath={basePath} />}
      />
    </Routes>
  );
}

function EditCompensation({
  employeeId,
  basePath,
}: {
  employeeId: string;
  basePath: string;
}) {
  const { jobId } = useParams<"jobId">();
  const navigate = useNavigate();

  if (!jobId) {
    return <Navigate to={basePath} replace />;
  }

  return (
    <EmployeeManagement.CompensationEditForm
      employeeId={employeeId}
      jobId={jobId}
      onEvent={(type) => {
        if (
          type === componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_EDIT_FORM_SUBMITTED ||
          type === componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_EDIT_FORM_CANCELLED
        ) {
          navigate(basePath);
        }
      }}
    />
  );
}
