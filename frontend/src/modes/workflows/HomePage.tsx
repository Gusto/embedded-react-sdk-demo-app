export function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-16">
      <header className="flex flex-col gap-4">
        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-blue-500 dark:text-[#E15A43]">
          Build method
        </p>
        <h1 className="m-0 text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Workflows
        </h1>
        <p className="m-0 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          Drop-in, multi-step flows that orchestrate an entire Gusto product
          surface end-to-end — onboarding an employee, running payroll, paying
          contractors — with one component import and a handful of callbacks.
        </p>
      </header>

      <Section heading="What it is">
        <p>
          A Workflow is a complete user journey shipped as a single React
          component. The SDK owns every step: data fetching, validation,
          intermediate routing between sub-screens, error handling, and the
          eventual write to Gusto's API. You drop{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
            &lt;Employee.OnboardingFlow /&gt;
          </code>{" "}
          into a route, hand it an employee id (or let it create one), and the
          SDK walks the user through profile, compensation, taxes, payment
          method, and signing — surfacing events on completion or error so
          your host app can react.
        </p>
        <p>
          Every Workflow is built on the same underlying blocks and hooks
          available in the other modes, so you can think of Workflows as the
          opinionated, batteries-included assembly that we already maintain
          for you.
        </p>
      </Section>

      <Section heading="When to reach for it">
        <p>
          Workflows are the right call when your product needs Gusto's
          functionality but doesn't have a strong opinion about the
          step-by-step UX inside that surface. Common shapes:
        </p>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-6">
          <li>
            You're shipping a payroll or HR feature for the first time and
            want a working integration in days, not quarters.
          </li>
          <li>
            Gusto's flow is the source of truth for compliance-sensitive steps
            (W-4, I-9, direct deposit) and you'd rather not own that surface.
          </li>
          <li>
            Your product wraps Gusto rather than embeds it deeply — the user
            launches into a focused task, finishes it, and returns to your app.
          </li>
        </ul>
      </Section>

      <Section heading="What you get out of the box">
        <p>
          A Workflow handles a lot of work you'd otherwise reproduce yourself:
        </p>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-6">
          <li>
            <strong>Step orchestration.</strong> The SDK chooses what to show
            next based on the data it loads, including skipping steps that
            don't apply (e.g. self-onboarding vs admin-onboarding).
          </li>
          <li>
            <strong>Data wiring.</strong> Reads, writes, retries, optimistic
            updates, and cache invalidation are all handled internally — no
            hand-rolled API client needed.
          </li>
          <li>
            <strong>Validation + error UX.</strong> Field-level validation,
            server error mapping, and recovery paths come pre-built.
          </li>
          <li>
            <strong>Events.</strong> The SDK emits typed events for milestones
            (e.g.{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800">
              EMPLOYEE_PROFILE_DONE
            </code>
            ,{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800">
              RUN_PAYROLL_SUBMITTED
            </code>
            ) so your host app can route, toast, or run downstream side
            effects.
          </li>
          <li>
            <strong>Theming &amp; component overrides.</strong> Even in
            Workflow mode you can re-skin every primitive via the SDK's theme
            tokens and component adapters, so the flow looks native to your
            product.
          </li>
        </ul>
      </Section>

      <Section heading="What you give up">
        <p>
          Workflows trade flexibility for speed. The most common things to
          know up front:
        </p>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-6">
          <li>
            <strong>You don't choose the step order.</strong> Inserting a host
            step in the middle of a flow (a custom welcome, a confirmation
            screen, a host-owned data capture) isn't supported in this mode —
            that's what <em>Blocks</em> is for.
          </li>
          <li>
            <strong>Navigation is internal.</strong> The Workflow advances
            itself; your router only sees a transition when the entire
            Workflow completes or the user exits.
          </li>
          <li>
            <strong>UX evolves with the SDK.</strong> When we ship visual or
            content changes to a Workflow in a new SDK version, they land in
            your product on upgrade. You can override individual components
            and tokens, but you don't fork the flow.
          </li>
        </ul>
      </Section>

      <Section heading="How it fits with the other modes">
        <p>
          You don't have to commit to a single mode per app. Most production
          integrations use Workflows where speed matters (employee
          onboarding), drop down to Blocks where the product needs custom
          orchestration (a payroll list with a host-owned step), and use
          Hooks for the screens where the visual design is uniquely yours.
          Workflows are the highest-leverage starting point; the other modes
          are there when you outgrow the defaults.
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
