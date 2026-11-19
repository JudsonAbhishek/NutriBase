"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Brain,
  Search,
  ShieldCheck,
} from "lucide-react";

export type GuideFood = {
  slug: string;
  name: string;
  imageUrl: string;
  dietaryType: string;
};

type BodyPart = {
  id: number;
  name: string;
  function: string;
  nutrients: string[];
  explanation: string;
  foods: string[];
  target: [number, number]; // Accurate anatomical point on the body
  badge: [number, number];  // Clean callout position on the margin
  color: string;
};

const BODY_PARTS: BodyPart[] = [
  {
    id: 1,
    name: "Brain",
    function: "Coordinates thinking, memory, movement, and many automatic body processes.",
    nutrients: ["Omega-3 fats", "B vitamins", "Choline"],
    explanation: "These nutrients have roles in normal nervous-system structure and energy metabolism.",
    foods: ["salmon", "whole-egg", "walnuts", "oats"],
    target: [160, 37],
    badge: [294, 40],
    color: "#8b5cf6",
  },
  {
    id: 2,
    name: "Eyes",
    function: "Detect light and send visual information to the brain.",
    nutrients: ["Vitamin A", "Lutein", "Zeaxanthin"],
    explanation: "Vitamin A supports normal vision; leafy greens supply carotenoids including lutein.",
    foods: ["carrot", "spinach", "whole-egg"],
    target: [151, 52],
    badge: [26, 55],
    color: "#0ea5e9",
  },
  {
    id: 3,
    name: "Ears",
    function: "Support hearing and help the body sense balance.",
    nutrients: ["Omega-3 fats", "Zinc", "Vitamin B12"],
    explanation: "A varied diet provides nutrients that contribute to normal cell and nerve function.",
    foods: ["salmon", "oats", "milk"],
    target: [187, 65],
    badge: [294, 77],
    color: "#06b6d4",
  },
  {
    id: 4,
    name: "Nose",
    function: "Enables smell and helps filter, warm, and humidify inhaled air.",
    nutrients: ["Vitamin C", "Protein", "Zinc"],
    explanation: "These nutrients support normal connective tissue, immune function, and cell maintenance.",
    foods: ["orange", "red-lentils", "curd"],
    target: [160, 63],
    badge: [26, 92],
    color: "#f59e0b",
  },
  {
    id: 5,
    name: "Teeth & mouth",
    function: "Bite, chew, and begin digestion while helping with speech.",
    nutrients: ["Calcium", "Phosphorus", "Vitamin C"],
    explanation: "Calcium and phosphorus are structural minerals in teeth; vitamin C supports collagen formation.",
    foods: ["milk", "curd", "broccoli"],
    target: [160, 74],
    badge: [294, 114],
    color: "#14b8a6",
  },
  {
    id: 6,
    name: "Heart",
    function: "Pumps blood around the body through the circulatory system.",
    nutrients: ["Fiber", "Unsaturated fats", "Potassium"],
    explanation: "A heart-supportive eating pattern can include fiber-rich plants and sources of unsaturated fats.",
    foods: ["oats", "almonds", "spinach", "salmon"],
    target: [162, 152],
    badge: [294, 155],
    color: "#ef4444",
  },
  {
    id: 7,
    name: "Lungs",
    function: "Exchange oxygen and carbon dioxide with the air we breathe.",
    nutrients: ["Vitamin C", "Protein", "Antioxidant-rich plant foods"],
    explanation: "A varied pattern of fruits, vegetables, and protein foods supplies nutrients for normal tissue maintenance.",
    foods: ["orange", "broccoli", "red-lentils"],
    target: [140, 146],
    badge: [26, 166],
    color: "#38bdf8",
  },
  {
    id: 8,
    name: "Liver",
    function: "Processes nutrients, produces bile, and supports many metabolic functions.",
    nutrients: ["Protein", "Choline", "Fiber"],
    explanation: "Adequate protein and choline support normal metabolism; fiber comes from plant foods.",
    foods: ["whole-egg", "red-lentils", "oats"],
    target: [140, 192],
    badge: [26, 203],
    color: "#a855f7",
  },
  {
    id: 9,
    name: "Stomach",
    function: "Mixes food with digestive juices and gradually passes it onward.",
    nutrients: ["Protein", "Fiber", "Fluids"],
    explanation: "Balanced meals with fluids and fiber-containing foods support everyday digestive function.",
    foods: ["curd", "oats", "red-lentils"],
    target: [174, 198],
    badge: [294, 229],
    color: "#f97316",
  },
  {
    id: 10,
    name: "Intestines",
    function: "Continue digestion, absorb nutrients, and move waste through the body.",
    nutrients: ["Fiber", "Fluids", "Fermented foods"],
    explanation: "Fiber-rich foods and adequate fluids help support regular bowel function; fermented foods can be part of a varied diet.",
    foods: ["red-lentils", "oats", "curd", "broccoli"],
    target: [160, 248],
    badge: [26, 248],
    color: "#22c55e",
  },
  {
    id: 11,
    name: "Kidneys",
    function: "Filter blood, balance body fluids and electrolytes, and produce urine.",
    nutrients: ["Fluids", "Potassium", "Protein"],
    explanation: "Water is essential for normal body functions. Individual fluid and nutrient needs vary, especially with health conditions.",
    foods: ["milk", "spinach", "orange"],
    target: [182, 218],
    badge: [294, 266],
    color: "#ec4899",
  },
  {
    id: 12,
    name: "Bones",
    function: "Provide structure, protect organs, and work with muscles to enable movement.",
    nutrients: ["Calcium", "Vitamin D", "Protein"],
    explanation: "Calcium, vitamin D, and protein each play roles in maintaining normal bones.",
    foods: ["milk", "curd", "paneer", "broccoli"],
    target: [145, 443],
    badge: [26, 443],
    color: "#6366f1",
  },
  {
    id: 13,
    name: "Muscles",
    function: "Enable movement, maintain posture, and help produce heat.",
    nutrients: ["Protein", "Carbohydrate", "Potassium"],
    explanation: "Protein contributes to muscle maintenance; carbohydrate and other nutrients support a balanced diet and activity.",
    foods: ["red-lentils", "paneer", "whole-egg", "salmon"],
    target: [180, 348],
    badge: [294, 348],
    color: "#f43f5e",
  },
  {
    id: 14,
    name: "Skin",
    function: "Forms a protective barrier and helps regulate body temperature.",
    nutrients: ["Vitamin C", "Vitamin E", "Protein"],
    explanation: "Vitamin C supports collagen formation; vitamin E is an antioxidant nutrient. No single food treats skin conditions.",
    foods: ["orange", "almonds", "spinach"],
    target: [100, 272],
    badge: [26, 290],
    color: "#eab308",
  },
  {
    id: 15,
    name: "Nerves",
    function: "Carry signals between the brain, spinal cord, and the rest of the body.",
    nutrients: ["B vitamins", "Vitamin B12", "Omega-3 fats"],
    explanation: "B vitamins including B12 support normal energy metabolism and nervous-system function.",
    foods: ["whole-egg", "salmon", "milk", "oats"],
    target: [160, 98],
    badge: [26, 129],
    color: "#0d9488",
  },
  {
    id: 16,
    name: "Blood",
    function: "Transports oxygen, nutrients, hormones, and waste products around the body.",
    nutrients: ["Iron", "Folate", "Vitamin B12"],
    explanation: "Iron, folate, and vitamin B12 are involved in normal red blood cell formation. Needs vary by person.",
    foods: ["red-lentils", "spinach", "salmon", "whole-egg"],
    target: [212, 172],
    badge: [294, 192],
    color: "#dc2626",
  },
];

