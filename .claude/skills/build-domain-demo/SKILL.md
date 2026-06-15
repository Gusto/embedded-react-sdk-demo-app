---
name: build-domain-demo
description: Add a new router-driven domain demo to the embedded-react-sdk-demo-app, composing SDK block components into a flow. Use when adding a new demo (e.g., contractor onboarding, payroll, terminations, time-off), refactoring an existing demo to follow the employee-onboarding pattern, or whenever the user mentions building a domain demo, replicating the employee-onboarding pattern, or composing SDK blocks behind a router.
---

# Build Domain Demo

Reference for adding a new domain demo to `frontend/src/demos/<domain>/` that composes the SDK's individual block components behind `react-router-dom`. The employee-onboarding demo (`frontend/src/demos/employee-onboarding/`) is the reference implementation — follow its shape unless there's a specific reason not to.

The point of these demos is to be **partner-readable reference code**. Optimize for "a partner can copy this file and understand what's happening at a glance," not for production hardening.

## Comments: be stingy

Write the absolute minimum number of comments. The persona reading every comment is a **partner engineer reviewing this code to learn how to integrate the SDK** — someone fluent in React and TypeScript but new to *this* SDK's blocks, events, and flow shape. Comment only to help that person past something they could not infer from the code itself.

Default to **zero** comments. Add one only when **all** of these hold:

- It explains *why*, never *what*. If the code already says what it does (a `navigate`, a `switch`, a prop), a comment restating it is noise — delete it.
- It covers something genuinely non-standard or surprising: an SDK quirk, a deliberate deviation from the SDK flow, a non-obvious event/payload contract, or a "this looks wrong but is intentional" decision.
- A competent partner engineer reading the code top-to-bottom would actually be confused or make a wrong assumption without it.

Concretely:

- **No narration.** `// Navigate to next step`, `// Handle the event`, `// Render the card` — all banned.
- **No section banners or labels** restating the function/route name.
- **Don't comment standard patterns** the skill already prescribes (using `componentEvents.*`, `useParams`, splitting create/edit, the pathless grouping route). They're conventions; the reader will see them everywhere.
- **Do** comment a real SDK gotcha — e.g. "the SDK fires `X` on save but the form handles the success state itself, so we only navigate on cancel," or "this status is stale by the time the next step mounts; let the block read it live."

When you do comment, write it *to* the partner engineer: explain the SDK behavior or the trade-off as if helping them avoid a mistake, not as if labeling your own code. If you can't articulate a concrete misunderstanding the comment prevents, don't write it.

## Phase 1: SDK State Machine Diligence

Before writing any demo code, read the SDK's Flow source to understand the actual flow you're recreating. Skipping this leads to missed branches, wrong props, and brittle "looks right but doesn't match" demos.

The SDK lives at `../embedded-react-sdk/` (sibling of this repo). For domain `<X>`, look in `src/components/<area>/<X>Flow/`:

- **`<X>Flow.tsx`** — the top-level SDK Flow component. Read its props (e.g., `companyId`, `isAdmin`, `withEmployeeI9`, `defaultValues`, `isSelfOnboardingEnabled`). These are the toggles a partner using the all-in-one Flow can set; your demo should expose the equivalent through whatever maps to each step.
- **`<x>StateMachine.ts`** — `robot3` state machine. This is the source of truth for:
  - Every step (state node) in the flow
  - The order steps run in
  - Event names that transition between steps
  - **Guards** — conditional skips (e.g., self-onboarding skipping admin-only steps, I-9 only when enabled). Each guard is a branch you'll need to mirror in your router (or deliberately not mirror — see "Don't reproduce SDK-internal branching" below).
  - Context fields each step reads from / writes to
- **`<X>FlowComponents.tsx`** — maps machine states to the React components they render. This tells you which SDK exports (`EmployeeOnboarding.Profile`, `EmployeeOnboarding.Compensation`, etc.) are the public block components your demo composes.

Capture from this read:

1. The ordered list of steps and the route names you'll give them.
2. Every conditional branch (guard) and what status / flag drives it.
3. What data each step needs as a prop, and which prior step's event payload provides it. This becomes your persistence schema (next phase).
4. The event constants the blocks emit on completion (use `componentEvents.*`, not string literals).

If a step has multiple events you handle, plan a `switch`. If a step only has one event you care about, an `if` is fine.

