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
│   └── <Domain>.tsx           # All step components in one file
├── block-compositions/        # Optional — one file per decomposed composite block
│   └── <Block>Composition.tsx
└── routes.tsx                 # Route tree, layout shell inlined
```

Single-file step components are intentional — partners read top-to-bottom and see the whole flow. Don't fragment unless a file gets unmanageable.

`block-compositions/` only exists when a step's SDK block is *itself* a composition you've chosen to rebuild from its sub-blocks — see "Phase 7: Block compositions" below.

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

## Phase 7: Block compositions (decomposing a composite block)

Some SDK blocks are *themselves* compositions — they run their own internal `Flow`/state machine over smaller sub-blocks. For example `EmployeeOnboarding.Compensation` is a jobs-list + edit-compensation flow, and `CompanyOnboarding.DocumentSigner` is an assign-signatory + document-list + signature-form flow. When the SDK also exports those sub-blocks, you can demonstrate the next level down: rebuild the single step from its sub-blocks, giving each its own URL.

Do this **in addition to** the all-in-one block, not as a replacement of the concept — the all-in-one stays the recommended default, and the comments (below) always point a partner back "up a level."

### When to build one

Only when the SDK exports the sub-blocks (check the namespace, e.g. `CompanyOnboarding.LocationsList` / `LocationForm`). If a sub-block isn't exported, you can't decompose that step — stop and note the missing export rather than reaching into SDK internals.

### Shape

One self-contained component per composite block, in `block-compositions/<Block>Composition.tsx`. It owns a nested `<Routes>` subtree and is mounted at a **splat route** in place of the single-block step. Sibling steps stay flat.

```tsx
export function <Block>Composition({
  entityId,
  basePath,   // absolute path this is mounted at, for sub-route navigation
  onComplete, // called on the block's terminal event (what the single block's onEvent did)
}: { entityId: string; basePath: string; onComplete: () => void }) {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route index element={
        <SDKNamespace.ListSubBlock
          entityId={entityId}
          onEvent={(type, payload) => {
            switch (type) {
              case componentEvents.SUBBLOCK_EDIT:
                navigate(`${basePath}/edit/${(payload as { uuid: string }).uuid}`);
                break;
              case componentEvents.SUBBLOCK_DONE:
                onComplete();
                break;
            }
          }}
        />
      } />
      <Route path="edit/:id" element={<EditSubStep entityId={entityId} basePath={basePath} />} />
    </Routes>
  );
}
```

The parent route changes from `<Route path="<step>" element={<Step />} />` to `<Route path="<step>/*" element={<Step />} />`, and `<Step>` renders `<<Block>Composition basePath="/<domain>/<step>" onComplete={...} />`.

Use **absolute `basePath`-rooted navigation** inside the composition (`navigate(\`${basePath}/edit/${id}\`)`), not relative `".."` hops — relative math across a nested `<Routes>` is error-prone.

### Initial routing from entry data

A composite block often picks its entry by reading live data (e.g. the all-in-one `DocumentSigner` starts on the document list when a signatory already exists; `Compensation` jumps straight to the form when there are no jobs yet). In order of preference:

1. **Let a sub-block's own affordance drive it.** Often a sub-block already exposes the branch. The company `DocumentList`, for instance, renders a "manage signatories" panel that says *Assign signatory* when none exists and *Change signatory* when one does — both emit `COMPANY_FORM_EDIT_SIGNATORY`. So the composition can always enter on the document list and route to the assign step only when that event fires; no signatory fetch, no entry flag.
2. **Drive the entry from a prop you already control** — a flag like `withEmployeeI9` passed by the consuming step, or the existing create-vs-edit split (a brand-new entity routes to the create sub-route; resuming routes to the list).
3. **Fetch the live status via the SDK's own query** when the branch genuinely depends on data neither an affordance nor a caller prop can answer. Use the version-matched `@gusto/embedded-api-*` React Query hooks (the same ones the SDK block uses internally), not the persistence store — `GustoProvider` already mounts that package's query client + client context, so the demo shares the SDK's cache and stays consistent with live data. The employee `EmployeeDocumentSignerComposition` does this: its `index` route reads the employee + their forms (`useEmployeesGet` / `useEmployeeFormsList`) to decide whether the I-9 employment-eligibility step is needed (`onboardingDocumentsConfig.i9Document` enabled AND the `US_I-9` form missing or `requiresSigning`), mirroring the all-in-one `DocumentSigner` gate, then `<Navigate replace>`s to `eligibility` or `documents`.

What's banned is reading a **stale cached value off the persistence store** to branch (see "Don't reproduce SDK-internal branching"): that's the cautionary `documents-skip` tale, where a cached `onboardingStatus` had advanced by the time it was read. Fetching the same live data the SDK fetches is fine. Also avoid inventing a boolean (`startAtDocuments`-style) that just re-encodes a live-data decision the caller can't actually answer — it tends to be wrong at exactly the call site that doesn't have the data.

### Comments (two templates, wording kept identical across files)

**Flow-fallback** — top of every `pages/<Domain>.tsx` (the whole demo is a hand-routed flow):

```
// This demo composes the individual SDK <area> blocks behind react-router so each
// step owns a URL. For a turnkey integration, skip all of this and render
// <Namespace.XFlow .../>, which runs the same steps inside one component.
```

**Composition-fallback** — top of every `block-compositions/<Block>Composition.tsx`:

```
// Fine-grained rebuild of the <step> step from its sub-blocks (<A>, <B>, <C>),
// routed so each owns a URL. If you don't need this control, render
// <Namespace.<Block> .../> instead - it composes these same sub-blocks behind its
// own internal flow.
```

**Consumption-site pointer** — above the step component in `pages/` that renders the composition, so a partner scanning the flow knows the routed version exists:

```
// <Block> is a composite block: it has smaller sub-steps (<A> + <B>) that we
// route individually here. That routed implementation lives in block-compositions/.
// Render <Namespace.<Block> .../> instead for the turnkey single-component step.
```

For **nested** compositions (a sub-block that is itself a composition, e.g. assign-signatory → create/invite), add the composition-fallback comment at each level, each pointing up to its own all-in-one block.

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
