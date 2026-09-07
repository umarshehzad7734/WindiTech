import type { Metadata, Viewport } from "next";
import { Fredoka, Inter, Outfit } from "next/font/google";
import { business, seo } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Rounded geometric face used only for the logo lockup, to match the
// letterforms of the Windii Tech wordmark.
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-logo",
});

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title: {
    default: seo.defaultTitle,
    template: seo.titleTemplate,
  },
  description: seo.description,
  keywords: [...seo.keywords],
  applicationName: business.name,
  authors: [{ name: business.name, url: business.url }],
  creator: business.name,
  publisher: business.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: business.name,
    title: seo.defaultTitle,
    description: seo.description,
    url: business.url,
    locale: seo.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.defaultTitle,
    description: seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#060809" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${inter.variable} ${fredoka.variable}`}
    >
      <head>
        <ThemeScript />
        {/* Scroll reveals start at opacity 0. Without JS they would never
            animate in, so force them visible. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-accent-contrast"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  );
}
