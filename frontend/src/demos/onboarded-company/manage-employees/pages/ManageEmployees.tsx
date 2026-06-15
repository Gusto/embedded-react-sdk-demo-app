import { Link, useNavigate, useParams } from "react-router-dom";
import { EmployeeManagement, EmployeeOnboarding, componentEvents } from "@gusto/embedded-react-sdk";
import { COMPANY_ID } from "../../../../config";
import styles from "./ManageEmployees.module.css";

// Recreates <EmployeeManagement.DashboardFlow /> as routed blocks: the dashboard
// tabs become URLs, each tab's cards emit an edit event that navigates to a
// manage route rendering the matching edit-form block.

export function EmployeeListPage() {
  const navigate = useNavigate();
  return (
    <EmployeeManagement.EmployeeList
      companyId={COMPANY_ID}
      onEvent={(type, payload) => {
        switch (type) {
          case componentEvents.EMPLOYEE_UPDATE: {
            const { employeeId } = payload as { employeeId: string };
            navigate(`/employees/${employeeId}/basic-details`);
            break;
          }
          case componentEvents.EMPLOYEE_CREATE:
            navigate("/employees/new");
            break;
          case componentEvents.EMPLOYEE_DISMISS: {
            const { employeeId } = payload as { employeeId: string };
            navigate(`/employees/terminations/${employeeId}`);
            break;
          }
        }
      }}
    />
  );
}

// OnboardingExecutionFlow (not OnboardingFlow) starts at the profile step
// rather than rendering its own employee list, since this list is the entry.
// For a routed, per-step version, see frontend/src/demos/employee-onboarding.
export function AddEmployee() {
  const navigate = useNavigate();
  return (
    <>
      <Link to="/employees" className={styles.backLink}>
        <span aria-hidden="true">&larr;</span>Back to employees
      </Link>
      <EmployeeOnboarding.OnboardingExecutionFlow
        companyId={COMPANY_ID}
        onEvent={(type) => {
          if (
            type === componentEvents.EMPLOYEES_LIST ||
            type === componentEvents.CANCEL
          ) {
            navigate("/employees");
          }
        }}
      />
    </>
  );
}

export function BasicDetailsTab() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  const onEvent = (type: string) => {
    switch (type) {
      case componentEvents.EMPLOYEE_MANAGEMENT_PROFILE_EDIT_REQUESTED:
        navigate(`/employees/${employeeId}/profile/edit`);
        break;
      case componentEvents.EMPLOYEE_MANAGEMENT_HOME_ADDRESS_EDIT_REQUESTED:
        navigate(`/employees/${employeeId}/home-address/edit`);
        break;
      case componentEvents.EMPLOYEE_MANAGEMENT_WORK_ADDRESS_EDIT_REQUESTED:
        navigate(`/employees/${employeeId}/work-address/edit`);
        break;
    }
  };
  return (
    <>
      <EmployeeManagement.ProfileCard employeeId={employeeId!} onEvent={onEvent} />
      <EmployeeManagement.HomeAddressCard employeeId={employeeId!} onEvent={onEvent} />
      <EmployeeManagement.WorkAddressCard employeeId={employeeId!} onEvent={onEvent} />
    </>
  );
}

export function JobAndPayTab() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  const onEvent = (type: string, payload: unknown) => {
    switch (type) {
      case componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_CARD_ADD_REQUESTED:
        navigate(`/employees/${employeeId}/compensation/add`);
        break;
      case componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_CARD_ADD_ANOTHER_REQUESTED:
        navigate(`/employees/${employeeId}/compensation/add-another`);
        break;
      case componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_CARD_EDIT_REQUESTED: {
        const { jobId } = payload as { jobId: string };
        navigate(`/employees/${employeeId}/compensation/${jobId}/edit`);
        break;
      }
      case componentEvents.EMPLOYEE_MANAGEMENT_PAYMENT_METHOD_CARD_ADD_REQUESTED:
        navigate(`/employees/${employeeId}/payment-method/add`);
        break;
      case componentEvents.EMPLOYEE_MANAGEMENT_PAYMENT_METHOD_CARD_SPLIT_REQUESTED:
        navigate(`/employees/${employeeId}/payment-method/split`);
        break;
      case componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_CARD_ADD_REQUESTED:
        navigate(`/employees/${employeeId}/deductions/add`);
        break;
      case componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_CARD_EDIT_REQUESTED: {
        const { uuid } = payload as { uuid: string };
        navigate(`/employees/${employeeId}/deductions/${uuid}/edit`);
        break;
      }
    }
  };
  return (
    <>
      <EmployeeManagement.CompensationCard employeeId={employeeId!} onEvent={onEvent} />
      <EmployeeManagement.PaymentMethodCard employeeId={employeeId!} onEvent={onEvent} />
      <EmployeeManagement.DeductionsCard employeeId={employeeId!} onEvent={onEvent} />
      <EmployeeManagement.PaystubsCard employeeId={employeeId!} onEvent={() => {}} />
    </>
  );
}

