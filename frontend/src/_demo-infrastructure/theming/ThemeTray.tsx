import { useMemo, useState } from "react";
import { useTheming } from "./context";
import {
  groupThemeTokens,
  tokenLabel,
  type ThemeToken,
} from "./themeTokens";
import styles from "./ThemeTray.module.css";

function matchesQuery(token: ThemeToken, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    token.key.toLowerCase().includes(q) ||
    tokenLabel(token.key).toLowerCase().includes(q)
  );
}

function TokenRow({ token }: { token: ThemeToken }) {
  const { overrides, setOverride } = useTheming();
  const override = (overrides[token.key] as string | undefined) ?? "";
  const swatchColor = override || token.defaultValue;
  const colorPickerValue =
    swatchColor.startsWith("#") && (swatchColor.length === 4 || swatchColor.length === 7)
      ? swatchColor
      : "#000000";

  return (
    <div className={styles.token}>
      {token.isColor ? (
        <label
          className={styles.swatchLabel}
          aria-label={`Pick ${tokenLabel(token.key)} color`}
        >
          <span
            className={styles.swatch}
            style={{ background: swatchColor || "transparent" }}
          />
          <input
            type="color"
            className={styles.colorPicker}
            value={colorPickerValue}
            onChange={(e) => {
              setOverride(token.key, e.target.value);
            }}
            tabIndex={-1}
          />
        </label>
      ) : (
        <span className={styles.swatchPlaceholder} />
      )}
      <label className={styles.tokenLabel} htmlFor={`theme-${token.key}`}>
        {tokenLabel(token.key)}
      </label>
      <input
        id={`theme-${token.key}`}
        className={styles.textInput}
        type="text"
        value={override}
        placeholder={token.defaultValue}
        spellCheck={false}
        onChange={(e) => {
          setOverride(token.key, e.target.value);
        }}
      />
    </div>
  );
}

function Group({
  label,
  tokens,
  isOpen,
  onToggle,
}: {
  label: string;
  tokens: ThemeToken[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  if (tokens.length === 0) return null;
  return (
    <div className={styles.group}>
      <button
        type="button"
        className={styles.groupHeader}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          aria-hidden="true"
        >
          ▸
        </span>
        <span className={styles.groupLabel}>{label}</span>
        <span className={styles.groupCount}>{tokens.length}</span>
      </button>
      {isOpen && (
        <div className={styles.groupBody}>
          {tokens.map((token) => (
            <TokenRow key={token.key} token={token} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ThemeTray() {
  const { isOpen, close, tokens, reset, hasOverrides } = useTheming();
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => {
    const filtered = tokens.filter((t) => matchesQuery(t, query));
    return groupThemeTokens(filtered);
  }, [tokens, query]);

  const isSearching = query.trim().length > 0;

  const isGroupOpen = (label: string, index: number) => {
    if (isSearching) return true;
    // Default: first group open, rest collapsed.
    return openGroups[label] ?? index === 0;
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ""}`}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        className={`${styles.tray} ${isOpen ? styles.trayOpen : ""}`}
        role="dialog"
        aria-label="Theme settings"
        aria-hidden={!isOpen}
      >
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>Theme</h2>
            <p className={styles.subtitle}>
              Live-edit the Gusto SDK theme tokens
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={close}
            aria-label="Close theme settings"
          >
            ×
          </button>
        </header>

        <div className={styles.searchRow}>
          <input
            className={styles.search}
            type="search"
            placeholder="Search tokens…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            aria-label="Search theme tokens"
          />
          {hasOverrides && (
            <button type="button" className={styles.resetBtn} onClick={reset}>
              Reset
            </button>
          )}
        </div>

        <div className={styles.body}>
          {tokens.length === 0 ? (
            <p className={styles.empty}>No theme tokens found.</p>
          ) : (
            groups.map((group, index) => (
              <Group
                key={group.label}
                label={group.label}
                tokens={group.tokens}
                isOpen={isGroupOpen(group.label, index)}
                onToggle={() => {
                  setOpenGroups((prev) => ({
                    ...prev,
                    [group.label]: !isGroupOpen(group.label, index),
                  }));
                }}
              />
            ))
          )}
        </div>
      </aside>
    </>
  );
}
