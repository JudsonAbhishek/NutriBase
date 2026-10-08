"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FoodRepository } from "@/lib/db/repository";
import { DietaryType, HealthGoal } from "@/types/nutrition";
import { 
  Sparkles, 
  Dumbbell, 
  Flame, 
  Heart, 
  TrendingUp, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Scale,
  RotateCcw
} from "lucide-react";
import { useNutri } from "@/context/NutriContext";

export default function DiscoverPage() {
  const { addToCompare, isInCompare } = useNutri();

  // Wizard selections
  const [goal, setGoal] = useState<HealthGoal>("muscle_building");
  const [diet, setDiet] = useState<"all" | DietaryType>("all");
  const [priorities, setPriorities] = useState<string[]>(["high_protein"]);
  const [maxCalories, setMaxCalories] = useState<string>("");
  const [minProtein, setMinProtein] = useState<string>("");

  const togglePriority = (p: string) => {
    setPriorities((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const results = FoodRepository.recommendFoods({
    goal,
    diet,
    priorities,
    maxCalories: maxCalories ? parseFloat(maxCalories) : undefined,
    minProtein: minProtein ? parseFloat(minProtein) : undefined,
  });

  const goals = [
    {
      id: "muscle_building" as HealthGoal,
      title: "Muscle Building",
      icon: Dumbbell,
      desc: "High protein, essential amino acids, and balanced recovery nutrients.",
    },
    {
      id: "weight_loss" as HealthGoal,
      title: "Weight Loss",
      icon: Flame,
      desc: "Low calorie density, high satiety fiber, and low simple sugars.",
    },
    {
      id: "general_health" as HealthGoal,
      title: "General Healthy Eating",
      icon: Heart,
      desc: "Antioxidants, balanced vitamins, gut-friendly fiber, and whole foods.",
    },
    {
      id: "weight_gain" as HealthGoal,
      title: "Clean Weight Gain",
      icon: TrendingUp,
      desc: "Nutrient-dense calories, healthy lipids, and sustained carbohydrates.",
    },
  ];

  const diets = [
    { id: "all", label: "Any Diet" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "100% Vegan" },
    { id: "non-vegetarian", label: "Non-Vegetarian" },
    { id: "eggetarian", label: "Eggetarian" },
    { id: "seafood", label: "Pescatarian / Seafood" },
  ];

  const priorityOptions = [
    { id: "high_protein", label: "High Protein (≥12g)" },
    { id: "high_fiber", label: "High Dietary Fiber (≥4g)" },
    { id: "low_calorie", label: "Low Calorie (≤80 kcal)" },
    { id: "low_sugar", label: "Low Sugar (≤5g)" },
    { id: "high_iron", label: "Rich in Iron" },
    { id: "high_calcium", label: "High Calcium" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-brand-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              NutriBase Match Engine
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Tell me what you need, and I&apos;ll find the best foods for you.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Don&apos;t waste hours sifting through static tables. Pick your fitness target, dietary boundaries, and priority nutrients—our matching engine will generate a ranked list with scientifically verified explanations.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 pointer-events-none hidden lg:block">
            <Sparkles className="w-96 h-96 text-brand-400" />
          </div>
        </div>

        {/* Wizard Filter Controls Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-black/20 space-y-8">
          
          {/* Step 1: Goal */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block">
              Step 1: Select Your Health Goal
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {goals.map((g) => {
                const Icon = g.icon;
                const isSelected = goal === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-brand-50/70 dark:bg-emerald-500/15 border-brand-500 shadow-sm ring-2 ring-brand-500/20"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-brand-600" : "text-slate-400"}`} />
                    <h3 className={`text-sm font-bold block ${isSelected ? "text-brand-900 dark:text-emerald-300" : "text-slate-800 dark:text-slate-100"}`}>
                      {g.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {g.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Diet Framework */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block">
              Step 2: Choose Dietary Framework
            </span>
            <div className="flex flex-wrap gap-2">
              {diets.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDiet(d.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    diet === d.id
                      ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Nutrition Priorities */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block">
              Step 3: Select Nutrition Priorities (Multi-select)
            </span>
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map((p) => {
                const isSelected = priorities.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePriority(p.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-400 font-bold"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Optional Calorie / Protein Limits */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">Max Calories / 100g:</span>
              <input
                type="number"
                placeholder="e.g. 150"
                value={maxCalories}
                onChange={(e) => setMaxCalories(e.target.value)}
                className="w-24 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500 font-bold text-center"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">Min Protein (g) / 100g:</span>
              <input
                type="number"
                placeholder="e.g. 15"
                value={minProtein}
                onChange={(e) => setMinProtein(e.target.value)}
                className="w-24 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500 font-bold text-center"
              />
            </div>

            {(maxCalories || minProtein) && (
              <button
                onClick={() => { setMaxCalories(""); setMinProtein(""); }}
                className="text-xs text-brand-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Clear limits
              </button>
            )}
          </div>

        </div>

        {/* Results Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Personalized Recommendations</span>
              <span className="text-xs bg-brand-100 text-brand-800 font-bold px-2.5 py-0.5 rounded-full">
                {results.length} Matches Found
              </span>
            </h2>
            <span className="text-xs text-slate-400">Ranked by Match Score</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map(({ food, matchReason, matchScore }, index) => {
              const compared = isInCompare(food.slug);
              return (
                <div
                  key={food.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top Row: Rank & Match Score */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200">
                          {food.categoryName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>{matchScore}% Match</span>
                      </div>
                    </div>

                    {/* Food Info */}
                    <div className="flex items-start gap-4">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 shadow-sm">
                        <Image src={food.imageUrl} alt={food.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/food/${food.slug}`} className="hover:text-brand-600 transition-colors">
                          <h3 className="text-base font-extrabold text-slate-900 leading-tight truncate">
                            {food.name}
                            {food.hindiName && (
                              <span className="text-xs font-normal text-slate-400 ml-1">
                                ({food.hindiName})
                              </span>
                            )}
                          </h3>
                        </Link>
                        
                        {/* Why this matches badge */}
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 mt-2 leading-relaxed">
                          <strong className="text-brand-700 font-semibold">Why this fits: </strong>
                          {matchReason}
                        </p>
                      </div>
                    </div>

                    {/* Quick Macro Specs Strip */}
                    <div className="grid grid-cols-4 gap-1 text-center bg-slate-50 rounded-xl p-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Calories</span>
                        <span className="font-bold text-slate-800">{food.nutrients.calories}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-blue-500 uppercase font-semibold block">Protein</span>
                        <span className="font-bold text-blue-700">{food.nutrients.protein}g</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-500 uppercase font-semibold block">Carbs</span>
                        <span className="font-bold text-amber-700">{food.nutrients.carbohydrates}g</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-500 uppercase font-semibold block">Fiber</span>
                        <span className="font-bold text-emerald-700">{food.nutrients.fiber}g</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => addToCompare(food.slug)}
                      className={`flex items-center gap-1 font-semibold transition-colors ${
                        compared ? "text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{compared ? "In Comparison" : "Add to Compare"}</span>
                    </button>

                    <Link
                      href={`/food/${food.slug}`}
                      className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
