"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, AlertTriangle, Zap, Leaf, ShieldAlert } from "lucide-react";

interface VitaminRow {
  letter: string;
  name: string;
  aliases: string;
  solubility: "fat" | "water";
  majorFunctions: string;
  deficiencyEffects: string;
  toxicityEffects: string;
  foodSources: string;
  color: string;
}

const VITAMINS: VitaminRow[] = [
  {
    letter: "A",
    name: "Vitamin A",
    aliases: "Retinol, Retinal, Retinoic acid, Beta-carotene",
    solubility: "fat",
    majorFunctions: "Vision, immunity, reproduction and growth",
    deficiencyEffects: "Night blindness, increased infections, stunted growth",
    toxicityEffects: "Bone fractures, liver damage, birth defects",
    foodSources: "Fortified milk, eggs, liver, dark green leafy & yellow/orange vegetables",
    color: "amber",
  },
  {
    letter: "D",
    name: "Vitamin D",
    aliases: "Cholecalciferol (D3), Ergocalciferol (D2)",
    solubility: "fat",
    majorFunctions: "Bone growth and maintenance, calcium absorption",
    deficiencyEffects: "Rickets (children), osteomalacia (adults), weakened immunity",
    toxicityEffects: "Hypercalcemia, calcium imbalance, kidney stones",
    foodSources: "Sunlight exposure, fortified milk, fatty fish, eggs, liver",
    color: "yellow",
  },
  {
    letter: "E",
    name: "Vitamin E",
    aliases: "Tocopherol",
    solubility: "fat",
    majorFunctions: "Antioxidant — protects cell membranes from oxidative damage",
    deficiencyEffects: "Red blood cell breakage (hemolysis), nerve damage",
    toxicityEffects: "Interferes with vitamin K & blood-clotting drugs",
    foodSources: "Vegetable & seed/nut oils, seeds, nuts, wheat germ, whole grains",
    color: "green",
  },
  {
    letter: "K",
    name: "Vitamin K",
    aliases: "Phylloquinone (K1), Menaquinone (K2)",
    solubility: "fat",
    majorFunctions: "Blood clotting, bone health, calcium regulation",
    deficiencyEffects: "Excessive bleeding, hemorrhage",
    toxicityEffects: "None reported at dietary levels",
    foodSources: "Dark leafy greens (spinach, kale), cabbage family, liver",
    color: "teal",
  },
  {
    letter: "B1",
    name: "Vitamin B1",
    aliases: "Thiamine",
    solubility: "water",
    majorFunctions: "Energy metabolism — converts glucose to usable energy",
    deficiencyEffects: "Beriberi (wet/dry), neurological problems, Wernicke's encephalopathy",
    toxicityEffects: "None reported — excess excreted in urine",
    foodSources: "Whole & enriched grain products, leafy greens, pork, legumes",
    color: "orange",
  },
  {
    letter: "B2",
    name: "Vitamin B2",
    aliases: "Riboflavin",
    solubility: "water",
    majorFunctions: "Energy metabolism, mitochondrial function, antioxidant support",
    deficiencyEffects: "Inflammation of mouth & skin (ariboflavinosis), sore throat",
    toxicityEffects: "None reported — excess excreted in urine",
    foodSources: "Whole & enriched grain products, milk products, eggs, organ meats",
    color: "yellow",
  },
  {
    letter: "B3",
    name: "Vitamin B3",
    aliases: "Niacin, Niacinamide, Nicotinic acid",
    solubility: "water",
    majorFunctions: "Energy metabolism, DNA repair, cholesterol management",
    deficiencyEffects: "Pellagra (3 Ds: Dermatitis, Diarrhea, Dementia)",
    toxicityEffects: "Niacin flush, liver damage (high supplemental doses), impaired glucose tolerance",
    foodSources: "Whole & enriched grain products, protein-rich foods (meat, fish, legumes)",
    color: "red",
  },
  {
    letter: "B5",
    name: "Vitamin B5",
    aliases: "Pantothenic acid",
    solubility: "water",
    majorFunctions: "Protein, fat and carbohydrate metabolism; synthesis of coenzyme A",
    deficiencyEffects: "Extremely rare — fatigue, numbness, irritability",
    toxicityEffects: "Mild intestinal distress at very high doses",
    foodSources: "Almost all foods; especially avocados, broccoli, meats, mushrooms, dairy",
    color: "pink",
  },
  {
    letter: "B6",
    name: "Vitamin B6",
    aliases: "Pyridoxine, Pyridoxal, Pyridoxamine",
    solubility: "water",
    majorFunctions: "Protein & fat metabolism, neurotransmitter synthesis, immune function",
    deficiencyEffects: "Scaly dermatitis, microcytic anemia, convulsions, depression",
    toxicityEffects: "Peripheral nerve degeneration (high supplemental doses)",
    foodSources: "Protein-rich foods (poultry, fish), bananas, potatoes, chickpeas",
    color: "purple",
  },
  {
    letter: "B7",
    name: "Vitamin B7",
    aliases: "Biotin",
    solubility: "water",
    majorFunctions: "Protein, fat and carbohydrate metabolism; hair, skin and nail health",
    deficiencyEffects: "Extremely rare — hair thinning, scaly rash, fatigue, depression",
    toxicityEffects: "Unlikely — excess excreted; may interfere with lab tests",
    foodSources: "Egg yolk, liver, peanuts; also produced by gut bacteria",
    color: "rose",
  },
  {
    letter: "B9",
    name: "Vitamin B9",
    aliases: "Folate, Folic acid, Folacin",
    solubility: "water",
    majorFunctions: "DNA synthesis for new cells, red blood cell formation, activates B12",
    deficiencyEffects: "Megaloblastic anemia, neural tube defects in pregnancy",
    toxicityEffects: "Can mask a vitamin B12 deficiency (high doses)",
    foodSources: "Fortified grain products, dark leafy greens, legumes, asparagus, liver",
    color: "lime",
  },
  {
    letter: "B12",
    name: "Vitamin B12",
    aliases: "Cobalamin, Cyanocobalamin",
    solubility: "water",
    majorFunctions: "DNA synthesis for new cells, nerve cell protection, activates folate",
    deficiencyEffects: "Megaloblastic anemia, irreversible nerve damage and paralysis",
    toxicityEffects: "None reported — excess excreted in urine",
    foodSources: "Meat, fish, poultry, eggs, dairy products (animal-derived only)",
    color: "cyan",
  },
  {
    letter: "C",
    name: "Vitamin C",
    aliases: "Ascorbic acid, L-ascorbate",
    solubility: "water",
    majorFunctions: "Antioxidant, collagen synthesis, iron absorption, immune function",
    deficiencyEffects: "Scurvy (bleeding gums, poor wound healing, joint pain)",
    toxicityEffects: "Diarrhea, kidney stones at very high doses",
    foodSources: "Citrus fruits, strawberries, kiwi, guava, bell peppers, broccoli",
    color: "orange",
  },
];

