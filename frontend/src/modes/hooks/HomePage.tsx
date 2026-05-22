export function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-16">
      <header className="flex flex-col gap-4">
        <p className="m-0 text-xs font-semibold uppercase tracking-wider text-blue-500 dark:text-[#E15A43]">
          Build method
        </p>
        <h1 className="m-0 text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Hooks
        </h1>
        <p className="m-0 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          Headless React hooks that give you SDK data, form state, validation,
          and submit handlers — and nothing else. No rendered UI, no opinions
          about layout. You compose the visible part of the experience
          entirely on your own terms.
        </p>
      </header>

      <Section heading="What it is">
        <p>
          Each hook (
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
            useEmployeeDetailsForm
          </code>
          ,{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
            useHomeAddressForm
          </code>
          , and so on) returns the same form machinery a Block or Workflow
          would use internally: a typed field schema, a live form state, the
          loading / error / success flags, and a{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
            handleSubmit
          </code>{" "}
          that talks to Gusto. Pair it with{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
            SDKFormProvider
          </code>{" "}
          and the bound{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
            Fields.*
          </code>{" "}
          components if you want pre-wired inputs, or wire fields yourself if
          you want full control.
        </p>
        <p>
          There is no SDK-rendered chrome — no card, no submit button, no
          step indicator. The hook hands you state and behavior; you render
          everything visible.
        </p>
      </Section>

      <Section heading="When to reach for it">
        <p>
          Hooks are the right call when the SDK's rendered UI — even with
          theming and adapter overrides — is still further from your design
          system than you can live with. Common shapes:
        </p>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-6">
          <li>
            Your product has a bespoke form layout (mixed-column grids,
            inline help, conditional reveals) that doesn't map cleanly onto
            the SDK's stock field layout.
          </li>
          <li>
            You need to compose multiple Gusto forms into a single submit —
            for example, saving employee details and home address as one
            atomic action with one button.
          </li>
          <li>
            You want SDK validation and persistence but you're rendering
            inside an unusual surface — a side panel, a modal stacked over
            other forms, a multi-column dashboard.
          </li>
        </ul>
      </Section>

      <Section heading="What you get">
        <p>Even at this level, the SDK still owns the hard parts:</p>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-6">
          <li>
            <strong>Schema + validation.</strong> Field rules, required-ness,
            cross-field constraints, and server error mapping all come from
            the hook's resolver.
          </li>
          <li>
            <strong>API integration.</strong> Reads and writes go through the
            SDK's typed client; you don't construct a request.
          </li>
          <li>
            <strong>Composition.</strong>{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
              composeSubmitHandler
            </code>{" "}
            lets you submit several hooks in a single pass with shared error
            handling.
          </li>
          <li>
            <strong>Bound field components.</strong> If you want the SDK's
            rendered field for one input but a custom component for another,
            the hook's{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
              form.Fields
            </code>{" "}
            are individually opt-in.
          </li>
        </ul>
      </Section>

      <Section heading="What you own">
        <p>
          Hooks push the most responsibility to your application. You're
          responsible for:
        </p>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-6">
          <li>
            <strong>Every visible element.</strong> Inputs, labels, helper
            text, error display, submit buttons, layout — none of it comes
            from the SDK.
          </li>
          <li>
            <strong>Loading + empty states.</strong> The hook exposes flags;
            you decide how to render them (skeleton, spinner, optimistic
            content).
          </li>
          <li>
            <strong>Accessibility.</strong> You're rendering the form, so
            labels, focus management, and ARIA wiring are yours to get
            right.
          </li>
          <li>
            <strong>Step orchestration.</strong> If you're composing multiple
            hooks into a flow, the navigation between them is host code.
          </li>
        </ul>
      </Section>

      <Section heading="How it fits with the other modes">
        <p>
          Hooks are the escape hatch. You reach for them when no amount of
          theming or adapter overrides on a Block can produce the design
          you want, or when the data shape you need crosses multiple forms
          in a single user action. It's rare to build a whole integration
          out of Hooks — most apps use them surgically for one or two
          high-design screens and use Blocks or Workflows everywhere else.
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
