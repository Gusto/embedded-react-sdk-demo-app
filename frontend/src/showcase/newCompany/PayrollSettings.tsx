import { useEffect, useState } from "react";
import { useDemoSession } from "../DemoSession";
import { useCompanyState } from "./useCompanyState";
import { DetailCard, DetailRow, PageHeader } from "./ui";
import { Link } from "react-router-dom";

interface PayrollSettingsProps {
  companyUuid: string;
}

interface PaySchedule {
  uuid?: string;
  frequency?: string;
  anchor_pay_date?: string;
  anchor_end_of_pay_period?: string;
  day_1?: number | null;
  day_2?: number | null;
  custom_name?: string;
  active?: boolean;
}

interface Signatory {
  first_name?: string;
  last_name?: string;
  email?: string;
  title?: string;
}

export function PayrollSettings({ companyUuid }: PayrollSettingsProps) {
  const state = useCompanyState(companyUuid);
  const { apiBaseUrl } = useDemoSession();
  const [paySchedule, setPaySchedule] = useState<PaySchedule | null>(null);
  const [signatory, setSignatory] = useState<Signatory | null>(null);

  useEffect(() => {
    let cancelled = false;
    const baseUrl = apiBaseUrl;
    async function load() {
      try {
        const [psRes, companyRes] = await Promise.all([
          fetch(`${baseUrl}/v1/companies/${companyUuid}/pay_schedules`),
          fetch(`${baseUrl}/v1/companies/${companyUuid}`),
        ]);
        const schedules = psRes.ok ? ((await psRes.json()) as PaySchedule[]) : [];
        const company = companyRes.ok
          ? ((await companyRes.json()) as { primary_signatory?: Signatory })
          : {};
        if (cancelled) return;
        setPaySchedule(schedules[0] ?? null);
        setSignatory(company.primary_signatory ?? null);
      } catch {
        if (!cancelled) {
          setPaySchedule(null);
          setSignatory(null);
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
        eyebrow="Settings"
        title="Payroll settings"
        description="Configure how and when your team gets paid."
      />
      <div className="flex flex-col gap-4">
        <DetailCard
          title="Pay schedule"
          description={
            state.steps.payroll_schedule
              ? "Active pay schedule on file."
              : "No pay schedule set up yet."
          }
          footer={
            <Link
              to="/showcase/new-company/payroll/settings"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Edit pay schedule →
            </Link>
          }
        >
          {paySchedule ? (
            <>
              <DetailRow
                label="Frequency"
                value={paySchedule.frequency ?? "—"}
              />
              {paySchedule.custom_name ? (
                <DetailRow label="Name" value={paySchedule.custom_name} />
              ) : null}
              <DetailRow
                label="Next pay day"
                value={paySchedule.anchor_pay_date ?? "—"}
              />
              <DetailRow
                label="Period ends"
                value={paySchedule.anchor_end_of_pay_period ?? "—"}
              />
            </>
          ) : (
            <p className="m-0 text-sm text-neutral-500">
              Not configured yet.
            </p>
          )}
        </DetailCard>

        <DetailCard
          title="Signatory"
          description={
            signatory
              ? "Person authorized to sign payroll documents."
              : "No signatory assigned yet."
          }
          footer={
            <Link
              to="/showcase/new-company/payroll/settings/signatory"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              {signatory ? "Update signatory →" : "Assign a signatory →"}
            </Link>
          }
        >
          {signatory ? (
            <>
              <DetailRow
                label="Name"
                value={`${signatory.first_name ?? ""} ${signatory.last_name ?? ""}`.trim() || "—"}
              />
              {signatory.title ? (
                <DetailRow label="Title" value={signatory.title} />
              ) : null}
              {signatory.email ? (
                <DetailRow label="Email" value={signatory.email} />
              ) : null}
            </>
          ) : (
            <p className="m-0 text-sm text-neutral-500">
              Not configured yet.
            </p>
          )}
        </DetailCard>
      </div>
    </>
  );
}
