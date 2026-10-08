"use client";

import React, { useState } from "react";
import { NutritionScoreBreakdown } from "@/types/nutrition";
import { Info, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

interface NutriScoreCardProps {
  score: NutritionScoreBreakdown;
  foodName: string;
}

export function NutriScoreCard({ score, foodName }: NutriScoreCardProps) {
  const [showFormula, setShowFormula] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              NutriBase Score
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Transparent 0-100
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic density rating for <span className="font-semibold text-slate-700">{foodName}</span>.
          </p>
        </div>

        {/* Large Score Indicator */}
        <div className="flex items-center gap-3">
          <div
            className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white shadow-md font-black"
            style={{ backgroundColor: score.color }}
          >
            <span className="text-2xl leading-none">{score.totalScore}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider opacity-90">/ 100</span>
          </div>
          <div>
            <span className="text-sm font-bold text-slate-800 block">
              {score.ratingTier}
            </span>
            <span className="text-xs text-slate-400">
              Processing: {score.processingLevel}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
        {score.summary}
      </p>

      {/* Breakdown Factors Bar */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Score Components Breakdown
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          <div className="bg-emerald-50/60 border border-emerald-200/80 p-3 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">
              + Protein Factor
            </span>
            <span className="text-lg font-black text-emerald-900">
              +{score.proteinPoints} pts
            </span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">
              Up to +20 max
            </span>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200/80 p-3 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">
              + Fiber Factor
            </span>
            <span className="text-lg font-black text-emerald-900">
              +{score.fiberPoints} pts
            </span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">
              Gut & satiety boost
            </span>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200/80 p-3 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">
              + Micronutrient Density
            </span>
            <span className="text-lg font-black text-emerald-900">
              +{score.micronutrientPoints} pts
            </span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">
              Essential vitamins & minerals
            </span>
          </div>

          <div className="bg-rose-50/60 border border-rose-200/80 p-3 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-rose-700 block">
              - Deductions
            </span>
            <span className="text-lg font-black text-rose-900">
              -{score.sugarDeduction + score.sodiumDeduction + score.fatCalorieDeduction + score.processingDeduction} pts
            </span>
            <span className="text-[10px] text-rose-600 block mt-0.5">
              Sugar, sodium & sat-fat
            </span>
          </div>

        </div>
      </div>

      {/* Pros & Considerations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="space-y-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Nutritional Strengths
          </span>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {score.pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5 uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Dietary Considerations
          </span>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {score.cons.map((con, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Transparent Calculation Toggle */}
      <div className="border-t border-slate-100 pt-4">
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="text-xs font-semibold text-slate-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-brand-600" />
          <span>How is the NutriBase Score calculated?</span>
          {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showFormula && (
          <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 animate-in fade-in duration-200">
            <p className="font-semibold text-slate-800">
              The NutriBase Score Formula:
            </p>
            <p className="font-mono bg-white p-2 rounded-lg border border-slate-200 text-[11px] text-slate-700">
              Score = 50 (Median Baseline) + Protein (+0 to 20) + Fiber (+0 to 20) + Micronutrients (+0 to 25) - Free Sugars (-0 to 15) - Excess Sodium (-0 to 10) - Saturated Fat/Calorie Density (-0 to 10) - Ultra-processing (-0 to 10)
            </p>
            <p className="text-[11px] text-slate-400">
              Notice: The NutriBase score is an objective educational index of nutrient density per unit of mass and energy. It is not intended as medical diagnosis or treatment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
