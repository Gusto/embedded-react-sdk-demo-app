import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { tokenManager } from "./tokenManager";

interface CompanyTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface CreatedCompany {
  companyUuid: string;
}

interface PartnerManagedCompanyResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  company_uuid: string;
}

interface PersistedDemoCompany {
  companyUuid: string;
  refreshToken: string;
  /** Persisted access token + expiry so quick re-opens skip the refresh. */
  accessToken?: string;
  expiresAt?: number;
}

interface PersistedState {
  newCompany?: PersistedDemoCompany;
}

const STORAGE_PATH = join(__dirname, "../demo-companies.json");

const companyTokens = new Map<string, CompanyTokens>();

function loadState(): PersistedState {
  if (!existsSync(STORAGE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(STORAGE_PATH, "utf-8")) as PersistedState;
  } catch (error) {
    console.warn(
      "demo-companies.json is unreadable — starting fresh:",
      error instanceof Error ? error.message : String(error)
    );
    return {};
  }
}

function saveState(next: PersistedState) {
  try {
    writeFileSync(STORAGE_PATH, JSON.stringify(next, null, 2), "utf-8");
  } catch (error) {
    console.error(
      "Failed to persist demo-companies.json:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

let state: PersistedState = loadState();
if (state.newCompany?.accessToken && state.newCompany.expiresAt) {
  companyTokens.set(state.newCompany.companyUuid, {
    accessToken: state.newCompany.accessToken,
    refreshToken: state.newCompany.refreshToken,
    expiresAt: state.newCompany.expiresAt,
  });
}

async function refreshCompanyTokens(
  companyUuid: string,
  refreshToken: string
): Promise<CompanyTokens> {
  const response = await fetch(`${tokenManager.baseUrl}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Gusto-API-Version": "2025-06-15",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `Failed to refresh demo company token (${response.status}): ${errText}`
    );
  }

  const data = (await response.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };

  const tokens: CompanyTokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  companyTokens.set(companyUuid, tokens);
  state = {
    ...state,
    newCompany: {
      companyUuid,
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
      expiresAt: tokens.expiresAt,
    },
  };
  saveState(state);
  return tokens;
}

async function getValidCompanyTokens(
  companyUuid: string,
  refreshToken: string
): Promise<CompanyTokens> {
  const bufferMs = 5 * 60 * 1000;
  const existing = companyTokens.get(companyUuid);
  if (existing && Date.now() < existing.expiresAt - bufferMs) {
    return existing;
  }
  return refreshCompanyTokens(companyUuid, refreshToken);
}

async function fetchCompanyStatus(
  companyUuid: string,
  accessToken: string
): Promise<string | null> {
  const response = await fetch(
    `${tokenManager.baseUrl}/v1/companies/${companyUuid}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Gusto-API-Version": "2025-06-15",
        Accept: "application/json",
      },
    }
  );
  if (!response.ok) return null;
  const data = (await response.json()) as { company_status?: string };
  return data.company_status ?? null;
}

/**
 * Returns the persisted new-company demo if it still exists and isn't yet
 * fully onboarded (any status other than "Approved"). Otherwise returns
 * null so the caller mints a fresh one.
 */
async function reuseExistingCompany(): Promise<CreatedCompany | null> {
  const persisted = state.newCompany;
  if (!persisted) return null;
  try {
    const tokens = await getValidCompanyTokens(
      persisted.companyUuid,
      persisted.refreshToken
    );
    const status = await fetchCompanyStatus(
      persisted.companyUuid,
      tokens.accessToken
    );
    if (!status) return null;
    if (status === "Approved") {
      console.log(
        `Persisted company ${persisted.companyUuid} is fully onboarded; creating a new one.`
      );
      return null;
    }
    console.log(
      `Reusing persisted partner-managed company ${persisted.companyUuid} (status: ${status})`
    );
    return { companyUuid: persisted.companyUuid };
  } catch (error) {
    console.warn(
      "Could not reuse persisted company; creating a new one:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

/**
 * Returns a partner-managed company for the "New company" demo. Reuses the
 * last one if it's still mid-onboarding; otherwise mints a fresh one.
 */
export async function createPartnerManagedCompany(): Promise<CreatedCompany> {
  const existing = await reuseExistingCompany();
  if (existing) return existing;

  const systemToken = await tokenManager.getSystemAccessToken();

  const stamp = Date.now();
  const payload = {
    user: {
      first_name: "Demo",
      last_name: "User",
      email: `demo.user.${stamp}@example.com`,
      phone: "5555551212",
    },
    company: {
      name: `Demo Co ${stamp}`,
      trade_name: `Demo Trade ${stamp}`,
    },
  };

  const response = await fetch(
    `${tokenManager.baseUrl}/v1/partner_managed_companies`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${systemToken}`,
        "Content-Type": "application/json",
        "X-Gusto-API-Version": "2025-06-15",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to create partner-managed company: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = (await response.json()) as PartnerManagedCompanyResponse;

  const tokens: CompanyTokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  companyTokens.set(data.company_uuid, tokens);
  state = {
    ...state,
    newCompany: {
      companyUuid: data.company_uuid,
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
      expiresAt: tokens.expiresAt,
    },
  };
  saveState(state);

  console.log(`Created partner-managed company ${data.company_uuid}`);
  return { companyUuid: data.company_uuid };
}

/** Returns the persisted new-company uuid without creating one. */
export function getCurrentNewCompanyUuid(): string | null {
  return state.newCompany?.companyUuid ?? null;
}

/** Forget the persisted new-company demo so the next Get Started mints a
 * fresh partner-managed company. Does NOT delete the company in Gusto —
 * just drops our local reference + tokens for it. */
export function clearNewCompany(): void {
  if (state.newCompany) {
    companyTokens.delete(state.newCompany.companyUuid);
  }
  state = { ...state, newCompany: undefined };
  saveState(state);
  console.log("Cleared persisted new-company demo");
}

export async function getCompanyAccessToken(
  companyUuid: string
): Promise<string | null> {
  const persisted = state.newCompany;
  if (persisted && persisted.companyUuid === companyUuid) {
    const tokens = await getValidCompanyTokens(
      companyUuid,
      persisted.refreshToken
    );
    return tokens.accessToken;
  }
  const inMemory = companyTokens.get(companyUuid);
  return inMemory?.accessToken ?? null;
}
