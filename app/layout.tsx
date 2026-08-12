import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin", "cyrillic"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Aero English — ICAO Level 4",
  description: "Тренажёр авиационного английского для подготовки к ICAO Level 4.",
  icons: { icon: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Aero English", statusBarStyle: "black-translucent" },
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="ru"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>;
}
