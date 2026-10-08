import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FOOD_CATEGORIES } from "@/data/categories";
import { FoodRepository } from "@/lib/db/repository";
import { FoodCard } from "@/components/food/FoodCard";
import { NutritionHeroIllustration } from "@/components/visuals/NutritionHeroIllustration";
import { FoodOfTheDay } from "@/components/food/FoodOfTheDay";
import { 
  Sparkles, 
  Search, 
  Scale, 
  Calculator, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Zap,
  Flame,
  Dumbbell,
  Compass,
  Layers,
  BarChart3,
  CalendarDays
} from "lucide-react";

export default function HomePage() {
  // Keep each homepage shelf visually distinct and avoid repeating an image.
  const fruitHighlights = FoodRepository.getFoods({
    category: "fruits",
    limit: 8,
    sortBy: "score",
  });
  const fruitImages = new Set(fruitHighlights.map((food) => food.imageUrl));
  const popularFoods = FoodRepository.getFoods({ limit: 20, sortBy: "score" })
    .filter((food) => !fruitImages.has(food.imageUrl))
    .slice(0, 8);
  const usedImages = new Set(popularFoods.map((food) => food.imageUrl));
  fruitHighlights.forEach((food) => usedImages.add(food.imageUrl));
  const highProteinPicks = FoodRepository.getRankings("high-protein", 12)
    .filter((food) => !usedImages.has(food.imageUrl))
    .slice(0, 4);

  const quickSearchTags = [
    { label: "High Protein Vegetarian", query: "high protein vegetarian" },
    { label: "Rich in Iron", query: "foods high in iron" },
    { label: "Low Calorie Fruits", query: "low calorie fruits" },
    { label: "High Fiber", query: "fiber" },
    { label: "Vitamin C Boost", query: "foods rich in vitamin C" },
    { label: "Indian Superfoods", query: "ragi" },
  ];

  const journeySteps = [
    { step: "01", name: "Discover", desc: "Targeted foods matched to your biological goals", icon: Compass },
    { step: "02", name: "Filter", desc: "Multi-layered clinical, allergen, and macro filters", icon: Layers },
    { step: "03", name: "Understand", desc: "Scientific 100g vitamins, minerals, and NutriScore", icon: ShieldCheck },
    { step: "04", name: "Compare", desc: "Up to 5 foods with radar and density ratios", icon: Scale },
    { step: "05", name: "Calculate", desc: "Evidence-based BMI, BMR, and macro splits", icon: Calculator },
    { step: "06", name: "Personalize", desc: "Rule-based recommendation engine for you", icon: Sparkles },
    { step: "07", name: "Track", desc: "Daily meal log with real-time target bars", icon: CalendarDays },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-slate-50 to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pt-12 sm:pt-20 pb-12 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-300 text-brand-800 dark:bg-emerald-950/70 dark:border-emerald-800 dark:text-emerald-200 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-emerald-300" />
              <span>The Food & Nutrition Intelligence Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-slate-900 dark:text-white">
              <span className="block text-2xl sm:text-3xl font-semibold tracking-tight text-slate-600 dark:text-slate-300">
                Welcome to
              </span>
              <span className="mt-2 block text-6xl sm:text-8xl font-black tracking-[-0.06em] leading-none">
                Nutri<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-500 dark:from-emerald-400 dark:to-teal-300">Base</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 leading-snug max-w-2xl mx-auto">
              Clear nutrition insight. Confident food choices.
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Explore trusted food data, compare nutrients, and find practical tools to make every meal work for you.
            </p>

            {/* Hero Quick Search Bar */}
            <div className="pt-2 max-w-xl mx-auto">
              <form action="/search" method="GET" className="relative group shadow-lg shadow-brand-500/5 dark:shadow-black/30 rounded-2xl">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 dark:group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search food by name, nutrient ('high protein veg', 'iron', 'apple')..."
                  className="w-full pl-12 pr-28 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Search
                </button>
              </form>

              {/* Quick Tags */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-slate-500 dark:text-slate-300">
                <span className="font-semibold text-slate-400 dark:text-slate-400">Popular:</span>
                {quickSearchTags.map((tag) => (
                  <Link
                    key={tag.label}
                    href={`/search?q=${encodeURIComponent(tag.query)}`}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 hover:bg-brand-50 dark:hover:bg-slate-800 hover:text-brand-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 transition-colors"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                href="/discover"
                className="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-brand-500/25 transition-transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Find Foods For Me (Smart Engine)</span>
              </Link>
              <Link
                href="/compare"
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <Scale className="w-4 h-4 text-brand-600" />
                <span>Compare Foods</span>
              </Link>
              <Link
                href="/calculators"
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>Health Calculators</span>
              </Link>
            </div>

            <NutritionHeroIllustration />

          </div>
        </div>
      </section>

      <FoodOfTheDay />

      {/* 2. The Core Product Principle Journey (DISCOVER -> FILTER -> UNDERSTAND -> COMPARE -> CALCULATE -> PERSONALIZE -> TRACK) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-[11px] uppercase font-bold tracking-wider text-brand-600 block">
            End-To-End Nutrition Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Not Just A Database. A Decision Engine.
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Move seamlessly from discovery to precision personal tracking in 7 connected phases.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {journeySteps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-brand-300 transition-all group"
              >
                <div>
                  <span className="text-[10px] font-black text-brand-600/60 block mb-2">{s.step}</span>
                  <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">{s.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. The Killer Feature: "Find Foods For Me" Teaser Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Interactive Decision Feature</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              &ldquo;Tell me what you need, and I&apos;ll find the best foods for you.&rdquo;
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Looking for Indian foods with &gt;20g protein and &lt;400 calories? Or gut-friendly high-fiber breakfast options? Enter your exact criteria and let our rule-based recommendation engine generate ranked matches with instant explanations.
            </p>
            <div className="pt-2">
              <Link
                href="/discover"
                className="px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-xs sm:text-sm inline-flex items-center gap-2 transition-transform hover:scale-105 shadow-md"
              >
                <span>Launch Food Recommendation Engine</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Interactive Preview Mockup Box */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 w-full lg:w-96 space-y-3 z-10 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-slate-200">Sample Query:</span>
              <span className="text-[10px] text-brand-300 font-semibold">Matched Live</span>
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span>Goal:</span> <strong className="text-white">Muscle Building</strong>
              </div>
              <div className="flex justify-between">
                <span>Diet:</span> <strong className="text-white">Vegetarian</strong>
              </div>
              <div className="flex justify-between">
                <span>Priority:</span> <strong className="text-white">High Protein + Low Cal</strong>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Top Match Generated:</span>
              <div className="bg-white/10 p-2 rounded-xl flex items-center justify-between">
                <span className="font-bold text-white">Soybeans (Mature)</span>
                <span className="text-emerald-300 font-extrabold">36.5g Protein</span>
              </div>
              <div className="bg-white/10 p-2 rounded-xl flex items-center justify-between">
                <span className="font-bold text-white">Paneer (Cottage Cheese)</span>
                <span className="text-emerald-300 font-extrabold">18.3g Protein</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Main Food Taxonomy Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-brand-600 block">
              Comprehensive Taxonomy
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Food Categories
            </h2>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            Browse All Foods &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {FOOD_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.slug}`}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-400 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.name.slice(0, 1)}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Popular Foods with NutriScore Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-brand-600 block">
              Authoritative Profiles
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Nutrition Profiles
            </h2>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            Explore 100+ Foods &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* 6. Seasonal fruit shelf */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 py-12 sm:py-16">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute -left-24 -bottom-32 h-72 w-72 rounded-full bg-lime-300/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-emerald-300 block">
                Fresh from the produce aisle
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-white">
                More fruit. More ways to eat well.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-100/70">
                Explore colourful, naturally nutrient-dense fruits with transparent calories,
                fibre, vitamins, and serving sizes.
              </p>
            </div>
            <Link
              href="/search?category=fruits"
              className="inline-flex items-center gap-2 self-start rounded-xl border border-emerald-400/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20 sm:self-auto"
            >
              View all fruits <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {fruitHighlights.map((food) => (
              <Link
                key={food.id}
                href={`/food/${food.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm transition hover:-translate-y-1 hover:border-emerald-300/60 hover:bg-white/15"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={food.imageUrl}
                    alt={food.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <span className="absolute bottom-2 left-2 right-2 truncate text-xs font-black text-white">
                    {food.name}
                  </span>
                </div>
                <div className="flex items-center justify-between px-2.5 py-2 text-[10px]">
                  <span className="font-bold text-emerald-200">{food.nutrients.calories} kcal</span>
                  <span className="text-white/60">{food.nutrients.fiber}g fibre</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Food Comparison Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <Scale className="w-3.5 h-3.5" />
              <span>Multi-Food Comparison Engine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Compare 2 to 5 foods side by side with radar density charts.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Don&apos;t just compare raw calories—discover protein per 100 calories, fiber-to-carb ratios, and comprehensive micronutrient density. Instant &ldquo;Better For...&rdquo; badges highlight the objective winner for every dietary target.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/compare?slugs=apple,banana,orange"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Try Demo: Apple vs Banana vs Orange</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Sample Comparison Breakdown
            </span>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Chicken Breast vs Atlantic Salmon</span>
                  <span className="text-[10px] text-slate-400">Lean Protein vs Omega-3 Fatty Acids</span>
                </div>
                <Link href="/compare?slugs=chicken-breast,salmon" className="text-brand-600 font-bold hover:underline">
                  Compare &rarr;
                </Link>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Paneer vs Firm Tofu</span>
                  <span className="text-[10px] text-slate-400">Vegetarian Casein vs Vegan Calcium</span>
                </div>
                <Link href="/compare?slugs=paneer,tofu-firm" className="text-brand-600 font-bold hover:underline">
                  Compare &rarr;
                </Link>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">White Rice vs Brown Rice vs Ragi</span>
                  <span className="text-[10px] text-slate-400">Fast Glycogen vs High Fiber vs Calcium Millet</span>
                </div>
                <Link href="/compare?slugs=white-rice,brown-rice,ragi-finger-millet" className="text-brand-600 font-bold hover:underline">
                  Compare &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Nutrition Calculators Hub Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-brand-600 block">
              Evidence-Based Mathematics
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Clinical Health Calculators
            </h2>
          </div>
          <Link
            href="/calculators"
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            View All Calculators &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link
            href="/calculators/bmi"
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-400 transition-all flex flex-col justify-between group space-y-3"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600">BMI Calculator</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Metric & Imperial scale with ideal healthy weight bracket estimation.
              </p>
            </div>
            <span className="text-xs font-bold text-brand-600 flex items-center gap-1 pt-2">
              Launch BMI &rarr;
            </span>
          </Link>

          <Link
            href="/calculators/calories"
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-400 transition-all flex flex-col justify-between group space-y-3"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600">BMR & Daily Calories</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Mifflin-St Jeor equation factoring in 5 distinct exercise activity levels.
              </p>
            </div>
            <span className="text-xs font-bold text-brand-600 flex items-center gap-1 pt-2">
              Calculate TDEE &rarr;
            </span>
          </Link>

          <Link
            href="/calculators/macros"
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-400 transition-all flex flex-col justify-between group space-y-3"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600">Macro Calculator</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Exact daily gram targets for Protein, Carbohydrates, Fats, and Fiber.
              </p>
            </div>
            <span className="text-xs font-bold text-brand-600 flex items-center gap-1 pt-2">
              Split Macros &rarr;
            </span>
          </Link>

          <Link
            href="/calculators/meal-nutrition"
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-400 transition-all flex flex-col justify-between group space-y-3"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600">Composite Meal Calculator</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Combine 100g chicken + 150g rice + 50g dal to calculate total meal macros.
              </p>
            </div>
            <span className="text-xs font-bold text-brand-600 flex items-center gap-1 pt-2">
              Build Meal &rarr;
            </span>
          </Link>

        </div>
      </section>

      {/* 9. Top Rankings Superlative Quick Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-brand-600 block">
              Top Ranking Foods
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Top High Protein Superfoods
            </h2>
          </div>
          <Link
            href="/rankings"
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            View All Top Ranking Foods &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highProteinPicks.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="nutrition-intelligence-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2
            id="nutrition-intelligence-heading"
            className="text-xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            Food nutrition, made easier to understand
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            NutriBase is a food nutrition database for exploring nutrition facts
            and food data per 100g, comparing nutrients, and discovering healthy
            food options. Use food search and discovery to find foods, browse
            food categories and category lists, and look up Indian foods with
            our food search engine. Explore nutrient information in our growing
            database, informed by USDA FoodData Central and ICMR-NIN references.
            You can also use our food nutrition calculators to estimate daily
            calories, protein, carbohydrates, and other macronutrients. Compare
            fiber, vitamins C and E, calcium, omega-3, and iron in foods, review
            nutrition in a meal, and explore high-protein, high-fiber, low-calorie,
            vegetarian, and iron-rich food options. Browse food rankings to find
            nutrient-dense choices and support balanced, healthy eating. Compare
            foods by protein, calories, fiber, and other nutrients, or use our BMI,
            BMR, daily calorie, macro, and meal nutrition calculators.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <Link href="/search" className="hover:underline">
              Explore the food database
            </Link>
            <Link href="/calculators" className="hover:underline">
              Try nutrition calculators
            </Link>
            <Link href="/compare" className="hover:underline">
              Compare nutrition information
            </Link>
            <Link href="/rankings" className="hover:underline">
              Browse top ranking foods
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
