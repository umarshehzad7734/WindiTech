"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-scrubbed depth. The wrapped element moves at a different rate to the
 * page as it passes through the viewport, which separates background layers
 * from content without any of it looking like it is "flying in".
 *
 * `speed` is the total travel in pixels across the full pass: negative moves
 * against the scroll (feels further away), positive moves with it.
 */
export function Parallax({
  speed = -60,
  className,
  children,
}: {
  speed?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed]);

  return (
    <motion.div
      ref={ref}
      style={reduceMotion ? undefined : { y }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Fades and lifts a whole section as it enters and leaves, scrubbed to scroll
 * position. Used sparingly — on the hero backdrop only — so the page never
 * feels like it is fighting the scrollbar.
 */
export function ScrollFade({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <motion.div
      ref={ref}
      style={reduceMotion ? undefined : { opacity, y }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
