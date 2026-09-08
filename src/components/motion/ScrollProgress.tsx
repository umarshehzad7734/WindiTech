"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Reading-progress bar pinned to the top of the viewport. Scroll-linked rather
 * than time-based, so it tracks the page exactly; the spring only smooths the
 * scaleX so it never looks jittery on a trackpad.
 *
 * Hidden under `prefers-reduced-motion` with a CSS variant rather than by
 * returning null — the server cannot know the visitor's preference, and
 * rendering different markup on the client breaks hydration.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accent/40 via-accent to-accent/40 motion-reduce:hidden"
    />
  );
}
