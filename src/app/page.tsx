import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { business, home, processSteps, products, services } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceIcon } from "@/components/ServiceIcon";
import { LogoMark } from "@/components/Logo";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhoWeAre />
      <ServicesOverview />
      <ProductsTeaser />
      <Process />
      <ContactStrip />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-brand-400/12 blur-[120px] dark:bg-brand-400/16"
      />
      <Container className="relative">
        <div className="py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <Eyebrow>{home.hero.eyebrow}</Eyebrow>
            <h1 className="text-5xl text-fg">{home.hero.headline}</h1>
            <p className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl font-medium text-fg-muted">
              {home.hero.positioning}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
              {home.hero.supporting}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={home.hero.primaryCta.href} size="lg">
                {home.hero.primaryCta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink
                href={home.hero.secondaryCta.href}
                size="lg"
                variant="secondary"
              >
                {home.hero.secondaryCta.label}
              </ButtonLink>
            </div>

            <p className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-fg-subtle">
              <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
              <span>{business.address.full}</span>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function WhoWeAre() {
  return (
    <Section tone="muted" aria-labelledby="who-we-are">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <Reveal>
          <SectionHeading id="who-we-are" title={home.whoWeAre.heading} />
          <div className="mt-6 space-y-5 text-base leading-relaxed text-fg-muted sm:text-lg">
            {home.whoWeAre.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-canvas">
            {home.whoWeAre.facts.map((fact) => (
              <div key={fact.label} className="px-6 py-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-sm font-medium text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}

function ServicesOverview() {
  return (
    <Section aria-labelledby="services-overview">
      <Reveal>
        <SectionHeading
          id="services-overview"
          eyebrow={home.services.eyebrow}
          title={home.services.heading}
          intro={home.services.intro}
        />
      </Reveal>

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Reveal as="li" key={service.slug} delay={Math.min(index, 5) * 0.05}>
            <Link
              href={`/services#${service.slug}`}
              className="group block h-full rounded-[var(--radius-card)]"
            >
              <Card interactive className="h-full">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <ServiceIcon name={service.icon} className="h-5 w-5" />
                </span>
                <CardTitle className="mt-5">{service.title}</CardTitle>
                <CardBody className="mt-3">{service.summary}</CardBody>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Learn more
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Card>
            </Link>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-12">
        <ButtonLink href={home.services.cta.href} variant="secondary">
          {home.services.cta.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </ButtonLink>
      </Reveal>
    </Section>
  );
}

function ProductsTeaser() {
  return (
    <Section tone="muted" aria-labelledby="products-teaser">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal>
          <SectionHeading
            id="products-teaser"
            eyebrow={home.products.eyebrow}
            title={home.products.heading}
            intro={home.products.intro}
          />
          <div className="mt-8">
            <ButtonLink href={home.products.cta.href}>
              {home.products.cta.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-canvas p-7 sm:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-400/10 blur-3xl"
            />
            <div className="relative">
              <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                {products.flagship.status}
              </span>
              <h3 className="mt-5 text-xl font-semibold text-fg">
                {products.flagship.name}
              </h3>
              <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {products.flagship.capabilities.map((capability) => (
                  <li
                    key={capability.title}
                    className="flex items-start gap-2.5 text-sm text-fg-muted"
                  >
                    <LogoMark className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {capability.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Process() {
  return (
    <Section aria-labelledby="process">
      <Reveal>
        <SectionHeading
          id="process"
          eyebrow={home.process.eyebrow}
          title={home.process.heading}
          intro={home.process.intro}
        />
      </Reveal>

      <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => (
          <Reveal as="li" key={step.step} delay={index * 0.08}>
            <Card className="h-full">
              <span
                aria-hidden
                className="font-[family-name:var(--font-display)] text-3xl font-semibold text-accent/35"
              >
                {step.step}
              </span>
              <CardTitle className="mt-4">{step.title}</CardTitle>
              <CardBody className="mt-3">{step.description}</CardBody>
            </Card>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function ContactStrip() {
  const items = [
    {
      icon: MapPin,
      label: "Address",
      value: business.address.full,
      href: null,
    },
    {
      icon: Phone,
      label: "Phone",
      value: business.phone,
      href: `tel:${business.phoneHref}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: business.email,
      href: `mailto:${business.email}`,
    },
  ];

  return (
    <Section tone="muted" aria-labelledby="home-contact">
      <Reveal>
        <div className="rounded-[var(--radius-card)] border border-line bg-canvas p-8 sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            <div>
              <h2 id="home-contact" className="text-3xl text-fg">
                {home.contactStrip.heading}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
                {home.contactStrip.body}
              </p>
              <div className="mt-8">
                <ButtonLink href={home.contactStrip.cta.href} size="lg">
                  {home.contactStrip.cta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>

            <ul className="space-y-5 lg:border-l lg:border-line lg:pl-12">
              {items.map((item) => (
                <li key={item.label} className="flex gap-3.5">
                  <item.icon
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-1 block break-all text-sm font-medium text-fg transition-colors hover:text-accent"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-medium text-fg">
                        {item.value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
