import type { ComponentType } from "react";

export type Example = {
  name: string;
  component: ComponentType;
};

export type ExampleGroup = {
  name: string;
  children: Example[];
};

export type DomainEntry = Example | ExampleGroup;

export type Domain = {
  name: string;
  examples: DomainEntry[];
};
