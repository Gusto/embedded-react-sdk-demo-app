#!/usr/bin/env node
// Cloud Agent / CI bootstrap: provision a fully-onboarded, APPROVED Gusto demo
// company from CLIENT_ID/CLIENT_SECRET alone, then wire it into the demo app.
//
// Why this exists: Gusto company access requires a company-scoped refresh token
// that rotates on every use, so it cannot live in a static secret. Instead of
// storing a token, this script mints a system token from the (static) client
// credentials, creates a brand-new demo company, seeds it through onboarding,
// approves it (demo-only instant approval), and writes the resulting refresh
// token to backend/tokens.json plus the company/employee ids into
// frontend/src/config.ts -- the exact inputs the unmodified app already reads.
//
// Usage:  CLIENT_ID=... CLIENT_SECRET=... node scripts/setup-demo-company.mjs
//
// Idempotent: if a previously-created company is still reachable (recorded in
// scripts/.demo-company.json + backend/tokens.json), it is reused instead of
// creating another company.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { randomInt } from "node:crypto";
import {
  client,
  getSystemToken,
  refreshCompanyToken,
  TOKENS_FILE,
  CONFIG_FILE,
  RECORD_FILE,
  log,
} from "./gusto-demo-lib.mjs";

const stamp = Date.now();
// These produce throwaway demo identifiers (EIN / SSN) for a sandbox company,
// not security-sensitive secrets, but use a CSPRNG (node:crypto) anyway.
const uniqueEin = () => `${randomInt(10, 100)}-${randomInt(1000000, 10000000)}`;
const rand9 = () => String(randomInt(100000000, 1000000000));

function futureFridayISO() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 21 + ((5 - d.getUTCDay() + 7) % 7));
  return d.toISOString().slice(0, 10);
}

async function onboardingRemaining(api, companyId) {
  const status = await api(`/v1/companies/${companyId}/onboarding_status`);
  return (status.onboarding_steps || [])
    .filter((s) => s.required && !s.completed)
    .map((s) => s.id);
}
async function stepComplete(api, companyId, stepId) {
  const status = await api(`/v1/companies/${companyId}/onboarding_status`);
  const step = (status.onboarding_steps || []).find((s) => s.id === stepId);
  return step ? step.completed : false;
}

