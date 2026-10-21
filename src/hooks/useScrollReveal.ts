"use client";

import { useEffect } from "react";

/** Marks `.kh-4d` elements visible when they enter the viewport */
export function useScrollReveal(rootMargin = "0px 0px -6% 0px") {
  useEffect(() => {
    document.documentElement.dataset.reveal = "on";

    const reveal = (el: Element) => {
      el.classList.remove("kh-4d-wait");
      el.classList.add("kh-4d-in");
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin, threshold: 0.08 }
    );

    const arm = (n: HTMLElement) => {
      n.classList.add("kh-4d-wait");
      const rect = n.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight * 0.97 && rect.bottom > 40;
      if (inView) reveal(n);
      else io.observe(n);
    };

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>(".kh-4d:not(.kh-4d-in)")
        .forEach(arm);
    };

    scan();
    const t = window.setTimeout(scan, 350);
    const t2 = window.setTimeout(scan, 1000);
    // safety: never leave content invisible
    const safety = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>(".kh-4d-wait:not(.kh-4d-in)")
        .forEach(reveal);
    }, 2800);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
      window.clearTimeout(t2);
      window.clearTimeout(safety);
    };
  }, [rootMargin]);
}
