"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FOODS } from "@/data/foods";
import { FOOD_CATEGORIES } from "@/data/categories";
import {
  ShieldCheck,
  Download,
  Search,
  Check,
} from "lucide-react";

export default function AdminPage() {
  const foodsList = FOODS;
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(foodsList, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nutribase_foods_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notify("Exported database to JSON!");
  };

  const displayedFoods = foodsList.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                NutriBase Admin Management Portal
              </h1>
              <p className="text-xs text-slate-500">
                Browse and export the verified food catalog.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-brand-600 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export JSON
            </button>
          </div>
        </div>

        {notification && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Verified Foods</span>
            <span className="text-2xl font-black text-slate-900">{foodsList.length}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Active Categories</span>
            <span className="text-2xl font-black text-brand-600">{FOOD_CATEGORIES.length}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Catalog Mode</span>
            <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg inline-block mt-1">
              Static / Read-only
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Data Source</span>
            <span className="text-xs font-bold text-slate-600 block mt-1 truncate">
              USDA FoodData & IFCT
            </span>
          </div>
        </div>

        {/* Search & Food Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food by name..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500"
              />
            </div>
            <span className="text-xs text-slate-400">
              Showing {displayedFoods.length} of {foodsList.length} foods
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-3">Food Item</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Dietary Type</th>
                  <th className="p-3">Calories</th>
                  <th className="p-3">Protein</th>
                  <th className="p-3">Carbs</th>
                  <th className="p-3">Fat</th>
                  <th className="p-3">NutriScore</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedFoods.map((food) => (
                  <tr key={food.id} className="hover:bg-slate-50/60">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                          <Image src={food.imageUrl} alt={food.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">{food.name}</span>
                          {food.hindiName && <span className="text-[10px] text-slate-400">({food.hindiName})</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600">{food.categoryName}</td>
                    <td className="p-3 capitalize">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {food.dietaryType}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">{food.nutrients.calories} kcal</td>
                    <td className="p-3 font-bold text-blue-600">{food.nutrients.protein}g</td>
                    <td className="p-3 text-amber-600">{food.nutrients.carbohydrates}g</td>
                    <td className="p-3 text-slate-600">{food.nutrients.fat}g</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-lg text-white font-black text-[10px]" style={{ backgroundColor: food.nutritionScore.color }}>
                        {food.nutritionScore.totalScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
