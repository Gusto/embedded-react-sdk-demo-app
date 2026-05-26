import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDemoSession } from "../DemoSession";
import { PageHeader } from "../newCompany/ui";

interface PayPeriod {
  start_date?: string;
  end_date?: string;
}

interface UpcomingPayroll {
  payroll_uuid?: string;
  pay_period?: PayPeriod;
  check_date?: string;
  payroll_deadline?: string;
  processed?: boolean;
}

// `payroll_deadline` is a full ISO datetime; other date fields are just
// `YYYY-MM-DD`. Parse both correctly without timezone surprises.
function parseDate(value?: string): Date | null {
  if (!value) return null;
  if (value.length > 10) return new Date(value);
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDate(value?: string): string {
  const date = parseDate(value);
  if (!date) return "—";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatPayPeriod(period?: PayPeriod): string {
  const start = parseDate(period?.start_date);
  const end = parseDate(period?.end_date);
  if (!start || !end) return "—";
  const sameYear = start.getFullYear() === end.getFullYear();
  const startStr = start.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
  const endStr = end.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
}

interface Props {
  companyUuid: string;
}

export function PayrollPayEmployees({ companyUuid }: Props) {
  const { apiBaseUrl } = useDemoSession();
  const [payrolls, setPayrolls] = useState<UpcomingPayroll[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const today = new Date();
        const threeMonthsOut = new Date(today);
        threeMonthsOut.setMonth(threeMonthsOut.getMonth() + 3);
        const params = new URLSearchParams({
          start_date: today.toISOString().slice(0, 10),
          end_date: threeMonthsOut.toISOString().slice(0, 10),
          processing_statuses: "unprocessed",
        });
        const response = await fetch(
          `${apiBaseUrl}/v1/companies/${companyUuid}/payrolls?${params}`
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }
        const data = (await response.json()) as UpcomingPayroll[];
        if (!cancelled) {
          setPayrolls(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setPayrolls([]);
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
        eyebrow="Payroll"
        title="Pay employees"
      />

      {error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {payrolls === null ? (
        <p className="m-0 text-sm text-neutral-500">Loading…</p>
      ) : payrolls.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
          No upcoming payrolls.
        </div>
      ) : (
        <>
          <NextPayrollCard payroll={payrolls[0]} />
          {payrolls.length > 1 ? (
            <UpcomingTable payrolls={payrolls.slice(1)} />
          ) : null}
        </>
      )}
    </>
  );
}

function NextPayrollCard({ payroll }: { payroll: UpcomingPayroll }) {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-indigo-200 bg-linear-to-br from-indigo-50 via-white to-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Next payroll
          </p>
          <h2 className="m-0 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            {formatPayPeriod(payroll.pay_period)}
          </h2>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 pt-1 sm:grid-cols-2">
            <div className="flex flex-col">
              <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Pay day
              </dt>
              <dd className="m-0 text-sm font-medium text-neutral-900">
                {formatDate(payroll.check_date)}
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Run by
              </dt>
              <dd className="m-0 text-sm font-medium text-neutral-900">
                {formatDate(payroll.payroll_deadline)}
              </dd>
            </div>
          </dl>
        </div>
        {payroll.payroll_uuid ? (
          <Link
            to={`${payroll.payroll_uuid}/configuration`}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-indigo-500/40 md:w-auto"
          >
            Run payroll <ArrowRight aria-hidden className="ml-1 h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </section>
  );
}

function UpcomingTable({ payrolls }: { payrolls: UpcomingPayroll[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="m-0 text-sm font-semibold uppercase tracking-wider text-neutral-500">
        Upcoming
      </h3>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <th className="px-5 py-3 text-left">Pay period</th>
              <th className="px-5 py-3 text-left">Pay day</th>
              <th className="px-5 py-3 text-left">Run by</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((p) => (
              <tr
                key={p.payroll_uuid}
                className="border-b border-neutral-100 last:border-b-0"
              >
                <td className="px-5 py-3 text-neutral-900">
                  {formatPayPeriod(p.pay_period)}
                </td>
                <td className="px-5 py-3 text-neutral-700">
                  {formatDate(p.check_date)}
                </td>
                <td className="px-5 py-3 text-neutral-700">
                  {formatDate(p.payroll_deadline)}
                </td>
                <td className="px-5 py-3 text-right">
                  {p.payroll_uuid ? (
                    <Link
                      to={`${p.payroll_uuid}/configuration`}
                      className="inline-flex h-8 cursor-pointer items-center rounded-full border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                    >
                      Run payroll
                    </Link>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
