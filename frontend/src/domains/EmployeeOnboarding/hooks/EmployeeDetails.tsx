import {
  useEmployeeDetailsForm,
  SDKFormProvider,
  type UseEmployeeDetailsFormReady,
} from "@gusto/embedded-react-sdk";
import { COMPANY_ID } from "../../../config";

export default function EmployeeDetails() {
  const employeeDetails = useEmployeeDetailsForm({ companyId: COMPANY_ID });

  if (employeeDetails.isLoading) {
    return <p>Loading...</p>;
  }

  return <Form employeeDetails={employeeDetails} />;
}

function Form({
  employeeDetails,
}: {
  employeeDetails: UseEmployeeDetailsFormReady;
}) {
  const { Fields } = employeeDetails.form;

  return (
    <SDKFormProvider formHookResult={employeeDetails}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void employeeDetails.actions.onSubmit();
        }}
      >
        {employeeDetails.errorHandling.errors.length > 0 && (
          <div role="alert">
            {employeeDetails.errorHandling.errors.map((error, index) => (
              <p key={index}>{error.message}</p>
            ))}
          </div>
        )}

        <Fields.FirstName
          label="First name"
          validationMessages={{
            REQUIRED: "First name is required",
            INVALID_NAME: "Enter a valid first name",
          }}
        />
        <Fields.MiddleInitial label="Middle initial" />
        <Fields.LastName
          label="Last name"
          validationMessages={{
            REQUIRED: "Last name is required",
            INVALID_NAME: "Enter a valid last name",
          }}
        />
        <Fields.Email
          label="Personal email"
          validationMessages={{
            REQUIRED: "Email is required",
            INVALID_EMAIL: "Enter a valid email address",
            EMAIL_REQUIRED_FOR_SELF_ONBOARDING:
              "Email is required when self-onboarding is enabled",
          }}
        />
        <Fields.DateOfBirth
          label="Date of birth"
          validationMessages={{ REQUIRED: "Date of birth is required" }}
        />
        <Fields.Ssn
          label="Social Security number"
          validationMessages={{
            INVALID_SSN: "Enter a valid Social Security number",
          }}
        />

        <button type="submit" disabled={employeeDetails.status.isPending}>
          {employeeDetails.status.mode === "create"
            ? "Add employee"
            : "Save changes"}
        </button>
      </form>
    </SDKFormProvider>
  );
}
