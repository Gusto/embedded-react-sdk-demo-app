import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDemoSession } from "../DemoSession";
import { useCompanyState } from "../newCompany/useCompanyState";
import { PageHeader } from "../newCompany/ui";

interface Props {
  companyUuid: string;
}

interface PayPeriod {
  start_date?: string;
  end_date?: string;
}

interface Payroll {
  payroll_uuid?: string;
  pay_period?: PayPeriod;
  check_date?: string;
  payroll_deadline?: string;
  totals?: {
    net_pay?: string;
    gross_pay?: string;
  };
}

interface Contractor {
  uuid: string;
}

// Fake finance numbers so the demo dashboard reads like a real product
// when there's nothing live to show.
const FAKE_BALANCE = 184_362.48;
const FAKE_SPEND_MONTH = 47_120.83;
const FAKE_UPCOMING_BILLS = 6_408.0;
const FAKE_ACTIVITY = [
  {
    id: "act-1",
    title: "Stripe payout",
    detail: "Daily settlement",
    amount: 12340.12,
    when: "Today",
  },
  {
    id: "act-2",
    title: "AWS",
    detail: "Compute · S3",
    amount: -823.41,
    when: "Yesterday",
  },
  {
    id: "act-3",
    title: "WeWork",
    detail: "Office rent",
    amount: -4250.0,
    when: "2 days ago",
  },
  {
    id: "act-4",
    title: "Shopify",
    detail: "Subscription",
    amount: -299.0,
    when: "3 days ago",
  },
  {
    id: "act-5",
    title: "Acme Corp",
    detail: "Invoice #2071",
    amount: 8400.0,
    when: "4 days ago",
  },
];

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

function daysUntil(value?: string): string {
  const date = parseDate(value);
  if (!date) return "—";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 0) return `${-diffDays} days ago`;
  return `In ${diffDays} days`;
}

function formatMoney(value: number | string | undefined, options?: {
  signed?: boolean;
}): string {
  const n =
    typeof value === "number" ? value : value ? parseFloat(value) : NaN;
  if (!Number.isFinite(n)) return "—";
  const formatted = Math.abs(n).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
  if (options?.signed) {
    return n >= 0 ? `+${formatted}` : `−${formatted}`;
  }
  return formatted;
}

export function ExistingCompanyDashboard({ companyUuid }: Props) {
  const { apiBaseUrl, brandName } = useDemoSession();
  const company = useCompanyState();
  const [next, setNext] = useState<Payroll | null | undefined>(undefined);
  const [recent, setRecent] = useState<Payroll[]>([]);
  const [contractorCount, setContractorCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const today = new Date();
        const future = new Date(today);
        future.setMonth(future.getMonth() + 3);
        const past = new Date(today);
        past.setMonth(past.getMonth() - 3);
        const [upcomingRes, recentRes, contractorsRes] = await Promise.all([
          fetch(
            `${apiBaseUrl}/v1/companies/${companyUuid}/payrolls?` +
              new URLSearchParams({
                start_date: today.toISOString().slice(0, 10),
                end_date: future.toISOString().slice(0, 10),
                processing_statuses: "unprocessed",
              })
          ),
          fetch(
            `${apiBaseUrl}/v1/companies/${companyUuid}/payrolls?` +
              new URLSearchParams({
                start_date: past.toISOString().slice(0, 10),
                end_date: today.toISOString().slice(0, 10),
                processing_statuses: "processed",
                include: "totals",
              })
          ),
          fetch(`${apiBaseUrl}/v1/companies/${companyUuid}/contractors`),
        ]);
        const upcoming = upcomingRes.ok
          ? ((await upcomingRes.json()) as Payroll[])
          : [];
        const recentList = recentRes.ok
          ? ((await recentRes.json()) as Payroll[])
          : [];
        const contractors = contractorsRes.ok
          ? ((await contractorsRes.json()) as Contractor[])
          : [];
        if (cancelled) return;
        setNext(upcoming[0] ?? null);
        setRecent(recentList.slice(-3).reverse());
        setContractorCount(contractors.length);
      } catch {
        if (!cancelled) {
          setNext(null);
          setRecent([]);
          setContractorCount(0);
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
        eyebrow={`Welcome to ${brandName}`}
        title="Overview"
        description="Cash, payroll, and recent activity at a glance."
      />

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <BalanceCard />
        <NextPayrollCard payroll={next} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Spending this month"
          value={formatMoney(FAKE_SPEND_MONTH)}
        />
        <Stat
          label="Upcoming bills"
          value={formatMoney(FAKE_UPCOMING_BILLS)}
          tone="amber"
        />
        <Stat
          label="Employees"
          value={company.loading ? "…" : company.employeeCount.toString()}
          to="/showcase/existing-company/payroll/people"
        />
        <Stat
          label="Contractors"
          value={contractorCount.toString()}
          to="/showcase/existing-company/payroll/people"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {recent.length > 0 ? (
        <div className="mt-6">
          <RecentPayrolls payrolls={recent} />
        </div>
      ) : null}
    </>
  );
}

function BalanceCard() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-900 p-6 text-white shadow-sm lg:col-span-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 0% 0%, rgba(99, 102, 241, 0.35), transparent 60%), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(236, 72, 153, 0.25), transparent 65%)",
        }}
      />
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-white/60">
            Operating account
          </p>
          <p className="m-0 font-mono text-xs text-white/50">•••• 4521</p>
        </div>
        <p className="m-0 text-4xl font-semibold tracking-tight">
          {formatMoney(FAKE_BALANCE)}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full bg-white px-4 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100"
          >
            Move money
          </button>
          <button
            type="button"
            className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            Statements
          </button>
        </div>
      </div>
    </section>
  );
}

