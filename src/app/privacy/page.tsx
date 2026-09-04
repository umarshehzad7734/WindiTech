import type { Metadata } from "next";
import { business, privacy } from "@/content/site";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: privacy.meta.title,
  description: privacy.meta.description,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `${privacy.meta.title} | ${business.name}`,
    description: privacy.meta.description,
    url: `${business.url}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      heading={privacy.heading}
      intro={privacy.intro}
      sections={privacy.sections}
    />
  );
}
