import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";

// `useState` with localStorage read-through and write-back at the given
// key. A `null` key opts out (state stays in memory only). Pick a
// namespaced key — localStorage is shared across the origin.
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
