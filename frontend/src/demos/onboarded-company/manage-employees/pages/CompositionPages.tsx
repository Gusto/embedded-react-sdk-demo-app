import { useParams, Link } from "react-router-dom";
import { ProfileComposition } from "../block-compositions/ProfileComposition";
import { HomeAddressComposition } from "../block-compositions/HomeAddressComposition";
import { WorkAddressComposition } from "../block-compositions/WorkAddressComposition";
import styles from "./CompositionPages.module.css";

function useRequiredEmployeeId(): string {
  const { employeeId } = useParams<"employeeId">();
  if (!employeeId) {
    throw new Error("Employee ID is required but was not found in route params");
  }
  return employeeId;
}

export function BasicDetailsCompositions() {
  const employeeId = useRequiredEmployeeId();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to={`/employees/${employeeId}/compositions`} className={styles.backLink}>
          <span aria-hidden="true">&larr;</span> Back to compositions
        </Link>
        <h1>Basic Details Compositions</h1>
        <p className={styles.subtitle}>
          Individual Profile, Home Address, and Work Address card + form
          compositions
        </p>
      </div>

      <section className={styles.section}>
        <h2>Profile</h2>
        <div className={styles.composition}>
          <ProfileComposition employeeId={employeeId} />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Home Address</h2>
        <div className={styles.composition}>
          <HomeAddressComposition employeeId={employeeId} />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Work Address</h2>
        <div className={styles.composition}>
          <WorkAddressComposition employeeId={employeeId} />
        </div>
      </section>
    </div>
  );
}

export function JobAndPayCompositions() {
  const employeeId = useRequiredEmployeeId();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to={`/employees/${employeeId}/compositions`} className={styles.backLink}>
          <span aria-hidden="true">&larr;</span> Back to compositions
        </Link>
        <h1>Job & Pay Compositions</h1>
        <p className={styles.subtitle}>
          Individual Compensation, Payment Method, and Deductions card + form
          compositions
        </p>
      </div>

      <section className={styles.section}>
        <h2>Compensation</h2>
        <div className={styles.composition}>
          <CompensationComposition employeeId={employeeId} />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Payment Method</h2>
        <div className={styles.composition}>
          <PaymentMethodComposition employeeId={employeeId} />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Deductions</h2>
        <div className={styles.composition}>
          <DeductionsComposition employeeId={employeeId} />
        </div>
      </section>
    </div>
  );
}

export function TaxesCompositions() {
  const employeeId = useRequiredEmployeeId();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to={`/employees/${employeeId}/compositions`} className={styles.backLink}>
          <span aria-hidden="true">&larr;</span> Back to compositions
        </Link>
        <h1>Taxes Compositions</h1>
        <p className={styles.subtitle}>
          Individual Federal and State Taxes card + form compositions
        </p>
      </div>

      <section className={styles.section}>
        <h2>Federal Taxes</h2>
        <div className={styles.composition}>
          <FederalTaxesComposition employeeId={employeeId} />
        </div>
      </section>

      <section className={styles.section}>
        <h2>State Taxes</h2>
        <div className={styles.composition}>
          <StateTaxesComposition employeeId={employeeId} />
        </div>
      </section>
    </div>
  );
}

export function DocumentsCompositions() {
  const employeeId = useRequiredEmployeeId();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to={`/employees/${employeeId}/compositions`} className={styles.backLink}>
          <span aria-hidden="true">&larr;</span> Back to compositions
        </Link>
        <h1>Documents Composition</h1>
        <p className={styles.subtitle}>
          Documents card with document viewer composition
        </p>
      </div>

      <section className={styles.section}>
        <h2>Documents</h2>
        <div className={styles.composition}>
          <DocumentsComposition employeeId={employeeId} />
        </div>
      </section>
    </div>
  );
}

// Import the compositions
import { CompensationComposition } from "../block-compositions/CompensationComposition";
import { PaymentMethodComposition } from "../block-compositions/PaymentMethodComposition";
import { DeductionsComposition } from "../block-compositions/DeductionsComposition";
import { FederalTaxesComposition } from "../block-compositions/FederalTaxesComposition";
import { StateTaxesComposition } from "../block-compositions/StateTaxesComposition";
import { DocumentsComposition } from "../block-compositions/DocumentsComposition";