function NextPayrollCard({ payroll }: { payroll: Payroll | null | undefined }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-indigo-200 bg-linear-to-br from-indigo-50 via-white to-white p-6 shadow-sm lg:col-span-2">
      <div className="flex h-full flex-col gap-4">
        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-indigo-600">
          {payroll
            ? `Next payroll · ${daysUntil(payroll.payroll_deadline)}`
            : "Payroll"}
        </p>
        {payroll ? (
          <>
            <h2 className="m-0 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              {formatPayPeriod(payroll.pay_period)}
            </h2>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3">
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
            <div className="mt-auto">
              {payroll.payroll_uuid ? (
                <Link
                  to={`/showcase/existing-company/payroll/pay-employees/${payroll.payroll_uuid}/configuration`}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-indigo-500/40"
                >
                  Run payroll <ArrowRight aria-hidden className="ml-1 h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </>
        ) : payroll === null ? (
          <p className="m-0 text-sm text-neutral-600">
            No upcoming payrolls scheduled.
          </p>
        ) : (
          <p className="m-0 text-sm text-neutral-500">Loading…</p>
        )}
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
  to,
}: {
  label: string;
  value: string;
  tone?: "neutral" | "emerald" | "amber";
  to?: string;
}) {
  const valueClasses = {
    neutral: "text-neutral-900",
    emerald: "text-emerald-700",
    amber: "text-amber-700",
  }[tone];
  const inner = (
    <div className="flex flex-col gap-1 rounded-2xl border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300">
      <p className="m-0 text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </p>
      <p className={`m-0 text-2xl font-semibold tracking-tight ${valueClasses}`}>
        {value}
      </p>
    </div>
  );
  return to ? (
    <Link to={to} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function ActivityFeed() {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white">
      <header className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
        <h3 className="m-0 text-sm font-semibold text-neutral-900">
          Recent activity
        </h3>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
        >
          See all <ArrowRight aria-hidden className="h-4 w-4" />
        </button>
      </header>
      <ul className="flex flex-col divide-y divide-neutral-100">
        {FAKE_ACTIVITY.map((item) => (
          <li key={item.id} className="flex items-center gap-4 px-5 py-3">
            <span
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                item.amount >= 0
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {item.amount >= 0 ? (
                <ArrowUp aria-hidden className="h-3.5 w-3.5" />
              ) : (
                <ArrowDown aria-hidden className="h-3.5 w-3.5" />
              )}
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="m-0 text-sm font-medium text-neutral-900">
                {item.title}
              </p>
              <p className="m-0 text-xs text-neutral-500">{item.detail}</p>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span
                className={`text-sm font-medium ${
                  item.amount >= 0 ? "text-emerald-700" : "text-neutral-900"
                }`}
              >
                {formatMoney(item.amount, { signed: true })}
              </span>
              <span className="text-xs text-neutral-500">{item.when}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function QuickActions() {
  const actions = [
    {
      label: "Send a transfer",
      hint: "Move funds between accounts",
      icon: "↗",
    },
    {
      label: "Pay a bill",
      hint: "Schedule a vendor payment",
      icon: "$",
    },
    {
      label: "Run payroll",
      hint: "Walk through the run flow",
      icon: "▶",
      to: "/showcase/existing-company/payroll/pay-employees",
    },
    {
      label: "Add an expense",
      hint: "Record a one-off charge",
      icon: "+",
    },
  ];
  return (
    <section className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white">
      <header className="border-b border-neutral-100 px-5 py-3">
        <h3 className="m-0 text-sm font-semibold text-neutral-900">
          Quick actions
        </h3>
      </header>
      <ul className="flex flex-1 flex-col">
        {actions.map((a) => {
          const inner = (
            <div className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-neutral-50">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700">
                {a.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-900">
                  {a.label}
                </span>
                <span className="text-xs text-neutral-500">{a.hint}</span>
              </div>
            </div>
          );
          return (
            <li
              key={a.label}
              className="border-b border-neutral-100 last:border-b-0"
            >
              {a.to ? (
                <Link to={a.to} className="block">
                  {inner}
                </Link>
              ) : (
                <button type="button" className="block w-full text-left cursor-pointer">
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function RecentPayrolls({ payrolls }: { payrolls: Payroll[] }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Recently processed payrolls
        </h3>
        <Link
          to="/showcase/existing-company/payroll/pay-employees"
          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
        >
          All payrolls <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <th className="px-5 py-3 text-left">Pay period</th>
              <th className="px-5 py-3 text-left">Pay day</th>
              <th className="px-5 py-3 text-right">Net pay</th>
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
                <td className="px-5 py-3 text-right font-medium text-neutral-900">
                  {formatMoney(p.totals?.net_pay)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
