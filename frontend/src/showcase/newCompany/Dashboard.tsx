import { useState } from "react";
import { useDemoSession } from "../DemoSession";
import { useCompanyState } from "./useCompanyState";
import { useDemoToast } from "./demoToast";
import { ActionCard, Drawer, PageHeader } from "./ui";
import { VerifyBankAccount } from "./VerifyBankAccount";

interface DashboardProps {
  companyUuid: string;
}

type DrawerState = { kind: "none" } | { kind: "verifyBank" };

export function Dashboard({ companyUuid }: DashboardProps) {
  const { toast } = useDemoToast();
  const { basePath } = useDemoSession();
  const state = useCompanyState(companyUuid);
  const [drawer, setDrawer] = useState<DrawerState>({ kind: "none" });

  const paySchedule = state.steps.payroll_schedule;
  const stateSetup = state.steps.state_setup;
  const signForms = state.steps.sign_all_forms;

  const allDone =
    state.bankVerified &&
    state.employeeCount > 0 &&
    paySchedule &&
    stateSetup &&
    signForms;

  return (
    <>
      <PageHeader
        eyebrow="Payroll"
        title="Welcome to your payroll dashboard"
        description="A few things still need your attention before you can run payroll."
      />

      {state.loading ? (
        <p className="m-0 text-sm text-neutral-500">Loading…</p>
      ) : (
        <div className="flex flex-col gap-4">
          {!state.bankVerified ? (
            <ActionCard
              eyebrow="Action required"
              title="Verify your bank account"
              body="Confirm the micro-deposits we sent to fund payroll runs."
              cta="Verify bank account"
              onClick={() => setDrawer({ kind: "verifyBank" })}
            />
          ) : null}
          {!paySchedule ? (
            <ActionCard
              eyebrow="Get set up"
              title="Set up a pay schedule"
              body="Tell us how often you pay your team so we know when to run payroll."
              cta="Add pay schedule"
              to={`${basePath}/payroll/settings`}
            />
          ) : null}
          {!stateSetup ? (
            <ActionCard
              eyebrow="Action required"
              title="Finish state tax setup"
              body="We need a few more state-specific details before we can file your taxes."
              cta="Set up state taxes"
              to={`${basePath}/payroll/settings/taxes`}
            />
          ) : null}
          {!signForms ? (
            <ActionCard
              eyebrow="Action required"
              title="Sign your payroll documents"
              body={
                state.hasSignatory
                  ? "Review and sign the documents required before your first payroll."
                  : "Assign a signatory authorized to sign your payroll documents."
              }
              cta={state.hasSignatory ? "Review documents" : "Assign a signatory"}
              to={
                state.hasSignatory
                  ? `${basePath}/payroll/documents`
                  : `${basePath}/payroll/settings/signatory`
              }
            />
          ) : null}
          {state.employeeCount === 0 ? (
            <ActionCard
              eyebrow="Get set up"
              title="Add your first employee"
              body="You need at least one onboarded employee before you can run payroll."
              cta="Add an employee"
              to={`${basePath}/payroll/people/add`}
            />
          ) : null}
          {allDone ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
              You're all set — your next payroll can run on schedule.
            </div>
          ) : null}
        </div>
      )}

      {drawer.kind === "verifyBank" ? (
        <Drawer
          onClose={() => setDrawer({ kind: "none" })}
          title="Verify bank account"
        >
          <VerifyBankAccount
            companyUuid={companyUuid}
            onVerified={() => {
              setDrawer({ kind: "none" });
              state.refresh();
              toast("Bank account verified");
            }}
          />
        </Drawer>
      ) : null}

    </>
  );
}
