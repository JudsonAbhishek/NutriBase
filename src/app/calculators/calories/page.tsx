"use client";

import React, { useState } from "react";
import Link from "next/link";
import { calculateDailyCalories } from "@/lib/algorithms/healthCalculators";
import { ActivityLevel, HealthGoal } from "@/types/nutrition";
import { useNutri } from "@/context/NutriContext";
import { Flame, ArrowLeft, Check, PieChart, Info } from "lucide-react";

export default function CalorieCalculatorPage() {
  const { profile } = useNutri();

  const [weightKg, setWeightKg] = useState<number>(profile.weightKg || 70);
  const [heightCm, setHeightCm] = useState<number>(profile.heightCm || 175);
  const [age, setAge] = useState<number>(profile.age || 28);
  const [gender, setGender] = useState<"male" | "female" | "other">(profile.gender || "male");
  const [activity, setActivity] = useState<ActivityLevel>(profile.activityLevel || "moderately_active");
  const [goal, setGoal] = useState<HealthGoal>(profile.primaryGoal || "maintenance");

  const result = calculateDailyCalories(weightKg, heightCm, age, gender, activity, goal);

  const activities: { id: ActivityLevel; label: string; desc: string }[] = [
    { id: "sedentary", label: "Sedentary", desc: "Little or no exercise, desk job" },
    { id: "lightly_active", label: "Lightly Active", desc: "Light exercise/sports 1-3 days/week" },
    { id: "moderately_active", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week" },
    { id: "very_active", label: "Very Active", desc: "Hard exercise 6-7 days/week" },
    { id: "extremely_active", label: "Extremely Active", desc: "Very hard daily exercise or physical job" },
  ];

  const goals: { id: HealthGoal; label: string; desc: string }[] = [
    { id: "weight_loss", label: "Lose Weight", desc: "~500 kcal deficit for safe fat loss" },
    { id: "maintenance", label: "Maintain Weight", desc: "Preserve current body mass and energy" },
    { id: "muscle_building", label: "Build Muscle / Gain", desc: "Lean caloric surplus for hypertrophy" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation */}
        <Link
          href="/calculators"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Calculators
        </Link>

        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500" />
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              BMR & Daily Calorie Calculator
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Scientifically estimate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor formula.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Sex</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Age</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Height (cm)</label>
                <input
                  type="number"
                  min="120"
                  max="220"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Weight (kg)</label>
                <input
                  type="number"
                  min="35"
                  max="200"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Daily Physical Activity Level
              </label>
              <div className="space-y-1.5">
                {activities.map((act) => {
                  const isSelected = activity === act.id;
                  return (
                    <button
                      key={act.id}
                      onClick={() => setActivity(act.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                        isSelected
                          ? "bg-amber-50 border-amber-500 text-amber-950 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div>
                        <span className="block">{act.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{act.desc}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Goal */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Primary Target Goal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {goals.map((g) => {
                  const isSelected = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-brand-50 border-brand-500 text-brand-900 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xs block">{g.label}</span>
                      <span className="text-[10px] text-slate-400 font-normal mt-0.5 block">{g.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Results Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Target Big Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
                  Recommended Daily Target
                </span>
                <span className="text-5xl font-black tracking-tight text-amber-400 block mt-2">
                  {result.targetCalories} <span className="text-base font-normal text-slate-300">kcal/day</span>
                </span>
              </div>

              {/* BMR vs TDEE */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Basal Metabolic Rate</span>
                  <span className="text-lg font-black text-slate-100">{result.bmr} kcal</span>
                  <span className="text-[10px] text-slate-400 block">Coma / rest energy</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Expenditure</span>
                  <span className="text-lg font-black text-slate-100">{result.tdee} kcal</span>
                  <span className="text-[10px] text-slate-400 block">TDEE with activity</span>
                </div>
              </div>

              {/* Macros Breakdown */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5 text-brand-400" />
                  Calculated Daily Macronutrient Split
                </span>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                    <span className="text-blue-400 font-bold">Protein ({result.macros.proteinPercent}%)</span>
                    <span className="font-extrabold text-white">{result.macros.proteinGrams}g</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                    <span className="text-amber-400 font-bold">Carbohydrates ({result.macros.carbsPercent}%)</span>
                    <span className="font-extrabold text-white">{result.macros.carbsGrams}g</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                    <span className="text-rose-400 font-bold">Healthy Fats ({result.macros.fatPercent}%)</span>
                    <span className="font-extrabold text-white">{result.macros.fatGrams}g</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                    <span className="text-emerald-400 font-bold">Dietary Fiber (Min Target)</span>
                    <span className="font-extrabold text-white">{result.macros.fiberGrams}g</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Formula Explanation */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Info className="w-4 h-4 text-brand-600" />
                <span>The Mifflin-St Jeor Clinical Equation</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Men: BMR = (10 × wt kg) + (6.25 × ht cm) − (5 × age) + 5<br/>
                Women: BMR = (10 × wt kg) + (6.25 × ht cm) − (5 × age) − 161
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
