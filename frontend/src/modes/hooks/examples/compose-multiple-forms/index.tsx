import {
  SDKFormProvider,
  composeSubmitHandler,
  useEmployeeDetailsForm,
  useHomeAddressForm,
} from "@gusto/embedded-react-sdk";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ExampleLayout } from "../../../exampleLayout";
import { SdkBoundary } from "../../../../sdk/SdkBoundary";
import { useToast } from "../../../../toast/ToastProvider";
import type { Example } from "../../../types";

const snippet = `import {
  SDKFormProvider,
  composeSubmitHandler,
  useEmployeeDetailsForm,
  useHomeAddressForm,
} from "@gusto/embedded-react-sdk";

function ComposedForms({ employeeId }: { employeeId: string }) {
  const detailsForm = useEmployeeDetailsForm({ employeeId });
  const addressForm = useHomeAddressForm({ employeeId });

  const { handleSubmit } = composeSubmitHandler(
    [detailsForm, addressForm],
    async () => {
      await detailsForm.actions.onSubmit();
      await addressForm.actions.onSubmit();
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <SDKFormProvider formHookResult={detailsForm}>
        <detailsForm.form.Fields.FirstName />
        <detailsForm.form.Fields.LastName />
        <detailsForm.form.Fields.Email />
      </SDKFormProvider>
      <SDKFormProvider formHookResult={addressForm}>
        <addressForm.form.Fields.Street1 />
        <addressForm.form.Fields.City />
        <addressForm.form.Fields.State />
        <addressForm.form.Fields.Zip />
      </SDKFormProvider>
      <button type="submit">Save all</button>
    </form>
  );
}
`;

function Page() {
  return (
    <ExampleLayout
      mode="hooks"
      example={composeMultipleFormsExample}
      code={[{ name: "index.tsx", source: snippet }]}
    >
      <EmployeeIdGate />
    </ExampleLayout>
  );
}

function EmployeeIdGate() {
  const [employeeId, setEmployeeId] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  if (!submitted) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (employeeId.trim()) setSubmitted(true);
        }}
        className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <p className="m-0 text-sm text-neutral-600 dark:text-neutral-400">
          Enter an existing employee id to load both their details and home
          address. (You can grab one from the Blocks · Compose payroll demo or
          from the Gusto demo API.)
        </p>
        <input
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="employee uuid"
          className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-blue-500 dark:focus:border-[#E15A43] focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 dark:bg-[#E15A43] dark:hover:bg-[#c84d39] disabled:opacity-50"
            disabled={!employeeId.trim()}
          >
            Load forms
          </button>
        </div>
      </form>
    );
  }

  return (
    <SdkBoundary>
      <ComposedForms employeeId={employeeId.trim()} />
    </SdkBoundary>
  );
}

function ComposedForms({ employeeId }: { employeeId: string }) {
  const { toast } = useToast();
  const detailsForm = useEmployeeDetailsForm({
    employeeId,
    shouldFocusError: false,
  });
  const addressForm = useHomeAddressForm({
    employeeId,
    shouldFocusError: false,
  });

  if (detailsForm.isLoading || addressForm.isLoading) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        Loading forms…
      </div>
    );
  }

  const { handleSubmit } = composeSubmitHandler(
    [detailsForm, addressForm],
    async () => {
      await detailsForm.actions.onSubmit();
      await addressForm.actions.onSubmit();
      toast({
        title: "host:composed-submit-complete",
        description: "Both forms validated and saved in one pass.",
      });
    }
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <section className="flex flex-col gap-4">
        <h3 className="m-0 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Details
        </h3>
        <SDKFormProvider formHookResult={detailsForm}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <detailsForm.form.Fields.FirstName />
            <detailsForm.form.Fields.LastName />
          </div>
          <detailsForm.form.Fields.Email />
        </SDKFormProvider>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="m-0 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Home address
        </h3>
        <SDKFormProvider formHookResult={addressForm}>
          <addressForm.form.Fields.Street1 />
          <addressForm.form.Fields.Street2 />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <addressForm.form.Fields.City />
            <addressForm.form.Fields.State />
            <addressForm.form.Fields.Zip />
          </div>
        </SDKFormProvider>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 dark:bg-[#E15A43] dark:hover:bg-[#c84d39]"
        >
          Save all
        </button>
      </div>
    </form>
  );
}

export const composeMultipleFormsExample: Example = {
  key: "compose-multiple-forms",
  label: "Compose multiple forms in one submit",
  path: "/hooks/compose-multiple-forms",
  summary:
    "Two SDK form hooks, one Save button — validate and submit them atomically.",
  description:
    "useEmployeeDetailsForm and useHomeAddressForm each manage their own data and validation, but composeSubmitHandler coordinates them so the user sees a single Save action. The handler validates both forms in parallel, focuses the first invalid field across either form, and only fires the success callback when both are clean. Reach for this when your product groups multiple SDK forms on one page.",
  sdkPrimitives: [
    "useEmployeeDetailsForm",
    "useHomeAddressForm",
    "composeSubmitHandler",
  ],
  Routes: () => (
    <Routes>
      <Route index element={<Page />} />
    </Routes>
  ),
};
