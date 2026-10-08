"use client";

import React, { useState } from "react";
import Link from "next/link";
import { calculateBMI } from "@/lib/algorithms/healthCalculators";
import { useNutri } from "@/context/NutriContext";
import { Scale, ArrowLeft, Info } from "lucide-react";

export default function BMICalculatorPage() {
  const { profile } = useNutri();

  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [weightKg, setWeightKg] = useState<number>(profile.weightKg || 70);
  const [heightCm, setHeightCm] = useState<number>(profile.heightCm || 175);
  
  // Imperial inputs
  const [weightLbs, setWeightLbs] = useState<number>(Math.round((profile.weightKg || 70) * 2.20462));
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);
  
  const [age, setAge] = useState<number>(profile.age || 28);
  const [gender, setGender] = useState<"male" | "female" | "other">(profile.gender || "male");

  // Compute active metric weight and height
  const activeWeightKg = unitSystem === "metric" 
    ? weightKg 
    : Math.round((weightLbs / 2.20462) * 10) / 10;

  const activeHeightCm = unitSystem === "metric"
    ? heightCm
    : Math.round((heightFeet * 30.48 + heightInches * 2.54) * 10) / 10;

  const result = calculateBMI(activeWeightKg, activeHeightCm, age, gender);

  // Gauge pointer position (BMI clamped from 15 to 40 mapped to 0% to 100%)
  const gaugePercent = Math.min(100, Math.max(0, ((result.bmi - 15) / (40 - 15)) * 100));

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation */}
        <Link
          href="/calculators"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Calculators
        </Link>

        {/* Page Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-brand-600" />
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Clinical BMI Calculator
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Calculate your Body Mass Index, health classification, BMI Prime, and ideal healthy weight range.
          </p>
        </div>

        {/* Form and Results Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Input Controls */}
          <div className="md:col-span-6 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            
            {/* Unit Toggle */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Unit System
              </span>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setUnitSystem("metric")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    unitSystem === "metric" ? "bg-white text-brand-700 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Metric (kg / cm)
                </button>
                <button
                  onClick={() => setUnitSystem("imperial")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    unitSystem === "imperial" ? "bg-white text-brand-700 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Imperial (lbs / ft)
                </button>
              </div>
            </div>

            {/* Gender and Age */}
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
                  max="110"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Height & Weight inputs */}
            {unitSystem === "metric" ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label className="font-bold text-slate-700">Height (cm)</label>
                    <span className="font-bold text-brand-700">{heightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="220"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label className="font-bold text-slate-700">Weight (kg)</label>
                    <span className="font-bold text-brand-700">{weightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="180"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Feet</label>
                    <input
                      type="number"
                      min="3"
                      max="7"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Inches</label>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightInches}
                      onChange={(e) => setHeightInches(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Weight (lbs)</label>
                  <input
                    type="number"
                    min="70"
                    max="400"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Results Display */}
          <div className="md:col-span-6 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Calculated Biometrics
              </span>

              {/* Big BMI Number */}
              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Your Body Mass Index (BMI)
                </span>
                <span className="text-5xl font-black tracking-tight text-slate-900 mt-1 block">
                  {result.bmi}
                </span>
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm" style={{ backgroundColor: result.categoryColor }}>
                  <span>{result.category}</span>
                </div>
              </div>

              {/* Visual Colored Gauge */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>Underweight (&lt;18.5)</span>
                  <span>Normal (18.5-24.9)</span>
                  <span>Overweight (25-29.9)</span>
                  <span>Obese (30+)</span>
                </div>
                <div className="relative h-4 rounded-full overflow-hidden flex shadow-inner">
                  <div className="w-[20%] bg-blue-400" />
                  <div className="w-[30%] bg-emerald-500" />
                  <div className="w-[25%] bg-amber-400" />
                  <div className="w-[25%] bg-rose-500" />
                </div>
                {/* Pointer indicator */}
                <div className="relative h-2">
                  <div
                    className="absolute top-0 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-900 transition-all duration-300"
                    style={{ left: `${gaugePercent}%` }}
                  />
                </div>
              </div>

              {/* Healthy Weight Range */}
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-800 block">
                  Estimated Healthy Weight Range:
                </span>
                <p className="text-sm font-black text-emerald-950">
                  {result.healthyWeightRangeKg.min} kg – {result.healthyWeightRangeKg.max} kg
                  {unitSystem === "imperial" && (
                    <span className="text-xs font-normal text-emerald-700 ml-1.5">
                      ({Math.round(result.healthyWeightRangeKg.min * 2.20462)} lbs – {Math.round(result.healthyWeightRangeKg.max * 2.20462)} lbs)
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-emerald-700">
                  Target corresponding to normal clinical BMI (18.5 – 24.9) at your height.
                </p>
              </div>
            </div>

            {/* Clinical Disclaimer */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5 text-[11px] text-slate-500 leading-relaxed">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>{result.disclaimer}</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
