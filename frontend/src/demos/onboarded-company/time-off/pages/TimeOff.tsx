import { Link, useNavigate, useParams } from "react-router-dom";
import { TimeOff, componentEvents } from "@gusto/embedded-react-sdk";
import { COMPANY_ID } from "../../../../config";

// This demo composes the individual SDK time-off blocks behind react-router so
// each step owns a URL. For a turnkey integration, skip all of this and render
// <TimeOff.TimeOffFlow .../>, which runs the same steps inside one component.

type SickOrVacation = "sick" | "vacation";

function isSickOrVacation(value: string | undefined): value is SickOrVacation {
  return value === "sick" || value === "vacation";
}

function UnknownPolicyType() {
  return (
    <p>
      Unknown time off policy type.{" "}
      <Link to="/time-off">Back to time off policies</Link>
    </p>
  );
}

export function PolicyListPage() {
  const navigate = useNavigate();
  return (
    <TimeOff.PolicyList
      companyId={COMPANY_ID}
      onEvent={(type, payload) => {
        switch (type) {
          case componentEvents.TIME_OFF_CREATE_POLICY:
            navigate("/time-off/new");
            break;
          case componentEvents.TIME_OFF_VIEW_POLICY: {
            const { policyId, policyType } = payload as {
              policyId: string;
              policyType: string;
            };
            navigate(
              policyType === "holiday"
                ? "/time-off/holiday"
                : `/time-off/policies/${policyType}/${policyId}`,
            );
            break;
          }
        }
      }}
    />
  );
}

export function SelectPolicyType() {
  const navigate = useNavigate();
  return (
    <TimeOff.PolicyTypeSelector
      companyId={COMPANY_ID}
      onEvent={(type, payload) => {
        switch (type) {
          case componentEvents.TIME_OFF_POLICY_TYPE_SELECTED: {
            const { policyType } = payload as { policyType: string };
            navigate(
              policyType === "holiday"
                ? "/time-off/holiday/new"
                : `/time-off/new/${policyType}`,
            );
            break;
          }
          case componentEvents.CANCEL:
            navigate("/time-off");
            break;
        }
      }}
    />
  );
}

export function PolicyDetailsCreate() {
  const { policyType } = useParams<"policyType">();
  const navigate = useNavigate();
  if (!isSickOrVacation(policyType)) return <UnknownPolicyType />;
  return (
    <TimeOff.PolicyConfigurationForm
      companyId={COMPANY_ID}
      policyType={policyType}
      onEvent={(type, payload) => {
        switch (type) {
          case componentEvents.TIME_OFF_POLICY_DETAILS_DONE: {
            const { policyId, accrualMethod } = payload as {
              policyId: string;
              accrualMethod?: string;
            };
            navigate(
              accrualMethod === "unlimited"
                ? `/time-off/policies/${policyType}/${policyId}/employees/add`
                : `/time-off/policies/${policyType}/${policyId}/settings`,
            );
            break;
          }
          case componentEvents.CANCEL:
            navigate("/time-off");
            break;
        }
      }}
    />
  );
}

export function PolicySettingsCreate() {
  const { policyType, policyId } = useParams<"policyType" | "policyId">();
  const navigate = useNavigate();
  return (
    <TimeOff.PolicySettings
      policyId={policyId!}
      mode="create"
      onEvent={(type) => {
        switch (type) {
          case componentEvents.TIME_OFF_POLICY_SETTINGS_DONE:
            navigate(`/time-off/policies/${policyType}/${policyId}/employees/add`);
            break;
          case componentEvents.TIME_OFF_POLICY_SETTINGS_BACK:
            navigate(`/time-off/policies/${policyType}/${policyId}/details/edit`);
            break;
          case componentEvents.CANCEL:
            navigate("/time-off");
            break;
        }
      }}
    />
  );
}

export function AddEmployees() {
  const { policyType, policyId } = useParams<"policyType" | "policyId">();
  const navigate = useNavigate();
  if (!isSickOrVacation(policyType)) return <UnknownPolicyType />;
  return (
    <TimeOff.AddEmployeesToPolicy
      companyId={COMPANY_ID}
      policyId={policyId!}
      policyType={policyType}
      onEvent={(type) => {
        if (
          type === componentEvents.TIME_OFF_ADD_EMPLOYEES_DONE ||
          type === componentEvents.TIME_OFF_ADD_EMPLOYEES_BACK ||
          type === componentEvents.CANCEL
        ) {
          navigate(`/time-off/policies/${policyType}/${policyId}`);
        }
      }}
    />
  );
}

