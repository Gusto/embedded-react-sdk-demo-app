import { EmployeeOnboarding, componentEvents } from "@gusto/embedded-react-sdk";

// SDK 0.51.0+ removed Compensation.JobsList and Compensation.EditCompensation from
// the public API as part of consolidating form-hook patterns. The turnkey
// Compensation component now handles routing internally. If you need finer control,
// use the compensation hooks (useCompensationForm, etc.) directly to build custom
// forms. This wrapper delegates to the all-in-one component.

type CompensationCompositionProps = {
  employeeId: string;
  startDate: string;
  onComplete: () => void;
};

export function CompensationComposition({
  employeeId,
  startDate,
  onComplete,
}: CompensationCompositionProps) {
  return (
    <EmployeeOnboarding.Compensation
      employeeId={employeeId}
      startDate={startDate}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_COMPENSATION_DONE) {
          onComplete();
        }
      }}
    />
  );
}
