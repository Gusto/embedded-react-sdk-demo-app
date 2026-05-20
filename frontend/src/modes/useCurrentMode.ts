import { useLocation } from "react-router-dom";
import { isMode, type Mode } from "./types";

/**
 * Derives the active demo mode from the URL prefix. Falls back to "workflows"
 * for unknown or root paths so the sidebar always has something to render.
 */
export function useCurrentMode(): Mode {
  const { pathname } = useLocation();
  const first = pathname.split("/")[1];
  return isMode(first) ? first : "workflows";
}
