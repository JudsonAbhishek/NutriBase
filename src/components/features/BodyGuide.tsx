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
  point: [number, number];
  color: string;
};

const BODY_PARTS: BodyPart[] = [
  { id: 1, name: "Brain", function: "Coordinates thinking, memory, movement, and many automatic body processes.", nutrients: ["Omega-3 fats", "B vitamins", "Choline"], explanation: "These nutrients have roles in normal nervous-system structure and energy metabolism.", foods: ["salmon", "whole-egg", "walnuts", "oats"], point: [161, 30], color: "#8b5cf6" },
  { id: 2, name: "Eyes", function: "Detect light and send visual information to the brain.", nutrients: ["Vitamin A", "Lutein", "Zeaxanthin"], explanation: "Vitamin A supports normal vision; leafy greens supply carotenoids including lutein.", foods: ["carrot", "spinach", "whole-egg"], point: [120, 51], color: "#0ea5e9" },
  { id: 3, name: "Ears", function: "Support hearing and help the body sense balance.", nutrients: ["Omega-3 fats", "Zinc", "Vitamin B12"], explanation: "A varied diet provides nutrients that contribute to normal cell and nerve function.", foods: ["salmon", "oats", "milk"], point: [202, 68], color: "#06b6d4" },
  { id: 4, name: "Nose", function: "Enables smell and helps filter, warm, and humidify inhaled air.", nutrients: ["Vitamin C", "Protein", "Zinc"], explanation: "These nutrients support normal connective tissue, immune function, and cell maintenance.", foods: ["orange", "red-lentils", "curd"], point: [118, 86], color: "#f59e0b" },
  { id: 5, name: "Teeth & mouth", function: "Bite, chew, and begin digestion while helping with speech.", nutrients: ["Calcium", "Phosphorus", "Vitamin C"], explanation: "Calcium and phosphorus are structural minerals in teeth; vitamin C supports collagen formation.", foods: ["milk", "curd", "broccoli"], point: [203, 105], color: "#14b8a6" },
  { id: 6, name: "Heart", function: "Pumps blood around the body through the circulatory system.", nutrients: ["Fiber", "Unsaturated fats", "Potassium"], explanation: "A heart-supportive eating pattern can include fiber-rich plants and sources of unsaturated fats.", foods: ["oats", "almonds", "spinach", "salmon"], point: [142, 133], color: "#ef4444" },
  { id: 7, name: "Lungs", function: "Exchange oxygen and carbon dioxide with the air we breathe.", nutrients: ["Vitamin C", "Protein", "Antioxidant-rich plant foods"], explanation: "A varied pattern of fruits, vegetables, and protein foods supplies nutrients for normal tissue maintenance.", foods: ["orange", "broccoli", "red-lentils"], point: [205, 145], color: "#38bdf8" },
  { id: 8, name: "Liver", function: "Processes nutrients, produces bile, and supports many metabolic functions.", nutrients: ["Protein", "Choline", "Fiber"], explanation: "Adequate protein and choline support normal metabolism; fiber comes from plant foods.", foods: ["whole-egg", "red-lentils", "oats"], point: [115, 169], color: "#a855f7" },
  { id: 9, name: "Stomach", function: "Mixes food with digestive juices and gradually passes it onward.", nutrients: ["Protein", "Fiber", "Fluids"], explanation: "Balanced meals with fluids and fiber-containing foods support everyday digestive function.", foods: ["curd", "oats", "red-lentils"], point: [210, 183], color: "#f97316" },
  { id: 10, name: "Intestines", function: "Continue digestion, absorb nutrients, and move waste through the body.", nutrients: ["Fiber", "Fluids", "Fermented foods"], explanation: "Fiber-rich foods and adequate fluids help support regular bowel function; fermented foods can be part of a varied diet.", foods: ["red-lentils", "oats", "curd", "broccoli"], point: [139, 213], color: "#22c55e" },
  { id: 11, name: "Kidneys", function: "Filter blood, balance body fluids and electrolytes, and produce urine.", nutrients: ["Fluids", "Potassium", "Protein"], explanation: "Water is essential for normal body functions. Individual fluid and nutrient needs vary, especially with health conditions.", foods: ["milk", "spinach", "orange"], point: [210, 207], color: "#ec4899" },
  { id: 12, name: "Bones", function: "Provide structure, protect organs, and work with muscles to enable movement.", nutrients: ["Calcium", "Vitamin D", "Protein"], explanation: "Calcium, vitamin D, and protein each play roles in maintaining normal bones.", foods: ["milk", "curd", "paneer", "broccoli"], point: [112, 271], color: "#6366f1" },
  { id: 13, name: "Muscles", function: "Enable movement, maintain posture, and help produce heat.", nutrients: ["Protein", "Carbohydrate", "Potassium"], explanation: "Protein contributes to muscle maintenance; carbohydrate and other nutrients support a balanced diet and activity.", foods: ["red-lentils", "paneer", "whole-egg", "salmon"], point: [211, 297], color: "#f43f5e" },
  { id: 14, name: "Skin", function: "Forms a protective barrier and helps regulate body temperature.", nutrients: ["Vitamin C", "Vitamin E", "Protein"], explanation: "Vitamin C supports collagen formation; vitamin E is an antioxidant nutrient. No single food treats skin conditions.", foods: ["orange", "almonds", "spinach"], point: [112, 331], color: "#eab308" },
  { id: 15, name: "Nerves", function: "Carry signals between the brain, spinal cord, and the rest of the body.", nutrients: ["B vitamins", "Vitamin B12", "Omega-3 fats"], explanation: "B vitamins including B12 support normal energy metabolism and nervous-system function.", foods: ["whole-egg", "salmon", "milk", "oats"], point: [209, 116], color: "#0d9488" },
  { id: 16, name: "Blood", function: "Transports oxygen, nutrients, hormones, and waste products around the body.", nutrients: ["Iron", "Folate", "Vitamin B12"], explanation: "Iron, folate, and vitamin B12 are involved in normal red blood cell formation. Needs vary by person.", foods: ["red-lentils", "spinach", "salmon", "whole-egg"], point: [112, 192], color: "#dc2626" },
];

