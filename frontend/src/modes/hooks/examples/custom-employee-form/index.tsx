import {
  SDKFormProvider,
  useEmployeeDetailsForm,
} from "@gusto/embedded-react-sdk";
import { Route, Routes } from "react-router-dom";
import { ExampleLayout } from "../../../exampleLayout";
import { SdkBoundary } from "../../../../sdk/SdkBoundary";
import type { Example } from "../../../types";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

function Page() {
  return (
    <ExampleLayout mode="hooks" example={customEmployeeFormExample}>
      <SdkBoundary>
        <EmployeeForm />
      </SdkBoundary>
    </ExampleLayout>
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

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const result = await actions.onSubmit({
          onEmployeeCreated: (employee) => {
            console.log("created employee", employee);
          },
        });
        console.log("submit result", result);
      }}
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

export const customEmployeeFormExample: Example = {
  key: "custom-employee-form",
  label: "Build a fully custom employee form",
  path: "/hooks/custom-employee-form",
  summary:
    "useEmployeeDetailsForm + SDKFormProvider + bound Fields — no SDK-rendered chrome.",
  description:
    "The SDK hook owns the form's data, validation, and submit handler; we render the layout, copy, and Save button ourselves. Pre-bound field components from partner-hook-utils plug into our layout without touching how the form is wired. Use this pattern when you need full design control over a single form.",
  sdkPrimitives: ["useEmployeeDetailsForm", "SDKFormProvider"],
  Routes: () => (
    <Routes>
      <Route index element={<Page />} />
    </Routes>
  ),
};
