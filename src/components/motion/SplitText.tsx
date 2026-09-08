"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * Word-by-word masked reveal — the signature "type rises out of the line"
 * effect. Each word sits in an overflow-hidden box and slides up from below it,
 * so the text appears to be uncovered rather than faded in.
 *
 * Accessibility: the split spans are hidden from assistive technology and the
 * original string is exposed once via aria-label, so screen readers and search
 * engines still see one clean sentence rather than a pile of word fragments.
 */

const word: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%" },
};

export function SplitText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.045,
  duration = 0.7,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = motion[Tag];

  // The DOM must be identical on the server and the client. The server cannot
  // know the visitor's motion preference, so this never branches on structure —
  // reduced motion only disables the movement.
  const motionProps = reduceMotion
    ? { initial: false as const }
    : {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, margin: "-60px" },
        transition: { staggerChildren: stagger, delayChildren: delay },
      };

  return (
    <MotionTag className={className} aria-label={text} {...motionProps}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden="true"
          // The box clips its word; the inner span is what moves.
          className="inline-flex overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span
            className="inline-block"
            variants={reduceMotion ? undefined : word}
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
    </MotionTag>
  );
}