export function TaxesTab() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  const onEvent = (type: string) => {
    switch (type) {
      case componentEvents.EMPLOYEE_MANAGEMENT_FEDERAL_TAXES_CARD_EDIT_REQUESTED:
        navigate(`/employees/${employeeId}/federal-taxes/edit`);
        break;
      case componentEvents.EMPLOYEE_MANAGEMENT_STATE_TAXES_EDIT_REQUESTED:
        navigate(`/employees/${employeeId}/state-taxes/edit`);
        break;
    }
  };
  return (
    <>
      <EmployeeManagement.FederalTaxesCard employeeId={employeeId!} onEvent={onEvent} />
      <EmployeeManagement.StateTaxesCard employeeId={employeeId!} onEvent={onEvent} />
    </>
  );
}

export function DocumentsTab() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeManagement.DocumentsCard
      employeeId={employeeId!}
      onEvent={(type, payload) => {
        if (type === componentEvents.EMPLOYEE_MANAGEMENT_DOCUMENTS_CARD_VIEW_REQUESTED) {
          const { formId } = payload as { formId: string };
          navigate(`/employees/${employeeId}/documents/${formId}`);
        }
      }}
    />
  );
}

export function ProfileEdit() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  const backToBasicDetails = () =>
    navigate(`/employees/${employeeId}/basic-details`);
  return (
    <EmployeeManagement.ProfileEditForm
      employeeId={employeeId!}
      onEvent={(type) => {
        if (
          type === componentEvents.EMPLOYEE_MANAGEMENT_PROFILE_UPDATED ||
          type === componentEvents.EMPLOYEE_MANAGEMENT_PROFILE_EDIT_CANCELLED
        ) {
          backToBasicDetails();
        }
      }}
    />
  );
}

export function HomeAddressEdit() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeManagement.HomeAddressEditForm
      employeeId={employeeId!}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_MANAGEMENT_HOME_ADDRESS_EDIT_CANCELLED) {
          navigate(`/employees/${employeeId}/basic-details`);
        }
      }}
    />
  );
}

export function WorkAddressEdit() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeManagement.WorkAddressEditForm
      employeeId={employeeId!}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_MANAGEMENT_WORK_ADDRESS_EDIT_CANCELLED) {
          navigate(`/employees/${employeeId}/basic-details`);
        }
      }}
    />
  );
}

export function FederalTaxesEdit() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeManagement.FederalTaxesEditForm
      employeeId={employeeId!}
      onEvent={(type) => {
        if (
          type === componentEvents.EMPLOYEE_MANAGEMENT_FEDERAL_TAXES_EDIT_FORM_SUBMITTED ||
          type === componentEvents.EMPLOYEE_MANAGEMENT_FEDERAL_TAXES_EDIT_FORM_CANCELLED
        ) {
          navigate(`/employees/${employeeId}/taxes`);
        }
      }}
    />
  );
}

export function StateTaxesEdit() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeManagement.StateTaxesEditForm
      employeeId={employeeId!}
      onEvent={(type) => {
        if (
          type === componentEvents.EMPLOYEE_MANAGEMENT_STATE_TAXES_UPDATED ||
          type === componentEvents.EMPLOYEE_MANAGEMENT_STATE_TAXES_EDIT_CANCELLED
        ) {
          navigate(`/employees/${employeeId}/taxes`);
        }
      }}
    />
  );
}

