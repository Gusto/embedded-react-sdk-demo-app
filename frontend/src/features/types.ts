import type { ReactNode } from "react";

export interface Feature {
  /** Unique slug within /features. */
  key: string;
  /** Display label for the sidebar and the feature card. */
  label: string;
  /** Absolute path, e.g. "/features/component-adapters". */
  path: string;
  /** One-liner for the home grid and the page hero. */
  summary: string;
  /** Renders the body of the feature page (hero + preview + code). */
  Page: () => ReactNode;
}
