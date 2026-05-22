# SDK feedback

Running notes from building the demo app where our adapter components and host
styles fight with the SDK's internal rendering. Each entry is a place where the
host (us) tried to apply a style on an outer wrapper and the SDK's inner
`<Text>` / styled element won the cascade, forcing a workaround. These are
signals that the SDK could change to make composition friendlier.

## Pattern: inner `<Text>` overrides outer typography

When an SDK component is rendered with `components={...}` adapters enabled,
the SDK frequently wraps the user-supplied children (or its own text content)
in a `<Text>` component that emits its own `font-weight`, `font-family`, or
color class. That inner class wins over whatever the outer adapter applies
to its root element, so adapters that want to control typography around their
content have to force-cascade with `**:` + `!important`.

### Hit list

#### `Badge` — `font-weight` on the chip is overridden

- **Adapter:** [`frontend/src/sdk/adapters/Badge.tsx`](frontend/src/sdk/adapters/Badge.tsx)
- **Symptom:** Setting `font-bold` (or `font-semibold`) on the outer `<span>`
  had no effect; the chip text stayed at the SDK's default weight.
- **Cause:** The SDK appears to wrap badge children in a `<Text>` component.
  Our Text adapter emits an explicit `font-normal` class when no `weight`
  prop is passed, which beats the span's `font-bold` by specificity.
- **Workaround:** `**:font-semibold!` on the badge `<span>` so the weight
  cascades to every descendant with `!important`.

#### `Table` cells — primary/secondary weights leak into the SDK's inner text

- **Adapter:** [`frontend/src/sdk/adapters/Table.tsx`](frontend/src/sdk/adapters/Table.tsx)
- **Symptom:** Cell text rendered semibold even when the cell wrapper
  set `font-normal`, because the SDK passed cell `content` wrapped in a
  `<Text weight="semibold">` (and other variants).
- **Cause:** Same pattern: SDK-controlled inner `<Text>` always emits a
  `font-weight` class, so the wrapper's class never reaches the visible text.
- **Workaround:** Stopped overriding font-weight at the cell wrapper and
  defaulted our Text adapter to emit `font-normal` when no `weight` prop is
  given, so SDK callers that don't specify a weight get a clean baseline
  the host can theme.

### Recommendation for the SDK

For components that are likely to be host-styled (Badge, Table cells, Card
titles, list rows, etc.), prefer one of:

1. Render plain text children (let the host control typography via the
   wrapping element), OR
2. Pass typography defaults via CSS custom properties on the host wrapper so
   hosts can override at the boundary (e.g. `--gusto-badge-font-weight`),
   OR
3. Emit Text/Heading children whose default classes use `:where()` selectors
   so they're 0-specificity and any host class can override.

Anything that pins a `font-weight` / `font-family` / `color` class on inner
elements forces host adapters into either `!important` workarounds or
duplicating the SDK's class names, both of which couple us to internals.

## Pattern: event payload shapes are undocumented and implicit

Some `componentEvents` payloads are described by neither their shape nor their
field names — you have to read the SDK source to learn what each event hands
back. The shape isn't always intuitive, especially when an event "spreads" a
model object rather than wrapping it under a descriptive key.

### Hit list

#### `EMPLOYEE_PROFILE_DONE` — payload is the bare Employee, identified by `uuid`

- **Page:** [`frontend/src/modes/blocks/examples/intermediate-host-step/ProfilePage.tsx`](frontend/src/modes/blocks/examples/intermediate-host-step/ProfilePage.tsx)
- **Symptom:** Reading `payload.employeeId` returned `undefined`, so we
  ended up routing to `.../extra-data/unknown` and the literal string
  `"unknown"` rode the URL through to a "Gusto record: unknown" message
  on the confirmation page.
- **Cause:** `EMPLOYEE_PROFILE_DONE` emits the Employee object directly
  (spread, not wrapped), so the id lives on `uuid` (the standard Gusto
  identifier). The pattern is consistent for Employee data but inconsistent
  with `RUN_PAYROLL_SELECTED` / `REVIEW_PAYROLL`, which both emit
  `{ payrollUuid, payPeriod }` — i.e. wrapped, with a descriptively-named
  id field. There's no in-IDE hint which an event uses.
- **Workaround:** Read `payload.uuid` instead and guard on its presence.

### Recommendation for the SDK

For every `componentEvents.*` value, either:

1. **Export a typed payload map** keyed by event name, so partners get
   IDE autocompletion / a compile-time error if they read the wrong field
   (e.g. `EventPayloads["employee/profile/done"] = { uuid: string; ... }`),
   OR
2. **Document the payload shape in JSDoc** on each event constant, OR
3. **Normalize the shape** to always wrap the model under a descriptive
   key (`{ employee: Employee }`, `{ payroll: Payroll }`) so the event name
   and the payload's top-level keys read the same way across the SDK.

Right now you can hit the SDK source to figure this out, but it shouldn't
require that. A demo developer's first read of `onEvent` should be
self-explanatory.