const COLOR_MAP: Record<
  string,
  { bg: string; border: string; badge: string; text: string; darkText: string }
> = {
  amber:  { bg: "bg-amber-50",  border: "border-amber-100",  badge: "bg-amber-500",  text: "text-amber-700",  darkText: "dark:text-amber-300" },
  yellow: { bg: "bg-yellow-50", border: "border-yellow-100", badge: "bg-yellow-500", text: "text-yellow-700", darkText: "dark:text-yellow-200" },
  green:  { bg: "bg-green-50",  border: "border-green-100",  badge: "bg-green-500",  text: "text-green-700",  darkText: "dark:text-green-300" },
  teal:   { bg: "bg-teal-50",   border: "border-teal-100",   badge: "bg-teal-500",   text: "text-teal-700",   darkText: "dark:text-teal-300" },
  orange: { bg: "bg-orange-50", border: "border-orange-100", badge: "bg-orange-500", text: "text-orange-700", darkText: "dark:text-orange-300" },
  red:    { bg: "bg-red-50",    border: "border-red-100",    badge: "bg-red-500",    text: "text-red-700",    darkText: "dark:text-red-300" },
  pink:   { bg: "bg-pink-50",   border: "border-pink-100",   badge: "bg-pink-500",   text: "text-pink-700",   darkText: "dark:text-pink-300" },
  purple: { bg: "bg-purple-50", border: "border-purple-100", badge: "bg-purple-500", text: "text-purple-700", darkText: "dark:text-purple-300" },
  rose:   { bg: "bg-rose-50",   border: "border-rose-100",   badge: "bg-rose-500",   text: "text-rose-700",   darkText: "dark:text-rose-300" },
  lime:   { bg: "bg-lime-50",   border: "border-lime-100",   badge: "bg-lime-500",   text: "text-lime-700",   darkText: "dark:text-lime-300" },
  cyan:   { bg: "bg-cyan-50",   border: "border-cyan-100",   badge: "bg-cyan-500",   text: "text-cyan-700",   darkText: "dark:text-cyan-300" },
};

