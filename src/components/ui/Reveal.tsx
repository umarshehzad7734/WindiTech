"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Scroll entrances for the site.
 *
 * Deliberately restrained: a short rise and a fade, once, on the same timing
 * everywhere. No scaling, rotation, blur or spring — those read as a template.
 * Everything falls back to a plain element when the visitor has asked for
 * reduced motion.
 */

const DISTANCE = 14;
const DURATION = 0.55;
const EASE = [0.16, 1, 0.3, 1] as const;

const variants: Variants = {
  hidden: { opacity: 0, y: DISTANCE },
  visible: { opacity: 1, y: 0 },
};

type Tag = "div" | "li" | "section" | "ul" | "ol";

type RevealProps = {
  as?: Tag;
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

export function Reveal({
  as = "div",
  delay = 0,
  className,
  children,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      // Marks the element for the no-JS stylesheet in the root layout, which
      // forces it visible when the animation can never run.
      data-reveal=""
      className={cn(className)}
      // Structure never branches on motion preference — the server cannot know
      // it, and differing markup breaks hydration. Only the movement is
      // disabled.
      {...(reduceMotion
        ? { initial: false as const }
        : {
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true, margin: "-80px" },
            variants,
            transition: { duration: DURATION, delay, ease: EASE },
          })}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Wraps a group so its children enter one after another. Use for card grids
 * and lists — the offset is small enough to read as a single movement rather
 * than a sequence of separate animations.
 */
export function RevealGroup({
  as = "div",
  stagger = 0.07,
  delay = 0,
  className,
  children,
}: RevealProps & { stagger?: number }) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      {...(reduceMotion
        ? { initial: false as const }
        : {
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true, margin: "-60px" },
            transition: { staggerChildren: stagger, delayChildren: delay },
          })}
    >
      {children}
    </MotionTag>
  );
}

/** A single child of RevealGroup. Inherits the group's stagger timing. */
export function RevealItem({
  as = "div",
  className,
  children,
}: Omit<RevealProps, "delay">) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      data-reveal=""
      className={cn(className)}
      variants={reduceMotion ? undefined : variants}
      transition={{ duration: DURATION, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
