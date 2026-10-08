"use client";

import React, { useState } from "react";
import { FoodItem, ServingOption } from "@/types/nutrition";
import { scaleNutrients } from "@/lib/algorithms/healthCalculators";
import { MacroChart } from "./MacroChart";
import { MicroNutrientGrid } from "./MicroNutrientGrid";
import { PlusCircle, RotateCcw } from "lucide-react";
import { useNutri } from "@/context/NutriContext";

interface ServingCalculatorProps {
  food: FoodItem;
}

export function ServingCalculator({ food }: ServingCalculatorProps) {
  const { addMealItem } = useNutri();
  
  // Find default serving or 100g
  const defaultServing = food.servings.find((s) => s.isDefault) || food.servings[0] || {
    unit: "100g",
    label: "100 grams",
    grams: 100,
  };

  const [selectedServing, setSelectedServing] = useState<ServingOption>(defaultServing);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [customGrams, setCustomGrams] = useState<number>(defaultServing.grams);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const activeGrams = isCustom ? Math.max(1, customGrams) : Math.max(1, selectedServing.grams * multiplier);

  const scaled = scaleNutrients(
    food.nutrients,
    food.vitamins,
    food.minerals,
    activeGrams
  );

  const handleSelectPredefined = (serving: ServingOption) => {
    setSelectedServing(serving);
    setIsCustom(false);
    setMultiplier(1);
    setCustomGrams(serving.grams);
  };

  const handleCustomGramsChange = (val: number) => {
    setIsCustom(true);
    setCustomGrams(val);
  };

  const handleAddToDailyLog = (mealType: "breakfast" | "lunch" | "dinner" | "snacks") => {
    addMealItem(mealType, {
      foodId: food.id,
      foodName: food.name,
      imageUrl: food.imageUrl,
      servingLabel: isCustom ? `${activeGrams}g custom` : `${multiplier > 1 ? `${multiplier}x ` : ""}${selectedServing.label}`,
      quantity: multiplier,
      grams: activeGrams,
      calories: scaled.nutrients.calories,
      protein: scaled.nutrients.protein,
      carbs: scaled.nutrients.carbohydrates,
      fat: scaled.nutrients.fat,
      fiber: scaled.nutrients.fiber,
    });
    setAddedNotice(`Logged to ${mealType.toUpperCase()}!`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Serving Size Calculator
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Change serving portion to automatically recalculate all macros, vitamins, and minerals in real time.
          </p>
        </div>

        {/* Serving Portion Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {food.servings.map((serving) => {
            const isSelected = !isCustom && selectedServing.unit === serving.unit;
            return (
              <button
                key={serving.unit}
                onClick={() => handleSelectPredefined(serving)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? "bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-500/20"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {serving.label}
              </button>
            );
          })}

          {/* Quick 250g preset if not in servings */}
          <button
            onClick={() => handleCustomGramsChange(250)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isCustom && customGrams === 250
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            250g
          </button>
        </div>
      </div>

      {/* Serving Multiplier or Custom Input Bar */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600">Selected Weight:</span>
          <span className="text-base font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-lg border border-brand-200">
            {activeGrams} grams
          </span>
          {multiplier > 1 && !isCustom && (
            <span className="text-xs text-slate-400">({multiplier}x portion)</span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {!isCustom ? (
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium pl-1">Quantity:</span>
              <button
                onClick={() => setMultiplier((m) => Math.max(0.5, m - 0.5))}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-bold text-slate-800">{multiplier}</span>
              <button
                onClick={() => setMultiplier((m) => m + 0.5)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleSelectPredefined(defaultServing)}
              className="text-xs text-slate-500 hover:text-brand-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to standard
            </button>
          )}

          {/* Direct custom gram input */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Custom g:</span>
            <input
              type="number"
              min="1"
              max="2000"
              value={customGrams}
              onChange={(e) => handleCustomGramsChange(Number(e.target.value))}
              className="w-16 text-xs font-bold text-slate-800 focus:outline-none border-b border-brand-300 focus:border-brand-600 text-center"
            />
          </div>
        </div>
      </div>

      {/* Recalculated Big Numbers Strip */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Nutrition for {activeGrams}g Portion
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-slate-900 text-white rounded-2xl p-4 text-center shadow-sm">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Calories</span>
            <span className="text-2xl font-black tracking-tight text-brand-400">{scaled.nutrients.calories}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">kcal</span>
          </div>

          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-center">
            <span className="text-[10px] uppercase font-semibold text-blue-600 block mb-1">Protein</span>
            <span className="text-2xl font-black tracking-tight text-blue-900">{scaled.nutrients.protein}</span>
            <span className="text-[10px] text-blue-600 block mt-0.5">grams</span>
          </div>

          <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 text-center">
            <span className="text-[10px] uppercase font-semibold text-amber-600 block mb-1">Carbohydrates</span>
            <span className="text-2xl font-black tracking-tight text-amber-900">{scaled.nutrients.carbohydrates}</span>
            <span className="text-[10px] text-amber-600 block mt-0.5">grams</span>
          </div>

          <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-4 text-center">
            <span className="text-[10px] uppercase font-semibold text-rose-600 block mb-1">Total Fat</span>
            <span className="text-2xl font-black tracking-tight text-rose-900">{scaled.nutrients.fat}</span>
            <span className="text-[10px] text-rose-600 block mt-0.5">grams</span>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 text-center">
            <span className="text-[10px] uppercase font-semibold text-emerald-600 block mb-1">Dietary Fiber</span>
            <span className="text-2xl font-black tracking-tight text-emerald-900">{scaled.nutrients.fiber}</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">grams</span>
          </div>

          <div className="bg-pink-50/70 border border-pink-100 rounded-2xl p-4 text-center">
            <span className="text-[10px] uppercase font-semibold text-pink-600 block mb-1">Natural Sugar</span>
            <span className="text-2xl font-black tracking-tight text-pink-900">{scaled.nutrients.sugar}</span>
            <span className="text-[10px] text-pink-600 block mt-0.5">grams</span>
          </div>

          <div className="bg-cyan-50/70 border border-cyan-100 rounded-2xl p-4 text-center">
            <span className="text-[10px] uppercase font-semibold text-cyan-600 block mb-1">Water Content</span>
            <span className="text-2xl font-black tracking-tight text-cyan-900">{scaled.nutrients.water}</span>
            <span className="text-[10px] text-cyan-600 block mt-0.5">grams</span>
          </div>
        </div>
      </div>

      {/* Visual Chart Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center pt-4">
        <div className="lg:col-span-1">
          <MacroChart
            protein={scaled.nutrients.protein}
            carbs={scaled.nutrients.carbohydrates}
            fat={scaled.nutrients.fat}
            calories={scaled.nutrients.calories}
          />
        </div>
        
        {/* Quick Log to Tracker Box */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-50 to-brand-50/30 rounded-2xl p-6 border border-brand-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-brand-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Log this {activeGrams}g Portion to Daily Tracker
              </h4>
            </div>
            {addedNotice && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full animate-bounce">
                {addedNotice}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Instantly add this exact calculated portion to your daily food log to update your calorie and macronutrient rings.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {(["breakfast", "lunch", "dinner", "snacks"] as const).map((meal) => (
              <button
                key={meal}
                onClick={() => handleAddToDailyLog(meal)}
                className="py-2 px-3 rounded-xl bg-white hover:bg-brand-600 hover:text-white border border-slate-200 hover:border-brand-600 text-slate-700 text-xs font-bold capitalize transition-all shadow-sm"
              >
                + {meal}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recalculated Vitamins & Minerals */}
      <div className="pt-6 border-t border-slate-100">
        <MicroNutrientGrid
          vitamins={scaled.vitamins}
          minerals={scaled.minerals}
          portionGrams={activeGrams}
        />
      </div>
    </div>
  );
}
