import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useDemoSession } from "../DemoSession";

interface OnboardingStep {
  id?: string;
  completed?: boolean;
}

export interface CompanyState {
  loading: boolean;
  /** Whether at least one bank account is verified. */
  bankVerified: boolean;
  /** Onboarding step completion keyed by step id. */
  steps: Record<string, boolean>;
  /** Number of employees on the company. */
  employeeCount: number;
  /** Whether the company has a primary signatory. */
  hasSignatory: boolean;
  /** Company status (e.g. "Not Approved", "Approved"). */
  companyStatus: string | null;
  /** Triggers a refresh. Shared across the provider, so every consumer
   * (including the floating checklist) gets the new data. */
  refresh: () => void;
}

interface BankAccount {
  verification_status?: string;
}

interface Company {
  company_status?: string;
  primary_signatory?: unknown;
}

const INITIAL: CompanyState = {
  loading: true,
  bankVerified: false,
  steps: {},
  employeeCount: 0,
  hasSignatory: false,
  companyStatus: null,
  refresh: () => {},
};

const CompanyStateContext = createContext<CompanyState>(INITIAL);

/**
 * Shared company-state provider. Mount once per demo session above any
 * component that reads onboarding state — the floating checklist and the
 * per-page screens then share one cache, so a refresh triggered anywhere
 * (an SDK block's "_DONE" event, a form save, etc.) updates everyone.
 */
export function CompanyStateProvider({ children }: { children: ReactNode }) {
  const { companyUuid, apiBaseUrl } = useDemoSession();
  const [loading, setLoading] = useState(true);
  const [bankVerified, setBankVerified] = useState(false);
  const [steps, setSteps] = useState<Record<string, boolean>>({});
  const [employeeCount, setEmployeeCount] = useState(0);
  const [hasSignatory, setHasSignatory] = useState(false);
  const [companyStatus, setCompanyStatus] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [bankRes, employeesRes, statusRes, companyRes] = await Promise.all(
          [
            fetch(`${apiBaseUrl}/v1/companies/${companyUuid}/bank_accounts`),
            fetch(`${apiBaseUrl}/v1/companies/${companyUuid}/employees`),
            fetch(
              `${apiBaseUrl}/v1/companies/${companyUuid}/onboarding_status`
            ),
            fetch(`${apiBaseUrl}/v1/companies/${companyUuid}`),
          ]
        );
        const bank = bankRes.ok ? ((await bankRes.json()) as BankAccount[]) : [];
        const employees = employeesRes.ok
          ? ((await employeesRes.json()) as unknown[])
          : [];
        const status = statusRes.ok
          ? ((await statusRes.json()) as {
              onboarding_steps?: OnboardingStep[];
            })
          : { onboarding_steps: [] };
        const company = companyRes.ok
          ? ((await companyRes.json()) as Company)
          : ({} as Company);
        if (cancelled) return;
        setBankVerified(
          bank.some((b) => b.verification_status === "verified")
        );
        setEmployeeCount(employees.length);
        const stepMap: Record<string, boolean> = {};
        for (const s of status.onboarding_steps ?? []) {
          if (s.id) stepMap[s.id] = !!s.completed;
        }
        setSteps(stepMap);
        setHasSignatory(!!company.primary_signatory);
        setCompanyStatus(company.company_status ?? null);
      } catch {
        if (!cancelled) {
          setBankVerified(false);
          setSteps({});
          setEmployeeCount(0);
          setHasSignatory(false);
          setCompanyStatus(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, companyUuid, tick]);

  const value: CompanyState = {
    loading,
    bankVerified,
    steps,
    employeeCount,
    hasSignatory,
    companyStatus,
    refresh,
  };

  return createElement(CompanyStateContext.Provider, { value }, children);
}

/**
 * Read the shared company state. `companyUuid` is accepted for backwards
 * compatibility but ignored — the provider owns the uuid.
 */
export function useCompanyState(_companyUuid?: string): CompanyState {
  return useContext(CompanyStateContext);
}
