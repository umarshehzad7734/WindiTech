import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * ---------------------------------------------------------------------------
 * Using the official logo artwork
 * ---------------------------------------------------------------------------
 * Drop the real file in as `public/logo-official.svg` (or .png) and set
 * USE_OFFICIAL_ARTWORK to true. Everything below it is a hand-drawn
 * reconstruction and should be retired the moment the real file exists.
 */
const USE_OFFICIAL_ARTWORK = false;
const OFFICIAL_ARTWORK_SRC = "/logo-official.svg";

/**
 * The flowing wave that forms the "W" of the Windii Tech wordmark, drawn as a
 * stroked path so it inherits the current colour. Used on its own as the app
 * icon and as the first letter of the wordmark below.
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
 * The "Windii Tech" lockup: the wave W leading into "indii", with "Tech" set
 * beneath it and the registered mark raised after the wordmark.
 *
 * The whole lockup scales from its own font-size, so callers size it with a
 * single text-* class.
 *
 * Colour note: the source artwork is bright green on black. On a light
 * background that green fails contrast requirements, so the lockup uses the
 * theme accent — a darker green in light mode, the bright brand green in dark
 * mode — which keeps it readable in both themes.
 */
export function Logo({
  className,
  collapseOnMobile = false,
}: {
  className?: string;
  /** Hides the "Tech" line below 360px so the header stays compact. */
  collapseOnMobile?: boolean;
}) {
  if (USE_OFFICIAL_ARTWORK) {
    return (
      <Image
        src={OFFICIAL_ARTWORK_SRC}
        alt="Windii Technologies"
        width={180}
        height={48}
        priority
        className={cn("h-10 w-auto", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex flex-col leading-none text-accent",
        "font-[family-name:var(--font-logo)]",
        className,
      )}
    >
      <span className="inline-flex items-end">
        {/* The wave W rises above the x-height, as it does in the artwork. */}
        <LogoMark
          className="-mb-[0.09em] h-[1.16em] w-[1.16em] shrink-0"
          aria-hidden="true"
        />
        <span className="-ml-[0.1em] text-[1em] font-semibold leading-[1.05] tracking-[-0.005em]">
          indii
        </span>
        {/* Raised to the top right, as in the artwork. */}
        <span className="ml-[0.08em] self-start pt-[0.06em] text-[0.3em] font-medium leading-none">
          ®
        </span>
      </span>
      <span
        className={cn(
          "ml-[1.55em] mt-[0.1em] text-[0.62em] font-medium tracking-[0.005em]",
          collapseOnMobile && "hidden min-[360px]:inline",
        )}
      >
        Tech
      </span>
    </span>
  );
}
