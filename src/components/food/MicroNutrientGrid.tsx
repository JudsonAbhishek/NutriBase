"use client";

import React, { useState } from "react";
import { Minerals, Vitamins } from "@/types/nutrition";
import { DAILY_VALUES } from "@/lib/algorithms/healthCalculators";
import { VitaminsReferenceTable } from "@/components/food/VitaminsReferenceTable";

interface MicroNutrientGridProps {
  vitamins: Vitamins;
  minerals: Minerals;
  portionGrams?: number;
}

export function MicroNutrientGrid({ vitamins, minerals, portionGrams = 100 }: MicroNutrientGridProps) {
  const [activeTab, setActiveTab] = useState<"vitamins" | "minerals">("vitamins");

  const vitaminList = [
    { name: "Vitamin A", value: vitamins.vitaminA_mcg, unit: "mcg", dv: DAILY_VALUES.vitaminA_mcg, desc: "Vision & Immune Integrity" },
    { name: "Vitamin C", value: vitamins.vitaminC_mg, unit: "mg", dv: DAILY_VALUES.vitaminC_mg, desc: "Collagen & Antioxidant" },
    { name: "Vitamin D", value: vitamins.vitaminD_iu, unit: "IU", dv: DAILY_VALUES.vitaminD_iu, desc: "Bone Density & Immunity" },
    { name: "Vitamin E", value: vitamins.vitaminE_mg, unit: "mg", dv: DAILY_VALUES.vitaminE_mg, desc: "Lipid Membrane Defense" },
    { name: "Vitamin K", value: vitamins.vitaminK_mcg, unit: "mcg", dv: DAILY_VALUES.vitaminK_mcg, desc: "Coagulation & Bone Matrix" },
    { name: "Vitamin B1 (Thiamine)", value: vitamins.vitaminB1_mg, unit: "mg", dv: DAILY_VALUES.vitaminB1_mg, desc: "Cellular Energy Synthesis" },
    { name: "Vitamin B2 (Riboflavin)", value: vitamins.vitaminB2_mg, unit: "mg", dv: DAILY_VALUES.vitaminB2_mg, desc: "Mitochondrial Function" },
    { name: "Vitamin B3 (Niacin)", value: vitamins.vitaminB3_mg, unit: "mg", dv: DAILY_VALUES.vitaminB3_mg, desc: "DNA Repair & Lipids" },
    { name: "Vitamin B6", value: vitamins.vitaminB6_mg, unit: "mg", dv: DAILY_VALUES.vitaminB6_mg, desc: "Neurotransmitter Synthesis" },
    { name: "Vitamin B9 (Folate)", value: vitamins.vitaminB9_mcg, unit: "mcg", dv: DAILY_VALUES.vitaminB9_mcg, desc: "Red Blood Cells & RNA" },
    { name: "Vitamin B12", value: vitamins.vitaminB12_mcg, unit: "mcg", dv: DAILY_VALUES.vitaminB12_mcg, desc: "Nerve Health & Erythrocytes" },
  ];

  const mineralList = [
    { name: "Calcium", value: minerals.calcium_mg, unit: "mg", dv: DAILY_VALUES.calcium_mg, desc: "Skeletal Structure & Signaling" },
    { name: "Iron", value: minerals.iron_mg, unit: "mg", dv: DAILY_VALUES.iron_mg, desc: "Hemoglobin Oxygen Transport" },
    { name: "Magnesium", value: minerals.magnesium_mg, unit: "mg", dv: DAILY_VALUES.magnesium_mg, desc: "300+ Enzymatic Reactions" },
    { name: "Potassium", value: minerals.potassium_mg, unit: "mg", dv: DAILY_VALUES.potassium_mg, desc: "Electrolyte Balance & BP" },
    { name: "Phosphorus", value: minerals.phosphorus_mg, unit: "mg", dv: DAILY_VALUES.phosphorus_mg, desc: "ATP Energy & Bone Strength" },
    { name: "Zinc", value: minerals.zinc_mg, unit: "mg", dv: DAILY_VALUES.zinc_mg, desc: "Immunity & DNA Polymerase" },
    { name: "Copper", value: minerals.copper_mg, unit: "mg", dv: DAILY_VALUES.copper_mg, desc: "Iron Metabolism" },
    { name: "Manganese", value: minerals.manganese_mg, unit: "mg", dv: DAILY_VALUES.manganese_mg, desc: "Enzymatic Antioxidant SOD" },
    { name: "Sodium", value: minerals.sodium_mg, unit: "mg", dv: DAILY_VALUES.sodium_mg, desc: "Fluid Volume Regulation" },
  ];

  const currentList = activeTab === "vitamins" ? vitaminList : mineralList;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Micronutrient Profile ({portionGrams}g portion)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Measured against FDA / ICMR Recommended Daily Value (% DV)
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("vitamins")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === "vitamins"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            11 Vitamins
          </button>
          <button
            onClick={() => setActiveTab("minerals")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === "minerals"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            9 Essential Minerals
          </button>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {currentList.map((item) => {
          const pct = Math.min(200, Math.round((item.value / item.dv) * 100));
          const isHigh = pct >= 20;

          return (
            <div
              key={item.name}
              className={`p-3.5 rounded-2xl border transition-all ${
                isHigh
                  ? "bg-brand-50/40 border-brand-200"
                  : "bg-slate-50/60 border-slate-200/80"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {item.desc}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-black text-slate-900">
                    {item.value} {item.unit}
                  </span>
                  <span
                    className={`block text-[10px] font-bold ${
                      isHigh ? "text-brand-600 font-extrabold" : "text-slate-400"
                    }`}
                  >
                    {pct}% DV
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pct >= 50
                      ? "bg-brand-500"
                      : pct >= 20
                      ? "bg-emerald-400"
                      : "bg-slate-400"
                  }`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Vitamin Reference Guide — only shown on vitamins tab */}
      {activeTab === "vitamins" && <VitaminsReferenceTable />}
    </div>
  );
}
