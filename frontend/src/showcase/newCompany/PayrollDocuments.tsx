import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDemoSession } from "../DemoSession";
import { useCompanyState } from "./useCompanyState";
import { PageHeader } from "./ui";

interface Props {
  companyUuid: string;
}

interface CompanyForm {
  uuid: string;
  name?: string;
  title?: string;
  description?: string;
  draft?: boolean;
  requires_signing?: boolean;
  year?: number | null;
  quarter?: number | null;
}

export function PayrollDocuments({ companyUuid }: Props) {
  const state = useCompanyState(companyUuid);
  const { apiBaseUrl } = useDemoSession();
  const [forms, setForms] = useState<CompanyForm[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(
          `${apiBaseUrl}/v1/companies/${companyUuid}/forms`
        );
        const data = response.ok ? ((await response.json()) as CompanyForm[]) : [];
        if (!cancelled) setForms(data);
      } catch {
        if (!cancelled) setForms([]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, companyUuid]);

  if (state.loading) {
    return <p className="m-0 text-sm text-neutral-500">Loading…</p>;
  }
  if (!state.hasSignatory) {
    return (
      <Navigate
        to="/showcase/new-company/payroll/settings/signatory"
        replace
      />
    );
  }

  const needsSigning = (forms ?? []).filter((f) => f.requires_signing);
  const completed = (forms ?? []).filter((f) => !f.requires_signing);

  return (
    <>
      <PageHeader
        eyebrow="Documents"
        title="Payroll documents"
        description="Forms required to authorize and complete your payroll setup."
      />

      {forms === null ? (
        <p className="m-0 text-sm text-neutral-500">Loading…</p>
      ) : forms.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
          No documents available yet.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <DocumentSection
            heading="Awaiting your signature"
            forms={needsSigning}
            emptyHint="Nothing waiting — you're up to date."
          />
          <DocumentSection
            heading="Completed"
            forms={completed}
            emptyHint="No completed documents yet."
            muted
          />
        </div>
      )}
    </>
  );
}

function DocumentSection({
  heading,
  forms,
  emptyHint,
  muted = false,
}: {
  heading: string;
  forms: CompanyForm[];
  emptyHint: string;
  muted?: boolean;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="m-0 text-sm font-semibold uppercase tracking-wider text-neutral-500">
        {heading}
      </h2>
      {forms.length === 0 ? (
        <p className="m-0 text-sm text-neutral-500">{emptyHint}</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <ul className="divide-y divide-neutral-100">
            {forms.map((form) => (
              <li key={form.uuid}>
                <DocumentRow form={form} muted={muted} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function DocumentRow({
  form,
  muted,
}: {
  form: CompanyForm;
  muted: boolean;
}) {
  const status = form.draft
    ? { label: "Draft", color: "neutral" as const }
    : form.requires_signing
      ? { label: "Needs signature", color: "amber" as const }
      : { label: "Signed", color: "emerald" as const };

  const title =
    form.title ||
    form.name?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
    form.uuid;

  const content = (
    <div
      className={`flex items-center justify-between gap-4 px-5 py-4 transition-colors ${
        form.requires_signing ? "hover:bg-neutral-50" : ""
      }`}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <p
          className={`m-0 text-sm font-medium ${muted ? "text-neutral-700" : "text-neutral-900"}`}
        >
          {title}
        </p>
        {form.description ? (
          <p className="m-0 truncate text-xs text-neutral-500">
            {form.description}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <StatusPill color={status.color} label={status.label} />
        {form.requires_signing ? (
          <span aria-hidden className="text-neutral-400">
            →
          </span>
        ) : null}
      </div>
    </div>
  );

  return form.requires_signing ? (
    <Link to={form.uuid} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}

function StatusPill({
  color,
  label,
}: {
  color: "amber" | "emerald" | "neutral";
  label: string;
}) {
  const styles = {
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    neutral: "border-neutral-200 bg-neutral-50 text-neutral-700",
  }[color];
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  );
}
