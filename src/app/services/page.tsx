import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { business, servicesPage, services } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceIcon } from "@/components/ServiceIcon";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: servicesPage.meta.title,
  description: servicesPage.meta.description,
  alternates: { canonical: "/services" },
  openGraph: {
    title: `${servicesPage.meta.title} | ${business.name}`,
    description: servicesPage.meta.description,
    url: `${business.url}/services`,
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow={servicesPage.eyebrow}
        title={servicesPage.heading}
        lead={servicesPage.intro}
      />

      {/* Jump list — useful on a long page and gives the footer deep links a target. */}
      <div className="border-b border-line bg-surface">
        <nav
          aria-label="Services"
          className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8"
        >
          <ul className="flex flex-wrap gap-2">
            {services.map((service) => (
              <li key={service.slug}>
                <a
                  href={`#${service.slug}`}
                  className={[
                    "inline-block rounded-full border border-line bg-canvas px-4 py-2 text-sm text-fg-muted",
                    "transition-[color,border-color,background-color,transform] duration-[--dur-base] ease-[--ease-out-soft]",
                    "hover:-translate-y-px hover:border-accent/60 hover:bg-accent-soft hover:text-accent",
                  ].join(" ")}
                >
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <Section>
        <div className="space-y-16 sm:space-y-20">
          {services.map((service) => (
            <Reveal
              as="section"
              key={service.slug}
              className="border-b border-line pb-16 last:border-0 last:pb-0 sm:pb-20"
            >
              <div
                id={service.slug}
                className="grid scroll-mt-28 gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-16"
              >
                <div>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-surface-raised text-accent">
                    <ServiceIcon name={service.icon} className="h-6 w-6" />
                  </span>
                  <h2 className="mt-5 text-2xl text-fg">{service.title}</h2>
                  <p className="mt-4 text-base leading-relaxed text-fg-muted">
                    {service.description}
                  </p>
                </div>

                <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                    What this includes
                  </h3>
                  <ul className="mt-5 space-y-3.5">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-fg-muted">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="muted" size="sm" aria-labelledby="services-cta">
        <Reveal className="max-w-2xl">
          <h2 id="services-cta" className="text-3xl text-fg">
            Not sure which of these you need?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
            Most engagements combine several of these service lines. Describe the
            outcome you are after and we will propose a shape for the work,
            including what we would not recommend spending money on.
          </p>
          <div className="mt-8">
            <ButtonLink href="/contact" size="lg">
              Talk to us
              <ArrowRight className="h-4 w-4 transition-transform duration-[--dur-base] ease-[--ease-out-soft] group-hover/btn:translate-x-0.5" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Reveal>
      </Section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
    </>
  );
}
