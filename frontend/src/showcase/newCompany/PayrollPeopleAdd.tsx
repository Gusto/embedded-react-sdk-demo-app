import { Link, useNavigate } from "react-router-dom";
import { useDemoSession } from "../DemoSession";
import { EmployeeOnboardingBlocks } from "./EmployeeOnboardingBlocks";
import { useDemoToast } from "./demoToast";
import { PageHeader } from "./ui";

interface Props {
  companyUuid: string;
}

export function PayrollPeopleAdd({ companyUuid }: Props) {
  const navigate = useNavigate();
  const { toast } = useDemoToast();
  const { basePath } = useDemoSession();

  return (
    <>
      <Link
        to={`${basePath}/payroll/people`}
        className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        ← Back to People
      </Link>
      <PageHeader
        eyebrow="People"
        title="Add an employee"
        description="Walk through the onboarding steps to add a new team member."
      />
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <EmployeeOnboardingBlocks
          companyUuid={companyUuid}
          onDone={() => {
            toast("Employee added");
            navigate(`${basePath}/payroll/people`);
          }}
        />
      </div>
    </>
  );
}
