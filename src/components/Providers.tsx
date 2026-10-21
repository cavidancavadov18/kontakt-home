"use client";

import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { VideoModalProvider } from "@/context/VideoModalContext";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppProvider>
        <VideoModalProvider>
          <ScrollReveal />
          {children}
        </VideoModalProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
