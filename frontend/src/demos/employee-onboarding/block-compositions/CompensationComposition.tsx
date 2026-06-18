import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { EmployeeOnboarding, componentEvents } from "@gusto/embedded-react-sdk";

// Fine-grained rebuild of the compensation step from its two exported sub-blocks
// (Compensation.JobsList + Compensation.EditCompensation), routed so each owns a
// URL. If you don't need this control, render <EmployeeOnboarding.Compensation />
// instead - it composes these same sub-blocks behind its own internal flow,
// including the initial-routing decision (jump straight to the form when the
// employee has no jobs yet) that we drive here via the create/edit entry split:
// a brand-new employee lands on `new` (see ProfileCreate), while resuming lands
// on the jobs list.

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
  const navigate = useNavigate();
  const basePath = `/employee-onboarding/${employeeId}/compensation`;

  return (
    <Routes>
      <Route
        index
        element={
          <EmployeeOnboarding.Compensation.JobsList
            employeeId={employeeId}
            onEvent={(type, payload) => {
              switch (type) {
                case componentEvents.EMPLOYEE_JOB_ADD:
                  navigate(`${basePath}/new`);
                  break;
                case componentEvents.EMPLOYEE_JOB_EDIT: {
                  const { uuid } = payload as { uuid: string };
                  navigate(`${basePath}/edit/${uuid}`);
                  break;
                }
                case componentEvents.EMPLOYEE_COMPENSATION_DONE:
                  onComplete();
                  break;
              }
            }}
          />
        }
      />
      <Route
        path="new"
        element={
          <EditJob employeeId={employeeId} startDate={startDate} basePath={basePath} />
        }
      />
      <Route
        path="edit/:jobId"
        element={
          <EditJob employeeId={employeeId} startDate={startDate} basePath={basePath} />
        }
      />
    </Routes>
  );
}

function EditJob({
  employeeId,
  startDate,
  basePath,
}: {
  employeeId: string;
  startDate: string;
  basePath: string;
}) {
  const { jobId } = useParams<"jobId">();
  const navigate = useNavigate();
  return (
    <EmployeeOnboarding.Compensation.EditCompensation
      employeeId={employeeId}
      startDate={startDate}
      currentJobId={jobId}
      title={jobId ? "Edit job" : "Add job"}
      submitCtaLabel="Save job"
      onCancel={() => navigate(basePath)}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_COMPENSATION_UPDATED) {
          navigate(basePath);
        }
      }}
    />
  );
}
