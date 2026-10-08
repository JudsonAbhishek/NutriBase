"use client";

import React, { useState } from "react";
import Link from "next/link";
import { calculateDailyCalories } from "@/lib/algorithms/healthCalculators";
import { ActivityLevel, HealthGoal } from "@/types/nutrition";
import { useNutri } from "@/context/NutriContext";
import { PieChart as PieIcon, ArrowLeft } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export default function MacroCalculatorPage() {
  const { profile } = useNutri();

  const [weightKg, setWeightKg] = useState<number>(profile.weightKg || 70);
  const [heightCm, setHeightCm] = useState<number>(profile.heightCm || 175);
  const [age, setAge] = useState<number>(profile.age || 28);
  const [gender, setGender] = useState<"male" | "female" | "other">(profile.gender || "male");
  const [activity, setActivity] = useState<ActivityLevel>(profile.activityLevel || "moderately_active");
  const [goal, setGoal] = useState<HealthGoal>(profile.primaryGoal || "muscle_building");
  const [dietStyle, setDietStyle] = useState<"balanced" | "high_protein" | "low_carb">("high_protein");

  // Compute base calories
  const baseCalc = calculateDailyCalories(weightKg, heightCm, age, gender, activity, goal);
  const calories = baseCalc.targetCalories;

  // Custom macro ratios based on diet style
  let pPct = 0.30;
  let cPct = 0.45;
  let fPct = 0.25;

  if (dietStyle === "high_protein") {
    pPct = 0.35;
    cPct = 0.40;
    fPct = 0.25;
  } else if (dietStyle === "low_carb") {
    pPct = 0.35;
    cPct = 0.20;
    fPct = 0.45;
  } else {
    pPct = 0.25;
    cPct = 0.50;
    fPct = 0.25;
  }

  const proteinGrams = Math.round((calories * pPct) / 4);
  const carbsGrams = Math.round((calories * cPct) / 4);
  const fatGrams = Math.round((calories * fPct) / 9);
  const fiberGrams = Math.max(28, Math.round((calories / 1000) * 14));

  const chartData = [
    { name: "Protein", grams: proteinGrams, calories: proteinGrams * 4, pct: Math.round(pPct * 100), color: "#3b82f6" },
    { name: "Carbohydrates", grams: carbsGrams, calories: carbsGrams * 4, pct: Math.round(cPct * 100), color: "#f59e0b" },
    { name: "Healthy Fats", grams: fatGrams, calories: fatGrams * 9, pct: Math.round(fPct * 100), color: "#ef4444" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <Link
          href="/calculators"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Calculators
        </Link>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <PieIcon className="w-6 h-6 text-brand-600" />
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Personalized Macro Calculator
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Calculate your precise daily grams of Protein, Carbohydrates, Fat, and Fiber.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Body Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Daily Target Calories</label>
                <input
                  type="text"
                  disabled
                  value={`${calories} kcal`}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-brand-700 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Goal */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Primary Goal
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "weight_loss", label: "Fat Loss" },
                  { id: "maintenance", label: "Maintain" },
                  { id: "muscle_building", label: "Muscle Gain" },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      goal === g.id
                        ? "bg-brand-50 border-brand-500 text-brand-700 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Diet Style */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Macronutrient Ratio Preset
              </label>
              <div className="space-y-2">
                {[
                  { id: "high_protein", label: "High Protein Athletic (35P / 40C / 25F)", desc: "Optimal for hypertrophy & preserving lean mass during deficits" },
                  { id: "balanced", label: "Balanced Lifestyle (25P / 50C / 25F)", desc: "Traditional WHO macronutrient energy distribution" },
                  { id: "low_carb", label: "Low Carb Focused (35P / 20C / 45F)", desc: "Higher fats, reduced glycemic load, and metabolic flexibility" },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDietStyle(d.id as any)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                      dietStyle === d.id
                        ? "bg-brand-50 border-brand-500 text-brand-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block">{d.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Visualization Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Target Daily Grams
              </span>

              {/* Chart */}
              <div className="h-56 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Pie
                      data={chartData}
                      dataKey="calories"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {chartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-900">{calories}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">kcal / day</span>
                </div>
              </div>

              {/* Targets List */}
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-blue-900 block">Protein Target</span>
                    <span className="text-[10px] text-blue-600">{(proteinGrams / weightKg).toFixed(1)}g per kg bodyweight</span>
                  </div>
                  <span className="text-xl font-black text-blue-950">{proteinGrams}g</span>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-amber-900 block">Carbohydrates Target</span>
                    <span className="text-[10px] text-amber-600">{Math.round(cPct * 100)}% of daily energy</span>
                  </div>
                  <span className="text-xl font-black text-amber-950">{carbsGrams}g</span>
                </div>

                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-rose-900 block">Healthy Fats Target</span>
                    <span className="text-[10px] text-rose-600">Essential lipids & hormones</span>
                  </div>
                  <span className="text-xl font-black text-rose-950">{fatGrams}g</span>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-emerald-900 block">Dietary Fiber (Minimum)</span>
                    <span className="text-[10px] text-emerald-600">Based on 14g / 1000 kcal standard</span>
                  </div>
                  <span className="text-xl font-black text-emerald-950">{fiberGrams}g</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed text-center">
              Personalized based on {weightKg}kg body mass and active energy targets.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
