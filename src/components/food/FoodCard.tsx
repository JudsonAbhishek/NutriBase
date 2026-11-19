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
  ExternalLink,
  Sparkles,
  Share2,
  Store,
  Dumbbell,
} from "lucide-react";
import { FoodItem } from "@/types/nutrition";
import { FOOD_CATEGORIES } from "@/data/categories";
import { useNutri } from "@/context/NutriContext";
import { DAILY_VALUES } from "@/lib/algorithms/healthCalculators";

interface FoodCardProps {
  food: FoodItem;
  priority?: boolean;
}

const DIETARY_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  vegan: {
    label: "Vegan",
    badgeClass: "bg-emerald-600/90 text-white border-emerald-400/40",
    dotClass: "bg-emerald-200",
  },
  vegetarian: {
    label: "Vegetarian",
    badgeClass: "bg-green-600/90 text-white border-green-400/40",
    dotClass: "bg-green-200",
  },
  "non-vegetarian": {
    label: "Non-Veg",
    badgeClass: "bg-rose-600/90 text-white border-rose-400/40",
    dotClass: "bg-rose-200",
  },
  seafood: {
    label: "Seafood",
    badgeClass: "bg-cyan-600/90 text-white border-cyan-400/40",
    dotClass: "bg-cyan-200",
  },
  eggetarian: {
    label: "Eggetarian",
    badgeClass: "bg-amber-600/90 text-white border-amber-400/40",
    dotClass: "bg-amber-200",
  },
};

