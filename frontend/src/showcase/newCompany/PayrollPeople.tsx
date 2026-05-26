import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDemoSession } from "../DemoSession";
import { PageHeader } from "./ui";

interface Props {
  companyUuid: string;
}

interface Employee {
  uuid: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  onboarded?: boolean;
  onboarding_status?: string;
}

interface Contractor {
  uuid: string;
  first_name?: string;
  last_name?: string;
  business_name?: string;
  email?: string;
  type?: "Individual" | "Business";
  onboarding_status?: string;
}

type Tab = "employees" | "contractors";

const STATUS_LABELS: Record<string, { label: string; tone: ToneKey }> = {
  onboarding_completed: { label: "Onboarded", tone: "emerald" },
  admin_onboarding_incomplete: {
    label: "Admin onboarding · incomplete",
    tone: "amber",
  },
  admin_onboarding_review: {
    label: "Admin onboarding · review",
    tone: "amber",
  },
  self_onboarding_pending_invite: {
    label: "Awaiting invite",
    tone: "neutral",
  },
  self_onboarding_invited: { label: "Invited", tone: "indigo" },
  self_onboarding_completed_by_employee: {
    label: "Awaiting your review",
    tone: "amber",
  },
};

type ToneKey = "emerald" | "amber" | "neutral" | "indigo";

const TONE_CLASSES: Record<ToneKey, string> = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  neutral: "border-neutral-200 bg-neutral-50 text-neutral-700",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
};

function humanize(status?: string) {
  if (!status) return { label: "Unknown", tone: "neutral" as ToneKey };
  return (
    STATUS_LABELS[status] ?? {
      label: status.replace(/_/g, " "),
      tone: "neutral" as ToneKey,
    }
  );
}

export function PayrollPeople({ companyUuid }: Props) {
  const { apiBaseUrl, basePath } = useDemoSession();
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [contractors, setContractors] = useState<Contractor[] | null>(null);
  const [tab, setTab] = useState<Tab>("employees");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [empRes, conRes] = await Promise.all([
          fetch(`${apiBaseUrl}/v1/companies/${companyUuid}/employees`),
          fetch(`${apiBaseUrl}/v1/companies/${companyUuid}/contractors`),
        ]);
        const empData = empRes.ok ? ((await empRes.json()) as Employee[]) : [];
        const conData = conRes.ok ? ((await conRes.json()) as Contractor[]) : [];
        if (!cancelled) {
          setEmployees(empData);
          setContractors(conData);
        }
      } catch {
        if (!cancelled) {
          setEmployees([]);
          setContractors([]);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, companyUuid]);

  return (
    <>
      <PageHeader
        eyebrow="People"
        title="Your team"
        action={
          tab === "employees" ? (
            <Link
              to={`${basePath}/payroll/people/add`}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-indigo-500/40"
            >
              Add employee
            </Link>
          ) : (
            <button
              type="button"
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-indigo-500/40"
            >
              Add contractor
            </button>
          )
        }
      />

      <Tabs
        tab={tab}
        onChange={setTab}
        employeesCount={employees?.length}
        contractorsCount={contractors?.length}
      />

      {tab === "employees" ? (
        <EmployeesTable employees={employees} />
      ) : (
        <ContractorsTable contractors={contractors} />
      )}
    </>
  );
}

function Tabs({
  tab,
  onChange,
  employeesCount,
  contractorsCount,
}: {
  tab: Tab;
  onChange: (next: Tab) => void;
  employeesCount?: number;
  contractorsCount?: number;
}) {
  return (
    <div className="mb-4 flex items-center gap-1 border-b border-neutral-200">
      <TabButton
        label="Employees"
        active={tab === "employees"}
        count={employeesCount}
        onClick={() => onChange("employees")}
      />
      <TabButton
        label="Contractors"
        active={tab === "contractors"}
        count={contractorsCount}
        onClick={() => onChange("contractors")}
      />
    </div>
  );
}

function TabButton({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative -mb-px inline-flex h-10 cursor-pointer items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors ${
        active
          ? "border-indigo-500 text-neutral-900"
          : "border-transparent text-neutral-500 hover:text-neutral-900"
      }`}
    >
      {label}
      {typeof count === "number" ? (
        <span
          className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-medium ${
            active
              ? "bg-indigo-100 text-indigo-700"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

function EmployeesTable({ employees }: { employees: Employee[] | null }) {
  if (employees === null) {
    return <p className="m-0 text-sm text-neutral-500">Loading…</p>;
  }
  if (employees.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
        No employees yet.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            <th className="w-2/5 px-5 py-3 text-left">Name</th>
            <th className="w-2/5 px-5 py-3 text-left">Email</th>
            <th className="w-1/5 px-5 py-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const status = humanize(emp.onboarding_status);
            return (
              <tr
                key={emp.uuid}
                className="border-b border-neutral-100 last:border-b-0"
              >
                <td className="px-5 py-3 text-neutral-900">
                  {`${emp.first_name ?? ""} ${emp.last_name ?? ""}`.trim() ||
                    "—"}
                </td>
                <td className="px-5 py-3 truncate text-neutral-600">
                  {emp.email ?? "—"}
                </td>
                <td className="px-5 py-3 text-right">
                  <span
                    className={`inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-medium ${TONE_CLASSES[status.tone]}`}
                  >
                    {status.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ContractorsTable({ contractors }: { contractors: Contractor[] | null }) {
  if (contractors === null) {
    return <p className="m-0 text-sm text-neutral-500">Loading…</p>;
  }
  if (contractors.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
        No contractors yet.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            <th className="w-2/5 px-5 py-3 text-left">Name</th>
            <th className="w-1/5 px-5 py-3 text-left">Type</th>
            <th className="w-1/5 px-5 py-3 text-left">Email</th>
            <th className="w-1/5 px-5 py-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {contractors.map((c) => {
            const status = humanize(c.onboarding_status);
            const name =
              c.type === "Business"
                ? c.business_name ?? "—"
                : `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim() || "—";
            return (
              <tr
                key={c.uuid}
                className="border-b border-neutral-100 last:border-b-0"
              >
                <td className="px-5 py-3 text-neutral-900">{name}</td>
                <td className="px-5 py-3 text-neutral-700">
                  {c.type ?? "—"}
                </td>
                <td className="px-5 py-3 truncate text-neutral-600">
                  {c.email ?? "—"}
                </td>
                <td className="px-5 py-3 text-right">
                  <span
                    className={`inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-medium ${TONE_CLASSES[status.tone]}`}
                  >
                    {status.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
