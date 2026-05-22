export function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-16">
      <header className="flex flex-col gap-4">
        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-blue-500 dark:text-[#E15A43]">
          Build method
        </p>
        <h1 className="m-0 text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Blocks
        </h1>
        <p className="m-0 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          Individual SDK components — payroll lists, employee profiles, single
          form steps — that you compose into a flow you own. You keep the
          SDK's data wiring, validation, and form UI; you decide the routing,
          step order, and what sits between them.
        </p>
      </header>

      <Section heading="What it is">
        <p>
          A Block is a self-contained SDK component for a single concept:{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
            Payroll.PayrollList
          </code>
          ,{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
            Employee.Profile
          </code>
          ,{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
            Payroll.PayrollConfiguration
          </code>
          , and so on. Each block renders one screen's worth of UI and emits
          events when its work completes (a payroll is selected, a profile
          is saved, a configuration is reviewed). You wire those events up
          to your own router and decide what happens next.
        </p>
        <p>
          Think of Blocks as the same components Workflows use internally,
          but exposed individually so you can rearrange them, drop steps,
          insert your own steps, and swap the navigation around them.
        </p>
      </Section>

      <Section heading="When to reach for it">
        <p>
          Blocks are the right call when your product needs Gusto's
          functionality but not its end-to-end flow. Common shapes:
        </p>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-6">
          <li>
            You want to insert a host-owned step in the middle of an SDK
            flow — a welcome screen, a confirmation, capturing internal data
            (badge number, locker assignment) that Gusto doesn't track.
          </li>
          <li>
            Your product already has a navigation pattern (a multi-tab
            wizard, a side-rail stepper) and you need the SDK to slot into
            it rather than replace it.
          </li>
          <li>
            You want to mix SDK screens with screens you've built yourself —
            Gusto handles the legal/compliance steps and your team owns the
            marketing-style intro and the success state.
          </li>
        </ul>
      </Section>

      <Section heading="What you get">
        <p>Each Block ships with the heavy lifting already done:</p>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-6">
          <li>
            <strong>Data wiring.</strong> The block reads and writes through
            the SDK's API client — caching, retries, and optimistic updates
            included.
          </li>
          <li>
            <strong>Form logic + validation.</strong> Field-level rules and
            server error mapping are baked in, so submits work the same way
            they do in a Workflow.
          </li>
          <li>
            <strong>Typed events.</strong> Every block emits events at
            meaningful moments (
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800">
              RUN_PAYROLL_SELECTED
            </code>
            ,{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800">
              EMPLOYEE_PROFILE_DONE
            </code>
            ) so your host code can react without polling state.
          </li>
          <li>
            <strong>Theming + adapters.</strong> Blocks read the same theme
            tokens and accept the same component adapter overrides as
            Workflows, so visual customization carries over.
          </li>
        </ul>
      </Section>

      <Section heading="What you own">
        <p>Blocks shift more responsibility to your application:</p>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-6">
          <li>
            <strong>Routing.</strong> You decide the URL for each block, the
            order, and what triggers a transition. The SDK tells you when a
            block is done; you decide where the user goes next.
          </li>
          <li>
            <strong>Layout chrome.</strong> Headers, breadcrumbs, sidebars,
            and step indicators are yours to render around the block.
          </li>
          <li>
            <strong>Cross-step state.</strong> If your flow needs data to
            travel between blocks (an employee id, a draft payroll), you
            persist it however you persist anything else — context, URL
            params, server state.
          </li>
        </ul>
      </Section>

      <Section heading="How it fits with the other modes">
        <p>
          Blocks are the middle path between Workflows and Hooks. You reach
          for them when Workflows are too rigid (you need a host step or a
          different step order) but Hooks are more than you need (you're
          happy to use the SDK's rendered forms and lists as-is). It's
          common to start a feature in Workflows, find a single step that
          doesn't fit, and migrate just that flow to Blocks — keeping the
          rest of the integration unchanged.
        </p>
      </Section>
    </div>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="m-0 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        {heading}
      </h2>
      <div className="flex flex-col gap-3 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
        {children}
      </div>
    </section>
  );
}
