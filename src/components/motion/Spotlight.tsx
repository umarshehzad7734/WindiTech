"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Cursor-tracked highlight. A soft radial wash of brand colour follows the
 * pointer across the card, which makes a grid of dark panels feel lit rather
 * than flat.
 *
 * The pointer position is written straight to two CSS custom properties, so
 * React never re-renders on mouse move and the paint stays on the compositor.
 * Fine-pointer only — it does nothing on touch, where there is no hover.
 */
export function Spotlight({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={cn("spotlight relative", className)}
    >
      {children}
    </div>
  );
}
