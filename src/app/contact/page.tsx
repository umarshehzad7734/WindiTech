import type { Metadata } from "next";
import { Building2, Clock, Globe2, Mail, MapPin, Phone } from "lucide-react";
import { business, contact } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbSchema,
  contactPageSchema,
  localBusinessSchema,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: contact.meta.title,
  description: contact.meta.description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `${contact.meta.title} | ${business.name}`,
    description: contact.meta.description,
    url: `${business.url}/contact`,
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow={contact.eyebrow}
        title={contact.heading}
        lead={contact.lead}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="text-xl font-semibold text-fg">
                {contact.detailsHeading}
              </h2>
              <address className="mt-6 space-y-6 not-italic">
                <DetailRow icon={Building2} label="Company">
                  <span className="font-medium text-fg">{business.name}</span>
                  <span className="mt-1 block text-sm text-fg-subtle">
                    {business.sector}
                  </span>
                </DetailRow>

                <DetailRow icon={MapPin} label="Registered office">
                  <span className="text-fg-muted">{business.address.full}</span>
                </DetailRow>

                <DetailRow icon={Phone} label="Phone">
                  <a
                    href={`tel:${business.phoneHref}`}
                    className="text-fg-muted transition-colors hover:text-accent"
                  >
                    {business.phone}
                  </a>
                </DetailRow>

                <DetailRow icon={Mail} label="Email">
                  <a
                    href={`mailto:${business.email}`}
                    className="break-all text-fg-muted transition-colors hover:text-accent"
                  >
                    {business.email}
                  </a>
                </DetailRow>

                <DetailRow icon={Clock} label="Business hours">
                  <span className="text-fg-muted">{business.businessHours}</span>
                </DetailRow>

                <DetailRow icon={Globe2} label="Geographic scope">
                  <span className="text-fg-muted">
                    {business.geographicScope}
                  </span>
                </DetailRow>
              </address>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-fg">
                {contact.formHeading}
              </h2>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted" size="sm" aria-labelledby="find-us">
        <Reveal>
          <h2 id="find-us" className="text-3xl text-fg">
            {contact.mapHeading}
          </h2>
          <div className="mt-8">
            <MapEmbed />
          </div>
        </Reveal>
      </Section>

      <JsonLd data={contactPageSchema()} />
      <JsonLd data={localBusinessSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
    </>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
          {label}
        </p>
        <div className="mt-1.5 text-base">{children}</div>
      </div>
    </div>
  );
}
