"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import { FOODS } from "@/data/foods";

function getDayNumber(date: Date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((startOfDay.getTime() - startOfYear.getTime()) / 86400000);
}

export function FoodOfTheDay() {
  const food = useMemo(() => {
    const dayNumber = getDayNumber(new Date());
    return FOODS[dayNumber % FOODS.length] || FOODS[0];
  }, []);

  if (!food) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/50 p-6 sm:p-8 shadow-sm dark:border-emerald-800/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-950">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-400/10" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              NutriBase Featured Food of the Day
            </div>
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                <CalendarDays className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Today&apos;s spotlight selection · 183-day rotation
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {food.name}
                {food.hindiName && (
                  <span className="text-base sm:text-lg font-semibold text-slate-400 dark:text-slate-500 ml-2">
                    ({food.hindiName})
                  </span>
                )}
              </h2>
              <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {food.description} Explore clinical macros, micronutrient density, and practical serving allocations.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-black text-white shadow-sm">
                {food.nutrients.calories} kcal / 100g
              </span>
              <span className="rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/50 px-3.5 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 shadow-sm">
                {food.nutrients.protein}g protein
              </span>
              <span className="rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm">
                Score: {food.nutritionScore.totalScore}/100 ({food.nutritionScore.ratingTier})
              </span>
              <Link
                href={`/food/${food.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-xs font-black shadow-sm transition hover:scale-105"
              >
                Explore profile <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              The 183-food rotation repeats twice annually so every single database item receives spotlight visibility.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[300px]">
            <div className="absolute inset-3 rounded-[1.75rem] bg-emerald-500/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 shadow-xl">
              <div className="relative h-48 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-700">
                <Image
                  src={food.imageUrl}
                  alt={food.name}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent px-3.5 pb-3.5 pt-8">
                  <p className="text-xs font-black text-white">{food.categoryName}</p>
                  <p className="text-[10px] text-emerald-300 font-semibold">Featured Food of the Day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
