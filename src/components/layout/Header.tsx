"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { business, navigation } from "@/content/site";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Lock scroll, trap focus and close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
      <Container>
        <div className="flex h-[72px] items-center justify-between gap-4 sm:h-20">
          <Link
            href="/"
            className="rounded-md"
            aria-label={`${business.name} — home`}
          >
            <Logo collapseOnMobile className="text-[23px] sm:text-[26px]" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                      isActive(item.href)
                        ? "bg-accent-soft text-accent"
                        : "text-fg-muted hover:bg-surface hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Wrapped rather than given `hidden`, which would collide with the
                button's own `inline-flex` utility. */}
            <span className="hidden lg:block">
              <ButtonLink href="/contact" size="sm">
                Talk to us
              </ButtonLink>
            </span>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg-muted transition-colors duration-200 hover:border-accent hover:text-accent lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-ink-950/50 backdrop-blur-sm"
            />
            <motion.div
              ref={panelRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={reduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduceMotion ? undefined : { x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 right-0 flex w-[min(20rem,85vw)] flex-col border-l border-line bg-canvas p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <Logo className="text-[26px]" />
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                  aria-label="Close menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Mobile" className="mt-8 flex-1">
                <ul className="flex flex-col gap-1">
                  {navigation.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={cn(
                          "block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                          isActive(item.href)
                            ? "bg-accent-soft text-accent"
                            : "text-fg-muted hover:bg-surface hover:text-fg",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-6 border-t border-line pt-6 text-sm">
                <a
                  href={`mailto:${business.email}`}
                  className="block text-fg-muted transition-colors hover:text-accent"
                >
                  {business.email}
                </a>
                <a
                  href={`tel:${business.phoneHref}`}
                  className="mt-2 block text-fg-muted transition-colors hover:text-accent"
                >
                  {business.phone}
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