## Phase 2: File Layout

Mirror `frontend/src/demos/employee-onboarding/`:

```
demos/<domain>/
├── pages/
│   └── <Domain>.tsx       # All step components in one file
└── routes.tsx             # Route tree, layout shell inlined
```

Single-file step components are intentional — partners read top-to-bottom and see the whole flow. Don't fragment unless a file gets unmanageable.

## Phase 3: Routes (`routes.tsx`)

The routes file should make the entire flow's URL shape visible at a glance.

- **Inline the layout shell** in the route element rather than exporting a `Shell` component. If the wrapper is just `<CenteredPage><Outlet /></CenteredPage>`, write that inline.
- Use a top-level route for the list (index) and any pre-entity step (e.g., `path="new"`).
- For per-entity steps, use a **pathless grouping route** (`<Route path=":entityId">` with no `element`) so children inherit the param without needing a layout component:

```tsx
<Route path="/<domain>" element={<CenteredPage><Outlet /></CenteredPage>}>
  <Route index element={<List />} />
  <Route path="new" element={<CreateStep />} />
  <Route path=":entityId">
    <Route path="step-a" element={<StepA />} />
    <Route path="step-b" element={<StepB />} />
    {/* ... */}
  </Route>
</Route>
```

Then register it in `App.tsx` alongside the other `*Routes` exports.

## Phase 4: Step components (`pages/<Domain>.tsx`)

Each step is a small, focused function component.

```tsx
export function StepA() {
  const { entityId } = useParams<"entityId">();
  const navigate = useNavigate();
  return (
    <SDKNamespace.StepA
      entityId={entityId!}
      onEvent={(type) => {
        if (type === componentEvents.STEP_A_DONE) {
          navigate(`/<domain>/${entityId}/step-b`);
        }
      }}
    />
  );
}
```

Conventions:

- **`useParams<"entityId">()`** for path params, with the `!` non-null assertion at the use site (the route structure guarantees presence).
- **`useNavigate()`** from `react-router-dom` for transitions.
- **`switch (type)`** for handlers with multiple cases; **`if (type === ...)`** for single-event handlers. Don't switch on one case — it's just boilerplate.
- **`componentEvents.*`** constants from the SDK for event types. Never string-literal them.

### Splitting "create" from "edit"

Most domains have a "create" step that runs before the entity exists (the SDK creates the entity on submit and returns the new uuid). Don't try to share one component for both modes — the optional-context dance gets ugly fast. Split into:

- `<Step>Create` — mounted at `/new`, no `entityId`. On the create event, capture `data.uuid`, persist anything later steps need, and `navigate` to the next step under the new uuid.
- `<Step>Edit` — mounted at `/:entityId/<step>`. Reads `entityId` from `useParams`, persists on submit, navigates.

These have meaningfully different handlers — sharing one component requires `useOutletContext<... | undefined>` and `setCtx?.(...)`, which is exactly the kind of "what is happening here" friction these demos are meant to avoid.

## Phase 5: Persistence between steps

When a later step needs data from an earlier step's event payload (e.g., `Compensation` needs `startDate` from the Profile event), use `createPersistedStore<T>` from `shared/persistedStore.ts`. It's a tiny `localStorage` wrapper — load/save/clear, namespaced by a prefix.

```tsx
type DomainContext = {
  fieldA?: string;
  fieldB?: string;
};

// Stand-in for your own state management or database. <ConsumerStep> needs
// fieldA and fieldB, which the SDK hands us in <ProducerStep>'s event
// payload — so we stash them per-entity here and read them back when
// <ConsumerStep> mounts. Backed by localStorage just so the demo
// survives a refresh.
const domainStore = createPersistedStore<DomainContext>(
  "gusto-demo-<domain>:",
);
```

Usage:

- `domainStore.save(entityId, { fieldA, fieldB })` in the producer step's event handler.
- `const { fieldA, fieldB } = domainStore.load(entityId!) ?? {};` at the top of the consumer step.
- `domainStore.clear(entityId!)` on the final-success event (e.g., after the summary block completes).

### Persistence rules

- **Only persist what later steps actually need as props or for branching**. Empty fields you "might want later" are noise.
- **Never persist status fields the SDK manages internally**. The SDK updates onboarding status, payment status, etc. as the flow progresses; your cached copy from an earlier event is stale by the time a later step runs. If a step needs the live status, the SDK block already reads it — let it.
- **Never invent your own loading state or duplicate SDK loading skeletons**. The blocks render their own.

