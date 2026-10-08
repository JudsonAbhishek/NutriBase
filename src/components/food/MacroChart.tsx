"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface MacroChartProps {
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
  calories: number;
}

export function MacroChart({ protein, carbs, fat, calories }: MacroChartProps) {
  const pCal = Math.round(protein * 4);
  const cCal = Math.round(carbs * 4);
  const fCal = Math.round(fat * 9);
  const totalMacroCal = Math.max(1, pCal + cCal + fCal);

  const data = [
    { name: "Protein", value: pCal, grams: protein, color: "#3b82f6" },
    { name: "Carbohydrates", value: cCal, grams: carbs, color: "#f59e0b" },
    { name: "Fat", value: fCal, grams: fat, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const pct = Math.round((d.value / totalMacroCal) * 100);
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg border border-slate-700">
          <p className="font-bold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            {d.name}
          </p>
          <p className="text-slate-300 mt-1">
            {d.grams}g • {d.value} kcal ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col items-center">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
        Caloric Macro Distribution
      </h4>
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              animationDuration={500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-black text-slate-800 leading-tight">
            {calories}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase">
            kcal
          </span>
        </div>
      </div>

      {/* Legend with percentages */}
      <div className="flex items-center justify-center gap-4 mt-2 text-xs">
        {data.map((item) => {
          const pct = Math.round((item.value / totalMacroCal) * 100);
          return (
            <div key={item.name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-semibold text-slate-700">
                {pct}% <span className="font-normal text-slate-400">{item.name.slice(0, 4)}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
