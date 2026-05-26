# SDK Feedback

Issues and observations discovered while building the demo app, for relay to the SDK team.

---

## Theme tokens

### `colorBodyHover` is not in the public `GustoSDKTheme` type

**File:** `dist/contexts/ThemeProvider/theme.d.ts`  
**Symptom:** Passing `colorBodyHover` to the `theme` prop on `GustoProvider` triggers a TypeScript excess-property error (`Object literal may only specify known properties`), even though the SDK's own stylesheet reads `var(--g-colorBodyHover)` internally.  
**Workaround:** Declare the theme object as a plain `const` with no type annotation to bypass excess-property checking.  
**Ask:** Expose `colorBodyHover` in the public `GustoSDKTheme` type, or document it as a supported informal token.

---

### `inputBorderColor` and `inputBackgroundColor` work but are undocumented

**Symptom:** Both tokens visibly affect rendered inputs when passed in the theme object, but neither appears in the public `GustoSDKTheme` type definition.  
**Workaround:** Same plain-const bypass as `colorBodyHover`.  
**Ask:** Add these to the public type or document them alongside the other input tokens (`inputRadius`, `inputLabelColor`, etc.).

---

### `fontFamily` token does not propagate into `.GSDK` subtree via CSS cascade

**Symptom:** Setting `font-family` on a host ancestor element (e.g. a wrapper `div`) has no effect inside SDK components because the `.GSDK` article wrapper sets `font-family: var(--g-fontFamily)`, breaking normal CSS inheritance.  
**Workaround:** Pass `fontFamily` directly in the SDK `theme` prop so the CSS custom property is set at the SDK boundary.  
**Ask:** Document this as the intended pattern — the theme `fontFamily` token is the only reliable way to apply a custom font inside SDK components.
