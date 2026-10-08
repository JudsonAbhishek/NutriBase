import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FoodRepository } from "@/lib/db/repository";
import { FoodCard } from "@/components/food/FoodCard";
import { Award, Flame, Dumbbell, ShieldCheck, Heart, ArrowRight, Apple, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Top Ranking Foods — NutriBase",
  description: "Explore authoritative rankings: Top High Protein Foods, Lowest Calorie Foods, Top Fiber Sources, and Essential Mineral Leaders.",
};

export default function RankingsIndexPage() {
  const rankingCategories = [
    {
      slug: "high-protein",
      title: "Top 20 High Protein Foods",
      icon: Dumbbell,
      color: "from-blue-600 to-indigo-600",
      description: "Ranked by total grams of bioavailable protein per 100g.",
      topLead: "Chicken Breast, Soybeans, Salmon",
    },
    {
      slug: "low-calorie",
      title: "Top 20 Low Calorie Foods",
      icon: Flame,
      color: "from-rose-500 to-amber-500",
      description: "Ranked for maximum volume and satiety with minimal caloric density.",
      topLead: "Spinach, Watermelon, Broccoli",
    },
    {
      slug: "high-fiber",
      title: "Top 20 High Fiber Foods",
      icon: Heart,
      color: "from-emerald-500 to-teal-600",
      description: "Foods highest in soluble and insoluble fiber for gut and heart health.",
      topLead: "Chia Seeds, Rolled Oats, Guava",
    },
    {
      slug: "rich-in-iron",
      title: "Top Foods Rich in Iron",
      icon: Zap,
      color: "from-purple-600 to-pink-600",
      description: "Essential for hemoglobin synthesis, cellular energy, and oxygen transport.",
      topLead: "Soybeans, Dark Chocolate, Spinach",
    },
    {
      slug: "rich-in-calcium",
      title: "Top Foods Rich in Calcium",
      icon: ShieldCheck,
      color: "from-cyan-600 to-blue-600",
      description: "Foods with exceptional calcium concentration for bone mineral density.",
      topLead: "Firm Tofu, Chia Seeds, Paneer, Ragi",
    },
    {
      slug: "best-vegetarian-protein",
      title: "Best Protein Sources for Vegetarians",
      icon: Award,
      color: "from-green-600 to-emerald-700",
      description: "Highest plant-based and dairy proteins without meat or seafood.",
      topLead: "Soybeans, Paneer, Chickpeas, Dal",
    },
    {
      slug: "best-fruits-for-fiber",
      title: "Best Fruits for Dietary Fiber",
      icon: Apple,
      color: "from-pink-500 to-rose-600",
      description: "Whole fruits with the highest pectin, soluble, and insoluble fiber count.",
      topLead: "Guava, Pomegranate, Banana, Apple",
    },
  ];

  // Preview the #1 ranking category: high protein
  const previewFoods = FoodRepository.getRankings("high-protein", 4);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Top Ranking Foods</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Top Ranking Foods
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Explore foods ranked by protein, calories, fiber, and key minerals, using 100g reference values from USDA FoodData Central and ICMR-NIN.
          </p>
        </div>

        {/* Categories Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankingCategories.map((rank) => {
            const Icon = rank.icon;
            return (
              <Link
                key={rank.slug}
                href={`/rankings/${rank.slug}`}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-400 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${rank.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {rank.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {rank.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                    Leaders: {rank.topLead}
                  </span>
                  <span className="font-bold text-brand-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Featured High Protein Ranking Preview */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Featured: Top High Protein Foods
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Highest protein concentration per 100g edible portion.
              </p>
            </div>
            <Link
              href="/rankings/high-protein"
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              View Full Top 20 &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewFoods.map((f) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
