import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  business,
  footer,
  legalNavigation,
  navigation,
  services,
} from "@/content/site";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr] lg:gap-8">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-fg-muted">
              {footer.tagline}
            </p>
          </div>

          <nav aria-labelledby="footer-company">
            <h2
              id="footer-company"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-fg"
            >
              {footer.columns.company}
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-fg-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {legalNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-fg-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-services">
            <h2
              id="footer-services"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-fg"
            >
              {footer.columns.services}
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services#${service.slug}`}
                    className="text-fg-muted transition-colors hover:text-accent"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* NAP block — must appear on every page for D&B consistency. */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg">
              {footer.columns.contact}
            </h2>
            <address className="mt-5 space-y-4 text-sm not-italic">
              <p className="font-medium text-fg">{business.name}</p>
              <p className="flex gap-3 text-fg-muted">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>
                  <span className="sr-only">{footer.addressLabel}: </span>
                  {business.address.full}
                </span>
              </p>
              <p className="flex gap-3">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${business.phoneHref}`}
                  className="text-fg-muted transition-colors hover:text-accent"
                >
                  {business.phone}
                </a>
              </p>
              <p className="flex gap-3">
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${business.email}`}
                  className="break-all text-fg-muted transition-colors hover:text-accent"
                >
                  {business.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-8 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright(year)}</p>
          <p>{business.sector}</p>
        </div>
      </Container>
    </footer>
  );
}
