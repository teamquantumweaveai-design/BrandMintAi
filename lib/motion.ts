// Motion variants for BrandMint AI site
// Centralized definitions to ensure consistency and respect prefers-reduced-motion.

import { Variants, useReducedMotion } from "framer-motion";

// Helper hook to provide reduced-motion fallback variants
export function useReducedMotionVariant<T, R>(variant: T, reduced: R): T | R {
  const shouldReduce = useReducedMotion();
  return shouldReduce ? reduced : variant;
}

// Helper to provide reduced‑motion fallback (opacity only)
export const reducedOpacityVariant: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

/**
 * Hero headline word‑by‑word reveal.
 * Staggered upward fade + blur‑to‑sharp.
 * Custom `custom` prop (index) controls delay (60 ms).
 */
export const heroWordVariant: Variants = {
  hidden: { y: 20, opacity: 0, filter: "blur(4px)" },
  show: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      delay: i * 0.06,
    },
  }),
};

/**
 * Section reveal on scroll – fade‑up 24 px.
 */
export const sectionRevealVariant: Variants = {
  hidden: { y: 24, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

/**
 * Button bounce on tap/click.
 * Scales down then overshoots back.
 */
export const buttonTapVariant = {
  tap: {
    scale: 0.96,
    transition: { type: "spring", stiffness: 500, damping: 20 },
  },
  // Framer will automatically spring back to 1.02 then settle at 1.
  whileTap: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
} satisfies Variants;

/**
 * Slow‑moving animated gradient background.
 * Uses background‑position animation; duration 18‑20 s.
 */
export const gradientBackgroundVariant: Variants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%"],
    transition: { duration: 18, repeat: Infinity, ease: "linear" },
  },
};

/**
 * Card hover – lift + soft glow border.
 */
export const cardHoverVariant = {
  hover: {
    y: -4,
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    border: "2px solid transparent",
    // Gradient border will be handled via CSS `border-image` animation.
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
} satisfies Variants;

/**
 * Navbar link underline animation (center‑out).
 */
export const navbarLinkVariant: Variants = {
  hidden: { scaleX: 0, transformOrigin: "center" },
  show: {
    scaleX: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

/**
 * Mobile menu item staggered slide‑in.
 */
export const mobileMenuItemVariant: Variants = {
  hidden: { x: -20, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

/**
 * Page transition – cross‑fade with 6 px vertical shift.
 */
export const pageTransitionVariant: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

/**
 * Reduced‑motion counterparts (opacity‑only) for the above variants.
 */
export const heroWordReduced: Variants = reducedOpacityVariant;
export const sectionRevealReduced: Variants = reducedOpacityVariant;
export const buttonTapReduced: Variants = reducedOpacityVariant;
export const gradientBackgroundReduced: Variants = reducedOpacityVariant;
export const cardHoverReduced: Variants = reducedOpacityVariant;
export const navbarLinkReduced: Variants = reducedOpacityVariant;
export const mobileMenuItemReduced: Variants = reducedOpacityVariant;
export const pageTransitionReduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};


export const fadeIn = (
  direction: "up" | "down" | "left" | "right" = "up",
  delay = 0,
  duration = 0.6
): Variants => ({
  hidden: {
    y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
    x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
    opacity: 0,
  },
  show: {
    y: 0,
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration,
      delay,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
});

export const staggerContainer = (
  staggerChildren = 0.1,
  delayChildren = 0
): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const scaleIn = (delay = 0, duration = 0.5): Variants => ({
  hidden: {
    scale: 0.95,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      duration,
      delay,
      ease: "easeOut",
    },
  },
});

export const slideIn = (
  direction: "up" | "down" | "left" | "right",
  type: "tween" | "spring" | "inertia",
  delay: number,
  duration: number
): Variants => ({
  hidden: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
  },
  show: {
    x: 0,
    y: 0,
    transition: {
      type,
      delay,
      duration,
      ease: "easeOut",
    },
  },
});