async function seedCompany(api, companyId) {
  // 1. Work address (also used as the filing/mailing address).
  if (!(await stepComplete(api, companyId, "add_addresses"))) {
    log("adding company address");
    await api(`/v1/companies/${companyId}/locations`, {
      method: "POST",
      body: {
        phone_number: "4155550123",
        street_1: "548 Market St",
        street_2: "",
        city: "San Francisco",
        state: "CA",
        zip: "94104",
        country: "USA",
        mailing_address: true,
        filing_address: true,
      },
    });
  }

  // 2. Pay schedule (bi-weekly).
  if (!(await stepComplete(api, companyId, "payroll_schedule"))) {
    log("adding pay schedule");
    const payDate = futureFridayISO();
    const endOfPeriod = new Date(payDate);
    endOfPeriod.setUTCDate(endOfPeriod.getUTCDate() - 4);
    await api(`/v1/companies/${companyId}/pay_schedules`, {
      method: "POST",
      body: {
        frequency: "Every other week",
        anchor_pay_date: payDate,
        anchor_end_of_pay_period: endOfPeriod.toISOString().slice(0, 10),
      },
    });
  }

  // 3. Industry.
  if (!(await stepComplete(api, companyId, "select_industry"))) {
    log("selecting industry");
    await api(`/v1/companies/${companyId}/industry_selection`, {
      method: "PUT",
      body: { title: "Custom Computer Programming Services", naics_code: "541511" },
    });
  }

  // 4. Federal tax details (unique EIN).
  if (!(await stepComplete(api, companyId, "federal_tax_setup"))) {
    log("entering federal tax details");
    const ftd = await api(`/v1/companies/${companyId}/federal_tax_details`);
    await api(`/v1/companies/${companyId}/federal_tax_details`, {
      method: "PUT",
      body: {
        version: ftd.version,
        ein: uniqueEin(),
        tax_payer_type: "C-Corporation",
        taxable_as_scorp: false,
        filing_form: "941",
        legal_name: ftd.legal_name,
      },
    });
  }

  // 5. Bank account.
  let bankUuid;
  if (!(await stepComplete(api, companyId, "add_bank_info"))) {
    log("adding bank account");
    const bank = await api(`/v1/companies/${companyId}/bank_accounts`, {
      method: "POST",
      body: { routing_number: "121000358", account_number: "1234567890", account_type: "Checking" },
    });
    bankUuid = bank.uuid;
  }

  // 6. Employee (required to complete onboarding) -- fully onboarded.
  if (!(await stepComplete(api, companyId, "add_employees"))) {
    await seedEmployee(api, companyId);
  }

  // 7. State tax rates (CA). Default SUI/ETT rates; no EDD number required.
  if (!(await stepComplete(api, companyId, "state_setup"))) {
    log("configuring CA state tax rates");
    await api(`/v1/companies/${companyId}/tax_requirements/CA`, {
      method: "PUT",
      body: {
        requirement_sets: [
          {
            state: "CA",
            key: "taxrates",
            effective_from: `${new Date().getUTCFullYear()}-01-01`,
            requirements: [
              { key: "usedefaultsuirates", value: "true" },
              { key: "8f99ddb8-2b20-4c27-b57a-30467e844abe", value: "3.4" },
              { key: "9f1d012f-0684-4614-962f-0df9ee46b92d", value: "0.1" },
            ],
          },
        ],
      },
    });
  }

  // 8. Verify the bank account (demo returns the micro-deposit amounts).
  if (!(await stepComplete(api, companyId, "verify_bank_info"))) {
    log("verifying bank account");
    const banks = await api(`/v1/companies/${companyId}/bank_accounts`);
    const bank = (Array.isArray(banks) ? banks : []).find((b) => b.uuid === bankUuid) || banks[0];
    const deposits = await api(
      `/v1/companies/${companyId}/bank_accounts/${bank.uuid}/send_test_deposits`,
      { method: "POST" }
    );
    await api(`/v1/companies/${companyId}/bank_accounts/${bank.uuid}/verify`, {
      method: "PUT",
      body: { deposit_1: deposits.deposit_1, deposit_2: deposits.deposit_2 },
    });
  }

  // 9. Signatory + sign all company forms.
  if (!(await stepComplete(api, companyId, "sign_all_forms"))) {
    log("creating signatory and signing company forms");
    const signatories = await api(`/v1/companies/${companyId}/signatories`);
    if (!Array.isArray(signatories) || signatories.length === 0) {
      await api(`/v1/companies/${companyId}/signatories`, {
        method: "POST",
        body: {
          first_name: "Demo",
          last_name: "Signatory",
          email: `cloud-agent-signatory+${stamp}@example.com`,
          title: "CEO",
          phone: "4155550123",
          birthday: "1980-01-01",
          ssn: rand9(),
          home_address: { street_1: "548 Market St", street_2: "", city: "San Francisco", state: "CA", zip: "94104" },
        },
      });
    }
    const forms = await api(`/v1/companies/${companyId}/forms`);
    for (const form of (forms || []).filter((f) => f.requires_signing)) {
      await api(`/v1/forms/${form.uuid}/sign`, {
        method: "PUT",
        body: { signature_text: "Demo Signatory", agree: true, signed_by_ip_address: "127.0.0.1" },
      });
    }
  }
}

async function seedEmployee(api, companyId) {
  log("adding and onboarding an employee");
  const locations = await api(`/v1/companies/${companyId}/locations`);
  const locationUuid = locations[0].uuid;

  const employee = await api(`/v1/companies/${companyId}/employees`, {
    method: "POST",
    body: {
      first_name: "Demo",
      last_name: "Employee",
      date_of_birth: "1990-01-01",
      email: `cloud-agent-employee+${stamp}@example.com`,
      self_onboarding: false,
    },
  });
  const empId = employee.uuid;

  const fresh = await api(`/v1/employees/${empId}`);
  await api(`/v1/employees/${empId}`, {
    method: "PUT",
    body: { version: fresh.version, ssn: rand9(), date_of_birth: "1990-01-01", first_name: "Demo", last_name: "Employee" },
  });

  await api(`/v1/employees/${empId}/work_addresses`, {
    method: "POST",
    body: { location_uuid: locationUuid, effective_date: "2020-01-01" },
  });
  await api(`/v1/employees/${empId}/home_addresses`, {
    method: "POST",
    body: { street_1: "548 Market St", street_2: "", city: "San Francisco", state: "CA", zip: "94104", effective_date: "2020-01-01", courtesy_withholding: false },
  });

  const job = await api(`/v1/employees/${empId}/jobs`, {
    method: "POST",
    body: { title: "Software Engineer", hire_date: "2020-01-01" },
  });
  const comps = await api(`/v1/jobs/${job.uuid}/compensations`);
  const primary = Array.isArray(comps) ? comps[0] : null;
  if (primary) {
    await api(`/v1/compensations/${primary.uuid}`, {
      method: "PUT",
      body: { version: primary.version, rate: "50.00", payment_unit: "Hour", flsa_status: "Nonexempt" },
    });
  } else {
    await api(`/v1/jobs/${job.uuid}/compensations`, {
      method: "POST",
      body: { rate: "50.00", payment_unit: "Hour", flsa_status: "Nonexempt" },
    });
  }

  const ft = await api(`/v1/employees/${empId}/federal_taxes`);
  await api(`/v1/employees/${empId}/federal_taxes`, {
    method: "PUT",
    body: {
      version: ft.version,
      w4_data_type: "rev_2020_w4",
      filing_status: "Single",
      two_jobs: false,
      dependents_amount: "0.0",
      other_income: "0.0",
      deductions: "0.0",
      extra_withholding: "0.0",
    },
  });

  await api(`/v1/employees/${empId}/state_taxes`, {
    method: "PUT",
    body: {
      states: [
        {
          state: "CA",
          questions: [
            { key: "filing_status", answers: [{ value: "S", valid_from: "2020-01-01" }] },
            { key: "withholding_allowance", answers: [{ value: 0, valid_from: "2020-01-01" }] },
            { key: "additional_withholding", answers: [{ value: "0.0", valid_from: "2020-01-01" }] },
            { key: "file_new_hire_report", answers: [{ value: "true", valid_from: "2020-01-01" }] },
          ],
        },
      ],
    },
  });

  return empId;
}

