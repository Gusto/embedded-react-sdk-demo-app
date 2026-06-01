import {
  useFederalTaxesForm,
  SDKFormProvider,
  type UseFederalTaxesFormReady,
} from "@gusto/embedded-react-sdk";

// Replace with the UUID of an existing employee in your company.
const EMPLOYEE_ID = "replace-with-your-employee-id";

export default function FederalTaxes() {
  const federalTaxes = useFederalTaxesForm({ employeeId: EMPLOYEE_ID });

  if (federalTaxes.isLoading) {
    return <p>Loading...</p>;
  }

  return <Form federalTaxes={federalTaxes} />;
}

function Form({ federalTaxes }: { federalTaxes: UseFederalTaxesFormReady }) {
  const { Fields } = federalTaxes.form;

  return (
    <SDKFormProvider formHookResult={federalTaxes}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void federalTaxes.actions.onSubmit();
        }}
      >
        {federalTaxes.errorHandling.errors.length > 0 && (
          <div role="alert">
            {federalTaxes.errorHandling.errors.map((error, index) => (
              <p key={index}>{error.message}</p>
            ))}
          </div>
        )}

        <Fields.FilingStatus
          label="Federal filing status"
          placeholder="Select filing status..."
          validationMessages={{ REQUIRED: "Please select filing status" }}
        />
        <Fields.TwoJobs
          label="Multiple jobs (Step 2c)"
          validationMessages={{ REQUIRED: "Please select an option" }}
        />
        <Fields.DependentsAmount
          label="Dependents (Step 3)"
          validationMessages={{ REQUIRED: "This field is required" }}
        />
        <Fields.OtherIncome
          label="Other income (Step 4a)"
          validationMessages={{ REQUIRED: "This field is required" }}
        />
        <Fields.Deductions
          label="Deductions (Step 4b)"
          validationMessages={{ REQUIRED: "This field is required" }}
        />
        <Fields.ExtraWithholding
          label="Extra withholding (Step 4c)"
          validationMessages={{ REQUIRED: "This field is required" }}
        />

        <button type="submit" disabled={federalTaxes.status.isPending}>
          Save
        </button>
      </form>
    </SDKFormProvider>
  );
}
