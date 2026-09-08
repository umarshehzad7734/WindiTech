import { SplitText } from "@/components/motion/SplitText";
import { cn } from "@/lib/utils";

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "mb-4 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent",
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 bg-accent/50" />
      {children}
    </p>
  );
}

export function SectionHeading({
  as: Tag = "h2",
  id,
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  as?: "h1" | "h2";
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow className={align === "center" ? "justify-center" : undefined}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Tag
        id={id}
        className={cn(Tag === "h1" ? "text-4xl" : "text-3xl", "text-fg")}
      >
        <SplitText text={title} />
      </Tag>
      {intro ? (
        <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
