import { ArrowRight } from "lucide-react";
import { notFound } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <Container>
      <div className="flex min-h-[60vh] max-w-xl flex-col justify-center py-24">
        <LogoMark className="h-10 w-10 text-accent" />
        <p className="mt-8 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.16em] text-fg-subtle">
          404
        </p>
        <h1 className="mt-3 text-4xl text-fg">{notFound.heading}</h1>
        <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
          {notFound.body}
        </p>
        <div className="mt-10">
          <ButtonLink href={notFound.cta.href} size="lg">
            {notFound.cta.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
