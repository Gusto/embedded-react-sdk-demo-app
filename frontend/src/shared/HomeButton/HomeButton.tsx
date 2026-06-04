import { Link, useLocation } from "react-router-dom";
import styles from "./HomeButton.module.css";

export function HomeButton() {
  const { pathname } = useLocation();

  if (pathname === "/") {
    return null;
  }

  return (
    <Link to="/" className={styles.button} aria-label="Return to landing page">
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 12 12 3l9 9" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-6h4v6" />
      </svg>
    </Link>
  );
}
