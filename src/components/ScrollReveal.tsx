"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

/** Client island that activates 4D scroll reveals site-wide */
export function ScrollReveal() {
  useScrollReveal();
  return null;
}
