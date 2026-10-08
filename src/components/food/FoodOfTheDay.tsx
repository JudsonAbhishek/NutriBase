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
      <div className="relative overflow-hidden rounded-[2rem] border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-5 shadow-lg shadow-emerald-900/5 dark:border-emerald-900/70 dark:from-emerald-950/50 dark:via-slate-900 dark:to-amber-950/30 sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-400/10" />
        <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:border-emerald-800 dark:bg-slate-900/80 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              NutriBase Food Item of the Day
            </div>
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                <CalendarDays className="h-3.5 w-3.5 text-emerald-600" />
                Today&apos;s featured food · 183-day rotation
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {food.name}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {food.description} Discover its nutrition profile, serving ideas, and the nutrients that make it useful in a balanced diet.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-black text-white">
                {food.nutrients.calories} kcal / 100g
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200">
                {food.nutrients.protein}g protein
              </span>
              <Link
                href={`/food/${food.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black text-emerald-700 transition hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-950"
              >
                Explore profile <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              The 183-food rotation repeats twice each year, so every item gets two feature days annually.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[280px]">
            <div className="absolute inset-3 rounded-[1.75rem] bg-emerald-500/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800">
              <div className="relative h-44 overflow-hidden rounded-2xl">
                <Image
                  src={food.imageUrl}
                  alt={food.name}
                  fill
                  sizes="280px"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent px-3 pb-3 pt-8">
                  <p className="text-xs font-black text-white">{food.categoryName}</p>
                  <p className="text-[10px] text-white/75">Featured today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
