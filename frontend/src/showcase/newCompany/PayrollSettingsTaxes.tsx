import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDemoSession } from "../DemoSession";
import { useCompanyState } from "./useCompanyState";
import { DetailCard, DetailRow, PageHeader } from "./ui";

interface Props {
  companyUuid: string;
}

interface FederalTaxDetails {
  ein?: string;
  tax_payer_type?: string;
  filing_form?: string;
  legal_name?: string;
}

type SetupStatus = "not_started" | "in_progress" | "complete";

interface StateRequirement {
  state?: string;
  setup_complete?: boolean;
  status?: SetupStatus;
}

export function PayrollSettingsTaxes({ companyUuid }: Props) {
  const state = useCompanyState(companyUuid);
  const { apiBaseUrl, basePath } = useDemoSession();
  const [federal, setFederal] = useState<FederalTaxDetails | null>(null);
  const [states, setStates] = useState<StateRequirement[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const baseUrl = apiBaseUrl;
    async function load() {
      try {
        const [federalRes, taxesRes] = await Promise.all([
          fetch(`${baseUrl}/v1/companies/${companyUuid}/federal_tax_details`),
          fetch(`${baseUrl}/v1/companies/${companyUuid}/tax_requirements`),
        ]);
        const federal = federalRes.ok
          ? ((await federalRes.json()) as FederalTaxDetails)
          : {};
        // Endpoint may return either an array or an object with a `states` key
        // depending on the SDK version. Coerce to an array.
        const taxesPayload = taxesRes.ok ? await taxesRes.json() : [];
        const list: StateRequirement[] = Array.isArray(taxesPayload)
          ? taxesPayload
          : (taxesPayload?.states ?? []);
        if (cancelled) return;
        setFederal(federal);
        setStates(list);
      } catch {
        if (!cancelled) {
          setFederal(null);
          setStates([]);
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
        eyebrow="Settings · Taxes"
        title="Tax setup"
        description="Federal and state tax configuration for your company."
      />
      <div className="flex flex-col gap-4">
        <DetailCard title="Federal taxes">
          {federal ? (
            <>
              <DetailRow label="Legal name" value={federal.legal_name ?? "—"} />
              <DetailRow label="EIN" value={federal.ein ?? "—"} />
              <DetailRow
                label="Tax payer type"
                value={federal.tax_payer_type ?? "—"}
              />
              <DetailRow
                label="Filing form"
                value={federal.filing_form ?? "—"}
              />
            </>
          ) : (
            <p className="m-0 text-sm text-neutral-500">Loading…</p>
          )}
        </DetailCard>

        <DetailCard
          title="State taxes"
          description={
            state.steps.state_setup
              ? "State tax setup is complete."
              : "State tax setup is required before your first payroll."
          }
        >
          {states === null ? (
            <p className="m-0 text-sm text-neutral-500">Loading…</p>
          ) : states.length === 0 ? (
            <p className="m-0 text-sm text-neutral-500">
              No state tax requirements yet.
            </p>
          ) : (
            <ul className="-mx-1 flex flex-col divide-y divide-neutral-100">
              {states.map((row) => (
                <li key={row.state ?? Math.random()}>
                  <StateRow row={row} basePath={basePath} />
                </li>
              ))}
            </ul>
          )}
        </DetailCard>
      </div>
    </>
  );
}

function StateRow({
  row,
  basePath,
}: {
  row: StateRequirement;
  basePath: string;
}) {
  const code = row.state ?? "—";
  const status = row.status ?? (row.setup_complete ? "complete" : "not_started");
  const pill =
    status === "complete"
      ? { label: "Complete", classes: "border-emerald-200 bg-emerald-50 text-emerald-800" }
      : status === "in_progress"
        ? { label: "In progress", classes: "border-amber-200 bg-amber-50 text-amber-800" }
        : { label: "Not started", classes: "border-neutral-200 bg-neutral-50 text-neutral-700" };
  const needsAction = status !== "complete";

  const content = (
    <div
      className={`flex items-center justify-between gap-4 px-4 py-3 transition-colors ${
        needsAction ? "hover:bg-neutral-50" : ""
      }`}
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium text-neutral-900">
          {STATE_NAMES[code] ?? code}
        </span>
        <span className="font-mono text-xs text-neutral-500">{code}</span>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-medium ${pill.classes}`}
        >
          {pill.label}
        </span>
        {needsAction ? (
          <span aria-hidden className="text-neutral-400">
            →
          </span>
        ) : null}
      </div>
    </div>
  );

  return needsAction ? (
    <Link
      to={`${basePath}/payroll/settings/taxes/${code}`}
      className="block"
    >
      {content}
    </Link>
  ) : (
    content
  );
}

// Minimal lookup so we can show "Pennsylvania" instead of just "PA" in the
// list. Falls back to the abbreviation for anything missing.
const STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DC: "District of Columbia",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  IA: "Iowa",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  MA: "Massachusetts",
  MD: "Maryland",
  ME: "Maine",
  MI: "Michigan",
  MN: "Minnesota",
  MO: "Missouri",
  MS: "Mississippi",
  MT: "Montana",
  NC: "North Carolina",
  ND: "North Dakota",
  NE: "Nebraska",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NV: "Nevada",
  NY: "New York",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VA: "Virginia",
  VT: "Vermont",
  WA: "Washington",
  WI: "Wisconsin",
  WV: "West Virginia",
  WY: "Wyoming",
};
