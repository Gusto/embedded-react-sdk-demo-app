import type { AdapterOption } from "./context";
import { materialUiAdapter } from "./material-ui";

// Available component adapters, surfaced in the demo tray. Add a new entry here
// (with its component map) to make another design system selectable.
export const adapters: AdapterOption[] = [
  {
    id: "default",
    label: "Default (SDK)",
    description: "The SDK's built-in React Aria components.",
  },
  {
    id: "material-ui",
    label: "Material UI",
    description: "SDK primitives rendered with Material UI components.",
    components: materialUiAdapter,
  },
];
