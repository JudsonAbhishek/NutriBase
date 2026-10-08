"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Scale,
  Check,
  ChevronRight,
  X,
  Zap,
  Leaf,
  FlaskConical,
  TrendingUp,
  ExternalLink,
  Flame,
  Sparkles,
  Share2,
} from "lucide-react";
import { FoodItem } from "@/types/nutrition";
import { FOOD_CATEGORIES } from "@/data/categories";
import { useNutri } from "@/context/NutriContext";
import { DAILY_VALUES } from "@/lib/algorithms/healthCalculators";

interface FoodCardProps {
  food: FoodItem;
}

const DIETARY_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  vegan: {
    label: "Vegan",
    badgeClass: "bg-emerald-500/90 text-white border-emerald-400/40",
    dotClass: "bg-white",
  },
  vegetarian: {
    label: "Vegetarian",
    badgeClass: "bg-green-500/90 text-white border-green-400/40",
    dotClass: "bg-white",
  },
  "non-vegetarian": {
    label: "Non-Veg",
    badgeClass: "bg-rose-500/90 text-white border-rose-400/40",
    dotClass: "bg-white",
  },
  seafood: {
    label: "Seafood",
    badgeClass: "bg-cyan-500/90 text-white border-cyan-400/40",
    dotClass: "bg-white",
  },
  eggetarian: {
    label: "Eggetarian",
    badgeClass: "bg-amber-500/90 text-white border-amber-400/40",
    dotClass: "bg-white",
  },
};

const SCORE_STYLES: Record<string, { bg: string; text: string; ring: string }> = {
  Excellent: {
    bg: "bg-emerald-500",
    text: "text-emerald-700",
    ring: "ring-emerald-400/30",
  },
  Good: {
    bg: "bg-teal-500",
    text: "text-teal-700",
    ring: "ring-teal-400/30",
  },
  Moderate: {
    bg: "bg-amber-500",
    text: "text-amber-700",
    ring: "ring-amber-400/30",
  },
  "Limit Consumption": {
    bg: "bg-rose-500",
    text: "text-rose-700",
    ring: "ring-rose-400/30",
  },
};

const FALLBACK_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80";
const FALLBACK_IMAGES_BY_CATEGORY: Record<string, string> = {
  Fruits:
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80",
  Vegetables:
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
  "Nuts & Seeds":
    "https://images.unsplash.com/photo-1599599810694-b5ac7f9f7c2d?w=800&auto=format&fit=crop&q=80",
  "Pulses & Legumes":
    "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=800&auto=format&fit=crop&q=80",
};

function getFoodFallbackImage(food: FoodItem) {
  return FALLBACK_IMAGES_BY_CATEGORY[food.categoryName] ?? FALLBACK_FOOD_IMAGE;
}

const CATEGORY_COLORS: Record<string, string> = Object.fromEntries(
  FOOD_CATEGORIES.map((category) => [category.id, category.color])
);

function getCategoryColor(categoryId: string) {
  return CATEGORY_COLORS[categoryId] ?? "#059669";
}

