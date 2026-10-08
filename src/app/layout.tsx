import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
  applicationName: "NutriBase",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  description:
    "Explore trusted food nutrition data, nutrition facts, a USDA-backed food database, nutrient comparisons, and practical food nutrition calculators with NutriBase.",
  keywords: [
    "food nutrition",
    "nutrition database",
    "food database",
    "nutrition intelligence",
    "nutrition facts",
    "nutrition information",
    "food data",
    "nutrient database",
    "USDA nutrition database",
    "USDA food database",
    "food nutrition calculator",
    "healthy food options",
    "food nutrient comparison",
    "Explore Foods",
    "Find Foods",
    "Food Search",
    "Food Discovery",
    "Smart Food Finder",
    "Food Recommendation",
    "Healthy Food Finder",
    "Personalized Food Recommendations",
    "Indian Food Search",
    "Food Categories",
    "healthy food finder",
    "healthy food finder app",
    "food categories list",
    "types of food categories",
    "different food categories",
    "food search engine",
    "food search",
    "nutrients",
    "protein",
    "high protein foods",
    "protein foods",
    "fiber",
    "fiber foods",
    "high fiber foods",
    "foods high in fiber",
    "fiber rich foods",
    "foods with fiber",
    "calories in food",
    "daily calorie needs",
    "calorie calculator",
    "carbohydrates",
    "carbohydrate foods",
    "vitamins",
    "vitamins and minerals",
    "minerals in food",
    "iron",
    "iron rich foods",
    "foods high in iron",
    "vitamin C foods",
    "foods high in vitamin C",
    "foods with vitamin C",
    "vitamin E foods",
    "foods high in vitamin E",
    "foods with vitamin E",
    "calcium rich foods",
    "foods high in calcium",
    "foods with calcium",
    "omega-3 foods",
    "macronutrients",
    "macronutrient calculator",
    "micronutrients",
    "macro and micronutrients",
    "low calorie high protein foods",
    "vegetarian foods",
    "vegan foods",
    "Indian superfoods",
    "muscle building foods",
    "gut friendly foods",
    "balanced diet",
    "healthy eating",
    "compare foods",
    "food comparison",
    "nutrition comparison",
    "nutrient comparison",
    "protein comparison",
    "protein comparison chart",
    "calorie comparison",
    "fiber comparison",
    "food ranking",
    "best foods",
    "best foods for fiber",
    "nutrient density",
    "nutrient density chart",
    "BMI calculator",
    "BMR calculator",
    "daily calorie calculator",
    "meal calculator",
    "meal nutrition calculator",
    "nutrition calculator",
    "Indian food nutrition",
    "high protein vegetarian foods",
    "high protein foods for muscle building",
    "iron rich Indian foods",
    "low calorie fruits",
    "Indian foods nutrition database",
    "compare foods by nutrition",
    "protein per 100g food",
    "foods high in protein and low in calories",
    "best vegetarian protein sources",
    "healthy Indian foods",
    "food calorie calculator",
    "BMI BMR TDEE calculator",
    "daily macro calculator",
    "nutrition tracker",
    "best foods for muscle building",
    "Indian superfoods nutrition",
    "protein calculator",
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6Q5B6KWYH6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6Q5B6KWYH6');
          `}
        </Script>
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
