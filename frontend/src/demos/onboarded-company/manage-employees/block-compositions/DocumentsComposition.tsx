import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { EmployeeManagement, componentEvents } from "@gusto/embedded-react-sdk";

/**
 * Fine-grained rebuild of the Documents management block from its individual
 * sub-components (DocumentsCard + DocumentManager), routed so each owns a URL.
 *
 * If you don't need this control, render <EmployeeManagement.Documents />
 * instead - it composes these same sub-blocks behind its own internal flow.
 *
 * This composition demonstrates:
 * - Using DocumentsCard as the main view
 * - Routing to DocumentManager for viewing/signing individual documents
 * - Handling all the event-driven navigation between components
 */

type DocumentsCompositionProps = {
  employeeId: string;
};

export function DocumentsComposition({
  employeeId,
}: DocumentsCompositionProps) {
  const navigate = useNavigate();
  const basePath = `/employees/${employeeId}/documents-composition`;

  return (
    <Routes>
      <Route
        index
        element={
          <EmployeeManagement.DocumentsCard
            employeeId={employeeId}
            onEvent={(type, payload) => {
              if (type === componentEvents.EMPLOYEE_MANAGEMENT_DOCUMENTS_CARD_VIEW_REQUESTED) {
                const { formId } = payload as { formId: string };
                navigate(`${basePath}/view/${formId}`);
              }
            }}
          />
        }
      />
      <Route
        path="view/:formId"
        element={<ViewDocument employeeId={employeeId} basePath={basePath} />}
      />
    </Routes>
  );
}

function ViewDocument({
  employeeId,
  basePath,
}: {
  employeeId: string;
  basePath: string;
}) {
  const { formId } = useParams<"formId">();
  const navigate = useNavigate();

  if (!formId) {
    return <Navigate to={basePath} replace />;
  }

  return (
    <EmployeeManagement.DocumentManager
      employeeId={employeeId}
      formId={formId}
      onEvent={(type) => {
        if (type === componentEvents.CANCEL) {
          navigate(basePath);
        }
      }}
    />
  );
}
