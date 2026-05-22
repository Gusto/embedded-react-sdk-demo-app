import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../toast/ToastProvider";

const COMPANY_ID = "91b95861-9a2b-4f3e-afe7-92d57056449c";

// Raw Gusto API response shape (snake_case wire format). The SDK normally
// deserializes this into a camelCase TypeScript model, but here we're calling
// the endpoint directly and parsing the JSON ourselves.
interface ApiPayroll {
  uuid?: string;
  payroll_uuid?: string;
  processed?: boolean;
  pay_period?: {
    start_date?: string;
    end_date?: string;
  };
  payroll_deadline?: string;
  check_date?: string;
}

/**
 * Parse a Gusto date field. `pay_period.*` and `check_date` come back as
 * `YYYY-MM-DD` (treat as local time to avoid UTC midnight shifting back a
 * day in negative-offset timezones). `payroll_deadline` is a full ISO
 * datetime with offset, which `new Date()` handles natively.
 */
function parseIsoDate(iso: string | undefined | null): Date | null {
  if (!iso) return null;
  // Date-only: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [year, month, day] = iso.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

const monthDayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatPayPeriod(
  startIso: string | undefined,
  endIso: string | undefined
): string {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  if (!start || !end) return "—";
  const year = end.getFullYear();
  if (start.getFullYear() === end.getFullYear()) {
    return `${monthDayFormatter.format(start)} – ${monthDayFormatter.format(end)}, ${year}`;
  }
  // Cross-year pay periods are rare but format them defensively.
  return `${monthDayFormatter.format(start)}, ${start.getFullYear()} – ${monthDayFormatter.format(end)}, ${year}`;
}

function formatFullDate(iso: string | undefined): string {
  const d = parseIsoDate(iso);
  return d ? fullDateFormatter.format(d) : "—";
}

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; payrolls: ApiPayroll[] };

export function PayrollListPage() {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    // The payrolls endpoint requires start_date / end_date and the API caps
    // end_date at 3 months in the future. Defaults would return an empty list.
    const now = new Date();
    const threeMonthsOut = new Date(now);
    threeMonthsOut.setMonth(threeMonthsOut.getMonth() + 3);
    const toIso = (d: Date) => d.toISOString().slice(0, 10);
    const params = new URLSearchParams({
      start_date: toIso(now),
      end_date: toIso(threeMonthsOut),
      processing_statuses: "unprocessed",
    });
    fetch(
      `http://localhost:3001/v1/companies/${COMPANY_ID}/payrolls?${params.toString()}`
    )
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`HTTP ${res.status} — ${body || "no body"}`);
        }
        const data = (await res.json()) as ApiPayroll[];
        if (!cancelled) setState({ status: "ready", payrolls: data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : String(err),
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        Loading payrolls from the API…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        Failed to load payrolls: {state.message}
      </div>
    );
  }

  const unprocessed = state.payrolls.filter((p) => !p.processed);

  if (unprocessed.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        No unprocessed payrolls. Try the workflows demo to create one.
      </div>
    );
  }

  const [nextPayroll, ...remaining] = unprocessed;
  const nextId = nextPayroll.payroll_uuid ?? nextPayroll.uuid;

  const handleRowClick = (id: string) => {
    toast({
      title: "host:row-clicked",
      description: (
        <>
          Routing to{" "}
          <code className="font-mono text-xs">Payroll.PayrollConfiguration</code>{" "}
          for payroll id ={" "}
          <span className="font-mono text-xs">{id}</span>
        </>
      ),
    });
    navigate(id);
  };

  return (
    <div className="flex flex-col gap-8">
      {nextId ? (
        <section className="relative overflow-hidden rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50 via-white to-white p-5 shadow-sm sm:p-8 dark:border-blue-900 dark:from-blue-950/40 dark:via-neutral-900 dark:to-neutral-900">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-3">
              <p className="m-0 text-xs font-semibold uppercase tracking-wider text-blue-500 dark:text-[#E15A43]">
                Next payroll
              </p>
              <h2 className="m-0 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
                {formatPayPeriod(
                  nextPayroll.pay_period?.start_date,
                  nextPayroll.pay_period?.end_date
                )}
              </h2>
              <dl className="grid grid-cols-1 gap-x-8 gap-y-3 pt-1 sm:grid-cols-2">
                <div className="flex flex-col">
                  <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Pay day
                  </dt>
                  <dd className="m-0 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {formatFullDate(nextPayroll.check_date)}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Run by
                  </dt>
                  <dd className="m-0 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {formatFullDate(nextPayroll.payroll_deadline)}
                  </dd>
                </div>
              </dl>
            </div>
            <button
              type="button"
              onClick={() => handleRowClick(nextId)}
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 dark:bg-[#E15A43] dark:hover:bg-[#c84d39] md:w-auto"
            >
              Run payroll →
            </button>
          </div>
        </section>
      ) : null}

      {remaining.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h3 className="m-0 px-1 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Upcoming pay periods
          </h3>

          {/*
            Mobile: each row renders as its own bordered card with a gap
            between siblings. Desktop (sm+): rows collapse into a single
            bordered container with row dividers.
          */}
          <div className="flex flex-col gap-3 sm:gap-0 sm:overflow-hidden sm:rounded-xl sm:border sm:border-neutral-200 sm:bg-white sm:dark:border-neutral-800 sm:dark:bg-neutral-900">
            {remaining.map((payroll, i) => {
              const id = payroll.payroll_uuid ?? payroll.uuid;
              if (!id) return null;
              const isLast = i === remaining.length - 1;
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => handleRowClick(id)}
                  className={`flex w-full cursor-pointer flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-left transition hover:border-neutral-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-none sm:border-0 sm:px-5 sm:py-4 sm:shadow-none sm:hover:bg-neutral-50 sm:hover:shadow-none dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 sm:dark:hover:bg-neutral-800 ${
                    isLast
                      ? ""
                      : "sm:border-b sm:border-neutral-100 sm:dark:border-neutral-800"
                  }`}
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {formatPayPeriod(
                        payroll.pay_period?.start_date,
                        payroll.pay_period?.end_date
                      )}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="block sm:inline">
                        Pay day: {formatFullDate(payroll.check_date)}
                      </span>
                      <span className="hidden sm:inline"> · </span>
                      <span className="block sm:inline">
                        Run by: {formatFullDate(payroll.payroll_deadline)}
                      </span>
                    </span>
                  </div>
                  <span className="inline-flex shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 cursor-pointer transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800">
                    Run payroll →
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
