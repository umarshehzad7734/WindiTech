import { cn } from "@/lib/utils";

/**
 * The flowing wave that forms the "W" of the Windii Tech logo, drawn as a
 * stroked path so it inherits the current text colour.
 *
 * TODO(windii): replace with the official vector artwork when you have the
 * source file — this is a faithful reconstruction, not the original asset.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("h-8 w-8", className)}
    >
      <path
        d="M3 10.5C6.5 23 11 23 13.8 13.5c1.4-4.7 3-4.7 4.4 0C21 23 25.5 23 29 10.5"
        stroke="currentColor"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Full lockup: wave mark plus the registered company name.
 *
 * `collapseOnMobile` drops "Technologies" below 360px so the header stays on
 * one line on the narrowest phones. The full registered name still appears in
 * the footer and page content on every page.
 */
export function Logo({
  className,
  collapseOnMobile = false,
}: {
  className?: string;
  collapseOnMobile?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-7 w-7 shrink-0 text-accent" />
      <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-fg sm:text-lg">
        Windii{" "}
        <span
          className={cn(
            "font-normal text-fg-muted",
            collapseOnMobile && "hidden min-[360px]:inline",
          )}
        >
          Technologies
        </span>
      </span>
    </span>
  );
}
