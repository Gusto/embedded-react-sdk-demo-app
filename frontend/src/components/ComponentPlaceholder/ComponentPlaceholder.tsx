import styles from "./ComponentPlaceholder.module.css";

type Props = {
  label?: string;
};

export function ComponentPlaceholder({ label = "Component placeholder" }: Props) {
  return <div className={styles.placeholder}>{label}</div>;
}
