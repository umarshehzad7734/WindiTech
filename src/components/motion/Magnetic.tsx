"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The wrapped control drifts a few pixels toward the cursor while it is nearby,
 * then springs back on leave. Used only on primary calls to action, where the
 * pull reads as responsiveness rather than a gimmick.
 *
 * Transform is written directly to the node, so there is no React render per
 * mouse move. Mouse-only, and disabled entirely under reduced motion.
 */
export function Magnetic({
  strength = 0.25,
  className,
  children,
}: {
  /** Fraction of the cursor's offset from centre that the element travels. */
  strength?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  function onPointerMove(event: React.PointerEvent<HTMLSpanElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function reset() {
    const el = ref.current;
    if (el) el.style.transform = "translate3d(0, 0, 0)";
  }

  return (
    <span
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      className={cn(
        "inline-block will-change-transform",
        "transition-transform duration-[--dur-slow] ease-[--ease-out-soft]",
        className,
      )}
    >
      {children}
    </span>
  );
}
