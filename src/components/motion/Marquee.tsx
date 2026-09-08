"use client";

import { cn } from "@/lib/utils";

/**
 * Continuous ticker of the service lines.
 *
 * The track is duplicated once and translated by exactly -50%, so the loop is
 * seamless. It runs as a single CSS animation on the compositor — no JavaScript
 * per frame — pauses on hover, and stops entirely under reduced motion.
 * The duplicate is hidden from assistive technology so the list is announced
 * once.
 */
export function Marquee({
  items,
  speedSeconds = 44,
  className,
}: {
  items: readonly string[];
  speedSeconds?: number;
  className?: string;
}) {
  const track = (ariaHidden: boolean) => (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-10 pr-10"
    >
      {items.map((item) => (
        <li
          key={item}
          className="flex shrink-0 items-center gap-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.16em] text-fg-subtle"
        >
          {item}
          <span aria-hidden className="h-1 w-1 rounded-full bg-accent/70" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        "group/marquee relative flex overflow-hidden",
        // Fade the ends so items enter and leave rather than being cut off.
        "[mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div
        className="flex min-w-full animate-marquee gap-10 group-hover/marquee:[animation-play-state:paused]"
        style={{ animationDuration: `${speedSeconds}s` }}
      >
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
