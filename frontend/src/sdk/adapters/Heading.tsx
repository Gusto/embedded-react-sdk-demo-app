import type { HeadingProps } from "@gusto/embedded-react-sdk";

const sizeClasses = {
  h1: "text-4xl font-semibold leading-tight tracking-tight",
  h2: "text-2xl font-semibold leading-snug tracking-tight",
  h3: "text-xl font-semibold leading-snug",
  h4: "text-lg font-semibold leading-snug",
  h5: "text-base font-semibold leading-snug",
  h6: "text-sm font-semibold uppercase tracking-wide",
} as const;

const alignClasses = {
  start: "text-left",
  center: "text-center",
  end: "text-right",
} as const;

export function Heading({
  as,
  styledAs,
  textAlign,
  children,
  className,
  id,
}: HeadingProps) {
  const Tag = as;
  const styleKey = styledAs ?? as;
  return (
    <Tag
      id={id}
      className={`font-sans text-neutral-900 ${sizeClasses[styleKey]} ${
        textAlign ? alignClasses[textAlign] : ""
      } ${className ?? ""}`}
    >
      {children}
    </Tag>
  );
}
