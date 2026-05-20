import { isMode, type Mode } from "./types";

const STORAGE_KEY = "demo-mode";

export function readLastMode(): Mode {
  if (typeof window === "undefined") return "workflows";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isMode(stored) ? stored : "workflows";
}

export function writeLastMode(mode: Mode): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, mode);
}
