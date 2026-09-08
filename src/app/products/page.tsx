import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { business, products } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: products.meta.title,
  description: products.meta.description,
  alternates: { canonical: "/products" },
  openGraph: {
    title: `${products.meta.title} | ${business.name}`,
    description: products.meta.description,
    url: `${business.url}/products`,
  },
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow={products.eyebrow}
        title={products.heading}
        lead={products.lead}
      />

      <Section aria-labelledby="capability">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <SectionHeading id="capability" title={products.capability.heading} />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-base leading-relaxed text-fg-muted sm:text-lg">
              {products.capability.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-10 grid gap-5 sm:grid-cols-3">
              {products.capability.points.map((point) => (
                <li key={point.title}>
                  <Card className="h-full">
                    <CardTitle className="text-base">{point.title}</CardTitle>
                    <CardBody className="mt-2.5">{point.description}</CardBody>
                  </Card>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted" aria-labelledby="flagship">
        <Reveal>
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              {products.flagship.status}
            </span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">
              {products.flagship.eyebrow}
            </p>
            <h2 id="flagship" className="mt-3 text-3xl text-fg">
              {products.flagship.name}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
              {products.flagship.lead}
            </p>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-fg-muted">
              {products.flagship.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Reveal>

        <h3 className="sr-only">Platform capabilities</h3>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.flagship.capabilities.map((capability, index) => (
            <Reveal as="li" key={capability.title} delay={Math.min(index, 5) * 0.06}>
              <Card className="h-full bg-canvas">
                <div className="flex items-start gap-3">
                  <Check
                    className="mt-1 h-4 w-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <div>
                    <CardTitle as="h4" className="text-base">
                      {capability.title}
                    </CardTitle>
                    <CardBody className="mt-2.5">
                      {capability.description}
                    </CardBody>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-12">
          <ButtonLink href={products.flagship.cta.href} size="lg">
            {products.flagship.cta.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-[--dur-base] ease-[--ease-out-soft] group-hover/btn:translate-x-0.5" aria-hidden="true" />
          </ButtonLink>
        </Reveal>
      </Section>

      <Section aria-labelledby="custom">
        <Reveal className="max-w-2xl">
          <SectionHeading
            id="custom"
            eyebrow="Bespoke work"
            title={products.custom.heading}
            intro={products.custom.body}
          />
          <div className="mt-8">
            <ButtonLink href={products.custom.cta.href} variant="secondary">
              {products.custom.cta.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-[--dur-base] ease-[--ease-out-soft] group-hover/btn:translate-x-0.5" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Reveal>
      </Section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Products & Solutions", path: "/products" },
        ])}
      />
    </>
  );
}
