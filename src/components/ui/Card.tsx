import { cn } from "@/lib/utils";

export function Card({
  className,
  interactive = false,
  children,
}: {
  className?: string;
  /** Adds hover affordances. Use only when the whole card is a link. */
  interactive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-line bg-surface-raised p-6 sm:p-7",
        "shadow-[0_1px_2px_rgba(6,8,9,0.04)]",
        interactive &&
          "transition duration-300 ease-[var(--ease-out-soft)] " +
            "hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_12px_32px_-12px_rgba(6,8,9,0.22)]",
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
    <Tag className={cn("text-lg font-semibold text-fg", className)}>{children}</Tag>
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
