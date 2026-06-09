import { Outlet, useNavigate, useParams } from "react-router-dom";
import {
  EmployeeOnboarding,
  EmployeeOnboardingStatus,
  componentEvents,
} from "@gusto/embedded-react-sdk";
import { CenteredPage } from "../../../shared/CenteredPage/CenteredPage";
import { createPersistedStore } from "../../../shared/persistedStore";
import { COMPANY_ID } from "../../../config";

type OnboardingContext = {
  startDate?: string;
  onboardingStatus?: string;
};

// Stand-in for your own state management or database. Compensation needs
// startDate (a required prop) and onboardingStatus (to decide whether to skip
// downstream steps for self-onboarding employees). Both come from the SDK's
// Profile event payload, so we stash them per-employee here and read them
// back when Compensation mounts. Backed by localStorage just so the demo
// survives a refresh.
const onboardingStore = createPersistedStore<OnboardingContext>(
  "gusto-demo-employee-onboarding:",
);

// When onboardingStatus matches one of these, the admin flow skips
// federal/state taxes and payment method after compensation — those will be
// filled in by the employee themselves during self-onboarding.
const SELF_ONBOARDING_STATUSES: ReadonlySet<string> = new Set([
  EmployeeOnboardingStatus.SELF_ONBOARDING_PENDING_INVITE,
  EmployeeOnboardingStatus.SELF_ONBOARDING_INVITED,
  EmployeeOnboardingStatus.SELF_ONBOARDING_INVITED_STARTED,
  EmployeeOnboardingStatus.SELF_ONBOARDING_INVITED_OVERDUE,
]);

export function OnboardingShell() {
  return (
    <CenteredPage>
      <Outlet />
    </CenteredPage>
  );
}

export function EmployeeList() {
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.EmployeeList
      companyId={COMPANY_ID}
      onEvent={(type, payload) => {
        switch (type) {
          case componentEvents.EMPLOYEE_CREATE:
            navigate("/employee-onboarding/new");
            break;
          case componentEvents.EMPLOYEE_UPDATE: {
            const data = payload as { employeeId: string };
            navigate(`/employee-onboarding/${data.employeeId}/profile`);
            break;
          }
        }
      }}
    />
  );
}

// Profile runs before the employee exists. The SDK creates the employee on
// submit and returns the new uuid in the payload.
export function ProfileCreate() {
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.Profile
      companyId={COMPANY_ID}
      isAdmin
      isSelfOnboardingEnabled
      onEvent={(type, payload) => {
        switch (type) {
          case componentEvents.EMPLOYEE_PROFILE_DONE: {
            const data = payload as {
              uuid: string;
              startDate: string;
              onboardingStatus: string;
            };
            onboardingStore.save(data.uuid, {
              startDate: data.startDate,
              onboardingStatus: data.onboardingStatus,
            });
            navigate(`/employee-onboarding/${data.uuid}/compensation`);
            break;
          }
          case componentEvents.CANCEL:
            navigate("/employee-onboarding");
            break;
        }
      }}
    />
  );
}

// Profile for an existing employee — used when resuming partway through, or
// when the admin returns to edit before completing onboarding.
export function ProfileEdit() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.Profile
      companyId={COMPANY_ID}
      employeeId={employeeId}
      isAdmin
      isSelfOnboardingEnabled
      onEvent={(type, payload) => {
        switch (type) {
          case componentEvents.EMPLOYEE_PROFILE_DONE: {
            const data = payload as {
              startDate: string;
              onboardingStatus: string;
            };
            onboardingStore.save(employeeId!, {
              startDate: data.startDate,
              onboardingStatus: data.onboardingStatus,
            });
            navigate(`/employee-onboarding/${employeeId}/compensation`);
            break;
          }
          case componentEvents.CANCEL:
            navigate("/employee-onboarding");
            break;
        }
      }}
    />
  );
}

export function Compensation() {
  const { employeeId } = useParams<"employeeId">();
  const { startDate, onboardingStatus } =
    onboardingStore.load(employeeId!) ?? {};
  const navigate = useNavigate();
  const isSelfOnboarding = SELF_ONBOARDING_STATUSES.has(onboardingStatus ?? "");
  return (
    <EmployeeOnboarding.Compensation
      employeeId={employeeId!}
      startDate={startDate!}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_COMPENSATION_DONE) {
          navigate(
            isSelfOnboarding
              ? `/employee-onboarding/${employeeId}/deductions`
              : `/employee-onboarding/${employeeId}/federal-taxes`,
          );
        }
      }}
    />
  );
}

export function FederalTaxes() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.FederalTaxes
      employeeId={employeeId!}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_FEDERAL_TAXES_DONE) {
          navigate(`/employee-onboarding/${employeeId}/state-taxes`);
        }
      }}
    />
  );
}

export function StateTaxes() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.StateTaxes
      employeeId={employeeId!}
      isAdmin
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_STATE_TAXES_DONE) {
          navigate(`/employee-onboarding/${employeeId}/payment-method`);
        }
      }}
    />
  );
}

export function PaymentMethod() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.PaymentMethod
      employeeId={employeeId!}
      isAdmin
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_PAYMENT_METHOD_DONE) {
          navigate(`/employee-onboarding/${employeeId}/deductions`);
        }
      }}
    />
  );
}

export function Deductions() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.Deductions
      employeeId={employeeId!}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_DEDUCTION_DONE) {
          navigate(`/employee-onboarding/${employeeId}/employee-documents`);
        }
      }}
    />
  );
}

export function EmployeeDocuments() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.EmployeeDocuments
      employeeId={employeeId!}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_DOCUMENTS_DONE) {
          navigate(`/employee-onboarding/${employeeId}/summary`);
        }
      }}
    />
  );
}

export function Summary() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.OnboardingSummary
      employeeId={employeeId!}
      isAdmin
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEES_LIST) {
          onboardingStore.clear(employeeId!);
          navigate("/employee-onboarding");
        }
      }}
    />
  );
}
