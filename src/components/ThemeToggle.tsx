"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

function IconSun() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M4.8 4.8l1.6 1.6M17.6 17.6l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.8 19.2l1.6-1.6M17.6 6.4l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
      <path
        d="M20.5 14.2A8.2 8.2 0 1 1 9.8 3.5a6.6 6.6 0 0 0 10.7 10.7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThemeToggle({ locale }: { locale: "az" | "ru" }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dark = mounted && theme === "dark";
  const label = dark
    ? locale === "az"
      ? "Gündüz rejimi"
      : "Дневной режим"
    : locale === "az"
      ? "Gecə rejimi"
      : "Ночной режим";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-7 w-7 items-center justify-center text-white"
      aria-label={label}
      title={label}
      suppressHydrationWarning
    >
      {dark ? <IconSun /> : <IconMoon />}
    </button>
  );
}
