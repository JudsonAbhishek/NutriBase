"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FoodRepository } from "@/lib/db/repository";
import { FOODS } from "@/data/foods";
import { FOOD_CATEGORIES } from "@/data/categories";
import { FoodItem } from "@/types/nutrition";
import { useNutri } from "@/context/NutriContext";
import { getSmartRatios } from "@/lib/algorithms/healthCalculators";
import { 
  Scale, 
  Plus, 
  X, 
  Trophy, 
  Zap, 
  BarChart2, 
  Share2, 
  Check, 
  ArrowRight 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { compareList, removeFromCompare, addToCompare, clearCompare } = useNutri();

  // Search & add dropdown state
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectorQuery, setSelectorQuery] = useState("");
  const [selectorCategory, setSelectorCategory] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const comparisonInitialized = useRef(false);

  useEffect(() => {
    if (!selectorOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectorOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectorOpen]);

  // Sync url param if specified (e.g. ?slugs=apple,banana,orange)
  useEffect(() => {
    if (comparisonInitialized.current) return;
    comparisonInitialized.current = true;

    const slugsParam = searchParams.get("slugs");
    if (slugsParam) {
      const validSlugs = new Set(FOODS.map((food) => food.slug));
      const slugs = [...new Set(slugsParam.split(",").map((s) => s.trim()))]
        .filter((slug) => validSlugs.has(slug))
        .slice(0, 5);
      slugs.forEach((slug) => addToCompare(slug));
    } else if (compareList.length === 0) {
      // Default initial comparison for first-time visitors
      addToCompare("apple");
      addToCompare("banana");
      addToCompare("orange");
    }
  }, [searchParams, addToCompare, compareList.length]);

  const comparedFoods: FoodItem[] = compareList
    .map((slug) => FoodRepository.getFoodBySlug(slug))
    .filter((f): f is FoodItem => Boolean(f));

  const availableFoodsToAdd = FOODS.filter(
    (f) =>
      !compareList.includes(f.slug) &&
      (!selectorCategory || f.categoryId === selectorCategory) &&
      f.name.toLowerCase().includes(selectorQuery.trim().toLowerCase())
  );

  const handleShare = () => {
    const url = `${window.location.origin}/compare?slugs=${compareList.join(",")}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Compute "Better For..." Winners
  const winners = React.useMemo(() => {
    if (comparedFoods.length < 2) return null;

    const highestProtein = [...comparedFoods].sort((a, b) => b.nutrients.protein - a.nutrients.protein)[0];
    const lowestCalories = [...comparedFoods].sort((a, b) => a.nutrients.calories - b.nutrients.calories)[0];
    const highestFiber = [...comparedFoods].sort((a, b) => b.nutrients.fiber - a.nutrients.fiber)[0];
    const highestVitC = [...comparedFoods].sort((a, b) => b.vitamins.vitaminC_mg - a.vitamins.vitaminC_mg)[0];
    const highestPotassium = [...comparedFoods].sort((a, b) => b.minerals.potassium_mg - a.minerals.potassium_mg)[0];
    const lowestSugar = [...comparedFoods].sort((a, b) => a.nutrients.sugar - b.nutrients.sugar)[0];
    
    // Best Protein per 100 kcal ratio
    const bestProteinRatio = [...comparedFoods].sort(
      (a, b) => getSmartRatios(b.nutrients).proteinPer100Kcal - getSmartRatios(a.nutrients).proteinPer100Kcal
    )[0];

    return {
      highestProtein,
      lowestCalories,
      highestFiber,
      highestVitC,
      highestPotassium,
      lowestSugar,
      bestProteinRatio,
    };
  }, [comparedFoods]);

  // Chart Data preparation
  const barChartData = [
    {
      metric: "Calories (kcal)",
      ...Object.fromEntries(comparedFoods.map((f) => [f.slug, f.nutrients.calories])),
    },
    {
      metric: "Protein (g)",
      ...Object.fromEntries(comparedFoods.map((f) => [f.slug, f.nutrients.protein])),
    },
    {
      metric: "Carbs (g)",
      ...Object.fromEntries(comparedFoods.map((f) => [f.slug, f.nutrients.carbohydrates])),
    },
    {
      metric: "Fiber (g)",
      ...Object.fromEntries(comparedFoods.map((f) => [f.slug, f.nutrients.fiber])),
    },
    {
      metric: "Sugar (g)",
      ...Object.fromEntries(comparedFoods.map((f) => [f.slug, f.nutrients.sugar])),
    },
  ];

  // Radar chart density (normalized 0 - 100 based on standard DV)
  const radarChartData = [
    {
      subject: "Protein",
      ...Object.fromEntries(comparedFoods.map((f) => [f.slug, Math.min(100, (f.nutrients.protein / 50) * 100)])),
    },
    {
      subject: "Fiber",
      ...Object.fromEntries(comparedFoods.map((f) => [f.slug, Math.min(100, (f.nutrients.fiber / 28) * 100)])),
    },
    {
      subject: "Vitamin C",
      ...Object.fromEntries(comparedFoods.map((f) => [f.slug, Math.min(100, (f.vitamins.vitaminC_mg / 90) * 100)])),
    },
    {
      subject: "Potassium",
      ...Object.fromEntries(comparedFoods.map((f) => [f.slug, Math.min(100, (f.minerals.potassium_mg / 4700) * 100)])),
    },
    {
      subject: "Iron",
      ...Object.fromEntries(comparedFoods.map((f) => [f.slug, Math.min(100, (f.minerals.iron_mg / 18) * 100)])),
    },
    {
      subject: "Calcium",
      ...Object.fromEntries(comparedFoods.map((f) => [f.slug, Math.min(100, (f.minerals.calcium_mg / 1300) * 100)])),
    },
  ];

  const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-brand-600" />
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Food Nutrition Comparison
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Side-by-side scientific comparison of up to 5 foods. Analyze macros, micronutrient density, and smart caloric ratios.
            </p>
          </div>

          {comparedFoods.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-brand-600 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Link Copied!" : "Share Comparison"}</span>
              </button>
              <button
                onClick={clearCompare}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Selected Foods Horizontal Picker & Add Button */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Comparing ({comparedFoods.length} of 5 slots used)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {comparedFoods.map((food, idx) => (
              <div
                key={food.id}
                className="relative bg-slate-50 rounded-2xl p-3 border border-slate-200 flex flex-col items-center text-center group"
              >
                <button
                  onClick={() => removeFromCompare(food.slug)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-white text-slate-400 hover:text-rose-600 border border-slate-200 shadow-sm"
                  title="Remove from comparison"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="relative w-16 h-16 rounded-xl overflow-hidden mb-2 shadow-sm">
                  <Image src={food.imageUrl} alt={food.name} fill className="object-cover" />
                </div>
                <span className="text-xs font-bold text-slate-900 line-clamp-1">{food.name}</span>
                <span className="text-[10px] text-slate-400">{food.nutrients.calories} kcal / 100g</span>
                <span className="mt-1 text-[10px] font-medium text-slate-500">{food.categoryName}</span>
                <div
                  className="w-full h-1 rounded-full mt-2"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                />
              </div>
            ))}

            {/* Add Food Slot */}
            {comparedFoods.length < 5 && (
              <div className="relative">
                <button
                  onClick={() => setSelectorOpen(!selectorOpen)}
                  className="w-full h-full min-h-[120px] rounded-2xl border-2 border-dashed border-slate-300 hover:border-brand-500 hover:bg-brand-50/40 text-slate-500 hover:text-brand-600 transition-all flex flex-col items-center justify-center p-3 gap-1"
                >
                  <Plus className="w-5 h-5 text-brand-600" />
                  <span className="text-xs font-bold">Add Food</span>
                  <span className="text-[10px] text-slate-400">Slot {comparedFoods.length + 1} of 5</span>
                </button>

                {/* Food picker dialog */}
                {selectorOpen && (
                  <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4"
                    onClick={() => setSelectorOpen(false)}
                  >
                    <div
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="food-picker-title"
                      className="flex h-[min(36rem,calc(100dvh-2rem))] w-full max-w-md flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h2 id="food-picker-title" className="text-sm font-bold text-slate-900 dark:text-white">
                            Find foods to compare
                          </h2>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            Search by food name or filter by category.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectorOpen(false)}
                          aria-label="Close food picker"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={selectorQuery}
                        onChange={(e) => setSelectorQuery(e.target.value)}
                        placeholder="Search food name..."
                        aria-label="Search foods to compare"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        autoFocus
                      />
                      <label className="block space-y-1">
                        <span className="text-[10px] font-semibold text-slate-500">
                          Food category
                        </span>
                        <select
                          value={selectorCategory}
                          onChange={(event) => setSelectorCategory(event.target.value)}
                          aria-label="Filter foods by category"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        >
                          <option value="">All categories</option>
                          {FOOD_CATEGORIES.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain">
                        {availableFoodsToAdd.length > 0 ? availableFoodsToAdd.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              addToCompare(item.slug);
                              setSelectorOpen(false);
                              setSelectorQuery("");
                              setSelectorCategory("");
                            }}
                            className="flex w-full items-center gap-2 rounded-xl p-2 text-left text-xs hover:bg-brand-50 dark:hover:bg-slate-800"
                          >
                            <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg">
                              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                            </div>
                            <div>
                              <span className="block font-bold leading-tight text-slate-800 dark:text-slate-100">{item.name}</span>
                              <span className="text-[10px] text-slate-500">
                                {item.categoryName} · {item.nutrients.calories} kcal / 100g
                              </span>
                            </div>
                          </button>
                        )) : (
                          <p className="px-2 py-5 text-center text-[11px] text-slate-500">
                            No matching foods available. Selected foods cannot be added again.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {comparedFoods.length < 2 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <Scale className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              Please select at least 2 foods to start comparing
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click &ldquo;Add Food&rdquo; above or browse the food directory to add items to your side-by-side comparison tray.
            </p>
          </div>
        ) : (
          <>
            {/* 1. "Better For..." Smart Summary Badges */}
            {winners && (
              <section className="bg-gradient-to-br from-slate-900 to-brand-950 text-white rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold tracking-tight">
                    Smart Insights: Which food is better for what?
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  
                  <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-amber-300 block mb-1">
                      ★ Best for Protein
                    </span>
                    <span className="text-sm font-bold text-white block">
                      {winners.highestProtein.name}
                    </span>
                    <span className="text-xs text-slate-300">
                      {winners.highestProtein.nutrients.protein}g protein / 100g
                    </span>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">
                      ★ Best for Weight Loss (Lowest Cal)
                    </span>
                    <span className="text-sm font-bold text-white block">
                      {winners.lowestCalories.name}
                    </span>
                    <span className="text-xs text-slate-300">
                      Only {winners.lowestCalories.nutrients.calories} kcal / 100g
                    </span>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-cyan-300 block mb-1">
                      ★ Highest Fiber & Satiety
                    </span>
                    <span className="text-sm font-bold text-white block">
                      {winners.highestFiber.name}
                    </span>
                    <span className="text-xs text-slate-300">
                      {winners.highestFiber.nutrients.fiber}g dietary fiber
                    </span>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-rose-300 block mb-1">
                      ★ Best Protein-to-Calorie Ratio
                    </span>
                    <span className="text-sm font-bold text-white block">
                      {winners.bestProteinRatio.name}
                    </span>
                    <span className="text-xs text-slate-300">
                      {getSmartRatios(winners.bestProteinRatio.nutrients).proteinPer100Kcal}g protein / 100 kcal
                    </span>
                  </div>

                </div>
              </section>
            )}

            {/* 2. Visual Charts (Bar Chart & Radar Chart) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Macro Bar Chart */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-brand-600" />
                    Macronutrients Comparison (per 100g)
                  </h3>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Live comparison from the selected foods&apos; nutrition data. Change the foods above to update the chart.
                </p>
                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="metric" tick={{ fontSize: 11, fill: "#64748b" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "none",
                          borderRadius: "12px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                      {comparedFoods.map((f, i) => (
                        <Bar
                          key={f.slug}
                          dataKey={f.slug}
                          name={f.name}
                          fill={colors[i % colors.length]}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Micronutrient Density Radar */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Nutrient Density Radar (% Daily Value)
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarChartData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#475569" }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <Tooltip />
                      {comparedFoods.map((f, i) => (
                        <Radar
                          key={f.slug}
                          name={f.name}
                          dataKey={f.slug}
                          stroke={colors[i % colors.length]}
                          fill={colors[i % colors.length]}
                          fillOpacity={0.25}
                        />
                      ))}
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* 3. Comprehensive Comparison Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Complete Scientific Side-by-Side Table (per 100g)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data normalized to 100g edible portion for true objective density comparison.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="p-4 w-44">Nutrient Metric</th>
                      {comparedFoods.map((f, idx) => (
                        <th key={f.id} className="p-4 min-w-[140px]">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: colors[idx % colors.length] }}
                            />
                            <span className="font-extrabold text-slate-900 text-sm">{f.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    
                    {/* General */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-slate-700">NutriBase Score</td>
                      {comparedFoods.map((f) => (
                        <td key={f.id} className="p-4">
                          <span
                            className="font-bold px-2.5 py-1 rounded-lg text-white"
                            style={{ backgroundColor: f.nutritionScore.color }}
                          >
                            {f.nutritionScore.totalScore} / 100
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-50/50 bg-slate-50/20">
                      <td className="p-4 font-semibold text-slate-700">Energy (Calories)</td>
                      {comparedFoods.map((f) => (
                        <td key={f.id} className="p-4 font-bold text-slate-900">
                          {f.nutrients.calories} kcal
                        </td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-blue-600">Protein</td>
                      {comparedFoods.map((f) => (
                        <td key={f.id} className="p-4 font-bold text-blue-700">
                          {f.nutrients.protein}g
                        </td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-amber-600">Carbohydrates</td>
                      {comparedFoods.map((f) => (
                        <td key={f.id} className="p-4 font-semibold text-amber-700">
                          {f.nutrients.carbohydrates}g
                        </td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-emerald-600">Dietary Fiber</td>
                      {comparedFoods.map((f) => (
                        <td key={f.id} className="p-4 font-semibold text-emerald-700">
                          {f.nutrients.fiber}g
                        </td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-pink-600">Total Sugar</td>
                      {comparedFoods.map((f) => (
                        <td key={f.id} className="p-4 text-slate-600">
                          {f.nutrients.sugar}g
                        </td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-rose-600">Total Fat</td>
                      {comparedFoods.map((f) => (
                        <td key={f.id} className="p-4 text-slate-600">
                          {f.nutrients.fat}g
                        </td>
                      ))}
                    </tr>

                    {/* Section: Smart Ratios */}
                    <tr className="bg-brand-50/40">
                      <td colSpan={comparedFoods.length + 1} className="p-3 font-bold text-brand-900 uppercase text-[10px] tracking-wider">
                        Smart Efficiency Ratios
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-slate-700">Protein per 100 kcal</td>
                      {comparedFoods.map((f) => {
                        const ratio = getSmartRatios(f.nutrients).proteinPer100Kcal;
                        return (
                          <td key={f.id} className="p-4 font-bold text-blue-700">
                            {ratio}g
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-slate-700">Fiber per 100 kcal</td>
                      {comparedFoods.map((f) => {
                        const ratio = getSmartRatios(f.nutrients).fiberPer100Kcal;
                        return (
                          <td key={f.id} className="p-4 font-bold text-emerald-700">
                            {ratio}g
                          </td>
                        );
                      })}
                    </tr>

                    {/* Section: Micronutrients */}
                    <tr className="bg-brand-50/40">
                      <td colSpan={comparedFoods.length + 1} className="p-3 font-bold text-brand-900 uppercase text-[10px] tracking-wider">
                        Key Micronutrients
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-slate-700">Vitamin C</td>
                      {comparedFoods.map((f) => (
                        <td key={f.id} className="p-4 text-slate-700">
                          {f.vitamins.vitaminC_mg} mg
                        </td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-slate-700">Potassium</td>
                      {comparedFoods.map((f) => (
                        <td key={f.id} className="p-4 text-slate-700">
                          {f.minerals.potassium_mg} mg
                        </td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-slate-700">Iron</td>
                      {comparedFoods.map((f) => (
                        <td key={f.id} className="p-4 text-slate-700">
                          {f.minerals.iron_mg} mg
                        </td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-slate-700">Calcium</td>
                      {comparedFoods.map((f) => (
                        <td key={f.id} className="p-4 text-slate-700">
                          {f.minerals.calcium_mg} mg
                        </td>
                      ))}
                    </tr>

                    {/* View Details Action */}
                    <tr className="bg-slate-50/70">
                      <td className="p-4 font-semibold text-slate-500">View Full Facts</td>
                      {comparedFoods.map((f) => (
                        <td key={f.id} className="p-4">
                          <Link
                            href={`/food/${f.slug}`}
                            className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                          >
                            Details <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      ))}
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-xs text-slate-400 font-bold">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
