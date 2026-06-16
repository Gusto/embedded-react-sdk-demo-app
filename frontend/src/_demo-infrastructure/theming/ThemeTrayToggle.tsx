import { useTheming } from "./context";
import styles from "./ThemeTrayToggle.module.css";

export function ThemeTrayToggle() {
  const { toggle, isOpen } = useTheming();

  return (
    <button
      type="button"
      className={styles.button}
      onClick={toggle}
      aria-label="Edit theme"
      aria-expanded={isOpen}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
        <circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />
        <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
        <circle cx="8" cy="18" r="2" fill="currentColor" stroke="none" />
      </svg>
      <span className={styles.label}>Theme</span>
    </button>
  );
}
