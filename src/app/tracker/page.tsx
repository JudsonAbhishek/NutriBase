"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useNutri } from "@/context/NutriContext";
import { FOODS } from "@/data/foods";
import { FoodItem } from "@/types/nutrition";
import { calculateBMI, scaleNutrients } from "@/lib/algorithms/healthCalculators";
import { 
  CalendarDays, 
  Plus, 
  Trash2, 
  Flame, 
  Dumbbell, 
  Wheat, 
  Heart, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function DailyTrackerPage() {
  const { dailyLog, addMealItem, removeMealItem, clearDayLog, profile } = useNutri();

  const [activeModalMeal, setActiveModalMeal] = useState<"breakfast" | "lunch" | "dinner" | "snacks" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedGrams, setSelectedGrams] = useState<number>(100);

  // Compute daily totals across all meals
  const allLoggedItems = [
    ...dailyLog.breakfast,
    ...dailyLog.lunch,
    ...dailyLog.dinner,
    ...dailyLog.snacks,
  ];

  const totals = allLoggedItems.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
      fiber: acc.fiber + item.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const calPct = Math.min(100, Math.round((totals.calories / (profile.targetCalories || 2000)) * 100));
  const proteinPct = Math.min(100, Math.round((totals.protein / (profile.targetProteinG || 100)) * 100));
  const carbsPct = Math.min(100, Math.round((totals.carbs / (profile.targetCarbsG || 250)) * 100));
  const fatPct = Math.min(100, Math.round((totals.fat / (profile.targetFatG || 65)) * 100));
  const fiberPct = Math.min(100, Math.round((totals.fiber / (profile.targetFiberG || 28)) * 100));
  const bmiResult = calculateBMI(profile.weightKg, profile.heightCm, profile.age, profile.gender);

  const handleOpenAddModal = (meal: "breakfast" | "lunch" | "dinner" | "snacks") => {
    setActiveModalMeal(meal);
    setSelectedFood(FOODS[0]);
    setSelectedGrams(FOODS[0].servings[0]?.grams || 100);
    setSearchQuery("");
  };

  const handleConfirmAdd = () => {
    if (!activeModalMeal || !selectedFood) return;

    const scaled = scaleNutrients(
      selectedFood.nutrients,
      selectedFood.vitamins,
      selectedFood.minerals,
      selectedGrams
    );

    addMealItem(activeModalMeal, {
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      imageUrl: selectedFood.imageUrl,
      servingLabel: `${selectedGrams}g`,
      quantity: 1,
      grams: selectedGrams,
      calories: scaled.nutrients.calories,
      protein: scaled.nutrients.protein,
      carbs: scaled.nutrients.carbohydrates,
      fat: scaled.nutrients.fat,
      fiber: scaled.nutrients.fiber,
    });

    setActiveModalMeal(null);
  };

  const mealSections: { id: "breakfast" | "lunch" | "dinner" | "snacks"; title: string; subtitle: string }[] = [
    { id: "breakfast", title: "Breakfast", subtitle: "Morning fuel & hydration" },
    { id: "lunch", title: "Lunch", subtitle: "Midday sustained macronutrients" },
    { id: "dinner", title: "Dinner", subtitle: "Evening repair & replenishment" },
    { id: "snacks", title: "Snacks & Quick Bites", subtitle: "Pre/post workout & fruits" },
  ];

  const searchResults = FOODS.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-brand-600" />
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Daily Nutrition Tracker
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Log your meals throughout the day and observe real-time progression toward your personal caloric and macronutrient targets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {allLoggedItems.length > 0 && (
              <button
                onClick={clearDayLog}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear Day
              </button>
            )}
          </div>
        </div>

        {/* Daily Nutrition Snapshot */}
        <section className="space-y-4" aria-labelledby="daily-snapshot-title">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 id="daily-snapshot-title" className="text-lg font-black text-slate-900 dark:text-white">
                Daily nutrition snapshot
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your daily guide based on the targets currently set in this browser.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Current BMI
              </span>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {bmiResult.bmi.toFixed(1)}
                </span>
                <span className="text-xs font-bold" style={{ color: bmiResult.categoryColor }}>
                  {bmiResult.category}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Target Calories
              </span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {profile.targetCalories}
                <span className="text-xs font-normal text-slate-400"> kcal/day</span>
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Protein Target
              </span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {profile.targetProteinG}
                <span className="text-xs font-normal text-slate-400"> grams</span>
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Fiber Target
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {profile.targetFiberG}
                <span className="text-xs font-normal text-slate-400"> grams</span>
              </span>
            </div>
          </div>

        </section>

        {/* Daily Target Progress Dashboard */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Today&apos;s Calories Consumed
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-brand-400">
                  {totals.calories}
                </span>
                <span className="text-slate-400 text-sm">
                  / {profile.targetCalories || 2000} kcal ({calPct}%)
                </span>
              </div>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Remaining Today
              </span>
              <span className={`text-2xl font-black ${(profile.targetCalories || 2000) - totals.calories >= 0 ? "text-slate-100" : "text-rose-400"}`}>
                {(profile.targetCalories || 2000) - totals.calories} kcal
              </span>
            </div>
          </div>

          {/* Big Energy Bar */}
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                calPct > 100 ? "bg-rose-500" : "bg-gradient-to-r from-emerald-400 to-brand-500"
              }`}
              style={{ width: `${Math.min(100, calPct)}%` }}
            />
          </div>

          {/* 4 Core Macro Rings / Bars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            
            {/* Protein */}
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-blue-400 font-bold flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5" /> Protein
                </span>
                <span className="font-bold text-white">
                  {totals.protein.toFixed(1)} / {profile.targetProteinG || 120}g
                </span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${proteinPct}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 block">{proteinPct}% target reached</span>
            </div>

            {/* Carbs */}
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Wheat className="w-3.5 h-3.5" /> Carbs
                </span>
                <span className="font-bold text-white">
                  {totals.carbs.toFixed(1)} / {profile.targetCarbsG || 250}g
                </span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${carbsPct}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 block">{carbsPct}% target reached</span>
            </div>

            {/* Fat */}
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Fats
                </span>
                <span className="font-bold text-white">
                  {totals.fat.toFixed(1)} / {profile.targetFatG || 65}g
                </span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${fatPct}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 block">{fatPct}% target reached</span>
            </div>

            {/* Fiber */}
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" /> Fiber
                </span>
                <span className="font-bold text-white">
                  {totals.fiber.toFixed(1)} / {profile.targetFiberG || 28}g
                </span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${fiberPct}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 block">{fiberPct}% target reached</span>
            </div>

          </div>
        </div>

        {/* Meal Logging Sections (Breakfast, Lunch, Dinner, Snacks) */}
        <div className="space-y-6">
          {mealSections.map((sec) => {
            const items = dailyLog[sec.id];
            const secCalories = items.reduce((sum, i) => sum + i.calories, 0);
            const secProtein = items.reduce((sum, i) => sum + i.protein, 0);

            return (
              <div
                key={sec.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                      {sec.title}
                    </h3>
                    <span className="text-xs text-slate-400">{sec.subtitle}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {secCalories} kcal • {secProtein.toFixed(1)}g Protein
                    </span>
                    <button
                      onClick={() => handleOpenAddModal(sec.id)}
                      className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold flex items-center gap-1 border border-brand-200 transition-colors dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-400/30 dark:hover:bg-emerald-500/25"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Food
                    </button>
                  </div>
                </div>

                {/* Section Items */}
                {items.length > 0 ? (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200">
                            <Image src={item.imageUrl} alt={item.foodName} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">{item.foodName}</span>
                            <span className="text-[10px] text-slate-500">
                              Portion: {item.servingLabel} ({item.grams}g)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="font-bold text-slate-900 block">{item.calories} kcal</span>
                            <span className="text-[10px] text-blue-600 font-semibold">{item.protein}g protein</span>
                          </div>
                          <button
                            onClick={() => removeMealItem(sec.id, item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-600">
                    No foods logged for {sec.title.toLowerCase()} yet.
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal: Add Food to Meal */}
        {activeModalMeal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 capitalize">
                  Add Food to {activeModalMeal}
                </h3>
                <button
                  onClick={() => setActiveModalMeal(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  ✕
                </button>
              </div>

              {/* Search food input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food by name..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500"
              />

              {/* Foods list */}
              <div className="max-h-48 overflow-y-auto space-y-1">
                {searchResults.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFood(f);
                      setSelectedGrams(f.servings[0]?.grams || 100);
                    }}
                    className={`w-full text-left p-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                      selectedFood?.id === f.id
                        ? "bg-brand-50 border border-brand-300 font-bold"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={f.imageUrl} alt={f.name} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="text-slate-900 block leading-tight">{f.name}</span>
                        <span className="text-[10px] text-slate-400">{f.categoryName}</span>
                      </div>
                    </div>
                    <span className="text-slate-500">{f.nutrients.calories} kcal / 100g</span>
                  </button>
                ))}
              </div>

              {/* Serving size grams input */}
              {selectedFood && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Portion Weight (grams):</span>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={selectedGrams}
                      onChange={(e) => setSelectedGrams(Number(e.target.value))}
                      className="w-20 text-center font-bold text-slate-900 bg-white border border-slate-200 rounded-lg py-1 text-xs"
                    />
                  </div>

                  {/* Predefined Servings */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedFood.servings.map((s) => (
                      <button
                        key={s.unit}
                        onClick={() => setSelectedGrams(s.grams)}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border font-medium ${
                          selectedGrams === s.grams
                            ? "bg-brand-600 text-white border-brand-600"
                            : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setActiveModalMeal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAdd}
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20"
                >
                  Log to {activeModalMeal}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
