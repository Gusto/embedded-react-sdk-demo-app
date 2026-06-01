import {
  useCurrentHomeAddressForm,
  SDKFormProvider,
  type UseHomeAddressFormReady,
} from "@gusto/embedded-react-sdk";

// Replace with the UUID of an existing employee in your company.
const EMPLOYEE_ID = "replace-with-your-employee-id";

export default function HomeAddress() {
  const homeAddress = useCurrentHomeAddressForm({
    employeeId: EMPLOYEE_ID,
  });

  if (homeAddress.isLoading) {
    return <p>Loading...</p>;
  }

  return <Form homeAddress={homeAddress} />;
}

function Form({ homeAddress }: { homeAddress: UseHomeAddressFormReady }) {
  const { Fields } = homeAddress.form;

  return (
    <SDKFormProvider formHookResult={homeAddress}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void homeAddress.actions.onSubmit();
        }}
      >
        {homeAddress.errorHandling.errors.length > 0 && (
          <div role="alert">
            {homeAddress.errorHandling.errors.map((error, index) => (
              <p key={index}>{error.message}</p>
            ))}
          </div>
        )}

        <Fields.Street1
          label="Street address"
          validationMessages={{ REQUIRED: "Street address is required" }}
        />
        <Fields.Street2 label="Apt, suite, etc. (optional)" />
        <Fields.City
          label="City"
          validationMessages={{ REQUIRED: "City is required" }}
        />
        <Fields.State
          label="State"
          validationMessages={{ REQUIRED: "State is required" }}
        />
        <Fields.Zip
          label="ZIP code"
          validationMessages={{
            REQUIRED: "ZIP code is required",
            INVALID_ZIP: "Enter a valid ZIP code",
          }}
        />
        {Fields.EffectiveDate && (
          <Fields.EffectiveDate
            label="Effective date"
            validationMessages={{ REQUIRED: "Effective date is required" }}
          />
        )}

        <button type="submit" disabled={homeAddress.status.isPending}>
          {homeAddress.status.mode === "create"
            ? "Add home address"
            : "Save changes"}
        </button>
      </form>
    </SDKFormProvider>
  );
}
