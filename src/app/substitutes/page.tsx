"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FOODS } from "@/data/foods";
import { FoodItem } from "@/types/nutrition";
import { Sparkles, ArrowRight, ArrowLeftRight, Check, Scale } from "lucide-react";
import { useNutri } from "@/context/NutriContext";

export default function SubstitutesPage() {
  const { addToCompare } = useNutri();

  // Find foods that have substitutes defined or offer substitution pairings
  const foodsWithSubs = FOODS.filter((f) => f.substitutes && f.substitutes.length > 0);
  const [selectedFoodSlug, setSelectedFoodSlug] = useState<string>(foodsWithSubs[0]?.slug || "chicken-breast");

  const selectedFood = FOODS.find((f) => f.slug === selectedFoodSlug) || foodsWithSubs[0];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-brand-600" />
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Smart Food Substitutions & Alternatives
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Find healthy dietary swaps, plant-based equivalents, lower-calorie replacements, and see immediate nutritional deltas.
          </p>
        </div>

        {/* Food Selector Pill Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Select a food to find its best alternatives:
          </label>
          <div className="flex flex-wrap gap-2">
            {FOODS.slice(0, 12).map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedFoodSlug(item.slug)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
                  selectedFoodSlug === item.slug
                    ? "bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-500/20"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Food & Alternatives Display */}
        {selectedFood && (
          <div className="space-y-6">
            
            {/* Current Source Food Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 shadow-sm">
                  <Image src={selectedFood.imageUrl} alt={selectedFood.name} fill className="object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Selected Food</span>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">{selectedFood.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{selectedFood.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Calories</span>
                  <span className="font-extrabold text-slate-900">{selectedFood.nutrients.calories} kcal</span>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div>
                  <span className="text-[10px] text-blue-500 block font-semibold">Protein</span>
                  <span className="font-extrabold text-blue-700">{selectedFood.nutrients.protein}g</span>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div>
                  <span className="text-[10px] text-emerald-500 block font-semibold">Fiber</span>
                  <span className="font-extrabold text-emerald-700">{selectedFood.nutrients.fiber}g</span>
                </div>
              </div>
            </div>

            {/* Alternatives Grid */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Recommended Alternatives for {selectedFood.name}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(selectedFood.substitutes || []).map((sub) => {
                  const altFood = FOODS.find((f) => f.slug === sub.foodSlug);
                  return (
                    <div
                      key={sub.foodId}
                      className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                            <Image src={sub.imageUrl} alt={sub.foodName} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="text-base font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                              {sub.foodName}
                            </h4>
                            <span className="text-xs font-semibold text-brand-600">Smart Alternative</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          {sub.reason}
                        </p>
                      </div>

                      {/* Nutritional Delta Badges */}
                      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Nutrient Difference vs {selectedFood.name} (per 100g)
                        </span>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                            <span className="text-[10px] text-slate-400 block font-medium">Protein Delta</span>
                            <span className={`font-black ${sub.proteinDiff >= 0 ? "text-blue-600" : "text-slate-700"}`}>
                              {sub.proteinDiff >= 0 ? `+${sub.proteinDiff}g` : `${sub.proteinDiff}g`}
                            </span>
                          </div>

                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                            <span className="text-[10px] text-slate-400 block font-medium">Calorie Delta</span>
                            <span className={`font-black ${sub.calorieDiff <= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                              {sub.calorieDiff > 0 ? `+${sub.calorieDiff}` : sub.calorieDiff} kcal
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <button
                            onClick={() => {
                              addToCompare(selectedFood.slug);
                              addToCompare(sub.foodSlug);
                            }}
                            className="text-xs font-semibold text-slate-600 hover:text-brand-600 flex items-center gap-1"
                          >
                            <Scale className="w-3.5 h-3.5" /> Compare both
                          </button>
                          
                          <Link
                            href={`/food/${sub.foodSlug}`}
                            className="font-bold text-brand-600 hover:underline flex items-center gap-0.5 text-xs"
                          >
                            View food <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
