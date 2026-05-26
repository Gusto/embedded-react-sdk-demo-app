import { useState } from "react";
import { useCompanyState } from "./useCompanyState";

interface ChecklistItem {
  key: string;
  label: string;
  /** True when the step is satisfied for our demo's onboarding. */
  complete: boolean;
}

/**
 * Onboarding "what's left to do" checklist. Designed to live anchored to
 * the bottom of the sidebar — collapsible header + expandable list. Reads
 * from the shared `useCompanyState` context so the items stay in sync as
 * the user finishes each step.
 */
export function OnboardingChecklist() {
  const state = useCompanyState();
  const [open, setOpen] = useState(false);

  if (state.loading) return null;

  const items: ChecklistItem[] = [
    { key: "address", label: "Company address", complete: !!state.steps.add_addresses },
    {
      key: "federal",
      label: "Federal tax setup",
      complete: !!state.steps.federal_tax_setup,
    },
    {
      key: "industry",
      label: "Industry",
      complete: !!state.steps.select_industry,
    },
    {
      key: "bank",
      label: "Add bank account",
      complete: !!state.steps.add_bank_info,
    },
    {
      key: "verifyBank",
      label: "Verify bank account",
      complete: state.bankVerified,
    },
    {
      key: "paySchedule",
      label: "Pay schedule",
      complete: !!state.steps.payroll_schedule,
    },
    {
      key: "employees",
      label: "Add employees",
      complete: state.employeeCount > 0,
    },
    {
      key: "stateTaxes",
      label: "State tax setup",
      complete: !!state.steps.state_setup,
    },
    {
      key: "signForms",
      label: "Sign documents",
      complete: !!state.steps.sign_all_forms,
    },
  ];

  const completed = items.filter((i) => i.complete).length;
  const total = items.length;
  const allDone = completed === total;

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50"
      >
        <div className="flex flex-col gap-0.5">
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Onboarding
          </p>
          <p className="m-0 text-sm font-medium text-neutral-900">
            {allDone ? "You're all set" : `${completed} of ${total} complete`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProgressRing completed={completed} total={total} />
          <span
            aria-hidden
            className={`text-neutral-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </div>
      </button>
      {open ? (
        <ul className="flex flex-col divide-y divide-neutral-100 border-t border-neutral-100">
          {items.map((item) => (
            <li key={item.key}>
              <div className="flex items-center gap-3 px-4 py-2.5">
                <span
                  className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    item.complete
                      ? "bg-emerald-100 text-emerald-700"
                      : "border border-neutral-200 bg-white text-neutral-300"
                  }`}
                >
                  {item.complete ? "✓" : ""}
                </span>
                <span
                  className={`text-sm ${
                    item.complete
                      ? "text-neutral-500 line-through"
                      : "text-neutral-900"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ProgressRing({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const pct = total === 0 ? 0 : completed / total;
  const offset = circumference * (1 - pct);
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 -rotate-90">
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="3"
      />
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke="#10b981"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 200ms ease" }}
      />
    </svg>
  );
}
