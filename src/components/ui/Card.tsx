import { cn } from "@/lib/utils";

/**
 * Surface for grouped content.
 *
 * `interactive` adds the hover treatment used across the site: a small lift,
 * a brand-tinted border, a soft shadow, and a hairline of brand colour that
 * fades in along the top edge (`card-edge`, defined in globals.css). It is
 * deliberately quiet — the movement is 2px, not a pop.
 */
export function Card({
  className,
  interactive = false,
  children,
}: {
  className?: string;
  /** Use when the whole card is a link or otherwise actionable. */
  interactive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-line bg-surface-raised p-6 sm:p-7",
        interactive && [
          "card-edge",
          "transition-[transform,border-color,box-shadow,background-color]",
          "duration-[--dur-slow] ease-[--ease-out-soft]",
          "hover:-translate-y-0.5 hover:border-line-strong",
          "hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.6)]",
        ],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  as: Tag = "h3",
  className,
  children,
}: {
  as?: "h2" | "h3" | "h4";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "text-lg font-semibold text-fg transition-colors duration-[--dur-base]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("text-sm leading-relaxed text-fg-muted", className)}>
      {children}
    </p>
  );
}

/**
 * Icon plate used at the top of feature cards. Picks up brand colour when the
 * surrounding card is hovered.
 */
export function CardIcon({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-xl",
        "border border-line bg-surface text-accent",
        "transition-[background-color,border-color,transform] duration-[--dur-slow] ease-[--ease-out-soft]",
        "group-hover:border-accent/40 group-hover:bg-accent-soft",
        className,
      )}
    >
      {children}
    </span>
  );
}
