import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import {
  EmployeeOnboarding,
  componentEvents,
  I9_FORM_NAME,
} from "@gusto/embedded-react-sdk";
import { useEmployeesGet } from "@gusto/embedded-api-v-2025-11-15/react-query/employeesGet";
import { useEmployeeFormsList } from "@gusto/embedded-api-v-2025-11-15/react-query/employeeFormsList";

// Fine-grained rebuild of the employee document-signing step from its sub-blocks
// (EmploymentEligibility -> DocumentList -> SignatureForm / I9SignatureForm),
// routed so each stage owns a URL. If you don't need this control, render
// <EmployeeOnboarding.DocumentSigner withEmployeeI9 /> instead - it composes
// these same sub-blocks behind its own internal flow.
//
// The entry route derives the start step from live data the same way the
// all-in-one DocumentSigner does internally, via the @gusto/embedded-api React
// Query hooks. Keep that package on the same version the SDK depends on so its
// hooks share the SDK's client and cache. Enter on EmploymentEligibility (the
// I-9 form) only when the employee needs the I-9, otherwise on the document
// list. The I-9 is needed when BOTH:
//   1. I-9 is enabled for the employee (`onboardingDocumentsConfig.i9Document`).
//   2. The I-9 is still outstanding - the "US_I-9" form is missing entirely or
//      present with `requiresSigning === true`.

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
      <Route
        index
        element={
          <DocumentSignerEntry employeeId={employeeId} basePath={basePath} />
        }
      />
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

// Picks the entry step from live data: EmploymentEligibility when the employee
// still needs the I-9, otherwise the document list. Mirrors the gate the
// all-in-one DocumentSigner runs internally.
function DocumentSignerEntry({
  employeeId,
  basePath,
}: {
  employeeId: string;
  basePath: string;
}) {
  const { data: employeeData, isPending: employeePending } = useEmployeesGet({
    employeeId,
  });
  const { data: formsData, isPending: formsPending } = useEmployeeFormsList({
    employeeId,
  });

  if (employeePending || formsPending) return null;

  const i9Enabled =
    employeeData?.employee?.onboardingDocumentsConfig?.i9Document === true;
  const i9Form = formsData?.forms?.find((form) => form.name === I9_FORM_NAME);
  const needsI9Form = i9Enabled && (!i9Form || i9Form.requiresSigning === true);

  return (
    <Navigate
      to={`${basePath}/${needsI9Form ? "eligibility" : "documents"}`}
      replace
    />
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
