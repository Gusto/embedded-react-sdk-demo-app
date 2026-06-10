import { useNavigate } from "react-router-dom";
import { EmployeeOnboarding, componentEvents } from "@gusto/embedded-react-sdk";
import { COMPANY_ID, EMPLOYEE_ID } from "../../../config";

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

export function DocumentSigner() {
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.DocumentSigner
      employeeId={EMPLOYEE_ID}
      withEmployeeI9
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_FORMS_DONE) {
          navigate("/employee-self-onboarding/summary");
        }
      }}
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
