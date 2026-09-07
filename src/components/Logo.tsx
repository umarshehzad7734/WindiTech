import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The official Windii Tech artwork.
 *
 * Extracted from the supplied PDF (WIndii_Logo_New.pdf). The source was flat
 * brand green composited over black, so the black ground was divided out rather
 * than keyed, which preserves the original anti-aliasing exactly. The result is
 * the real lockup on transparency, so it sits correctly on both themes.
 *
 * Natural size 641 x 257.
 */
const LOGO_SRC = "/logo-official.png";
const LOGO_RATIO = 641 / 257;

/**
 * Square brand mark — the wave "W" from the same artwork, on the brand-dark
 * plate. Used for the favicon and app icons (see public/icon-*.png).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/icon-192.png"
      alt=""
      aria-hidden="true"
      width={192}
      height={192}
      className={cn("h-8 w-8 rounded-[22%]", className)}
    />
  );
}

/**
 * The full "Windii Tech" lockup.
 *
 * Height is driven by the `className` (e.g. `h-10`); the width follows the
 * artwork's own aspect ratio, so it can never distort.
 */
export function Logo({
  className,
  priority = false,
}: {
  className?: string;
  /** Set on the header instance so the logo is not lazy-loaded above the fold. */
  priority?: boolean;
}) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Windii Technologies"
      width={641}
      height={257}
      priority={priority}
      sizes="(max-width: 640px) 140px, 190px"
      className={cn("w-auto", className)}
      style={{ aspectRatio: LOGO_RATIO }}
    />
  );
}
