import { type Dispatch, type SetStateAction } from "react";
import {
  Outlet,
  useMatch,
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

// When onboardingStatus is in this set, the admin flow skips federal taxes,
// state taxes, and payment method after compensation — those steps are
// filled in by the employee themselves.
const SELF_ONBOARDING_STATUSES = new Set([
  "self_onboarding_invited",
  "self_onboarding_invited_started",
  "self_onboarding_invited_overdue",
  "self_onboarding_pending_invite",
]);

// When onboardingStatus is in this set, deductions routes straight to summary,
// skipping the EmployeeDocuments (I-9) step — onboarding is already complete
// or awaiting admin review. Mirrors the SDK's employeeDocumentsGuard.
const DOCUMENTS_CONFIG_COMPLETED_STATUSES = new Set([
  "self_onboarding_completed_by_employee",
  "self_onboarding_awaiting_admin_review",
  "onboarding_completed",
]);

// Cross-step state: `startDate` (required by Compensation) and
// `onboardingStatus` (drives the self-onboarding and I-9 skip branches).
type OnboardingContext = {
  startDate?: string;
  onboardingStatus?: string;
};

type OnboardingContextValue = [
  OnboardingContext,
  Dispatch<SetStateAction<OnboardingContext>>,
];

const ONBOARDING_STORAGE_PREFIX = "gusto-demo-employee-onboarding:";

// `OnboardingFlow` is the layout route at /employee-onboarding. It owns the
// cross-step state for an in-progress employee onboarding.
//
// `useMatch` is used (not `useParams`) because as the layout route element,
// this component only sees its own segment's params; `:employeeId` lives on
// descendant routes.
export function OnboardingFlow() {
  const match = useMatch("/employee-onboarding/:employeeId/*");
  const storageKey = match?.params.employeeId
    ? `${ONBOARDING_STORAGE_PREFIX}${match.params.employeeId}`
    : null;

  const [ctx, setCtx] = usePersistedState<OnboardingContext>(storageKey, {});

  const value: OnboardingContextValue = [ctx, setCtx];
  return (
    <CenteredPage>
      <Outlet context={value} />
    </CenteredPage>
  );
}

function useOnboardingContext() {
  return useOutletContext<OnboardingContextValue>();
}

export function EmployeeList() {
  const [, setCtx] = useOnboardingContext();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.EmployeeList
      companyId={COMPANY_ID}
      onEvent={(type, payload) => {
        if (type === componentEvents.EMPLOYEE_CREATE) {
          setCtx({});
          navigate("/employee-onboarding/new/profile");
        }
        if (type === componentEvents.EMPLOYEE_UPDATE) {
          const data = payload as {
            employeeId: string;
            onboardingStatus: string;
          };
          setCtx({ onboardingStatus: data.onboardingStatus });
          navigate(`/employee-onboarding/${data.employeeId}/profile`);
        }
      }}
    />
  );
}

export function Profile() {
  const { employeeId } = useParams<{ employeeId?: string }>();
  const [, setCtx] = useOnboardingContext();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.Profile
      companyId={COMPANY_ID}
      employeeId={employeeId}
      isAdmin
      isSelfOnboardingEnabled
      onEvent={(type, payload) => {
        if (type === componentEvents.EMPLOYEE_PROFILE_DONE) {
          const data = payload as {
            uuid: string;
            startDate: string;
            onboardingStatus: string;
          };
          setCtx({
            startDate: data.startDate,
            onboardingStatus: data.onboardingStatus,
          });
          navigate(`/employee-onboarding/${data.uuid}/compensation`);
        }
        if (type === componentEvents.CANCEL) navigate("/employee-onboarding");
      }}
    />
  );
}

export function Compensation() {
  const { employeeId } = useParams<{ employeeId: string }>();
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
  const { employeeId } = useParams<{ employeeId: string }>();
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
  const { employeeId } = useParams<{ employeeId: string }>();
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
  const { employeeId } = useParams<{ employeeId: string }>();
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
  const { employeeId } = useParams<{ employeeId: string }>();
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

// Currently exported under EmployeeManagement (deprecated); will move to
// EmployeeOnboarding.EmployeeDocuments in a future SDK release.
export function EmployeeDocuments() {
  const { employeeId } = useParams<{ employeeId: string }>();
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
  const { employeeId } = useParams<{ employeeId: string }>();
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