function patchConfig(companyId, employeeId) {
  let src = readFileSync(CONFIG_FILE, "utf8");
  src = src.replace(/(export const COMPANY_ID = ")[^"]*(";)/, `$1${companyId}$2`);
  if (employeeId) {
    src = src.replace(/(export const EMPLOYEE_ID = ")[^"]*(";)/, `$1${employeeId}$2`);
  }
  writeFileSync(CONFIG_FILE, src);
  log(`updated ${CONFIG_FILE} (local only -- do not commit)`);
}

async function reuseExisting() {
  if (!existsSync(RECORD_FILE) || !existsSync(TOKENS_FILE)) return null;
  try {
    const record = JSON.parse(readFileSync(RECORD_FILE, "utf8"));
    const tokens = JSON.parse(readFileSync(TOKENS_FILE, "utf8"));
    if (!record.company_uuid || !tokens.refresh_token) return null;
    const { accessToken, refreshToken } = await refreshCompanyToken(tokens.refresh_token);
    const api = client(accessToken);
    const company = await api(`/v1/companies/${record.company_uuid}`);
    writeFileSync(TOKENS_FILE, JSON.stringify({ refresh_token: refreshToken }, null, 2) + "\n");
    log(`reusing existing company ${company.name} (${company.uuid}), status: ${company.company_status}`);
    patchConfig(record.company_uuid, record.employee_uuid);
    return record.company_uuid;
  } catch (err) {
    log(`could not reuse recorded company (${err.message}); provisioning a fresh one`);
    return null; // stale/invalid -> provision fresh
  }
}

async function main() {
  if (await reuseExisting()) {
    log("done (reused existing company).");
    return;
  }

  log("minting system access token from client credentials");
  const systemToken = await getSystemToken();
  const sysApi = client(systemToken);

  log("creating partner-managed company");
  const created = await sysApi("/v1/partner_managed_companies", {
    method: "POST",
    body: {
      user: { first_name: "Cloud", last_name: "Agent", email: `cloud-agent+${stamp}@example.com` },
      company: { name: `Cloud Agent Demo ${new Date(stamp).toISOString()}` },
    },
  });
  const companyId = created.company_uuid;
  log(`created company ${companyId}`);

  const api = client(created.access_token);
  await seedCompany(api, companyId);

  const remaining = await onboardingRemaining(api, companyId);
  if (remaining.length > 0) {
    throw new Error(`onboarding still incomplete: ${remaining.join(", ")}`);
  }
  log("finishing onboarding");
  await api(`/v1/companies/${companyId}/finish_onboarding`, { method: "PUT" });
  log("approving company (demo)");
  await api(`/v1/companies/${companyId}/approve`, { method: "PUT" });

  const company = await api(`/v1/companies/${companyId}`);
  const employees = await api(`/v1/companies/${companyId}/employees`);
  const employeeId = Array.isArray(employees) && employees[0] ? employees[0].uuid : null;

  writeFileSync(TOKENS_FILE, JSON.stringify({ refresh_token: created.refresh_token }, null, 2) + "\n");
  log(`wrote ${TOKENS_FILE}`);
  writeFileSync(
    RECORD_FILE,
    JSON.stringify({ company_uuid: companyId, employee_uuid: employeeId, name: company.name, created_at: new Date(stamp).toISOString() }, null, 2) + "\n"
  );
  patchConfig(companyId, employeeId);

  log(`done. Company "${company.name}" status: ${company.company_status}`);
}

main().catch((err) => {
  console.error(`[gusto-demo] FAILED: ${err.message}`);
  process.exit(1);
});
