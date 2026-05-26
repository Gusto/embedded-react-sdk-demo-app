import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ActionCardProps {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  /** Either a path to navigate to, or an onClick handler. */
  to?: string;
  onClick?: () => void;
}

export function ActionCard({
  eyebrow,
  title,
  body,
  cta,
  to,
  onClick,
}: ActionCardProps) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-indigo-500/40"
    >
      {cta}
    </button>
  );
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-6">
      <p className="m-0 text-xs font-semibold uppercase tracking-wider text-indigo-600">
        {eyebrow}
      </p>
      <h2 className="m-0 text-xl font-semibold tracking-tight text-neutral-900">
        {title}
      </h2>
      <p className="m-0 text-sm leading-relaxed text-neutral-600">{body}</p>
      <div className="pt-2">
        {to ? (
          <Link to={to} className="inline-block">
            {button}
          </Link>
        ) : (
          button
        )}
      </div>
    </div>
  );
}

interface DetailCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function DetailCard({
  title,
  description,
  children,
  footer,
}: DetailCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 text-base font-semibold text-neutral-900">{title}</h2>
        {description ? (
          <p className="m-0 text-sm text-neutral-600">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 text-sm text-neutral-700">
        {children}
      </div>
      {footer ? <div className="pt-2">{footer}</div> : null}
    </div>
  );
}

export function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-neutral-100 py-2 last:border-b-0">
      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <span className="text-sm text-neutral-900">{value}</span>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6 flex items-start justify-between gap-6">
      <div className="flex flex-col gap-1">
        {eyebrow ? (
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="m-0 text-3xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        {description ? (
          <p className="m-0 text-base text-neutral-600">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function HatchwellToast({ message }: { message: string }) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-lg shadow-emerald-500/10">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
        ✓
      </span>
      <p className="m-0 text-sm font-medium text-neutral-900">{message}</p>
    </div>
  );
}

export function Drawer({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
      <div className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="m-0 text-base font-semibold text-neutral-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
}
