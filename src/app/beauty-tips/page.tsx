import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Flower2, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { FoodRepository } from "@/lib/db/repository";

export const metadata: Metadata = {
  title: "Beauty Tips | NutriBase",
  description:
    "Explore everyday foods and nutrients that can be part of a balanced beauty and wellness routine.",
};

const beautyFoodGuides = [
  {
    slug: "indian-gooseberry",
    focus: "Vitamin C",
    nutrient: "vitaminC_mg",
    nutrientLabel: "Vitamin C",
    note: "Amla adds vitamin C to your meals, a nutrient involved in normal collagen formation.",
  },
  {
    slug: "guava",
    focus: "Vitamin C + fibre",
    nutrient: "vitaminC_mg",
    nutrientLabel: "Vitamin C",
    note: "Enjoy guava as a whole-fruit snack for vitamin C and dietary fibre.",
  },
  {
    slug: "papaya-fresh",
    focus: "Vitamin C",
    nutrient: "vitaminC_mg",
    nutrientLabel: "Vitamin C",
    note: "Fresh papaya is an easy way to add fruit and vitamin C to breakfast or a snack.",
  },
  {
    slug: "spinach",
    focus: "Vitamin A + folate",
    nutrient: "vitaminA_mcg",
    nutrientLabel: "Vitamin A",
    note: "Add spinach to dals, curries, or salads for a leafy-green source of micronutrients.",
  },
  {
    slug: "carrot",
    focus: "Vitamin A",
    nutrient: "vitaminA_mcg",
    nutrientLabel: "Vitamin A",
    note: "Carrots bring colourful variety and vitamin A to everyday meals.",
  },
  {
    slug: "almonds",
    focus: "Vitamin E",
    nutrient: "vitaminE_mg",
    nutrientLabel: "Vitamin E",
    note: "A small portion of almonds can add vitamin E and unsaturated fats to a balanced diet.",
  },
  {
    slug: "tomato",
    focus: "Vitamin C",
    nutrient: "vitaminC_mg",
    nutrientLabel: "Vitamin C",
    note: "Tomatoes are a versatile everyday ingredient that contributes vitamin C.",
  },
  {
    slug: "walnuts",
    focus: "Everyday healthy fats",
    nutrient: "vitaminE_mg",
    nutrientLabel: "Vitamin E",
    note: "Use walnuts in modest portions for a satisfying source of plant-based fats.",
  },
] as const;

const guides = beautyFoodGuides.flatMap((guide) => {
  const food = FoodRepository.getFoodBySlug(guide.slug);
  return food ? [{ ...guide, food }] : [];
});

export default function BeautyTipsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/70 via-white to-slate-50 py-10 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-white px-6 py-10 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-10 sm:py-14">
          <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full bg-rose-100/70 blur-3xl dark:bg-emerald-500/10" />
          <div className="relative mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
              <Flower2 aria-hidden="true" className="h-4 w-4" />
              NutriBase Beauty Tips
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Beauty begins with{" "}
              <span className="bg-gradient-to-r from-rose-600 to-emerald-600 bg-clip-text text-transparent dark:from-rose-300 dark:to-emerald-300">
                everyday nourishment.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Explore foods and nutrients that can be part of a balanced eating
              pattern. Start with familiar favourites like amla, guava, leafy
              greens, and nuts.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Food information is educational, not a promise of cosmetic results.
            </p>
          </div>
        </section>

        <section aria-labelledby="beauty-foods-heading" className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                <Sparkles aria-hidden="true" className="h-4 w-4" />
                Food inspiration
              </span>
              <h2 id="beauty-foods-heading" className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Everyday foods to explore
              </h2>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200"
            >
              Explore all foods <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          {guides.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {guides.map(({ food, focus, nutrient, nutrientLabel, note }) => {
                const nutrientValue = food.vitamins[nutrient];
                const nutrientUnit = nutrient === "vitaminA_mcg" ? "mcg" : "mg";

                return (
                  <article
                    key={food.slug}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-700"
                  >
                    <Link href={`/food/${food.slug}`} className="block">
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={food.imageUrl}
                          alt={food.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-slate-950/75 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur">
                          {focus}
                        </span>
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-extrabold leading-tight text-slate-900 dark:text-white">
                              {food.name}
                            </h3>
                            {food.hindiName && (
                              <p className="mt-0.5 text-xs text-slate-400">{food.hindiName}</p>
                            )}
                          </div>
                          <span className="shrink-0 rounded-xl bg-emerald-50 px-2.5 py-1.5 text-right dark:bg-emerald-950/60">
                            <span className="block text-sm font-black text-emerald-800 dark:text-emerald-200">
                              {nutrientValue} {nutrientUnit}
                            </span>
                            <span className="block text-[9px] font-semibold text-emerald-700 dark:text-emerald-300">
                              {nutrientLabel} / 100g
                            </span>
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                          {note}
                        </p>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:gap-2 dark:text-emerald-300">
                          View nutrition details <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Beauty food guides are temporarily unavailable. Please explore the food directory instead.
            </p>
          )}
        </section>

        <p className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-white/80 p-4 text-xs leading-relaxed text-slate-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-400">
          <Leaf aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          Nutrient amounts are based on the listed food data per 100g edible portion and can vary by variety and preparation.
          No single food can guarantee changes to skin, hair, or appearance.
        </p>
      </div>
    </div>
  );
}
