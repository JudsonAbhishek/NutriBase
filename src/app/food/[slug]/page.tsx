import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { FoodRepository } from "@/lib/db/repository";
import { ServingCalculator } from "@/components/food/ServingCalculator";
import { NutriScoreCard } from "@/components/food/NutriScoreCard";
import { FoodCard } from "@/components/food/FoodCard";
import { 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles, 
  ArrowRight, 
  Scale, 
  Clock, 
  Database,
  CheckCircle2
} from "lucide-react";

interface FoodDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: FoodDetailPageProps): Promise<Metadata> {
  const food = FoodRepository.getFoodBySlug(params.slug);
  if (!food) {
    return {
      title: "Food Not Found — NutriBase",
    };
  }

  const title = `${food.name} Nutrition Facts — Calories, Protein, Vitamins & Minerals | NutriBase`;
  const description = `${food.name} (${food.hindiName || ""}): ${food.nutrients.calories} kcal, ${food.nutrients.protein}g protein, ${food.nutrients.fiber}g fiber per 100g. Complete scientific vitamins, minerals, and serving size analysis.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: food.imageUrl, width: 1200, height: 630, alt: food.name }],
    },
  };
}

export default function FoodDetailPage({ params }: FoodDetailPageProps) {
  const food = FoodRepository.getFoodBySlug(params.slug);

  if (!food) {
    notFound();
  }

  // Get related foods from the same category
  const relatedFoods = FoodRepository.getFoods({
    category: food.categoryId,
    limit: 4,
  }).filter((f) => f.slug !== food.slug);

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NutritionInformation",
    name: food.name,
    calories: `${food.nutrients.calories} calories`,
    carbohydrateContent: `${food.nutrients.carbohydrates} g`,
    proteinContent: `${food.nutrients.protein} g`,
    fatContent: `${food.nutrients.fat} g`,
    fiberContent: `${food.nutrients.fiber} g`,
    sugarContent: `${food.nutrients.sugar} g`,
    servingSize: "100 grams",
  };

  const dietaryColors = {
    vegan: "bg-emerald-100 text-emerald-800 border-emerald-300",
    vegetarian: "bg-green-100 text-green-800 border-green-300",
    "non-vegetarian": "bg-rose-100 text-rose-800 border-rose-300",
    seafood: "bg-cyan-100 text-cyan-800 border-cyan-300",
    eggetarian: "bg-amber-100 text-amber-800 border-amber-300",
  }[food.dietaryType] || "bg-slate-100 text-slate-800 border-slate-300";

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href={`/search?category=${food.categoryId}`} className="hover:text-brand-600 transition-colors">
            {food.categoryName}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">{food.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Food Image */}
            <div className="lg:col-span-5 relative aspect-square lg:aspect-auto min-h-[320px] bg-slate-100">
              <Image
                src={food.imageUrl}
                alt={food.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              
              <div className="absolute bottom-4 left-4 lg:hidden">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${dietaryColors}`}>
                  {food.dietaryType.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Title & Quick Profile */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="hidden lg:flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${dietaryColors}`}>
                    {food.dietaryType.toUpperCase()}
                  </span>
                  <Link
                    href={`/search?category=${food.categoryId}`}
                    className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200 hover:bg-brand-100 transition-colors"
                  >
                    {food.categoryName}
                  </Link>
                  {food.isVerified && (
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1 ml-auto">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> USDA/IFCT Verified
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {food.name}
                  </h1>
                  {food.hindiName && (
                    <span className="text-lg text-slate-400 font-medium">
                      ({food.hindiName})
                    </span>
                  )}
                </div>

                {food.scientificName && (
                  <p className="text-xs italic text-slate-400 font-mono">
                    Species: {food.scientificName}
                  </p>
                )}

                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {food.description}
                </p>

                {/* Better For Tags */}
                {food.betterFor && food.betterFor.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-xs font-bold text-slate-500">Key Strengths:</span>
                    {food.betterFor.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Data Verification Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-brand-600" />
                  <span>Source: <strong className="text-slate-700">{food.dataSource}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Reference: {food.referenceBasis} (Updated {food.lastUpdated})</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 1. Interactive Serving Size Calculator (Core Feature) */}
        <section id="serving-calculator">
          <ServingCalculator food={food} />
        </section>

        {/* 2. Transparent NutriBase Score Breakdown */}
        <section id="nutrition-score">
          <NutriScoreCard score={food.nutritionScore} foodName={food.name} />
        </section>

        {/* 3. Smart Food Substitutions ("Find an Alternative") */}
        {food.substitutes && food.substitutes.length > 0 && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Healthier & Dietary Alternatives for {food.name}
                </h3>
              </div>
              <Link
                href="/substitutes"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                Explore All Substitutes &rarr;
              </Link>
            </div>
            <p className="text-xs text-slate-500">
              Need a vegan, lower-calorie, or higher-protein swap? Here are scientifically balanced alternatives:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {food.substitutes.map((sub) => (
                <div
                  key={sub.foodId}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between hover:border-brand-300 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200">
                        <Image src={sub.imageUrl} alt={sub.foodName} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {sub.foodName}
                        </h4>
                        <span className="text-[11px] text-brand-600 font-semibold">Recommended Alternative</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sub.reason}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className={sub.proteinDiff >= 0 ? "text-blue-600 font-bold" : "text-slate-500"}>
                        {sub.proteinDiff >= 0 ? `+${sub.proteinDiff}g` : `${sub.proteinDiff}g`} Prot
                      </span>
                      <span>•</span>
                      <span className={sub.calorieDiff <= 0 ? "text-emerald-600 font-bold" : "text-amber-600"}>
                        {sub.calorieDiff > 0 ? `+${sub.calorieDiff}` : sub.calorieDiff} kcal
                      </span>
                    </div>
                    <Link
                      href={`/food/${sub.foodSlug}`}
                      className="font-bold text-brand-600 hover:underline flex items-center gap-0.5"
                    >
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Compare with Similar Foods */}
        <section className="bg-gradient-to-r from-brand-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold tracking-tight">
              Compare {food.name} with other foods
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Evaluate protein density, glycemic ratios, fiber content, and micronutrients side-by-side using our interactive radar and multi-bar comparisons.
            </p>
          </div>
          <Link
            href={`/compare?slugs=${food.slug}`}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-transform hover:scale-105 flex-shrink-0"
          >
            <Scale className="w-4 h-4" /> Compare Now
          </Link>
        </section>

        {/* 5. Related Foods in Category */}
        {relatedFoods.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                More in {food.categoryName}
              </h3>
              <Link
                href={`/search?category=${food.categoryId}`}
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                View all in category &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedFoods.map((item) => (
                <FoodCard key={item.id} food={item} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
