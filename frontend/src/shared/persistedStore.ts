// Creates a namespace-prefixed, JSON-serialized localStorage store typed to T.
// Useful for demo state that should survive a hard refresh without pulling in
// a state management library.
//
// In a real app, replace the underlying load/save/clear with calls to your
// own state management or backend.
export function createPersistedStore<T>(keyPrefix: string) {
  const storageKey = (id: string) => `${keyPrefix}${id}`;
  return {
    load(id: string): T | null {
      const raw = localStorage.getItem(storageKey(id));
      if (!raw) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },
    save(id: string, value: T): void {
      localStorage.setItem(storageKey(id), JSON.stringify(value));
    },
    clear(id: string): void {
      localStorage.removeItem(storageKey(id));
    },
  };
}