## Phase 6: Branching

If the SDK state machine has guards based on initial choices the user makes early in the flow (e.g., an admin-set "self-onboarding" toggle that persists for the whole flow), mirror them in your router with a `ReadonlySet<string>` constructed from SDK status enums:

```tsx
const SELF_ONBOARDING_STATUSES: ReadonlySet<string> = new Set([
  EmployeeOnboardingStatus.SELF_ONBOARDING_PENDING_INVITE,
  EmployeeOnboardingStatus.SELF_ONBOARDING_INVITED,
  // ...
]);

// In the consumer step:
const isSelfOnboarding = SELF_ONBOARDING_STATUSES.has(status ?? "");
navigate(isSelfOnboarding ? "/<domain>/.../skip-target" : "/<domain>/.../normal-next");
```

Construct from `EmployeeOnboardingStatus.*` (or whichever enum the SDK exports), not string literals — the build will fail on a typo or stale rename.

### Don't reproduce SDK-internal branching

If a guard depends on **live** status that updates throughout the flow (e.g., "is the I-9 already complete?"), don't try to read it from cached state. Either:

1. Always navigate to the SDK block and let it decide what to render (it has access to live data).
2. If you genuinely need to branch on live status, fetch it via the SDK's hook/query — don't read from the persistence store.

The reproduced employee-onboarding `documents-skip` branch (now removed) is the cautionary tale: it checked a cached `onboardingStatus` from the Profile event, but by the time the user reached Deductions the real status had advanced past that value, and the EmployeeDocuments block already handles "nothing to show" itself. Don't recreate that mistake for new domains.

## Anti-patterns to avoid

These were tried in the employee-onboarding refactor and rejected. Don't reintroduce them.

| Anti-pattern | Why it's bad | Do this instead |
|---|---|---|
| `usePersistedState` hook + outlet context as the state-sharing layer | Three coordination mechanisms doing one job; localStorage is already the source of truth, the React context is redundant when only one step mounts at a time | `createPersistedStore<T>` + per-step direct reads |
| `location.state` to hand off data on the create→edit transition | Adds a `useLocation` cast plus a parallel hand-off on every `navigate`; only needed because of the shared `Profile` component | Split into `Create` / `Edit` components and write directly to the persistence store on create |
| One `Profile` component for both create and edit | Forces `useOutletContext<... \| undefined>`, `setCtx?.(...)`, optional-chained tuple destructure | Separate components |
| `useMatch` to read `:entityId` in a parent layout | Non-standard React Router pattern, hard-codes route paths | Pathless grouping route + `useParams` in each child |
| Extracting a 5-line `Shell` component for the layout | More indirection than payload | Inline `<CenteredPage><Outlet /></CenteredPage>` in `routes.tsx` |
| Comments that narrate what the code does ("// Navigate to next step") | Noise — the code says it | Be stingy (see "Comments: be stingy"): default to zero, comment only a non-obvious "why" written to the partner engineer |
| Casting `location.state` wholesale (`state as MyType`) | location.state is fully caller-controlled; runtime values may not match | Don't rely on location.state for cross-step data; use the persistence store |
| String-literal event types or status values | No build-time check on typos / SDK renames | `componentEvents.*` constants and `<DomainStatus>.*` enum values |

## Verification

After implementing:

1. `cd frontend && npx tsc -b && npm run lint && npm run build` must all pass.
2. Walk every branch from the state machine manually in the browser: happy path, each guard's skip path, cancel from each cancellable step, refresh mid-flow, and resume an existing entity from the list.
3. Reading the demo file top-to-bottom should answer "what does each step need, where does data come from, where does it go next" without jumping to the persistence helper or the routes file. If a step is genuinely non-obvious to a partner engineer, add a single "why" comment per "Comments: be stingy" — not narration.

## Reference files

- `frontend/src/demos/employee-onboarding/pages/EmployeeOnboarding.tsx` — step components reference
- `frontend/src/demos/employee-onboarding/routes.tsx` — routes + inlined shell reference
- `frontend/src/shared/persistedStore.ts` — the persistence helper
- `../embedded-react-sdk/src/components/<area>/<Domain>Flow/` — SDK source for the domain you're recreating
