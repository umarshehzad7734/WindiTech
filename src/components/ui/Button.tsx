import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Interaction feedback is fast and physical: a 1px lift, a colour shift and a
 * soft shadow. Transitions are scoped to the properties that change so nothing
 * triggers layout work, and the press state returns the lift immediately.
 */
const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-[background-color,color,border-color,box-shadow,transform] " +
  "duration-[--dur-base] ease-[--ease-out-soft] " +
  "hover:-translate-y-px active:translate-y-0 active:duration-[--dur-fast] " +
  "disabled:pointer-events-none disabled:opacity-60 disabled:hover:translate-y-0";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-contrast shadow-[0_1px_2px_rgba(0,0,0,0.25)] " +
    "hover:bg-accent-hover hover:shadow-[0_8px_24px_-8px_var(--color-accent-line)]",
  secondary:
    "border border-line-strong bg-surface-raised text-fg " +
    "hover:border-accent hover:text-accent hover:shadow-[0_8px_24px_-12px_var(--color-accent-line)]",
  ghost: "text-fg-muted hover:bg-surface hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm sm:text-base",
  lg: "h-12 px-6 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type StyleProps = { variant?: Variant; size?: Size };

export function Button({
  variant,
  size,
  className,
  ...rest
}: StyleProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={buttonClasses({ variant, size, className })} {...rest} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...rest
}: StyleProps & React.ComponentPropsWithoutRef<typeof Link>) {
  return <Link className={buttonClasses({ variant, size, className })} {...rest} />;
}