export function PaymentMethodAdd() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeManagement.PaymentMethodBankForm
      employeeId={employeeId!}
      onEvent={(type) => {
        if (
          type === componentEvents.EMPLOYEE_MANAGEMENT_PAYMENT_METHOD_BANK_FORM_SUBMITTED ||
          type === componentEvents.EMPLOYEE_MANAGEMENT_PAYMENT_METHOD_BANK_FORM_CANCELLED
        ) {
          navigate(`/employees/${employeeId}/job-and-pay`);
        }
      }}
    />
  );
}

export function PaymentMethodSplit() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeManagement.PaymentMethodSplitForm
      employeeId={employeeId!}
      onEvent={(type) => {
        if (
          type === componentEvents.EMPLOYEE_MANAGEMENT_PAYMENT_METHOD_SPLIT_FORM_SUBMITTED ||
          type === componentEvents.EMPLOYEE_MANAGEMENT_PAYMENT_METHOD_SPLIT_FORM_CANCELLED
        ) {
          navigate(`/employees/${employeeId}/job-and-pay`);
        }
      }}
    />
  );
}

export function DocumentView() {
  const { employeeId, formId } = useParams<"employeeId" | "formId">();
  const navigate = useNavigate();
  return (
    <EmployeeManagement.DocumentManager
      employeeId={employeeId!}
      formId={formId!}
      onEvent={(type) => {
        if (type === componentEvents.CANCEL) {
          navigate(`/employees/${employeeId}/documents`);
        }
      }}
    />
  );
}

export function CompensationAdd() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeManagement.CompensationAddJobForm
      employeeId={employeeId!}
      onEvent={(type) => {
        if (
          type === componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_ADD_JOB_FORM_SUBMITTED ||
          type === componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_ADD_JOB_FORM_CANCELLED
        ) {
          navigate(`/employees/${employeeId}/job-and-pay`);
        }
      }}
    />
  );
}

export function CompensationAddAnother() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeManagement.CompensationAddAnotherJobForm
      employeeId={employeeId!}
      onEvent={(type) => {
        if (
          type === componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_ADD_ANOTHER_JOB_FORM_SUBMITTED ||
          type === componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_ADD_ANOTHER_JOB_FORM_CANCELLED
        ) {
          navigate(`/employees/${employeeId}/job-and-pay`);
        }
      }}
    />
  );
}

export function CompensationEdit() {
  const { employeeId, jobId } = useParams<"employeeId" | "jobId">();
  const navigate = useNavigate();
  return (
    <EmployeeManagement.CompensationEditForm
      employeeId={employeeId!}
      jobId={jobId!}
      onEvent={(type) => {
        if (
          type === componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_EDIT_FORM_SUBMITTED ||
          type === componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_EDIT_FORM_CANCELLED
        ) {
          navigate(`/employees/${employeeId}/job-and-pay`);
        }
      }}
    />
  );
}

export function DeductionAdd() {
  const { employeeId } = useParams<"employeeId">();
  const navigate = useNavigate();
  return (
    <EmployeeManagement.DeductionsEditForm
      employeeId={employeeId!}
      onEvent={(type) => {
        if (
          type === componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_EDIT_FORM_CREATED ||
          type === componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_EDIT_FORM_UPDATED ||
          type === componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_EDIT_FORM_CANCELLED
        ) {
          navigate(`/employees/${employeeId}/job-and-pay`);
        }
      }}
    />
  );
}

export function DeductionEdit() {
  const { employeeId, deductionId } = useParams<"employeeId" | "deductionId">();
  const navigate = useNavigate();
  return (
    <EmployeeManagement.DeductionsEditForm
      employeeId={employeeId!}
      editingDeductionId={deductionId!}
      onEvent={(type) => {
        if (
          type === componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_EDIT_FORM_CREATED ||
          type === componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_EDIT_FORM_UPDATED ||
          type === componentEvents.EMPLOYEE_MANAGEMENT_DEDUCTIONS_EDIT_FORM_CANCELLED
        ) {
          navigate(`/employees/${employeeId}/job-and-pay`);
        }
      }}
    />
  );
}
