import { useEffect, useState } from "react";
import { useDemoSession } from "../DemoSession";

interface VerifyBankAccountProps {
  companyUuid: string;
  onVerified: () => void;
}

interface BankAccount {
  uuid: string;
  name?: string;
  account_number?: string;
  routing_number?: string;
  verification_status?: string;
}

interface MicroDeposits {
  // Gusto returns money values as strings (e.g. "0.05") to avoid float
  // precision issues, but we accept either to be safe.
  deposit_1?: number | string;
  deposit_2?: number | string;
}

function formatDeposit(value: number | string | undefined): string {
  if (value == null) return "";
  const num = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(num) ? num.toFixed(2) : "";
}

type Phase =
  | { status: "loading" }
  | { status: "no-account" }
  | { status: "ready"; bankAccount: BankAccount; deposits: MicroDeposits }
  | { status: "verifying"; bankAccount: BankAccount; deposits: MicroDeposits }
  | { status: "verified" }
  | { status: "error"; bankAccount?: BankAccount; reason: string };

/**
 * Hatchwell-styled bank verification form. Replaces the SDK's
 * Company.BankAccount block on the dashboard's verify drawer. We
 * auto-trigger the demo-only `send_test_deposits` endpoint on mount and
 * pre-fill the deposit inputs with the returned amounts, so the user
 * just clicks Verify.
 */
export function VerifyBankAccount({
  companyUuid,
  onVerified,
}: VerifyBankAccountProps) {
  const [phase, setPhase] = useState<Phase>({ status: "loading" });
  const [deposit1, setDeposit1] = useState("");
  const [deposit2, setDeposit2] = useState("");

  const { apiBaseUrl } = useDemoSession();
  const baseUrl = apiBaseUrl;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const listResp = await fetch(
          `${baseUrl}/v1/companies/${companyUuid}/bank_accounts`
        );
        if (!listResp.ok) throw new Error(`HTTP ${listResp.status}`);
        const list = (await listResp.json()) as BankAccount[];
        const unverified = list.find(
          (b) => b.verification_status !== "verified"
        );
        if (cancelled) return;
        if (!unverified) {
          setPhase({ status: "no-account" });
          return;
        }
        const depositsResp = await fetch(
          `${baseUrl}/v1/companies/${companyUuid}/bank_accounts/${unverified.uuid}/send_test_deposits`,
          { method: "POST" }
        );
        if (!depositsResp.ok) {
          const text = await depositsResp.text();
          throw new Error(`${depositsResp.status}: ${text}`);
        }
        const deposits = (await depositsResp.json()) as MicroDeposits;
        if (cancelled) return;
        setDeposit1(formatDeposit(deposits.deposit_1));
        setDeposit2(formatDeposit(deposits.deposit_2));
        setPhase({ status: "ready", bankAccount: unverified, deposits });
      } catch (error) {
        if (!cancelled) {
          setPhase({
            status: "error",
            reason: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [baseUrl, companyUuid]);

  async function verify() {
    if (phase.status !== "ready") return;
    const { bankAccount, deposits } = phase;
    const d1 = parseFloat(deposit1);
    const d2 = parseFloat(deposit2);
    if (Number.isNaN(d1) || Number.isNaN(d2)) {
      setPhase({
        status: "error",
        bankAccount,
        reason: "Enter both deposit amounts.",
      });
      return;
    }
    setPhase({ status: "verifying", bankAccount, deposits });
    try {
      const response = await fetch(
        `${baseUrl}/v1/companies/${companyUuid}/bank_accounts/${bankAccount.uuid}/verify`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deposit_1: d1, deposit_2: d2 }),
        }
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }
      setPhase({ status: "verified" });
      onVerified();
    } catch (error) {
      setPhase({
        status: "error",
        bankAccount,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (phase.status === "loading") {
    return (
      <p className="m-0 text-sm text-neutral-500">
        Sending test deposits to your account…
      </p>
    );
  }

  if (phase.status === "no-account") {
    return (
      <p className="m-0 text-sm text-neutral-600">
        No bank account on file yet. Add one in the onboarding flow first.
      </p>
    );
  }

  const bankAccount =
    "bankAccount" in phase ? phase.bankAccount : undefined;
  const verifying = phase.status === "verifying";

  return (
    <div className="flex flex-col gap-6">
      {bankAccount ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-neutral-500">
            Account on file
          </p>
          <p className="m-0 mt-1 text-sm font-medium text-neutral-900">
            {bankAccount.name ?? "Bank account"}
          </p>
          {bankAccount.account_number ? (
            <p className="m-0 mt-0.5 font-mono text-xs text-neutral-600">
              •••• {bankAccount.account_number.slice(-4)}
            </p>
          ) : null}
        </div>
      ) : null}

      <section className="flex flex-col gap-3">
        <h3 className="m-0 text-base font-semibold text-neutral-900">
          Confirm the deposit amounts
        </h3>
        <p className="m-0 text-sm leading-relaxed text-neutral-600">
          We sent two small test deposits to your account. We've pre-filled
          the amounts below — click Verify to confirm.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-neutral-700">
            Deposit 1
            <div className="flex items-center rounded-md border border-neutral-200 bg-white px-3 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <span className="text-sm text-neutral-500">$</span>
              <input
                type="number"
                step="0.01"
                value={deposit1}
                onChange={(e) => setDeposit1(e.target.value)}
                placeholder="0.00"
                className="ml-1 w-full bg-transparent py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
              />
            </div>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-neutral-700">
            Deposit 2
            <div className="flex items-center rounded-md border border-neutral-200 bg-white px-3 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <span className="text-sm text-neutral-500">$</span>
              <input
                type="number"
                step="0.01"
                value={deposit2}
                onChange={(e) => setDeposit2(e.target.value)}
                placeholder="0.00"
                className="ml-1 w-full bg-transparent py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
              />
            </div>
          </label>
        </div>
        <div>
          <button
            type="button"
            onClick={verify}
            disabled={verifying}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {verifying ? "Verifying…" : "Verify"}
          </button>
        </div>
      </section>

      {phase.status === "error" ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {phase.reason}
        </div>
      ) : null}
    </div>
  );
}
