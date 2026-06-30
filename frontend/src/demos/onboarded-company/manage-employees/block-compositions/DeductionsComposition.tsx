import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { EmployeeManagement, componentEvents } from "@gusto/embedded-react-sdk";

/**
 * Fine-grained rebuild of the Deductions management block from its individual
 * sub-components (DeductionsCard + DeductionsEditForm), routed so each owns a URL.
 *
 * If you don't need this control, render <EmployeeManagement.Deductions />
 * instead - it composes these same sub-blocks behind its own internal flow.
 *
 * This composition demonstrates:
 * - Using DeductionsCard as the main view
 * - Routing to the edit form for both add and edit actions
 * - Handling all the event-driven navigation between components
 */

type DeductionsCompositionProps = {
  employeeId: string;
};

export function DeductionsComposition({
  employeeId,
}: DeductionsCompositionProps) {
  const navigate = useNavigate();
  const basePath = `/employees/${employeeId}/deductions-composition`;

  return (
    <Routes>
      <Route
        index
        element={
          <EmployeeManagement.DeductionsCard
            employeeId={employeeId}
            onEvent={(type, payload) => {
              switch (type) {
                case componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_CARD_ADD_REQUESTED:
                  navigate(`${basePath}/add`);
                  break;
                case componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_CARD_EDIT_REQUESTED: {
                  const { uuid } = payload as { uuid: string };
                  navigate(`${basePath}/edit/${uuid}`);
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
          <EmployeeManagement.DeductionsEditForm
            employeeId={employeeId}
            onEvent={(type) => {
              if (
                type === componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_EDIT_FORM_CREATED ||
                type === componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_EDIT_FORM_UPDATED ||
                type === componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_EDIT_FORM_CANCELLED
              ) {
                navigate(basePath);
              }
            }}
          />
        }
      />
      <Route
        path="edit/:deductionId"
        element={<EditDeduction employeeId={employeeId} basePath={basePath} />}
      />
    </Routes>
  );
}

function EditDeduction({
  employeeId,
  basePath,
}: {
  employeeId: string;
  basePath: string;
}) {
  const { deductionId } = useParams<"deductionId">();
  const navigate = useNavigate();

  if (!deductionId) {
    return <Navigate to={basePath} replace />;
  }

  return (
    <EmployeeManagement.DeductionsEditForm
      employeeId={employeeId}
      editingDeductionId={deductionId}
      onEvent={(type) => {
        if (
          type === componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_EDIT_FORM_CREATED ||
          type === componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_EDIT_FORM_UPDATED ||
          type === componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_EDIT_FORM_CANCELLED
        ) {
          navigate(basePath);
        }
      }}
    />
  );
}
