import {
  SDKFormProvider,
  useEmployeeDetailsForm,
} from "@gusto/embedded-react-sdk";
import { SdkBoundary } from "../../../sdk/SdkBoundary";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

/**
 * The SDK hook (`useEmployeeDetailsForm`) must run inside a `GustoProvider`
 * context, so we wrap the hook-consuming component in `<SdkBoundary>`. The
 * page chrome itself (header, intro) lives outside the boundary so it inherits
 * our app's typography rather than the SDK's CSS variables.
 */
export function EmployeeFormPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-blue-500">
          Hooks · Employee form
        </p>
        <h1 className="m-0 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Create employee
        </h1>
        <p className="m-0 text-sm text-neutral-600 dark:text-neutral-400">
          Powered by <code className="font-mono text-xs">useEmployeeDetailsForm</code>.
        </p>
      </header>
      <SdkBoundary>
        <EmployeeForm />
      </SdkBoundary>
    </div>
  );
}

function EmployeeForm() {
  const formResult = useEmployeeDetailsForm({ companyId: COMPANY_ID });

  if (formResult.isLoading) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        Loading form…
      </div>
    );
  }

  const { form, actions } = formResult;
  const { Fields } = form;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await actions.onSubmit({
      onEmployeeCreated: (employee) => {
        console.log("created employee", employee);
      },
    });
    console.log("submit result", result);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <SDKFormProvider formHookResult={formResult}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Fields.FirstName />
          <Fields.LastName />
        </div>
        <Fields.Email />
        <Fields.DateOfBirth />
        <Fields.Ssn />
      </SDKFormProvider>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
