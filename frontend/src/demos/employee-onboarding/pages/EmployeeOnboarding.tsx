import { type Dispatch, type SetStateAction } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import {
  EmployeeManagement,
  EmployeeOnboarding,
  componentEvents,
} from "@gusto/embedded-react-sdk";
import { CenteredPage } from "../../../shared/CenteredPage/CenteredPage";
import { usePersistedState } from "../../../shared/usePersistedState";
import { COMPANY_ID } from "../../../config";

// When onboardingStatus matches one of these, the admin flow skips
// federal/state taxes and payment method after compensation.
const SELF_ONBOARDING_STATUSES = new Set([
  "self_onboarding_invited",
  "self_onboarding_invited_started",
  "self_onboarding_invited_overdue",
  "self_onboarding_pending_invite",
]);

// When onboardingStatus matches one of these, deductions routes straight
// to summary, skipping EmployeeDocuments — onboarding is already complete
// or awaiting admin review. Mirrors the SDK's employeeDocumentsGuard.
const DOCUMENTS_CONFIG_COMPLETED_STATUSES = new Set([
  "self_onboarding_completed_by_employee",
  "self_onboarding_awaiting_admin_review",
  "onboarding_completed",
]);

// startDate is required by Compensation; onboardingStatus drives the
// self-onboarding and I-9 skip branches.
type OnboardingContext = {
  // ISO date string (YYYY-MM-DD). The SDK's Profile event emits and the
  // Compensation prop expects exactly this format — pass it through as a
  // string rather than round-tripping through `Date`.
  startDate?: string;
  onboardingStatus?: string;
};

type OnboardingContextValue = [
  OnboardingContext,
  Dispatch<SetStateAction<OnboardingContext>>,
];

const ONBOARDING_STORAGE_PREFIX = "gusto-demo-employee-onboarding:";

// Outer layout for /employee-onboarding. Hosts the list and the create-mode
// profile, which run before there's an employeeId to key state by.
export function OnboardingShell() {
  return (
    <CenteredPage>
      <Outlet />
    </CenteredPage>
  );
}

// Inner layout under :employeeId. Owns the per-employee onboarding context.
// Profile-create hands off the initial value via `location.state` because
// this layout isn't mounted yet during creation.
export function OnboardingFlow() {
  const { employeeId } = useParams<"employeeId">();
  const initial = readInitialContext(useLocation().state);
  const [ctx, setCtx] = usePersistedState<OnboardingContext>(
    `${ONBOARDING_STORAGE_PREFIX}${employeeId}`,
    initial,
  );

  const value: OnboardingContextValue = [ctx, setCtx];
  return <Outlet context={value} />;
}

// `location.state` is typed as `any` by React Router and is fully
// caller-controlled, so pull each field through an explicit type check
// rather than casting the whole object into our shape.
function readInitialContext(state: unknown): OnboardingContext {
  const source = (state ?? {}) as Record<string, unknown>;
  return {
    startDate:
      typeof source.startDate === "string" ? source.startDate : undefined,
    onboardingStatus:
      typeof source.onboardingStatus === "string"
        ? source.onboardingStatus
        : undefined,
  };
}

function useOnboardingContext() {
  return useOutletContext<OnboardingContextValue>();
}

export function EmployeeList() {
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.EmployeeList
      companyId={COMPANY_ID}
      onEvent={(type, payload) => {
        switch (type) {
          case componentEvents.EMPLOYEE_CREATE:
            // User clicked "Add employee" in the list.
            navigate("/employee-onboarding/new/profile");
            break;
          case componentEvents.EMPLOYEE_UPDATE: {
            // User selected an existing employee to continue onboarding.
            const data = payload as { employeeId: string };
            navigate(`/employee-onboarding/${data.employeeId}/profile`);
            break;
          }
        }
      }}
    />
  );
}

// Mounted at /new/profile (create, outside OnboardingFlow) and
// /:employeeId/profile (edit, inside). In create mode the initial onboarding
// fields are handed to OnboardingFlow via location.state on the next
// navigate; in edit mode updates flow through setCtx.
export function Profile() {
  const { employeeId } = useParams<{ employeeId?: string }>();
  const ctx = useOutletContext<OnboardingContextValue | undefined>();
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
            // SDK persisted the profile form. Payload includes the (possibly
            // newly created) employee uuid plus the initial onboarding
            // fields the rest of the flow keys off.
            const data = payload as {
              uuid: string;
              startDate: string;
              onboardingStatus: string;
            };
            const next: OnboardingContext = {
              startDate: data.startDate,
              onboardingStatus: data.onboardingStatus,
            };
            ctx?.[1](next);
            navigate(`/employee-onboarding/${data.uuid}/compensation`, {
              state: next,
            });
            break;
          }
          case componentEvents.CANCEL:
            // User dismissed the form.
            navigate("/employee-onboarding");
            break;
        }
      }}
    />
  );
}

export function Compensation() {
  const { employeeId } = useParams<"employeeId">();
  const [{ startDate, onboardingStatus }] = useOnboardingContext();
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
  const [{ onboardingStatus }] = useOnboardingContext();
  const navigate = useNavigate();
  const skipDocumentsConfig = DOCUMENTS_CONFIG_COMPLETED_STATUSES.has(
    onboardingStatus ?? "",
  );
  return (
    <EmployeeOnboarding.Deductions
      employeeId={employeeId!}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_DEDUCTION_DONE) {
          navigate(
            skipDocumentsConfig
              ? `/employee-onboarding/${employeeId}/summary`
              : `/employee-onboarding/${employeeId}/employee-documents`,
          );
        }
      }}
    />
  );
}

export function EmployeeDocuments() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeManagement.EmployeeDocuments
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
  const [, setCtx] = useOnboardingContext();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.OnboardingSummary
      employeeId={employeeId!}
      isAdmin
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEES_LIST) {
          setCtx({});
          navigate("/employee-onboarding");
        }
      }}
    />
  );
}