export function PolicyDetail() {
  const { policyType, policyId } = useParams<"policyType" | "policyId">();
  const navigate = useNavigate();
  return (
    <TimeOff.TimeOffPolicyDetail
      policyId={policyId!}
      onEvent={(type) => {
        switch (type) {
          case componentEvents.TIME_OFF_ADD_EMPLOYEES_TO_POLICY:
            navigate(`/time-off/policies/${policyType}/${policyId}/employees/add`);
            break;
          case componentEvents.TIME_OFF_EDIT_POLICY:
            navigate(`/time-off/policies/${policyType}/${policyId}/details/edit`);
            break;
          case componentEvents.TIME_OFF_CHANGE_SETTINGS:
            navigate(`/time-off/policies/${policyType}/${policyId}/settings/edit`);
            break;
          case componentEvents.TIME_OFF_BACK_TO_LIST:
            navigate("/time-off");
            break;
        }
      }}
    />
  );
}

export function PolicyDetailsEdit() {
  const { policyType, policyId } = useParams<"policyType" | "policyId">();
  const navigate = useNavigate();
  if (!isSickOrVacation(policyType)) return <UnknownPolicyType />;
  return (
    <TimeOff.PolicyConfigurationForm
      companyId={COMPANY_ID}
      policyId={policyId!}
      policyType={policyType}
      onEvent={(type) => {
        if (
          type === componentEvents.TIME_OFF_POLICY_DETAILS_DONE ||
          type === componentEvents.CANCEL
        ) {
          navigate(`/time-off/policies/${policyType}/${policyId}`);
        }
      }}
    />
  );
}

export function PolicySettingsEdit() {
  const { policyType, policyId } = useParams<"policyType" | "policyId">();
  const navigate = useNavigate();
  return (
    <TimeOff.PolicySettings
      policyId={policyId!}
      mode="edit"
      onEvent={(type) => {
        if (
          type === componentEvents.TIME_OFF_POLICY_SETTINGS_DONE ||
          type === componentEvents.TIME_OFF_POLICY_SETTINGS_BACK ||
          type === componentEvents.CANCEL
        ) {
          navigate(`/time-off/policies/${policyType}/${policyId}`);
        }
      }}
    />
  );
}

export function HolidayCreate() {
  const navigate = useNavigate();
  return (
    <TimeOff.HolidaySelectionForm
      companyId={COMPANY_ID}
      mode="create"
      onEvent={(type) => {
        switch (type) {
          case componentEvents.TIME_OFF_HOLIDAY_SELECTION_DONE:
            navigate("/time-off/holiday/employees/add");
            break;
          case componentEvents.CANCEL:
            navigate("/time-off");
            break;
        }
      }}
    />
  );
}

export function HolidayAddEmployees() {
  const navigate = useNavigate();
  return (
    <TimeOff.AddEmployeesHoliday
      companyId={COMPANY_ID}
      onEvent={(type) => {
        if (
          type === componentEvents.TIME_OFF_HOLIDAY_ADD_EMPLOYEES_DONE ||
          type === componentEvents.CANCEL
        ) {
          navigate("/time-off/holiday");
        }
      }}
    />
  );
}

export function HolidayEmployees() {
  const navigate = useNavigate();
  return (
    <TimeOff.ViewHolidayEmployees
      companyId={COMPANY_ID}
      onEvent={(type) => {
        switch (type) {
          case componentEvents.TIME_OFF_HOLIDAY_ADD_EMPLOYEES:
            navigate("/time-off/holiday/employees/add");
            break;
          case componentEvents.TIME_OFF_VIEW_HOLIDAY_SCHEDULE:
            navigate("/time-off/holiday/schedule");
            break;
          case componentEvents.TIME_OFF_EDIT_HOLIDAY_POLICY:
            navigate("/time-off/holiday/edit");
            break;
          case componentEvents.TIME_OFF_BACK_TO_LIST:
            navigate("/time-off");
            break;
        }
      }}
    />
  );
}

export function HolidaySchedule() {
  const navigate = useNavigate();
  return (
    <TimeOff.ViewHolidaySchedule
      companyId={COMPANY_ID}
      onEvent={(type) => {
        switch (type) {
          case componentEvents.TIME_OFF_VIEW_HOLIDAY_EMPLOYEES:
            navigate("/time-off/holiday");
            break;
          case componentEvents.TIME_OFF_HOLIDAY_ADD_EMPLOYEES:
            navigate("/time-off/holiday/employees/add");
            break;
          case componentEvents.TIME_OFF_EDIT_HOLIDAY_POLICY:
            navigate("/time-off/holiday/edit");
            break;
          case componentEvents.TIME_OFF_BACK_TO_LIST:
            navigate("/time-off");
            break;
        }
      }}
    />
  );
}

export function HolidayEdit() {
  const navigate = useNavigate();
  return (
    <TimeOff.HolidaySelectionForm
      companyId={COMPANY_ID}
      mode="edit"
      onEvent={(type) => {
        if (
          type === componentEvents.TIME_OFF_HOLIDAY_SELECTION_EDIT_DONE ||
          type === componentEvents.CANCEL
        ) {
          navigate("/time-off/holiday");
        }
      }}
    />
  );
}
