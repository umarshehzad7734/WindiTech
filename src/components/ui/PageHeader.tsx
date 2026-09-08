import { Container } from "./Container";
import { Eyebrow } from "./SectionHeading";

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand-400/[0.06] blur-[110px]"
      />
      <Container className="relative">
        <div className="max-w-3xl py-16 sm:py-20 lg:py-24">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="text-4xl text-fg">{title}</h1>
          {lead ? (
            <p className="mt-6 text-base leading-relaxed text-fg-muted sm:text-lg">
              {lead}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
