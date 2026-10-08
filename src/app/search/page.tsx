"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FoodRepository } from "@/lib/db/repository";
import { FOOD_CATEGORIES } from "@/data/categories";
import { FoodCard } from "@/components/food/FoodCard";
import { AllergenType, DietaryType } from "@/types/nutrition";
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  RotateCcw,
  ArrowUpDown,
  Filter,
  Check,
  ChevronDown,
  ShieldCheck,
  Zap,
} from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();

  // Search and filter states
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState<DietaryType | "all">("all");
  const [sortBy, setSortBy] = useState<any>("score");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const selectedCategoryInfo = FOOD_CATEGORIES.find(
    (category) => category.id === selectedCategory
  );

  // Nutrition toggles
  const [filterHighProtein, setFilterHighProtein] = useState(false);
  const [filterLowCalorie, setFilterLowCalorie] = useState(false);
  const [filterHighFiber, setFilterHighFiber] = useState(false);
  const [filterLowSugar, setFilterLowSugar] = useState(false);
  const [filterHighIron, setFilterHighIron] = useState(false);
  const [filterHighCalcium, setFilterHighCalcium] = useState(false);
  const [filterHighVitC, setFilterHighVitC] = useState(false);

  // Allergen exclusions
  const [excludedAllergens, setExcludedAllergens] = useState<AllergenType[]>([]);

  // Sync url param changes
  useEffect(() => {
    const qParam = searchParams.get("q");
    if (qParam !== null) setQuery(qParam);

    const catParam = searchParams.get("category");
    if (catParam !== null) setSelectedCategory(catParam);
  }, [searchParams]);

  const toggleAllergen = (allergen: AllergenType) => {
    setExcludedAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    );
  };

  const handleResetFilters = () => {
    setQuery("");
    setSelectedCategory("all");
    setSelectedDiet("all");
    setSortBy("score");
    setFilterHighProtein(false);
    setFilterLowCalorie(false);
    setFilterHighFiber(false);
    setFilterLowSugar(false);
    setFilterHighIron(false);
    setFilterHighCalcium(false);
    setFilterHighVitC(false);
    setExcludedAllergens([]);
  };

  // Quick suggestion queries
  const quickQueries = [
    "High protein vegetarian",
    "Rich in iron",
    "Low calorie fruits",
    "High vitamin C",
    "Low sugar",
    "Ancient grains",
  ];

  // Perform filtering using repository
  const filteredFoods = useMemo(() => {
    return FoodRepository.getFoods({
      search: query,
      category: selectedCategory === "all" ? undefined : selectedCategory,
      dietaryType: selectedDiet,
      minProtein: filterHighProtein ? 12 : undefined,
      maxCalories: filterLowCalorie ? 80 : undefined,
      minFiber: filterHighFiber ? 4 : undefined,
      maxSugar: filterLowSugar ? 5 : undefined,
      minIron: filterHighIron ? 2.5 : undefined,
      minCalcium: filterHighCalcium ? 150 : undefined,
      minVitaminC: filterHighVitC ? 30 : undefined,
      allergensExclude: excludedAllergens.length > 0 ? excludedAllergens : undefined,
      sortBy,
    });
  }, [
    query,
    selectedCategory,
    selectedDiet,
    sortBy,
    filterHighProtein,
    filterLowCalorie,
    filterHighFiber,
    filterLowSugar,
    filterHighIron,
    filterHighCalcium,
    filterHighVitC,
    excludedAllergens,
  ]);

  const activeFilterCount = [
    selectedCategory !== "all",
    selectedDiet !== "all",
    filterHighProtein,
    filterLowCalorie,
    filterHighFiber,
    filterLowSugar,
    filterHighIron,
    filterHighCalcium,
    filterHighVitC,
    excludedAllergens.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        {/* Modern Studio Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Clinical Nutrition Dataset
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Precision Food Discovery
            </h1>
            <p className="text-sm text-slate-500 max-w-none sm:whitespace-nowrap">
              Search authoritative whole foods, apply clinical dietary filters, check allergens,
              and compare micro-nutrient density.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 shadow-sm text-right">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Database
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {filteredFoods.length} Foods Live
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-sm dark:shadow-black/20 border border-slate-200/90 dark:border-slate-700 space-y-3.5 transition-all focus-within:shadow-xl focus-within:border-emerald-500/50">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search foods by name, nutrient, or goal ('spinach', 'rich in iron', 'high protein')..."
              className="w-full pl-12 pr-12 py-3.5 text-sm sm:text-base bg-slate-50/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-900 dark:text-white placeholder-slate-400 font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 bg-slate-200/60 rounded-full transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Query Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1 flex-shrink-0 text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Popular:
            </span>
            {quickQueries.map((q) => {
              const active = query.toLowerCase() === q.toLowerCase();
              return (
                <button
                  key={q}
                  onClick={() => setQuery(active ? "" : q)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${
                    active
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border-slate-200/60"
                  }`}
                >
                  {q}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Layout (Sidebar Filters + Results Grid) */}
        <div className="grid min-h-0 grid-cols-1 items-start gap-6 lg:grid-cols-[235px_minmax(0,1fr)] lg:gap-7 xl:grid-cols-[250px_minmax(0,1fr)]">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>Filters ({activeFilterCount})</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="score">NutriScore: High to Low</option>
                <option value="protein">Highest Protein</option>
                <option value="calories-low">Lowest Calories</option>
                <option value="fiber">Highest Fiber</option>
                <option value="sugar-low">Lowest Sugar</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Filters Sidebar */}
          <div
            className={`lg:block ${
              showFiltersMobile ? "block" : "hidden"
            } space-y-6 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-5rem)] lg:self-start lg:space-y-4 lg:overflow-y-auto lg:pr-1`}
          >
            <div className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
              {/* Header */}
              <div className="-mx-1 flex items-center justify-between border-b border-slate-100 px-1 pb-3 dark:border-slate-700">
                <span className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                  <Filter className="w-4 h-4 text-emerald-600" />
                  Filter Foods
                  {activeFilterCount > 0 && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-black text-emerald-700 shadow-sm transition-colors hover:bg-emerald-100 hover:text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset filters
                  </button>
                )}
              </div>

              {/* Dietary Types */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Dietary Preference
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: "all", label: "All Diets" },
                    { id: "vegetarian", label: "Vegetarian" },
                    { id: "vegan", label: "Vegan" },
                    { id: "non-vegetarian", label: "Non-Veg" },
                    { id: "seafood", label: "Seafood" },
                    { id: "eggetarian", label: "Eggetarian" },
                  ].map((diet) => (
                    <button
                      key={diet.id}
                      onClick={() => setSelectedDiet(diet.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all border ${
                        selectedDiet === diet.id
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                          : "bg-slate-50 border-slate-200/70 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {diet.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Food Category
                </label>
                <div
                  className="relative"
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setIsCategoryMenuOpen(false);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setIsCategoryMenuOpen(false);
                  }}
                >
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isCategoryMenuOpen}
                    aria-controls="food-category-options"
                    onClick={() => setIsCategoryMenuOpen((open) => !open)}
                    className="flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-xs font-black text-slate-800 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:!border-slate-600 dark:!bg-slate-800 dark:!bg-none dark:!text-slate-100"
                    style={{
                      borderColor: selectedCategoryInfo
                        ? `${selectedCategoryInfo.color}66`
                        : "#cbd5e1",
                      background: selectedCategoryInfo
                        ? `linear-gradient(110deg, ${selectedCategoryInfo.color}12, ${selectedCategoryInfo.color}24)`
                        : "linear-gradient(110deg, #f8fafc, #eef2f7)",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {selectedCategoryInfo && (
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full shadow-inner"
                          style={{ backgroundColor: selectedCategoryInfo.color }}
                        />
                      )}
                      {selectedCategoryInfo?.name ??
                        `All Categories (${FOOD_CATEGORIES.length})`}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 text-slate-500 transition-transform ${
                        isCategoryMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isCategoryMenuOpen && (
                    <div
                      id="food-category-options"
                      role="listbox"
                      aria-label="Food category options"
                      className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
                    >
                      <button
                        type="button"
                        role="option"
                        aria-selected={selectedCategory === "all"}
                        onClick={() => {
                          setSelectedCategory("all");
                          setIsCategoryMenuOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        All Categories ({FOOD_CATEGORIES.length})
                        {selectedCategory === "all" && (
                          <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                        )}
                      </button>
                      {FOOD_CATEGORIES.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          role="option"
                          aria-selected={selectedCategory === category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setIsCategoryMenuOpen(false);
                          }}
                          className="my-0.5 flex w-full items-center justify-between rounded-lg border-l-[3px] px-3 py-2.5 text-left text-xs font-bold text-slate-800 transition-all hover:brightness-[0.98] dark:text-slate-100"
                          style={{
                            borderLeftColor: category.color,
                            background: `linear-gradient(105deg, ${category.color}0a 0%, ${category.color}24 100%)`,
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </span>
                          {selectedCategory === category.id && (
                            <Check
                              aria-hidden="true"
                              className="h-4 w-4"
                              style={{ color: category.color }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Clinical Nutrient Thresholds */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Nutritional Targets
                </label>
                <div className="space-y-1.5">
                  {[
                    {
                      label: "High Protein",
                      sub: "≥ 12g / 100g",
                      active: filterHighProtein,
                      setter: setFilterHighProtein,
                    },
                    {
                      label: "Low Calorie",
                      sub: "≤ 80 kcal / 100g",
                      active: filterLowCalorie,
                      setter: setFilterLowCalorie,
                    },
                    {
                      label: "High Fiber",
                      sub: "≥ 4g / 100g",
                      active: filterHighFiber,
                      setter: setFilterHighFiber,
                    },
                    {
                      label: "Low Sugar",
                      sub: "≤ 5g / 100g",
                      active: filterLowSugar,
                      setter: setFilterLowSugar,
                    },
                    {
                      label: "Rich in Iron",
                      sub: "≥ 2.5mg / 100g",
                      active: filterHighIron,
                      setter: setFilterHighIron,
                    },
                    {
                      label: "Rich in Calcium",
                      sub: "≥ 150mg / 100g",
                      active: filterHighCalcium,
                      setter: setFilterHighCalcium,
                    },
                    {
                      label: "High Vitamin C",
                      sub: "≥ 30mg / 100g",
                      active: filterHighVitC,
                      setter: setFilterHighVitC,
                    },
                  ].map((filterItem) => (
                    <label
                      key={filterItem.label}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                        filterItem.active
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                          : "bg-slate-50/60 border-slate-200/70 text-slate-700 hover:bg-slate-100/80"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{filterItem.label}</span>
                        <span className="text-[10px] text-slate-400">{filterItem.sub}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={filterItem.active}
                        onChange={(e) => filterItem.setter(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Exclude Allergens */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Exclude Allergens
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(["nuts", "dairy", "gluten", "soy", "eggs", "shellfish"] as AllergenType[]).map(
                    (allergen) => {
                      const isExcluded = excludedAllergens.includes(allergen);
                      return (
                        <button
                          key={allergen}
                          onClick={() => toggleAllergen(allergen)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize border transition-all ${
                            isExcluded
                              ? "bg-rose-50 text-rose-700 border-rose-300 line-through"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {allergen}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="min-w-0 space-y-4">
            {/* Results Banner & Desktop Sort */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-slate-600 font-medium">
                Showing <strong className="text-slate-900 font-extrabold">{filteredFoods.length}</strong> verified foods
                {query && <span> for &ldquo;{query}&rdquo;</span>}
              </span>

              <div className="hidden sm:flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 font-semibold">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="score">NutriScore: High to Low</option>
                  <option value="protein">Highest Protein</option>
                  <option value="calories-low">Lowest Calories</option>
                  <option value="fiber">Highest Fiber</option>
                  <option value="sugar-low">Lowest Sugar</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Food Grid */}
            {filteredFoods.length > 0 ? (
              <div className="food-results-scroll grid grid-cols-1 gap-6 sm:grid-cols-2 xl:max-h-[calc(100dvh-12rem)] xl:grid-cols-3 xl:overflow-y-auto xl:pr-2">
                {filteredFoods.map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    No matching foods found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Try loosening your dietary filters or searching for broader terms like &ldquo;fruits&rdquo;, &ldquo;protein&rdquo;, or &ldquo;dal&rdquo;.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading Nutrition Intelligence...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
