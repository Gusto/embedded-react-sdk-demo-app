import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";

// `usePersistedState` mirrors `useState`'s API but reads its initial value
// from localStorage at the given key on mount and writes back to that key
// whenever the value changes. Pass a `null` key to opt out of persistence
// (e.g., when the resource id isn't known yet); state is held in memory
// only until a real key arrives.
//
// localStorage is a single flat key/value store shared across the origin —
// callers must pick a namespaced key to avoid colliding with other code on
// the page.
//
// Persisting demo state in localStorage is a crutch — in a real integration
// you'd persist this in your own database, keyed by whatever resource the
// state belongs to.
export function usePersistedState<T>(
  key: string | null,
  initial: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readPersisted(key, initial));

  useEffect(() => {
    if (key === null) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function readPersisted<T>(key: string | null, fallback: T): T {
  if (key === null) return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
