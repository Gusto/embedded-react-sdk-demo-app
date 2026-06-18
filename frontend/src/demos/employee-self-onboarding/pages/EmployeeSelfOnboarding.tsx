import { useNavigate } from "react-router-dom";
import { EmployeeOnboarding, componentEvents } from "@gusto/embedded-react-sdk";
import { COMPANY_ID, EMPLOYEE_ID } from "../../../config";
import { EmployeeDocumentSignerComposition } from "../block-compositions/EmployeeDocumentSignerComposition";

// This demo composes the individual SDK employee self-onboarding blocks behind
// react-router so each step owns a URL. For a turnkey integration, skip all of
// this and render <EmployeeOnboarding.SelfOnboardingFlow .../>, which runs the
// same steps inside one component.

// Self-onboarding is employee-facing: the employee already exists (an admin
// invited them) and is identified by their session/link, so this demo runs the
// flow against a single configured employee rather than picking one from a list.
export function Landing() {
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.Landing
      companyId={COMPANY_ID}
      employeeId={EMPLOYEE_ID}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_SELF_ONBOARDING_START) {
          navigate("/employee-self-onboarding/profile");
        }
      }}
    />
  );
}

export function Profile() {
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.Profile
      companyId={COMPANY_ID}
      employeeId={EMPLOYEE_ID}
      isAdmin={false}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_PROFILE_DONE) {
          navigate("/employee-self-onboarding/federal-taxes");
        }
      }}
    />
  );
}

export function FederalTaxes() {
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.FederalTaxes
      employeeId={EMPLOYEE_ID}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_FEDERAL_TAXES_DONE) {
          navigate("/employee-self-onboarding/state-taxes");
        }
      }}
    />
  );
}

export function StateTaxes() {
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.StateTaxes
      employeeId={EMPLOYEE_ID}
      isAdmin={false}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_STATE_TAXES_DONE) {
          navigate("/employee-self-onboarding/payment-method");
        }
      }}
    />
  );
}

export function PaymentMethod() {
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.PaymentMethod
      employeeId={EMPLOYEE_ID}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_PAYMENT_METHOD_DONE) {
          navigate("/employee-self-onboarding/documents");
        }
      }}
    />
  );
}

// DocumentSigner is a composite block: it has smaller sub-steps (I-9 employment
// eligibility + document list + signature forms) that we route individually here.
// That routed implementation lives in block-compositions/. Render
// <EmployeeOnboarding.DocumentSigner withEmployeeI9 .../> instead for the turnkey
// single-component step.
export function DocumentSigner() {
  const navigate = useNavigate();
  return (
    <EmployeeDocumentSignerComposition
      employeeId={EMPLOYEE_ID}
      basePath="/employee-self-onboarding/documents"
      onComplete={() => navigate("/employee-self-onboarding/summary")}
    />
  );
}

export function Summary() {
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.OnboardingSummary
      employeeId={EMPLOYEE_ID}
      isAdmin={false}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_ONBOARDING_DONE) {
          navigate("/");
        }
      }}
    />
  );
}
