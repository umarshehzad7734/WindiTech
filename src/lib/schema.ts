import { business, seo, socialProfiles, mapLocation } from "@/content/site";

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: business.address.street,
  addressLocality: business.address.locality,
  addressRegion: business.address.region,
  addressCountry: business.address.countryCode,
} as const;

/**
 * Organization schema. Emitted on every page — the values here must stay
 * identical to what is rendered in the footer and on the contact page.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${business.url}/#organization`,
    name: business.name,
    url: business.url,
    logo: `${business.url}/logo.svg`,
    email: business.email,
    telephone: business.phoneHref,
    address: postalAddress,
    ...(socialProfiles.length > 0 ? { sameAs: socialProfiles } : {}),
    description: seo.description,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${business.url}/#website`,
    url: business.url,
    name: business.name,
    description: seo.description,
    publisher: { "@id": `${business.url}/#organization` },
    inLanguage: "en",
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${business.url}/contact#contactpage`,
    url: `${business.url}/contact`,
    name: `Contact ${business.name}`,
    about: { "@id": `${business.url}/#organization` },
  };
}

/** LocalBusiness schema — Contact page only, same address values as above. */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${business.url}/#localbusiness`,
    name: business.name,
    url: business.url,
    image: `${business.url}/logo.svg`,
    logo: `${business.url}/logo.svg`,
    email: business.email,
    telephone: business.phoneHref,
    address: postalAddress,
    geo: {
      "@type": "GeoCoordinates",
      latitude: mapLocation.latitude,
      longitude: mapLocation.longitude,
    },
    ...(socialProfiles.length > 0 ? { sameAs: socialProfiles } : {}),
    description: seo.description,
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${business.url}${item.path}`,
    })),
  };
}
