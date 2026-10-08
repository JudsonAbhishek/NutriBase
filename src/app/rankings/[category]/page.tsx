import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { FoodRepository } from "@/lib/db/repository";
import { FoodItem } from "@/types/nutrition";
import { Award, ArrowLeft, ArrowRight, Scale, ShieldCheck } from "lucide-react";

interface RankingPageProps {
  params: {
    category: string;
  };
}

const RANKING_CONFIGS: Record<string, { title: string; metricName: string; unit: string; getValue: (f: FoodItem) => number | string; description: string }> = {
  "high-protein": {
    title: "Top High Protein Foods",
    metricName: "Protein",
    unit: "g / 100g",
    getValue: (f) => f.nutrients.protein,
    description: "Ranked strictly by highest biological protein content per 100g edible portion. Essential for muscle repair, enzyme production, and satiety.",
  },
  "low-calorie": {
    title: "Top Low Calorie Foods",
    metricName: "Calories",
    unit: "kcal / 100g",
    getValue: (f) => f.nutrients.calories,
    description: "Foods with minimal caloric density per 100g, allowing maximum meal volume and natural appetite regulation during fat loss phases.",
  },
  "high-fiber": {
    title: "Top High Fiber Foods",
    metricName: "Fiber",
    unit: "g / 100g",
    getValue: (f) => f.nutrients.fiber,
    description: "Rich sources of soluble and insoluble dietary fibers that support healthy gut microbiota, regulate blood sugar, and lower LDL cholesterol.",
  },
  "rich-in-iron": {
    title: "Top Foods Rich in Iron",
    metricName: "Iron",
    unit: "mg / 100g",
    getValue: (f) => f.minerals.iron_mg,
    description: "Leading foods for non-heme and heme iron to prevent anemia, enhance cellular energy metabolism, and support cognitive oxygenation.",
  },
  "rich-in-calcium": {
    title: "Top Foods Rich in Calcium",
    metricName: "Calcium",
    unit: "mg / 100g",
    getValue: (f) => f.minerals.calcium_mg,
    description: "The most concentrated dietary sources of calcium for bone mineralization, dental health, muscular contraction, and nerve conduction.",
  },
  "best-vegetarian-protein": {
    title: "Best Protein Sources for Vegetarians",
    metricName: "Protein",
    unit: "g / 100g",
    getValue: (f) => f.nutrients.protein,
    description: "The most potent plant-based and dairy proteins for vegetarian and vegan diets without any meat or seafood.",
  },
  "best-fruits-for-fiber": {
    title: "Best Fruits for Dietary Fiber",
    metricName: "Fiber",
    unit: "g / 100g",
    getValue: (f) => f.nutrients.fiber,
    description: "Whole fresh fruits delivering the highest concentration of dietary fiber per 100g.",
  },
};

export async function generateMetadata({ params }: RankingPageProps): Promise<Metadata> {
  const config = RANKING_CONFIGS[params.category];
  if (!config) return { title: "Ranking Not Found — NutriBase" };

  return {
    title: `${config.title} (Scientific Leaderboard) — NutriBase`,
    description: `${config.description} Verified data from USDA FoodData Central and ICMR-NIN.`,
  };
}

export default function CategoryRankingPage({ params }: RankingPageProps) {
  const config = RANKING_CONFIGS[params.category];
  if (!config) {
    notFound();
  }

  const foods = FoodRepository.getRankings(params.category, 20);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation */}
        <Link
          href="/rankings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Rankings Hub
        </Link>

        {/* Title */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-brand-600" />
            <span>Nutritional Leaderboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {config.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {config.description}
          </p>
        </div>

        {/* Ranked Leaderboard List */}
        <div className="space-y-3">
          {foods.map((food, index) => {
            const isTop3 = index < 3;
            const rankMedal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;
            const metricValue = config.getValue(food);

            return (
              <div
                key={food.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isTop3
                    ? "border-brand-200 shadow-sm hover:shadow-md"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Left: Rank & Food Meta */}
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                    index === 0
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : index === 1
                      ? "bg-slate-200 text-slate-800"
                      : index === 2
                      ? "bg-amber-50 text-amber-800"
                      : "bg-slate-50 text-slate-500"
                  }`}>
                    {rankMedal}
                  </span>

                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                    <Image src={food.imageUrl} alt={food.name} fill className="object-cover" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Link href={`/food/${food.slug}`} className="hover:text-brand-600 transition-colors">
                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                          {food.name}
                        </h3>
                      </Link>
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {food.categoryName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {food.description}
                    </p>
                  </div>
                </div>

                {/* Right: Key Metric & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {config.metricName}
                    </span>
                    <span className="text-lg font-black text-brand-700">
                      {metricValue} <span className="text-xs font-semibold text-slate-500">{config.unit}</span>
                    </span>
                  </div>

                  <Link
                    href={`/food/${food.slug}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-brand-600 hover:text-white border border-slate-200 hover:border-brand-600 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <span>View Facts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