/* ─── Quick-View Modal ─────────────────────────────────────── */
function QuickViewModal({
  food,
  onClose,
}: {
  food: FoodItem;
  onClose: () => void;
}) {
  const { isInCompare, addToCompare, removeFromCompare, isFavorite, toggleFavorite } =
    useNutri();
  const compared = isInCompare(food.slug);
  const favorite = isFavorite(food.id);

  const dietBadge =
    DIETARY_CONFIG[food.dietaryType] ?? DIETARY_CONFIG["vegetarian"];

  const [modalImgSrc, setModalImgSrc] = useState(food.imageUrl);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    setModalImgSrc(food.imageUrl);
  }, [food.imageUrl]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/food/${food.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${food.name} nutrition profile`,
          text: `Explore the nutrition profile for ${food.name} on NutriBase.`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus("copied");
        window.setTimeout(() => setShareStatus("idle"), 2200);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Unable to share food card:", error);
      setShareStatus("error");
      window.setTimeout(() => setShareStatus("idle"), 3000);
    }
  };

  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  // Top 3 vitamins by % DV
  const vitaminEntries = [
    { name: "Vitamin A", value: food.vitamins.vitaminA_mcg, dv: DAILY_VALUES.vitaminA_mcg },
    { name: "Vitamin C", value: food.vitamins.vitaminC_mg, dv: DAILY_VALUES.vitaminC_mg },
    { name: "Vitamin D", value: food.vitamins.vitaminD_iu, dv: DAILY_VALUES.vitaminD_iu },
    { name: "Vitamin E", value: food.vitamins.vitaminE_mg, dv: DAILY_VALUES.vitaminE_mg },
    { name: "Vitamin K", value: food.vitamins.vitaminK_mcg, dv: DAILY_VALUES.vitaminK_mcg },
    { name: "B1", value: food.vitamins.vitaminB1_mg, dv: DAILY_VALUES.vitaminB1_mg },
    { name: "B2", value: food.vitamins.vitaminB2_mg, dv: DAILY_VALUES.vitaminB2_mg },
    { name: "B6", value: food.vitamins.vitaminB6_mg, dv: DAILY_VALUES.vitaminB6_mg },
    { name: "B9 Folate", value: food.vitamins.vitaminB9_mcg, dv: DAILY_VALUES.vitaminB9_mcg },
    { name: "B12", value: food.vitamins.vitaminB12_mcg, dv: DAILY_VALUES.vitaminB12_mcg },
  ]
    .filter((v) => v.value > 0)
    .map((v) => ({ ...v, pct: Math.round((v.value / v.dv) * 100) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);

  // Top 3 minerals by % DV
  const mineralEntries = [
    { name: "Calcium", value: food.minerals.calcium_mg, dv: DAILY_VALUES.calcium_mg },
    { name: "Iron", value: food.minerals.iron_mg, dv: DAILY_VALUES.iron_mg },
    { name: "Magnesium", value: food.minerals.magnesium_mg, dv: DAILY_VALUES.magnesium_mg },
    { name: "Potassium", value: food.minerals.potassium_mg, dv: DAILY_VALUES.potassium_mg },
    { name: "Zinc", value: food.minerals.zinc_mg, dv: DAILY_VALUES.zinc_mg },
  ]
    .filter((m) => m.value > 0)
    .map((m) => ({ ...m, pct: Math.round((m.value / m.dv) * 100) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);

  const scoreStyle =
    SCORE_STYLES[food.nutritionScore.ratingTier] ?? SCORE_STYLES["Good"];
  const categoryColor = getCategoryColor(food.categoryId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      onWheel={(event) => {
        if (event.target === event.currentTarget) event.preventDefault();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${food.name} nutrition details`}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col max-h-[94vh] sm:max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Hero Banner */}
        <div className="relative h-44 sm:h-60 w-full overflow-hidden bg-slate-900">
          <Image
            src={modalImgSrc}
            alt={food.name}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            priority
            onError={() => setModalImgSrc(getFoodFallbackImage(food))}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-black/30" />

          {/* Share and close actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="relative rounded-full border border-white/20 bg-black/50 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/80"
              aria-label={`Share ${food.name}`}
              title={shareStatus === "copied" ? "Link copied" : "Share food card"}
            >
              <Share2 className="h-4 w-4" />
              {shareStatus !== "idle" && (
                <span className={`absolute right-0 top-11 whitespace-nowrap rounded-lg px-2 py-1 text-[10px] font-bold shadow-lg ${
                  shareStatus === "copied"
                    ? "bg-emerald-500 text-white"
                    : "bg-rose-500 text-white"
                }`}>
                  {shareStatus === "copied" ? "Link copied" : "Could not share"}
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="rounded-full border border-white/20 bg-black/50 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/80"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${dietBadge.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dietBadge.dotClass}`} />
              {dietBadge.label}
            </span>
            <span className="text-[11px] font-semibold text-white/90 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              {food.categoryName}
            </span>
          </div>

          {/* Floating NutriScore over Image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                {food.name}
              </h2>
              {food.hindiName && (
                <p className="text-sm text-slate-300 font-medium">{food.hindiName}</p>
              )}
            </div>

            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-lg border border-white/60">
              <span className={`w-2.5 h-2.5 rounded-full ${scoreStyle.bg}`} />
              <div className="text-right leading-none">
                <span className="text-xs font-black text-slate-900">
                  {food.nutritionScore.totalScore}/100
                </span>
                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  {food.nutritionScore.ratingTier}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Calorie & Servings Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-orange-50/80 border border-orange-200/80 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
                Calories
              </span>
              <span className="text-xl font-black text-orange-950">
                {food.nutrients.calories}
              </span>
              <span className="text-[10px] text-orange-600/80 block">kcal / 100g</span>
            </div>

            <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                Protein
              </span>
              <span className="text-xl font-black text-blue-950">
                {food.nutrients.protein}g
              </span>
              <span className="text-[10px] text-blue-600/80 block">
                {Math.round((food.nutrients.protein / 50) * 100)}% DV
              </span>
            </div>

            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                Carbs
              </span>
              <span className="text-xl font-black text-amber-950">
                {food.nutrients.carbohydrates}g
              </span>
              <span className="text-[10px] text-amber-600/80 block">
                Net: {food.nutrients.netCarbs}g
              </span>
            </div>

            <div className="bg-emerald-50/80 dark:bg-emerald-500/15 border border-emerald-200/80 dark:border-emerald-400/40 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300 block">
                Fiber
              </span>
              <span className="text-xl font-black text-emerald-950 dark:text-emerald-100">
                {food.nutrients.fiber}g
              </span>
              <span className="text-[10px] text-emerald-600/80 dark:text-emerald-300 block">
                {Math.round((food.nutrients.fiber / 28) * 100)}% DV
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            {food.description}
          </p>

          {/* Micronutrient Top Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vitaminEntries.length > 0 && (
              <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 mb-2 text-purple-700">
                  <Leaf className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Key Vitamins (% DV)
                  </span>
                </div>
                <div className="space-y-1.5">
                  {vitaminEntries.map((v) => (
                    <div key={v.name} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium">{v.name}</span>
                      <span className="font-extrabold text-purple-700">{v.pct}% DV</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mineralEntries.length > 0 && (
              <div className="bg-teal-50/70 border border-teal-100 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 mb-2 text-teal-700">
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Key Minerals (% DV)
                  </span>
                </div>
                <div className="space-y-1.5">
                  {mineralEntries.map((m) => (
                    <div key={m.name} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium">{m.name}</span>
                      <span className="font-extrabold text-teal-700">{m.pct}% DV</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Better For Tags */}
          {food.betterFor && food.betterFor.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {food.betterFor.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-[11px] font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer CTAs */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
          <Link
            href={`/food/${food.slug}`}
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all text-xs"
          >
            Explore Complete Clinical Profile
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() =>
              compared ? removeFromCompare(food.slug) : addToCompare(food.slug)
            }
            className={`p-3 rounded-2xl border transition-all ${
              compared
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-slate-700 border-slate-200 hover:border-brand-500 hover:text-brand-600"
            }`}
            aria-label="Compare"
          >
            {compared ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
          </button>

          <button
            onClick={() => toggleFavorite(food.id)}
            className={`p-3 rounded-2xl border transition-all ${
              favorite
                ? "bg-rose-500 text-white border-rose-500"
                : "bg-white text-slate-700 border-slate-200 hover:border-rose-400 hover:text-rose-500"
            }`}
            aria-label="Favorite"
          >
            <Heart className={`w-4 h-4 ${favorite ? "fill-white" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── High-End Food Card ─────────────────────────────────────── */
export function FoodCard({ food }: FoodCardProps) {
  const { isInCompare, addToCompare, removeFromCompare, isFavorite, toggleFavorite } =
    useNutri();
  const compared = isInCompare(food.slug);
  const favorite = isFavorite(food.id);

  const [modalOpen, setModalOpen] = useState(false);
  const [cardImgSrc, setCardImgSrc] = useState(food.imageUrl);

  useEffect(() => {
    setCardImgSrc(food.imageUrl);
  }, [food.imageUrl]);

  const handleCompareClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      compared ? removeFromCompare(food.slug) : addToCompare(food.slug);
    },
    [compared, food.slug, addToCompare, removeFromCompare]
  );

  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(food.id);
    },
    [food.id, toggleFavorite]
  );

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  }, []);

  const dietBadge =
    DIETARY_CONFIG[food.dietaryType] ?? DIETARY_CONFIG["vegetarian"];

  const scoreStyle =
    SCORE_STYLES[food.nutritionScore.ratingTier] ?? SCORE_STYLES["Good"];
  const categoryColor = getCategoryColor(food.categoryId);

  return (
    <>
      {modalOpen && (
        <QuickViewModal food={food} onClose={() => setModalOpen(false)} />
      )}

      <div
        className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_12px_35px_-18px_rgba(15,23,42,0.35)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_-22px_rgba(15,23,42,0.42)] dark:border-slate-700/80 dark:bg-slate-900 dark:shadow-[0_18px_45px_-24px_rgba(0,0,0,0.75)]"
        style={{ borderTopColor: categoryColor, borderTopWidth: "4px" }}
      >
        {/* Top Image Box */}
        <div
          onClick={handleImageClick}
          className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-slate-100"
        >
          <Image
            src={cardImgSrc}
            alt={food.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            onError={() => setCardImgSrc(getFoodFallbackImage(food))}
          />
          {/* Subtle Dark Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-black/10" />
          <div
            className="absolute inset-x-0 top-0 h-20 opacity-20"
            style={{ background: `linear-gradient(180deg, ${categoryColor}, transparent)` }}
          />

          {/* Quick Preview Hint on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-xl flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" />
              Quick View
            </span>
          </div>

          {/* Top Left: Dietary Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wide backdrop-blur-md shadow-lg ${dietBadge.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dietBadge.dotClass}`} />
              {dietBadge.label}
            </span>
          </div>

          {/* Top Right: Compare & Favorite Glass Buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              onClick={handleFavoriteClick}
              aria-label={favorite ? "Saved to favorites" : "Save to favorites"}
              className={`rounded-full border p-2.5 backdrop-blur-md transition-all duration-200 ${
                favorite
                  ? "bg-rose-500 text-white border-rose-400 shadow-md scale-105"
                  : "bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500 border-white/40 shadow-sm dark:!text-slate-700 dark:hover:!text-rose-600"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorite ? "fill-white" : ""}`} />
            </button>

            <button
              onClick={handleCompareClick}
              aria-label={compared ? "Remove comparison" : "Add to comparison"}
              className={`rounded-full border p-2.5 backdrop-blur-md transition-all duration-200 ${
                compared
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-md scale-105"
                  : "bg-white/80 hover:bg-white text-slate-700 hover:text-emerald-600 border-white/40 shadow-sm dark:!text-slate-700 dark:hover:!text-emerald-700"
              }`}
            >
              {compared ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Scale className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Bottom Over Image: NutriScore Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/80 px-3.5 py-1.5 text-white shadow-lg backdrop-blur-md">
            <span className={`w-2 h-2 rounded-full ${scoreStyle.bg} animate-pulse`} />
            <span className="text-xs font-black tracking-wide">
              {food.nutritionScore.totalScore}
              <span className="text-[10px] text-slate-400 font-semibold ml-0.5">/100</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-300 hidden sm:inline">
              · {food.nutritionScore.ratingTier}
            </span>
          </div>

          {/* Category Pill on Bottom Right of Image */}
          <div
            className="absolute bottom-3 right-3 rounded-full border border-white/30 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-lg backdrop-blur-md"
            style={{ backgroundColor: categoryColor }}
          >
            {food.categoryName}
          </div>
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
          {/* Food Title & Description */}
          <div>
            <Link href={`/food/${food.slug}`} className="block group/link">
              <h3 className="text-[1.05rem] font-black leading-snug tracking-tight text-slate-900 transition-colors group-hover/link:text-emerald-600 dark:text-white">
                {food.name}
                {food.hindiName && (
                  <span className="text-xs font-semibold text-slate-400 ml-1.5">
                    ({food.hindiName})
                  </span>
                )}
              </h3>
            </Link>
            <span
              className="mt-2 inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-sm"
              style={{ backgroundColor: categoryColor }}
            >
              {food.categoryName}
            </span>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {food.description}
            </p>
          </div>

          {/* ⚡ Studio Macro Bento Strip (4 Mini Dashboard Cards) */}
          <div className="grid grid-cols-4 gap-2">
            {/* Calories Bento */}
            <div className="rounded-2xl border border-orange-100/80 bg-gradient-to-b from-orange-50 to-white p-2.5 text-center dark:border-orange-400/20 dark:from-orange-500/10 dark:to-slate-900">
              <span className="block text-[9px] uppercase font-bold text-orange-600 tracking-wider">
                Cal
              </span>
              <span className="block text-xs font-black text-orange-950 leading-tight">
                {food.nutrients.calories}
              </span>
              <div className="w-full bg-orange-100 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (food.nutrients.calories / 500) * 100)}%` }}
                />
              </div>
            </div>

            {/* Protein Bento */}
            <div className="rounded-2xl border border-blue-100/80 bg-gradient-to-b from-blue-50 to-white p-2.5 text-center dark:border-blue-400/20 dark:from-blue-500/10 dark:to-slate-900">
              <span className="block text-[9px] uppercase font-bold text-blue-600 tracking-wider">
                Protein
              </span>
              <span className="block text-xs font-black text-blue-950 leading-tight">
                {food.nutrients.protein}g
              </span>
              <div className="w-full bg-blue-100 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (food.nutrients.protein / 40) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs Bento */}
            <div className="rounded-2xl border border-amber-100/80 bg-gradient-to-b from-amber-50 to-white p-2.5 text-center dark:border-amber-400/20 dark:from-amber-500/10 dark:to-slate-900">
              <span className="block text-[9px] uppercase font-bold text-amber-600 tracking-wider">
                Carbs
              </span>
              <span className="block text-xs font-black text-amber-950 leading-tight">
                {food.nutrients.carbohydrates}g
              </span>
              <div className="w-full bg-amber-100 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (food.nutrients.carbohydrates / 75) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fiber Bento */}
            <div className="rounded-2xl border border-emerald-100/80 bg-gradient-to-b from-emerald-50 to-white p-2.5 text-center dark:border-emerald-400/20 dark:from-emerald-500/10 dark:to-slate-900">
              <span className="block text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-300 tracking-wider">
                Fiber
              </span>
              <span className="block text-xs font-black text-emerald-950 dark:text-emerald-100 leading-tight">
                {food.nutrients.fiber}g
              </span>
              <div className="w-full bg-emerald-100 dark:bg-emerald-950/70 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (food.nutrients.fiber / 20) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Highlights & Link */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
            {food.betterFor && food.betterFor.length > 0 ? (
              <span className="text-[11px] font-bold text-slate-600 truncate max-w-[170px] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0" />
                {food.betterFor[0]}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium">Standard Portion 100g</span>
            )}

            <Link
              href={`/food/${food.slug}`}
              className="group/btn flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
            >
              Analyze
              <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
