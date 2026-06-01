import { useState } from "react";
import { EmployeeOnboarding, componentEvents } from "@gusto/embedded-react-sdk";
import { COMPANY_ID } from "../../config";

type Step =
  | "list"
  | "profile"
  | "compensation"
  | "federalTaxes"
  | "stateTaxes"
  | "paymentMethod"
  | "deductions"
  | "summary";

type State = {
  step: Step;
  employeeId?: string;
  startDate?: string;
  onboardingStatus?: string;
};

// Statuses that indicate the employee is self-onboarding. When true, the admin
// flow skips the federal taxes, state taxes, and payment method steps because
// the employee will fill those in themselves.
const SELF_ONBOARDING_STATUSES = new Set([
  "self_onboarding_invited",
  "self_onboarding_invited_started",
  "self_onboarding_invited_overdue",
  "self_onboarding_pending_invite",
]);

export default function CustomFlow() {
  const [state, setState] = useState<State>({ step: "list" });
  const navigate = (nextState: Partial<State>) =>
    setState((currentState) => ({ ...currentState, ...nextState }));

  const { step, employeeId, startDate, onboardingStatus } = state;
  const isSelfOnboarding = SELF_ONBOARDING_STATUSES.has(onboardingStatus ?? "");

  switch (step) {
    case "list":
      return (
        <EmployeeOnboarding.EmployeeList
          companyId={COMPANY_ID}
          onEvent={(type, payload) => {
            if (type === componentEvents.EMPLOYEE_CREATE) {
              setState({ step: "profile" });
            }
            if (type === componentEvents.EMPLOYEE_UPDATE) {
              const data = payload as {
                employeeId: string;
                onboardingStatus: string;
              };
              navigate({
                step: "profile",
                employeeId: data.employeeId,
                onboardingStatus: data.onboardingStatus,
              });
            }
          }}
        />
      );

    case "profile":
      return (
        <EmployeeOnboarding.Profile
          companyId={COMPANY_ID}
          employeeId={employeeId}
          isAdmin
          onEvent={(type, payload) => {
            if (type === componentEvents.EMPLOYEE_PROFILE_DONE) {
              const data = payload as {
                uuid: string;
                startDate: string;
                onboardingStatus: string;
              };
              navigate({
                step: "compensation",
                employeeId: data.uuid,
                startDate: data.startDate,
                onboardingStatus: data.onboardingStatus,
              });
            }
            if (type === componentEvents.CANCEL) navigate({ step: "list" });
          }}
        />
      );

    case "compensation":
      return (
        <EmployeeOnboarding.Compensation
          employeeId={employeeId!}
          startDate={startDate!}
          onEvent={(type) => {
            if (type === componentEvents.EMPLOYEE_COMPENSATION_DONE) {
              navigate({
                step: isSelfOnboarding ? "deductions" : "federalTaxes",
              });
            }
            if (type === componentEvents.CANCEL) navigate({ step: "list" });
          }}
        />
      );

    case "federalTaxes":
      return (
        <EmployeeOnboarding.FederalTaxes
          employeeId={employeeId!}
          onEvent={(type) => {
            if (type === componentEvents.EMPLOYEE_FEDERAL_TAXES_DONE) {
              navigate({ step: "stateTaxes" });
            }
            if (type === componentEvents.CANCEL) navigate({ step: "list" });
          }}
        />
      );

    case "stateTaxes":
      return (
        <EmployeeOnboarding.StateTaxes
          employeeId={employeeId!}
          isAdmin
          onEvent={(type) => {
            if (type === componentEvents.EMPLOYEE_STATE_TAXES_DONE) {
              navigate({ step: "paymentMethod" });
            }
            if (type === componentEvents.CANCEL) navigate({ step: "list" });
          }}
        />
      );

    case "paymentMethod":
      return (
        <EmployeeOnboarding.PaymentMethod
          employeeId={employeeId!}
          onEvent={(type) => {
            if (type === componentEvents.EMPLOYEE_PAYMENT_METHOD_DONE) {
              navigate({ step: "deductions" });
            }
            if (type === componentEvents.CANCEL) navigate({ step: "list" });
          }}
        />
      );

    case "deductions":
      return (
        <EmployeeOnboarding.Deductions
          employeeId={employeeId!}
          onEvent={(type) => {
            if (type === componentEvents.EMPLOYEE_DEDUCTION_DONE) {
              navigate({ step: "summary" });
            }
            if (type === componentEvents.CANCEL) navigate({ step: "list" });
          }}
        />
      );

    case "summary":
      return (
        <EmployeeOnboarding.OnboardingSummary
          employeeId={employeeId!}
          isAdmin
          onEvent={(type) => {
            if (type === componentEvents.EMPLOYEES_LIST) {
              setState({ step: "list" });
            }
          }}
        />
      );
  }
}