const BODY_SHAPE = "M160 14c-18 0-30 15-30 34 0 17 9 30 19 35v12c-7 7-18 10-32 13-12 3-20 12-23 28l-13 82c-2 12 3 20 12 22 8 2 15-4 17-15l14-66 9 5-12 89-12 105c-1 11 5 18 14 19 10 1 16-5 18-15l18-91 18 91c2 10 8 16 18 15 9-1 15-8 14-19l-12-105-12-89 9-5 14 66c2 11 9 17 17 15 9-2 14-10 12-22l-13-82c-3-16-11-25-23-28-14-3-25-6-32-13V83c10-5 19-18 19-35 0-19-12-34-30-34Z";

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
  const getMarkerLabelPosition = (point: [number, number]) => {
    const [x, y] = point;
    const offsetX = x < 160 ? -28 : 28;
    const offsetY = y > 250 ? 20 : y < 120 ? -20 : 0;

    return {
      outerX: x + offsetX,
      outerY: y + offsetY,
      lineX: x + offsetX * 0.55,
      lineY: y + offsetY * 0.55,
    };
  };

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

        <div className="grid items-start gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <section aria-label="Interactive body illustration" className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
            <div className="flex items-center justify-between"><h2 className="font-black text-slate-900 dark:text-white">Interactive body map</h2><span className="text-[10px] text-slate-400">Tap a number</span></div>
            <div className="mx-auto mt-3 max-w-md">
              <svg viewBox="0 0 320 380" role="group" aria-label="Educational human body diagram with clickable numbered hotspots" className="h-auto w-full overflow-visible">
                <defs>
                  <linearGradient id="bodyFill" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="#dbeafe" /><stop offset="100%" stopColor="#c7d2fe" /></linearGradient>
                </defs>
                <path d={BODY_SHAPE} fill="url(#bodyFill)" stroke="#94a3b8" strokeWidth="2" />
                <path d="M160 98v220M126 132h68M139 200h42M142 236h36" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
                <path d="M145 125c-14 9-14 27 0 34 11 5 17-4 15-12-2-9-8-16-15-22ZM174 125c14 9 14 27 0 34-11 5-17-4-15-12 2-9 8-16 15-22Z" fill="#fb7185" opacity=".7" />
                {BODY_PARTS.map((part) => {
                  const labelPosition = getMarkerLabelPosition(part.point);
                  const isSelected = selectedId === part.id;

                  return (
                    <g key={part.id} role="button" tabIndex={0} aria-label={`Select ${markerLabel(part)}`} aria-pressed={isSelected} onClick={() => setSelectedId(part.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedId(part.id); } }} className="cursor-pointer outline-none">
                      <line x1={part.point[0]} y1={part.point[1]} x2={labelPosition.lineX} y2={labelPosition.lineY} stroke="#4b5563" strokeWidth="1.6" strokeDasharray="4 5" opacity="0.9" />
                      <circle cx={part.point[0]} cy={part.point[1]} r="4" fill={part.color} opacity="0.9" />
                      <circle cx={labelPosition.outerX} cy={labelPosition.outerY} r={isSelected ? 16 : 13} fill={part.color} stroke="white" strokeWidth="3" className="transition-all" />
                      <text x={labelPosition.outerX} y={labelPosition.outerY + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="800" pointerEvents="none">{part.id}</text>
                      <circle cx={part.point[0]} cy={part.point[1]} r="19" fill="transparent" />
                    </g>
                  );
                })}
              </svg>
            </div>
            <p className="text-center text-[11px] text-slate-400">Illustration is a simplified, non-sexual educational silhouette; private and reproductive anatomy is omitted.</p>
          </section>

          <section aria-live="polite" className="space-y-4">
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-7">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black text-white" style={{ backgroundColor: selected.color }}>{selected.id}</span>
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Body part</p><h2 className="mt-0.5 text-2xl font-black text-slate-900 dark:text-white">{selected.name}</h2></div>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800"><h3 className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Main function</h3><p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{selected.function}</p></div>
              <div className="mt-4"><h3 className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Relevant nutrients</h3><div className="mt-2 flex flex-wrap gap-2">{selected.nutrients.map((nutrient) => <span key={nutrient} className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800 dark:border-brand-900 dark:bg-brand-950/50 dark:text-brand-200">{nutrient}</span>)}</div><p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{selected.explanation}</p></div>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div><h3 className="font-black text-slate-900 dark:text-white">Foods to explore</h3><p className="text-[11px] text-slate-500">Examples of foods containing relevant nutrients.</p></div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Food options<select value={dietFilter} onChange={(event) => setDietFilter(event.target.value as typeof dietFilter)} className="ml-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"><option value="all">All options</option><option value="vegetarian">Vegetarian</option><option value="non-vegetarian">Non-vegetarian</option></select></label>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">Recommendations show food examples, not treatments. Nutrient amounts vary by food and serving.</p>
              {recommendedFoods.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{recommendedFoods.map((food) => <Link key={food.slug} href={`/food/${food.slug}`} className="group flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 p-2.5 transition hover:border-brand-200 hover:bg-brand-50/50 dark:border-slate-800 dark:hover:border-brand-900 dark:hover:bg-slate-800">
                <span aria-hidden="true" className="h-14 w-14 shrink-0 rounded-xl bg-cover bg-center bg-slate-100 dark:bg-slate-800" style={{ backgroundImage: `url("${food.imageUrl}")` }} />
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-slate-800 group-hover:text-brand-700 dark:text-slate-100 dark:group-hover:text-brand-300">{food.name}</span><span className="mt-1 block text-[10px] capitalize text-slate-400">{food.dietaryType.replace("-", " ")}</span></span>
                <span aria-hidden="true" className="text-slate-300 group-hover:text-brand-600">↗</span>
              </Link>)}</div> : <p className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-500 dark:bg-slate-800">No matching catalog examples in this filter. Try all options.</p>}
              <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400"><ShieldCheck className="h-3.5 w-3.5" />Links open NutriBase food detail pages.</div>
            </article>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div><h2 className="text-lg font-black text-slate-900 dark:text-white">Browse body parts</h2><p className="text-xs text-slate-500">Search or choose any body area to open its guide.</p></div>
            <label className="relative block sm:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input aria-label="Search body parts" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search body parts..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-800" /></label>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">{filteredParts.map((part) => <button key={part.id} type="button" onClick={() => setSelectedId(part.id)} aria-pressed={selectedId === part.id} className={`flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition ${selectedId === part.id ? "border-brand-300 bg-brand-50 text-brand-800 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-200" : "border-slate-200 text-slate-600 hover:border-brand-200 dark:border-slate-700 dark:text-slate-300"}`}><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black text-white" style={{ backgroundColor: part.color }}>{part.id}</span><span className="truncate">{part.name}</span></button>)}</div>
          {filteredParts.length === 0 && <p className="mt-4 text-center text-sm text-slate-500">No body parts match this search.</p>}
        </section>
      </div>
    </div>
  );
}
