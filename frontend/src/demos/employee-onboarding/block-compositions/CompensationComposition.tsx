import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { EmployeeOnboarding, componentEvents } from "@gusto/embedded-react-sdk";
import { useJobsAndCompensationsGetJobs } from "@gusto/embedded-api-v-2025-11-15/react-query/jobsAndCompensationsGetJobs";

// Fine-grained rebuild of the compensation step from its two exported sub-blocks
// (Compensation.JobsList + Compensation.EditCompensation), routed so each owns a
// URL. If you don't need this control, render <EmployeeOnboarding.Compensation />
// instead - it composes these same sub-blocks behind its own internal flow.
//
// The entry route derives the start step from live data the same way the
// all-in-one Compensation does internally, via the @gusto/embedded-api React
// Query hooks. Keep that package on the same version the SDK depends on so its
// hooks share the SDK's client and cache. The all-in-one block calls getJobs and
// routes on first mount:
//   - No jobs yet -> jump straight to the create form.
//   - Exactly one job that isn't Nonexempt (e.g. a salaried employee) -> jump
//     straight to editing that one job.
//   - Otherwise (multiple jobs, or a single Nonexempt/hourly job) -> the jobs
//     list, where roles can be added/edited.
// We reproduce that gate in CompensationEntry so the composition lands on the
// same step the turnkey component would, without the caller having to guess.

const NONEXEMPT_FLSA_STATUS = "Nonexempt";

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
          <CompensationEntry employeeId={employeeId} basePath={basePath} />
        }
      />
      <Route
        path="jobs"
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

// Picks the entry step from live job data, mirroring the routing the all-in-one
// Compensation runs internally on first mount.
function CompensationEntry({
  employeeId,
  basePath,
}: {
  employeeId: string;
  basePath: string;
}) {
  const { data, isPending } = useJobsAndCompensationsGetJobs({ employeeId });

  if (isPending) return null;

  const jobs = data?.jobs ?? [];

  if (jobs.length === 0) {
    return <Navigate to={`${basePath}/new`} replace />;
  }

  const onlyJob = jobs.length === 1 ? jobs[0] : undefined;
  const onlyJobCompensation = onlyJob?.compensations?.find(
    (comp) => comp.uuid === onlyJob.currentCompensationUuid,
  );

  if (onlyJob && onlyJobCompensation?.flsaStatus !== NONEXEMPT_FLSA_STATUS) {
    return <Navigate to={`${basePath}/edit/${onlyJob.uuid}`} replace />;
  }

  return <Navigate to={`${basePath}/jobs`} replace />;
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
      onCancel={() => navigate(`${basePath}/jobs`)}
      onEvent={(type) => {
        if (type === componentEvents.EMPLOYEE_COMPENSATION_UPDATED) {
          navigate(`${basePath}/jobs`);
        }
      }}
    />
  );
}
