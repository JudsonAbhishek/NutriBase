"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FOODS } from "@/data/foods";
import { FoodItem } from "@/types/nutrition";
import { calculateBMI, scaleNutrients } from "@/lib/algorithms/healthCalculators";
import { useNutri } from "@/context/NutriContext";
import { 
  UtensilsCrossed, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  PieChart 
} from "lucide-react";

interface MealRow {
  id: string;
  food: FoodItem;
  grams: number;
}

export default function MealNutritionCalculatorPage() {
  const { addMealItem, profile } = useNutri();

  // Initial meal example as requested in prompt: 100g white rice, 100g chicken breast, 50g dal, 100g spinach
  const [mealItems, setMealItems] = useState<MealRow[]>([
    { id: "1", food: FOODS.find((f) => f.slug === "white-rice") || FOODS[0], grams: 150 },
    { id: "2", food: FOODS.find((f) => f.slug === "chicken-breast") || FOODS[1], grams: 150 },
    { id: "3", food: FOODS.find((f) => f.slug === "yellow-dal-toor") || FOODS[2], grams: 80 },
    { id: "4", food: FOODS.find((f) => f.slug === "spinach") || FOODS[3], grams: 100 },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const commonFoodOptions = [
    { label: "Rice", slug: "white-rice", grams: 150 },
    { label: "Curd", slug: "yogurt", grams: 100 },
    { label: "Chicken", slug: "chicken-breast", grams: 100 },
    { label: "Dal", slug: "yellow-dal-toor", grams: 100 },
    { label: "Paneer", slug: "paneer", grams: 100 },
    { label: "Milk", slug: "milk", grams: 200 },
  ];

  const bmiResult = calculateBMI(profile.weightKg, profile.heightCm, profile.age, profile.gender);

  const availableFoods = FOODS.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFood = (food: FoodItem) => {
    setMealItems((prev) => [
      ...prev,
      {
        id: `${food.id}-${Date.now()}`,
        food,
        grams: 100,
      },
    ]);
    setDropdownOpen(false);
    setSearchQuery("");
  };

  const addCommonFood = (slug: string, grams: number) => {
    const food = FOODS.find((item) => item.slug === slug);
    if (food) {
      handleAddFoodWithGrams(food, grams);
    }
  };

  const handleAddFoodWithGrams = (food: FoodItem, grams: number) => {
    setMealItems((prev) => [
      ...prev,
      { id: `${food.id}-${Date.now()}`, food, grams },
    ]);
    setDropdownOpen(false);
    setSearchQuery("");
  };

  const handleRemoveRow = (rowId: string) => {
    setMealItems((prev) => prev.filter((r) => r.id !== rowId));
  };

  const handleGramsChange = (rowId: string, grams: number) => {
    setMealItems((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, grams: Math.max(1, grams) } : r))
    );
  };

  // Compute aggregate totals
  const totals = mealItems.reduce(
    (acc, row) => {
      const scaled = scaleNutrients(
        row.food.nutrients,
        row.food.vitamins,
        row.food.minerals,
        row.grams
      );

      acc.totalWeight += row.grams;
      acc.calories += scaled.nutrients.calories;
      acc.protein += scaled.nutrients.protein;
      acc.carbs += scaled.nutrients.carbohydrates;
      acc.fat += scaled.nutrients.fat;
      acc.fiber += scaled.nutrients.fiber;
      acc.sugar += scaled.nutrients.sugar;
      acc.sodium += scaled.minerals.sodium_mg;
      acc.potassium += scaled.minerals.potassium_mg;
      acc.iron += scaled.minerals.iron_mg;
      acc.calcium += scaled.minerals.calcium_mg;
      acc.vitaminC += scaled.vitamins.vitaminC_mg;

      return acc;
    },
    {
      totalWeight: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      potassium: 0,
      iron: 0,
      calcium: 0,
      vitaminC: 0,
    }
  );

  const handleLogWholeMeal = (mealType: "breakfast" | "lunch" | "dinner" | "snacks") => {
    mealItems.forEach((row) => {
      const scaled = scaleNutrients(row.food.nutrients, row.food.vitamins, row.food.minerals, row.grams);
      addMealItem(mealType, {
        foodId: row.food.id,
        foodName: row.food.name,
        imageUrl: row.food.imageUrl,
        servingLabel: `${row.grams}g`,
        quantity: 1,
        grams: row.grams,
        calories: scaled.nutrients.calories,
        protein: scaled.nutrients.protein,
        carbs: scaled.nutrients.carbohydrates,
        fat: scaled.nutrients.fat,
        fiber: scaled.nutrients.fiber,
      });
    });
    setSavedNotice(`Logged complete meal to ${mealType.toUpperCase()}!`);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <Link
          href="/calculators"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Calculators
        </Link>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-brand-600" />
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Composite Meal Nutrition Calculator
            </h1>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Common foods
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {commonFoodOptions.map((option) => (
                <button
                  key={option.slug}
                  type="button"
                  onClick={() => addCommonFood(option.slug, option.grams)}
                  className="px-3 py-2 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-600 hover:text-white transition-colors text-xs font-bold"
                >
                  + {option.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              Add a food, enter its edible quantity in grams, and the nutrition updates instantly.
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Combine multiple foods with custom gram weights to calculate the aggregate calories, macronutrients, and micronutrient profile of your entire meal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Items Table List */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ingredients in Meal ({mealItems.length})
              </span>
              
              {/* Add Ingredient Button & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-3.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-brand-200"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Food
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-30 space-y-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search ingredient..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                      autoFocus
                    />
                    <div className="max-h-56 overflow-y-auto space-y-1">
                      {availableFoods.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => handleAddFood(f)}
                          className="w-full text-left p-2 rounded-xl hover:bg-brand-50 flex items-center gap-2 text-xs"
                        >
                          <div className="relative w-6 h-6 rounded-md overflow-hidden flex-shrink-0">
                            <Image src={f.imageUrl} alt={f.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block leading-tight">{f.name}</span>
                            <span className="text-[10px] text-slate-400">{f.categoryName}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {mealItems.map((item) => {
                const scaled = scaleNutrients(
                  item.food.nutrients,
                  item.food.vitamins,
                  item.food.minerals,
                  item.grams
                );

                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200">
                        <Image src={item.food.imageUrl} alt={item.food.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">{item.food.name}</h4>
                        <span className="text-[10px] text-slate-500">
                          {scaled.nutrients.calories} kcal • {scaled.nutrients.protein}g P • {scaled.nutrients.carbohydrates}g C
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200">
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={item.grams}
                          onChange={(e) => handleGramsChange(item.id, Number(e.target.value))}
                          className="w-14 text-center font-bold text-slate-800 focus:outline-none text-xs"
                        />
                        <span className="text-[10px] text-slate-400 font-semibold pr-1">g</span>
                      </div>

                      <button
                        onClick={() => handleRemoveRow(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Log Meal Buttons */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Log this entire combination to Daily Tracker:</span>
                {savedNotice && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full animate-bounce">
                    {savedNotice}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(["breakfast", "lunch", "dinner", "snacks"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => handleLogWholeMeal(m)}
                    className="py-2 text-xs font-bold bg-slate-50 hover:bg-brand-600 hover:text-white rounded-xl border border-slate-200 hover:border-brand-600 capitalize transition-all"
                  >
                    + {m}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Aggregate Totals Dashboard */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Your daily guide
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-1">
                    BMI {bmiResult.bmi.toFixed(1)}
                  </h2>
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: bmiResult.categoryColor }}
                >
                  {bmiResult.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Targets use your saved profile, activity level, and goal. BMI is a screening guide, not a diagnosis.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Calories", `${profile.targetCalories} kcal`, totals.calories, profile.targetCalories],
                  ["Protein", `${profile.targetProteinG} g`, totals.protein, profile.targetProteinG],
                  ["Carbs", `${profile.targetCarbsG} g`, totals.carbs, profile.targetCarbsG],
                  ["Fat", `${profile.targetFatG} g`, totals.fat, profile.targetFatG],
                  ["Fiber", `${profile.targetFiberG} g`, totals.fiber, profile.targetFiberG],
                ].map(([label, target, current, dailyTarget]) => {
                  const percent = Math.min(100, Math.round((Number(current) / Number(dailyTarget)) * 100));
                  return (
                    <div key={label} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-slate-500">{label}</span>
                        <span className="text-[10px] font-black text-brand-700">{percent}%</span>
                      </div>
                      <span className="block text-sm font-black text-slate-900 mt-1">
                        {typeof current === "number" ? current.toFixed(label === "Calories" ? 0 : 1) : current}
                        <span className="text-[10px] font-medium text-slate-400"> / {target}</span>
                      </span>
                      <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
                  Total Meal Energy ({totals.totalWeight}g food mass)
                </span>
                <span className="text-5xl font-black tracking-tight text-amber-400 block mt-2">
                  {Math.round(totals.calories)} <span className="text-base font-normal text-slate-300">kcal</span>
                </span>
              </div>

              {/* Core Macros Strip */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700/80">
                  <span className="text-[10px] uppercase font-bold text-blue-400 block">Total Protein</span>
                  <span className="text-2xl font-black text-white">{totals.protein.toFixed(1)}g</span>
                </div>
                <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700/80">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">Total Carbs</span>
                  <span className="text-2xl font-black text-white">{totals.carbs.toFixed(1)}g</span>
                </div>
                <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700/80">
                  <span className="text-[10px] uppercase font-bold text-rose-400 block">Total Fat</span>
                  <span className="text-2xl font-black text-white">{totals.fat.toFixed(1)}g</span>
                </div>
                <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700/80">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Dietary Fiber</span>
                  <span className="text-2xl font-black text-white">{totals.fiber.toFixed(1)}g</span>
                </div>
              </div>

              {/* Micronutrients Summary */}
              <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-300 block uppercase tracking-wider text-[10px]">
                  Aggregated Micronutrients
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 block text-[10px]">Vitamin C</span>
                    <span className="font-bold text-white">{totals.vitaminC.toFixed(1)} mg</span>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 block text-[10px]">Iron</span>
                    <span className="font-bold text-white">{totals.iron.toFixed(2)} mg</span>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 block text-[10px]">Calcium</span>
                    <span className="font-bold text-white">{totals.calcium.toFixed(0)} mg</span>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 block text-[10px]">Potassium</span>
                    <span className="font-bold text-white">{totals.potassium.toFixed(0)} mg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
