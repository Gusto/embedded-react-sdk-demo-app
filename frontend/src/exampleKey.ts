// Each example gets a unique key composed from its location in the nav tree.
// Used to identify which example is currently selected in the sidebar.
export function exampleKey(domainName: string, ...path: string[]): string {
  return [domainName, ...path].join(" / ");
}
