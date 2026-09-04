import { legalLastUpdated } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/ui/PageHeader";

type LegalSection = {
  readonly heading: string;
  readonly body: readonly string[];
};

export function LegalPage({
  heading,
  intro,
  sections,
}: {
  heading: string;
  intro: string;
  sections: readonly LegalSection[];
}) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={heading} lead={intro} />

      <Section>
        <div className="max-w-3xl">
          <p className="text-sm text-fg-subtle">
            Last updated: {legalLastUpdated}
          </p>

          <div className="mt-12 space-y-12">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold text-fg">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-fg-muted">
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