const SCORE_STYLES: Record<string, { bg: string; text: string; ring: string }> = {
  Excellent: {
    bg: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
    ring: "ring-emerald-400/30",
  },
  Good: {
    bg: "bg-teal-500",
    text: "text-teal-700 dark:text-teal-300",
    ring: "ring-teal-400/30",
  },
  Moderate: {
    bg: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-300",
    ring: "ring-amber-400/30",
  },
  "Limit Consumption": {
    bg: "bg-rose-500",
    text: "text-rose-700 dark:text-rose-300",
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      onWheel={(event) => {
        if (event.target === event.currentTarget) event.preventDefault();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${food.name} nutrition details`}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Hero Banner */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-900">
          <Image
            src={modalImgSrc}
            alt={food.name}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            priority
            onError={() => setModalImgSrc(getFoodFallbackImage(food))}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-black/30 pointer-events-none" />

          {/* Share and close actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleShare}
              className="relative rounded-full border border-white/20 bg-slate-950/60 p-2 text-white backdrop-blur-md transition-colors hover:bg-slate-950/90 shadow-md"
              aria-label={`Share ${food.name}`}
              title={shareStatus === "copied" ? "Link copied" : "Share food card"}
            >
              <Share2 className="h-4 w-4" />
              {shareStatus !== "idle" && (
                <span
                  className={`absolute right-0 top-11 whitespace-nowrap rounded-lg px-2.5 py-1 text-[10px] font-bold shadow-lg ${
                    shareStatus === "copied"
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {shareStatus === "copied" ? "Link copied" : "Could not share"}
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="rounded-full border border-white/20 bg-slate-950/60 p-2 text-white backdrop-blur-md transition-colors hover:bg-slate-950/90 shadow-md"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10 flex-wrap max-w-[80%]">
            <span
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border shadow-md backdrop-blur-md ${dietBadge.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dietBadge.dotClass}`} />
              {dietBadge.label}
            </span>
            <span className="text-[11px] font-semibold text-white/95 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-sm">
              {food.categoryName}
            </span>
            {food.isLocalAvailable && (
              <span className="text-[11px] font-bold text-white bg-emerald-700/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-400/40 shadow-sm flex items-center gap-1">
                <Store className="w-3 h-3" />
                Home & Local Market
              </span>
            )}
          </div>

          {/* Floating NutriScore over Image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
                {food.name}
              </h2>
              {food.hindiName && (
                <p className="text-sm text-slate-300 font-medium">{food.hindiName}</p>
              )}
            </div>

            <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-xl border border-white/20 text-white">
              <span className={`w-2.5 h-2.5 rounded-full ${scoreStyle.bg}`} />
              <div className="text-right leading-none">
                <span className="text-xs font-black">
                  {food.nutritionScore.totalScore}/100
                </span>
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  {food.nutritionScore.ratingTier}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Calorie & Servings Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-800/40 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block">
                Calories
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                {food.nutrients.calories}
              </span>
              <span className="text-[10px] text-orange-600/80 dark:text-orange-400/80 block">kcal / 100g</span>
            </div>

            <div className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/40 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                Protein
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                {food.nutrients.protein}g
              </span>
              <span className="text-[10px] text-blue-600/80 dark:text-blue-400/80 block">
                {Math.round((food.nutrients.protein / 50) * 100)}% DV
              </span>
            </div>

            <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                Carbs
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                {food.nutrients.carbohydrates}g
              </span>
              <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 block">
                Net: {food.nutrients.netCarbs}g
              </span>
            </div>

            <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Fiber
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                {food.nutrients.fiber}g
              </span>
              <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 block">
                {Math.round((food.nutrients.fiber / 28) * 100)}% DV
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            {food.description}
          </p>

          {/* Micronutrient Top Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vitaminEntries.length > 0 && (
              <div className="bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 mb-2 text-purple-700 dark:text-purple-300">
                  <Leaf className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Key Vitamins (% DV)
                  </span>
                </div>
                <div className="space-y-1.5">
                  {vitaminEntries.map((v) => (
                    <div key={v.name} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{v.name}</span>
                      <span className="font-extrabold text-purple-700 dark:text-purple-300">{v.pct}% DV</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mineralEntries.length > 0 && (
              <div className="bg-teal-50/70 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-800/40 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 mb-2 text-teal-700 dark:text-teal-300">
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Key Minerals (% DV)
                  </span>
                </div>
                <div className="space-y-1.5">
                  {mineralEntries.map((m) => (
                    <div key={m.name} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{m.name}</span>
                      <span className="font-extrabold text-teal-700 dark:text-teal-300">{m.pct}% DV</span>
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
                  className="flex items-center gap-1 text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer CTAs */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
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
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600"
            }`}
            aria-label="Compare"
          >
            {compared ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
          </button>

          <button
            onClick={() => toggleFavorite(food.id)}
            className={`p-3 rounded-2xl border transition-all ${
              favorite
                ? "bg-rose-500 text-white border-rose-400"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-rose-400 hover:text-rose-500"
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

/* ─── High-End Professional Food Card ─────────────────────────────────────── */
export function FoodCard({ food, priority = false }: FoodCardProps) {
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

      <div className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-300/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_18px_45px_-24px_rgba(0,0,0,0.75)] dark:hover:shadow-black/70">
        {/* Subtle Category Accent Indicator */}
        <div
          className="h-1.5 w-full transition-opacity duration-300"
          style={{ backgroundColor: categoryColor }}
        />

        {/* Top Image Box */}
        <div
          onClick={handleImageClick}
          className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-slate-100 dark:bg-slate-800"
        >
          <Image
            src={cardImgSrc}
            alt={food.name}
            fill
            sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            onError={() => setCardImgSrc(getFoodFallbackImage(food))}
          />

          {/* Vignette Gradients for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20 pointer-events-none" />

          {/* Quick Preview Hint on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none scale-95 group-hover:scale-100">
            <span className="backdrop-blur-md bg-slate-950/80 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full border border-white/20 shadow-xl flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Quick View
            </span>
          </div>

          {/* Top Left: Dietary Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${dietBadge.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dietBadge.dotClass}`} />
              {dietBadge.label}
            </span>
          </div>

          {/* Top Right: Compare & Favorite Glass Buttons */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            <button
              onClick={handleFavoriteClick}
              aria-label={favorite ? "Saved to favorites" : "Save to favorites"}
              className={`h-8 w-8 rounded-full border flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-md ${
                favorite
                  ? "bg-rose-500 text-white border-rose-400 scale-105 shadow-rose-500/30"
                  : "bg-slate-950/40 hover:bg-slate-950/70 text-white border-white/20 hover:scale-105"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorite ? "fill-white" : ""}`} />
            </button>

            <button
              onClick={handleCompareClick}
              aria-label={compared ? "Remove comparison" : "Add to comparison"}
              className={`h-8 w-8 rounded-full border flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-md ${
                compared
                  ? "bg-emerald-600 text-white border-emerald-500 scale-105 shadow-emerald-500/30"
                  : "bg-slate-950/40 hover:bg-slate-950/70 text-white border-white/20 hover:scale-105"
              }`}
            >
              {compared ? (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              ) : (
                <Scale className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Bottom Left: NutriScore Badge */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/80 px-2.5 py-1 text-white shadow-lg backdrop-blur-md">
            <span className={`w-2 h-2 rounded-full ${scoreStyle.bg} ring-2 ring-white/20`} />
            <span className="text-xs font-black tracking-wide">
              {food.nutritionScore.totalScore}
              <span className="text-[10px] text-slate-400 font-semibold ml-0.5">/100</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-300 hidden sm:inline">
              · {food.nutritionScore.ratingTier}
            </span>
          </div>

        </div>

        {/* Card Content Body */}
        <div className="flex flex-1 flex-col p-5">
          <Link href={`/food/${food.slug}`} className="group/link block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {food.categoryName}
            </span>
            <h3 className="mt-1 text-[1.05rem] font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover/link:text-emerald-600 dark:text-white dark:group-hover/link:text-emerald-400">
              {food.name}
            </h3>
            {food.hindiName && (
              <span className="mt-0.5 block text-xs font-medium text-slate-400 dark:text-slate-500">
                {food.hindiName}
              </span>
            )}
          </Link>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {food.description}
          </p>

          {/* Protein is the headline metric, kept visually distinct from the rest. */}
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/60 px-3.5 py-2.5 dark:border-blue-500/25 dark:bg-blue-500/10">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
              <Dumbbell className="h-3.5 w-3.5" />
              Protein
            </span>
            <span className="text-base font-black leading-none text-blue-900 dark:text-blue-100">
              {food.nutrients.protein}
              <span className="ml-0.5 text-[11px] font-bold text-blue-600 dark:text-blue-300">g</span>
            </span>
          </div>

          {/* Remaining macros, all read straight from the record */}
          <dl className="mt-2 grid grid-cols-4 divide-x divide-slate-100 rounded-2xl border border-slate-100 py-2.5 dark:divide-slate-800 dark:border-slate-800">
            {[
              { label: "Calories", value: food.nutrients.calories, unit: "" },
              { label: "Carbs", value: food.nutrients.carbohydrates, unit: "g" },
              { label: "Fat", value: food.nutrients.fat, unit: "g" },
              { label: "Fiber", value: food.nutrients.fiber, unit: "g" },
            ].map((item) => (
              <div key={item.label} className="px-1 text-center">
                <dt className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  {item.label}
                </dt>
                <dd className="mt-0.5 text-[13px] font-black text-slate-900 dark:text-slate-100">
                  {item.value}
                  {item.unit && (
                    <span className="text-[10px] font-bold text-slate-400">{item.unit}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-1.5 text-[10px] text-slate-400">Per 100 g edible portion</p>

          {/* Highlight & action */}
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            {food.betterFor && food.betterFor.length > 0 ? (
              <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                <span className="truncate">{food.betterFor[0]}</span>
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {food.dietaryType.replace("-", " ")}
              </span>
            )}

            <Link
              href={`/food/${food.slug}`}
              className="group/btn flex flex-shrink-0 items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-bold text-emerald-700 shadow-sm transition-all hover:bg-emerald-600 hover:text-white dark:border-emerald-800/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
            >
              <span>Analyze</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
