import type { Metadata } from "next";
import { business, terms } from "@/content/site";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: terms.meta.title,
  description: terms.meta.description,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: `${terms.meta.title} | ${business.name}`,
    description: terms.meta.description,
    url: `${business.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      heading={terms.heading}
      intro={terms.intro}
      sections={terms.sections}
    />
  );
}
