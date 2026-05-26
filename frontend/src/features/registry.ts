import { bringYourOwnDataFeature } from "./bring-your-own-data";
import { componentAdaptersFeature } from "./component-adapters";
import { themingFeature } from "./theming";
import { translationsFeature } from "./translations";
import type { Feature } from "./types";

export const featuresBasePath = "/features";

export const features: Feature[] = [
  componentAdaptersFeature,
  themingFeature,
  translationsFeature,
  bringYourOwnDataFeature,
];
