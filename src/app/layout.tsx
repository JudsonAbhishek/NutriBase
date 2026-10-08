import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NutriProvider } from "@/context/NutriContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { BrandPreloader } from "@/components/layout/BrandPreloader";
import { ServiceWorkerRegistration } from "@/components/layout/ServiceWorkerRegistration";
// import { CommunityChat } from "@/components/chat/CommunityChat";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "NutriBase — Food & Nutrition Intelligence Platform",
  description: "Advanced food database, nutrition analyzer, smart comparison tool, and personalized dietary discovery engine.",
  keywords: [
    "nutrition facts",
    "food calories",
    "macro calculator",
    "food comparison",
    "high protein vegetarian",
    "vitamins and minerals",
    "dietary tracker",
    "USDA food database",
  ],
  authors: [{ name: "NutriBase Intelligence Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <NutriProvider>
          <ServiceWorkerRegistration />
          <BrandPreloader />
          <Navbar />
          <main className="flex-1 pb-24 lg:pb-0">{children}</main>
          <Footer />
          <MobileNav />
          {/* <CommunityChat /> */}
        </NutriProvider>
      </body>
    </html>
  );
}
