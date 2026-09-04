import type { Metadata } from "next";
import { ArrowRight, Building2, Globe2 } from "lucide-react";
import { about, business } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: about.meta.title,
  description: about.meta.description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${about.meta.title} | ${business.name}`,
    description: about.meta.description,
    url: `${business.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={about.eyebrow}
        title={about.heading}
        lead={about.lead}
      />

      <Section aria-labelledby="who-we-are">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading id="who-we-are" title={about.whoWeAre.heading} />
            <div className="mt-6 space-y-5 text-base leading-relaxed text-fg-muted">
              {about.whoWeAre.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <SectionHeading id="what-we-do" title={about.whatWeDo.heading} />
            <div className="mt-6 space-y-5 text-base leading-relaxed text-fg-muted">
              {about.whatWeDo.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              <ButtonLink href={about.whatWeDo.cta.href} variant="secondary">
                {about.whatWeDo.cta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted" aria-labelledby="scope">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <Reveal>
            <SectionHeading id="scope" title={about.scope.heading} />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-base leading-relaxed text-fg-muted sm:text-lg">
              {about.scope.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[var(--radius-card)] border border-line bg-canvas p-5">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                  <Building2 className="h-4 w-4 text-accent" aria-hidden="true" />
                  Sector
                </dt>
                <dd className="mt-2 text-sm font-medium text-fg">
                  {business.sector}
                </dd>
              </div>
              <div className="rounded-[var(--radius-card)] border border-line bg-canvas p-5">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                  <Globe2 className="h-4 w-4 text-accent" aria-hidden="true" />
                  Geographic scope
                </dt>
                <dd className="mt-2 text-sm font-medium text-fg">
                  {business.geographicScope}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </Section>

      <Section aria-labelledby="values">
        <Reveal>
          <SectionHeading
            id="values"
            eyebrow="Our approach"
            title={about.values.heading}
            intro={about.values.intro}
          />
        </Reveal>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {about.values.items.map((value, index) => (
            <Reveal as="li" key={value.title} delay={index * 0.06}>
              <Card className="h-full">
                <CardTitle>{value.title}</CardTitle>
                <CardBody className="mt-3">{value.description}</CardBody>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="muted" size="sm" aria-labelledby="registered-address">
        <Reveal>
          <div className="rounded-[var(--radius-card)] border border-line bg-canvas p-8 sm:p-10">
            <h2 id="registered-address" className="text-xl font-semibold text-fg">
              {about.registeredAddress.heading}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-fg-muted">
              {about.registeredAddress.note}
            </p>
            <address className="mt-6 not-italic">
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-fg">
                {business.name}
              </p>
              <p className="mt-1 text-base text-fg-muted">
                {business.address.full}
              </p>
              <p className="mt-4 flex flex-col gap-1 text-sm sm:flex-row sm:gap-6">
                <a
                  href={`tel:${business.phoneHref}`}
                  className="text-fg-muted transition-colors hover:text-accent"
                >
                  {business.phone}
                </a>
                <a
                  href={`mailto:${business.email}`}
                  className="break-all text-fg-muted transition-colors hover:text-accent"
                >
                  {business.email}
                </a>
              </p>
            </address>
          </div>
        </Reveal>
      </Section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
    </>
  );
}
