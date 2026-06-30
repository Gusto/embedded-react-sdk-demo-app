import { Link, useParams } from "react-router-dom";
import styles from "./BlockCompositionsDemo.module.css";

/**
 * Exploded block compositions demo - shows how to use individual card and form
 * components to build custom flows instead of using the pre-packaged blocks.
 *
 * Each composition demonstrates combining a Card component with its corresponding
 * Form components and handling the event-driven navigation between them.
 *
 * This is the same pattern used in the employee-onboarding demo's
 * CompensationComposition, but applied to all the employee management blocks.
 */

function useRequiredEmployeeId(): string {
  const { employeeId } = useParams<"employeeId">();
  if (!employeeId) {
    throw new Error("Employee ID is required but was not found in route params");
  }
  return employeeId;
}

export function BlockCompositionsIndex() {
  const employeeId = useRequiredEmployeeId();

  return (
    <div className={styles.container}>
      <h1>Exploded Block Compositions</h1>
      <p className={styles.description}>
        These examples demonstrate how to compose individual Card and Form
        components to build custom employee management flows. Each composition
        shows the same functionality as the pre-packaged blocks (like{" "}
        <code>{"<EmployeeManagement.Compensation />"}</code>), but using the
        individual sub-components with your own routing and orchestration.
      </p>

      <div className={styles.grid}>
        <Link
          to={`/employees/${employeeId}/compositions/basic-details`}
          className={styles.card}
        >
          <h2>Basic Details</h2>
          <p>
            Profile, Home Address, and Work Address compositions showing card +
            form patterns
          </p>
        </Link>

        <Link
          to={`/employees/${employeeId}/compositions/job-and-pay`}
          className={styles.card}
        >
          <h2>Job & Pay</h2>
          <p>
            Compensation, Payment Method, and Deductions compositions with
            multiple forms
          </p>
        </Link>

        <Link
          to={`/employees/${employeeId}/compositions/taxes`}
          className={styles.card}
        >
          <h2>Taxes</h2>
          <p>Federal and State Taxes compositions</p>
        </Link>

        <Link
          to={`/employees/${employeeId}/compositions/documents`}
          className={styles.card}
        >
          <h2>Documents</h2>
          <p>Documents card with document viewer composition</p>
        </Link>
      </div>

      <div className={styles.backLink}>
        <Link to={`/employees/${employeeId}`}>
          <span aria-hidden="true">&larr;</span> Back to employee dashboard
        </Link>
      </div>
    </div>
  );
}
