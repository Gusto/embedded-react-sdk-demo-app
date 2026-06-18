import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import {
  EmployeeOnboarding,
  componentEvents,
  I9_FORM_NAME,
} from "@gusto/embedded-react-sdk";

// Fine-grained rebuild of the employee document-signing step from its sub-blocks
// (EmploymentEligibility -> DocumentList -> SignatureForm / I9SignatureForm),
// routed so each stage owns a URL. If you don't need this control, render
// <EmployeeOnboarding.DocumentSigner withEmployeeI9 /> instead - it composes
// these same sub-blocks behind its own internal flow.
//
// This composition always enters on the `eligibility` route, which renders
// EmployeeOnboarding.EmploymentEligibility (the I-9 employment eligibility form).
// In a real integration you'd render that component only for employees who
// actually need the I-9, otherwise entering directly on the `documents` route
// (EmployeeOnboarding.DocumentList). Derive that decision from live data - this
// is what the SDK DocumentSigner checks internally - and render
// EmploymentEligibility first only when BOTH:
//   1. I-9 is enabled for the employee - GET the employee and check
//      `onboarding_documents_config.i9_document === true`:
//      https://docs.gusto.com/embedded-payroll/reference/get-v1-employees
//   2. The I-9 is still outstanding - GET their forms; the "US_I-9" form is
//      either missing entirely or present with `requires_signing === true`:
//      https://docs.gusto.com/embedded-payroll/reference/get-v1-employee-forms

type EmployeeDocumentSignerCompositionProps = {
  employeeId: string;
  /** Absolute path this composition is mounted at, used for sub-route navigation. */
  basePath: string;
  /** Called when all required forms are signed (EMPLOYEE_FORMS_DONE). */
  onComplete: () => void;
};

export function EmployeeDocumentSignerComposition({
  employeeId,
  basePath,
  onComplete,
}: EmployeeDocumentSignerCompositionProps) {
  const navigate = useNavigate();
  const toDocuments = () => navigate(`${basePath}/documents`);

  return (
    <Routes>
      <Route index element={<Navigate to={`${basePath}/eligibility`} replace />} />
      <Route
        path="eligibility"
        element={
          <EmployeeOnboarding.EmploymentEligibility
            employeeId={employeeId}
            onEvent={(type) => {
              if (type === componentEvents.EMPLOYEE_EMPLOYMENT_ELIGIBILITY_DONE) {
                toDocuments();
              }
            }}
          />
        }
      />
      <Route
        path="documents"
        element={
          <EmployeeOnboarding.DocumentList
            employeeId={employeeId}
            onEvent={(type, payload) => {
              switch (type) {
                case componentEvents.EMPLOYEE_VIEW_FORM_TO_SIGN: {
                  const { uuid, name } = payload as { uuid: string; name?: string };
                  navigate(
                    name === I9_FORM_NAME
                      ? `${basePath}/sign-i9/${uuid}`
                      : `${basePath}/sign/${uuid}`,
                  );
                  break;
                }
                case componentEvents.EMPLOYEE_FORMS_DONE:
                  onComplete();
                  break;
              }
            }}
          />
        }
      />
      <Route
        path="sign/:formId"
        element={<SignFormStep employeeId={employeeId} basePath={basePath} />}
      />
      <Route
        path="sign-i9/:formId"
        element={<SignI9FormStep employeeId={employeeId} basePath={basePath} />}
      />
    </Routes>
  );
}

function SignFormStep({
  employeeId,
  basePath,
}: {
  employeeId: string;
  basePath: string;
}) {
  const { formId } = useParams<"formId">();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.SignatureForm
      employeeId={employeeId}
      formId={formId!}
      onEvent={(type) => {
        if (
          type === componentEvents.EMPLOYEE_SIGN_FORM ||
          type === componentEvents.CANCEL
        ) {
          navigate(`${basePath}/documents`);
        }
      }}
    />
  );
}

// I9SignatureForm adds a "change eligibility status" action on top of sign/cancel,
// which routes back to the EmploymentEligibility step.
function SignI9FormStep({
  employeeId,
  basePath,
}: {
  employeeId: string;
  basePath: string;
}) {
  const { formId } = useParams<"formId">();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.I9SignatureForm
      employeeId={employeeId}
      formId={formId!}
      onEvent={(type) => {
        switch (type) {
          case componentEvents.EMPLOYEE_SIGN_FORM:
          case componentEvents.CANCEL:
            navigate(`${basePath}/documents`);
            break;
          case componentEvents.EMPLOYEE_CHANGE_ELIGIBILITY_STATUS:
            navigate(`${basePath}/eligibility`);
            break;
        }
      }}
    />
  );
}
