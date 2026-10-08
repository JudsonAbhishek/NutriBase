import React from "react";
import Link from "next/link";
import { 
  Calculator, 
  Scale, 
  Flame, 
  PieChart, 
  UtensilsCrossed, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function CalculatorsHubPage() {
  const calculators = [
    {
      title: "BMI Calculator",
      slug: "/calculators/bmi",
      icon: Scale,
      color: "from-blue-500 to-indigo-600",
      description: "Determine your Body Mass Index, health category, BMI Prime, and ideal healthy weight range.",
      features: ["Metric & Imperial units", "WHO category classification", "Healthy weight range estimation"],
    },
    {
      title: "Daily Calorie & BMR Calculator",
      slug: "/calculators/calories",
      icon: Flame,
      color: "from-rose-500 to-amber-600",
      description: "Calculate your Basal Metabolic Rate and Total Daily Energy Expenditure (TDEE) using the clinical Mifflin-St Jeor formula.",
      features: ["5 Activity levels", "Deficit & surplus goals", "Exact daily maintenance targets"],
    },
    {
      title: "Macro Split Calculator",
      slug: "/calculators/macros",
      icon: PieChart,
      color: "from-emerald-500 to-teal-600",
      description: "Obtain personalized daily gram targets for Protein, Carbohydrates, Healthy Fats, and Dietary Fiber.",
      features: ["Weight loss, Muscle gain & Maintenance splits", "Fiber requirement per 1000 kcal", "Interactive donut chart"],
    },
    {
      title: "Composite Meal Nutrition Calculator",
      slug: "/calculators/meal-nutrition",
      icon: UtensilsCrossed,
      color: "from-purple-500 to-pink-600",
      description: "Combine multiple foods with custom gram weights to calculate the aggregate nutrition of an entire meal.",
      features: ["Multi-ingredient combining", "Total calories & macros", "Complete micronutrient tally"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Clinical Nutrition Calculators</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Scientific Dietary & Health Calculators
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Evidence-based biometric calculations powered by internationally recognized equations (Mifflin-St Jeor, WHO BMI cutoffs, and ICMR daily reference intakes).
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <div
                key={calc.slug}
                className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-300 transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${calc.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {calc.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {calc.description}
                    </p>
                  </div>
                  <ul className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    {calc.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-brand-500 font-bold">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={calc.slug}
                  className="w-full py-3 rounded-xl bg-slate-50 hover:bg-brand-600 hover:text-white border border-slate-200 hover:border-brand-600 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Launch Calculator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="bg-slate-100/80 rounded-2xl p-4 text-center text-xs text-slate-500 max-w-2xl mx-auto flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span>Notice: All calculator calculations are intended for general nutritional guidance and wellness tracking.</span>
        </div>

      </div>
    </div>
  );
}
