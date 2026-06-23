import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UB Solars — Size Your Solar in Seconds",
  description:
    "Free TNEB solar calculator (LT-IA slabs, 2024–2026): turn your electricity bill into the right kW system, savings estimate, and post-solar bill — no signup.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f766e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full min-h-[100dvh] font-sans">{children}</body>
    </html>
  );
}