export function BodyGuide({ foods }: { foods: GuideFood[] }) {
  const [selectedId, setSelectedId] = useState(1);
  const [query, setQuery] = useState("");
  const [dietFilter, setDietFilter] = useState<"all" | "vegetarian" | "non-vegetarian">("all");
  const selected = BODY_PARTS.find((part) => part.id === selectedId) ?? BODY_PARTS[0];
  const foodsBySlug = useMemo(() => new Map(foods.map((food) => [food.slug, food])), [foods]);
  const filteredParts = BODY_PARTS.filter((part) => part.name.toLowerCase().includes(query.trim().toLowerCase()));
  const recommendedFoods = selected.foods.map((slug) => foodsBySlug.get(slug)).filter((food): food is GuideFood => Boolean(food))
    .filter((food) => dietFilter === "all" || (dietFilter === "vegetarian" ? ["vegan", "vegetarian", "eggetarian"].includes(food.dietaryType) : ["non-vegetarian", "seafood"].includes(food.dietaryType)));

  const markerLabel = (part: BodyPart) => `${part.id}. ${part.name}`;

  return (
    <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-7 px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-800 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-200">
            <Brain className="h-3.5 w-3.5" /> Explore human biology
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">The body &amp; nutrition guide</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Select a numbered body area to explore its everyday function and nutrients found in a balanced diet. This is general nutrition education, not medical advice.</p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section aria-label="Interactive body illustration" className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="font-black text-slate-900 dark:text-white tracking-tight">Interactive body map</h2>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                Tap organ or number
              </span>
            </div>

            <div className="mx-auto mt-4 max-w-[340px]">
              <svg
                viewBox="0 0 320 540"
                role="group"
                aria-label="Educational human body diagram with clickable numbered hotspots"
                className="h-auto w-full overflow-visible select-none"
              >
                <defs>
                  <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
                  </filter>
                  <filter id="figureShadow" x="-15%" y="-5%" width="130%" height="112%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
                  </filter>
                </defs>

                {/* Generated anatomical illustration */}
                <image
                  href="/body-anatomy.webp"
                  x="75.6"
                  y="12"
                  width="168.8"
                  height="516"
                  preserveAspectRatio="xMidYMid meet"
                  filter="url(#figureShadow)"
                />

                {/* 16 Anatomically Positioned Pins & Clean Leader Lines */}
                {BODY_PARTS.map((part) => {
                  const isSelected = selectedId === part.id;
                  const [tx, ty] = part.target;
                  const [bx, by] = part.badge;

                  return (
                    <g
                      key={part.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${markerLabel(part)}`}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedId(part.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedId(part.id);
                        }
                      }}
                      className="cursor-pointer group/pin outline-none"
                    >
                      {/* Accurate Leader Line connecting exact organ location to callout */}
                      <line
                        x1={tx}
                        y1={ty}
                        x2={bx}
                        y2={by}
                        stroke={isSelected ? part.color : "#94a3b8"}
                        strokeWidth={isSelected ? 2 : 1.4}
                        strokeDasharray={isSelected ? "none" : "3 3"}
                        opacity={isSelected ? 1 : 0.65}
                        className="transition-all duration-200"
                      />

                      {/* Organ Anchor Hotspot (Directly on Anatomical Target) */}
                      {isSelected && (
                        <circle
                          cx={tx}
                          cy={ty}
                          r={10}
                          fill={part.color}
                          opacity={0.3}
                          className="animate-pulse"
                        />
                      )}
                      <circle
                        cx={tx}
                        cy={ty}
                        r={isSelected ? 5.5 : 4}
                        fill={part.color}
                        stroke="white"
                        strokeWidth={1.8}
                        className="transition-transform group-hover/pin:scale-125"
                      />

                      {/* Clickable enlarged hotspot zone on the organ itself */}
                      <circle cx={tx} cy={ty} r={14} fill="transparent" />

                      {/* Callout Badge on Margin */}
                      {isSelected && (
                        <circle
                          cx={bx}
                          cy={by}
                          r={17}
                          fill={part.color}
                          opacity={0.25}
                        />
                      )}
                      <circle
                        cx={bx}
                        cy={by}
                        r={isSelected ? 14.5 : 12.5}
                        fill={part.color}
                        stroke="white"
                        strokeWidth={2.5}
                        filter="url(#softGlow)"
                        className="transition-all duration-200 group-hover/pin:scale-110"
                      />
                      <text
                        x={bx}
                        y={by + 4}
                        textAnchor="middle"
                        fill="white"
                        fontSize={part.id >= 10 ? "9.5" : "10.5"}
                        fontWeight="900"
                        pointerEvents="none"
                      >
                        {part.id}
                      </text>

                      {/* Clickable enlarged zone on the callout badge */}
                      <circle cx={bx} cy={by} r={18} fill="transparent" />
                    </g>
                  );
                })}
              </svg>
            </div>

            <p className="mt-3 text-center text-[11px] text-slate-400 dark:text-slate-500">
              Illustration is a simplified educational silhouette; private and reproductive anatomy is omitted.
            </p>
          </section>

          <section aria-live="polite" className="space-y-4">
            <article className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <div className="flex items-start gap-4">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black text-white shadow-md"
                  style={{ backgroundColor: selected.color }}
                >
                  {selected.id}
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Body part
                  </p>
                  <h2 className="mt-0.5 text-2xl font-black text-slate-900 dark:text-white">
                    {selected.name}
                  </h2>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Main function
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  {selected.function}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Relevant nutrients
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.nutrients.map((nutrient) => (
                    <span
                      key={nutrient}
                      className="rounded-full border border-brand-200/80 bg-brand-50/80 px-3 py-1.5 text-xs font-bold text-brand-800 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-200"
                    >
                      {nutrient}
                    </span>
                  ))}
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {selected.explanation}
                </p>
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white">Foods to explore</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Examples of foods containing relevant nutrients.
                  </p>
                </div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  Food options
                  <select
                    value={dietFilter}
                    onChange={(event) => setDietFilter(event.target.value as typeof dietFilter)}
                    className="ml-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 font-semibold"
                  >
                    <option value="all">All options</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-vegetarian</option>
                  </select>
                </label>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Recommendations show food examples, not treatments. Nutrient amounts vary by food and serving.
              </p>

              {recommendedFoods.length ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {recommendedFoods.map((food) => (
                    <Link
                      key={food.slug}
                      href={`/food/${food.slug}`}
                      className="group flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 p-2.5 transition hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-slate-800 dark:hover:border-emerald-800 dark:hover:bg-slate-800/80 shadow-sm"
                    >
                      <span
                        aria-hidden="true"
                        className="h-14 w-14 shrink-0 rounded-xl bg-cover bg-center bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700"
                        style={{ backgroundImage: `url("${food.imageUrl}")` }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-slate-800 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-300">
                          {food.name}
                        </span>
                        <span className="mt-1 block text-[10px] capitalize text-slate-400">
                          {food.dietaryType.replace("-", " ")}
                        </span>
                      </span>
                      <span aria-hidden="true" className="text-slate-300 group-hover:text-emerald-600 font-bold pr-1">
                        ↗
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-500 dark:bg-slate-800">
                  No matching catalog examples in this filter. Try all options.
                </p>
              )}
              <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Links open NutriBase food detail pages.
              </div>
            </article>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Browse body parts</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Search or choose any body area to open its guide.</p>
            </div>
            <label className="relative block sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                aria-label="Search body parts"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search body parts..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </label>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {filteredParts.map((part) => (
              <button
                key={part.id}
                type="button"
                onClick={() => setSelectedId(part.id)}
                aria-pressed={selectedId === part.id}
                className={`flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition ${
                  selectedId === part.id
                    ? "border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200 shadow-sm"
                    : "border-slate-200 text-slate-600 hover:border-emerald-300 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black text-white shadow-sm"
                  style={{ backgroundColor: part.color }}
                >
                  {part.id}
                </span>
                <span className="truncate">{part.name}</span>
              </button>
            ))}
          </div>
          {filteredParts.length === 0 && (
            <p className="mt-4 text-center text-sm text-slate-500">No body parts match this search.</p>
          )}
        </section>
      </div>
    </div>
  );
}
