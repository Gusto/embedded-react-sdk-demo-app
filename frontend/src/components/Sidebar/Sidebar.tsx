import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.linkActive}` : styles.link;

  return (
    <aside className={styles.sidebar}>
      <nav>
        <div className={styles.groupHeading}>Pay</div>
        <ul className={styles.list}>
          <li>
            <NavLink to="/run-payroll" className={linkClass}>
              Run Payroll
            </NavLink>
          </li>
        </ul>
        <div className={styles.groupHeading}>People</div>
        <ul className={styles.list}>
          <li>
            <NavLink to="/employees" className={linkClass}>
              Employees
            </NavLink>
          </li>
        </ul>
        <div className={styles.groupHeading}>Manage company</div>
        <ul className={styles.list}>
          <li>
            <NavLink to="/bank-account" className={linkClass}>
              Bank account
            </NavLink>
          </li>
          <li>
            <NavLink to="/locations" className={linkClass}>
              Locations
            </NavLink>
          </li>
          <li>
            <NavLink to="/federal-taxes" className={linkClass}>
              Federal Taxes
            </NavLink>
          </li>
          <li>
            <NavLink to="/state-taxes" className={linkClass}>
              State Taxes
            </NavLink>
          </li>
          <li>
            <NavLink to="/pay-schedule" className={linkClass}>
              Pay Schedule
            </NavLink>
          </li>
          <li>
            <NavLink to="/documents" className={linkClass}>
              Documents
            </NavLink>
          </li>
          <li>
            <NavLink to="/time-off" className={linkClass}>
              Time off policies
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
