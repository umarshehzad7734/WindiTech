import { cn } from "@/lib/utils";
import { Container } from "./Container";

type SectionProps = {
  id?: string;
  className?: string;
  containerClassName?: string;
  /** Renders a subtle tinted band instead of the page background. */
  tone?: "default" | "muted";
  size?: "default" | "lg" | "sm";
  "aria-labelledby"?: string;
  children: React.ReactNode;
};

const sizes = {
  sm: "py-14 sm:py-16",
  default: "py-16 sm:py-20 lg:py-24",
  lg: "py-20 sm:py-24 lg:py-32",
};

export function Section({
  id,
  className,
  containerClassName,
  tone = "default",
  size = "default",
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      {...rest}
      className={cn(
        sizes[size],
        tone === "muted" && "border-y border-line bg-surface",
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