function VitaminCard({ vitamin }: { vitamin: VitaminRow }) {
  const [expanded, setExpanded] = useState(false);
  const c = COLOR_MAP[vitamin.color] ?? COLOR_MAP["teal"];

  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} overflow-hidden transition-all duration-200 dark:border-slate-700 dark:bg-slate-800`}>
      {/* Header row */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 p-3.5 text-left focus:outline-none"
        aria-expanded={expanded}
      >
        {/* Letter badge */}
        <div
          className={`w-9 h-9 flex-shrink-0 ${c.badge} text-white rounded-xl flex items-center justify-center text-sm font-black shadow-sm`}
        >
          {vitamin.letter}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-extrabold ${c.text} ${c.darkText}`}>{vitamin.name}</span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide border ${
                vitamin.solubility === "fat"
                  ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800"
                  : "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-800"
              }`}
            >
              {vitamin.solubility === "fat" ? "Fat-soluble" : "Water-soluble"}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 truncate">{vitamin.aliases}</p>
          {!expanded && (
            <p className="text-[10px] text-slate-600 mt-0.5 truncate font-medium">
              {vitamin.majorFunctions}
            </p>
          )}
        </div>

        <div className="flex-shrink-0 text-slate-400">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/60 dark:border-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            {/* Functions */}
            <div className="bg-white/70 rounded-xl p-3 border border-white dark:bg-slate-900 dark:border-slate-700">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3.5 h-3.5 text-brand-600" />
                <span className="text-[10px] font-black text-brand-700 uppercase tracking-wider dark:text-brand-300">
                  Major Functions
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{vitamin.majorFunctions}</p>
            </div>

            {/* Food Sources */}
            <div className="bg-white/70 rounded-xl p-3 border border-white dark:bg-slate-900 dark:border-slate-700">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider dark:text-emerald-300">
                  Food Sources
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{vitamin.foodSources}</p>
            </div>

            {/* Deficiency */}
            <div className="bg-white/70 rounded-xl p-3 border border-white dark:bg-slate-900 dark:border-slate-700">
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider dark:text-orange-300">
                  Deficiency Effects
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{vitamin.deficiencyEffects}</p>
            </div>

            {/* Toxicity */}
            <div className="bg-white/70 rounded-xl p-3 border border-white dark:bg-slate-900 dark:border-slate-700">
              <div className="flex items-center gap-1.5 mb-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider dark:text-rose-300">
                  Toxicity / Excess Effects
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{vitamin.toxicityEffects}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function VitaminsReferenceTable() {
  const [open, setOpen] = useState(false);

  const fatSoluble = VITAMINS.filter((v) => v.solubility === "fat");
  const waterSoluble = VITAMINS.filter((v) => v.solubility === "water");

  return (
    <div className="mt-6">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-brand-50 to-violet-50 border border-brand-100 rounded-2xl hover:from-brand-100 hover:to-violet-100 transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700 dark:hover:from-slate-800 dark:hover:to-slate-700"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-brand-200 shadow-sm flex items-center justify-center dark:bg-slate-950 dark:border-slate-700">
            <BookOpen className="w-4.5 h-4.5 text-brand-600" />
          </div>
          <div className="text-left">
            <span className="block text-sm font-extrabold text-slate-900">
              Vitamin Reference Guide
            </span>
            <span className="text-[11px] text-slate-500">
              13 vitamins · Functions, deficiency, toxicity & food sources
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full hidden sm:inline dark:text-brand-300">
            {open ? "Collapse" : "Expand"}
          </span>
          {open ? (
            <ChevronUp className="w-5 h-5 text-brand-600 group-hover:scale-110 transition-transform" />
          ) : (
            <ChevronDown className="w-5 h-5 text-brand-600 group-hover:scale-110 transition-transform" />
          )}
        </div>
      </button>

      {/* Table content */}
      {open && (
        <div className="mt-4 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Disclaimer */}
          <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>
              This reference table is for general educational purposes only. It is not a substitute
              for medical advice. Consult a registered dietitian or physician for personalized recommendations.
            </span>
          </div>

          {/* Fat-soluble vitamins */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-amber-200 dark:bg-amber-800" />
              <span className="text-[11px] font-black text-amber-700 uppercase tracking-widest px-3 py-1 bg-amber-50 border border-amber-200 rounded-full dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800">
                Fat-Soluble Vitamins (A, D, E, K)
              </span>
              <div className="h-px flex-1 bg-amber-200 dark:bg-amber-800" />
            </div>
            <div className="space-y-2.5">
              {fatSoluble.map((v) => (
                <VitaminCard key={v.letter} vitamin={v} />
              ))}
            </div>
          </div>

          {/* Water-soluble vitamins */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-blue-200 dark:bg-blue-800" />
              <span className="text-[11px] font-black text-blue-700 uppercase tracking-widest px-3 py-1 bg-blue-50 border border-blue-200 rounded-full dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-800">
                Water-Soluble Vitamins (B-complex, C)
              </span>
              <div className="h-px flex-1 bg-blue-200 dark:bg-blue-800" />
            </div>
            <div className="space-y-2.5">
              {waterSoluble.map((v) => (
                <VitaminCard key={v.letter} vitamin={v} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
