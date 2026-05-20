import type { TextProps } from "@gusto/embedded-react-sdk";

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
} as const;

const weightClasses = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

const alignClasses = {
  start: "text-left",
  center: "text-center",
  end: "text-right",
} as const;

const variantClasses = {
  supporting: "text-neutral-500 dark:text-neutral-400",
  leading: "text-neutral-900 leading-relaxed dark:text-neutral-100",
} as const;

export function Text({
  as = "p",
  size = "md",
  textAlign,
  weight,
  variant,
  children,
  className,
  id,
}: TextProps) {
  const Tag = as;
  return (
    <Tag
      id={id}
      className={`font-sans ${sizeClasses[size]} ${
        weightClasses[weight ?? "regular"]
      } ${textAlign ? alignClasses[textAlign] : ""} ${
        variant ? variantClasses[variant] : "text-neutral-900 dark:text-neutral-100"
      } ${className ?? ""}`}
    >
      {children}
    </Tag>
  );
}
