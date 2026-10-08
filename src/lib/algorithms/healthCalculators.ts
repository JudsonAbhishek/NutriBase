import { 
  ActivityLevel, 
  BMICalculationResult, 
  CalorieCalculationResult, 
  HealthGoal, 
  Macronutrients, 
  Minerals, 
  Vitamins 
} from "@/types/nutrition";

/**
 * Standard Daily Values (FDA / ICMR references)
 */
export const DAILY_VALUES = {
  calories: 2000,
  protein_g: 50,
  carbs_g: 275,
  fat_g: 78,
  fiber_g: 28,
  sugar_g: 50, // max added
  vitaminA_mcg: 900,
  vitaminB1_mg: 1.2,
  vitaminB2_mg: 1.3,
  vitaminB3_mg: 16,
  vitaminB6_mg: 1.7,
  vitaminB9_mcg: 400,
  vitaminB12_mcg: 2.4,
  vitaminC_mg: 90,
  vitaminD_iu: 800,
  vitaminE_mg: 15,
  vitaminK_mcg: 120,
  calcium_mg: 1300,
  iron_mg: 18,
  magnesium_mg: 420,
  phosphorus_mg: 1250,
  potassium_mg: 4700,
  sodium_mg: 2300,
  zinc_mg: 11,
  copper_mg: 0.9,
  manganese_mg: 2.3,
};

/**
 * 1. Professional BMI Calculator
 */
export function calculateBMI(
  weightKg: number,
  heightCm: number,
  _age: number = 30,
  _gender: 'male' | 'female' | 'other' = 'male'
): BMICalculationResult {
  if (!weightKg || !heightCm || heightCm <= 0) {
    return {
      bmi: 0,
      category: 'Normal weight',
      categoryColor: '#10b981',
      healthyWeightRangeKg: { min: 50, max: 70 },
      prime: 1.0,
      disclaimer: 'BMI is a general screening indicator and does not differentiate between body fat and lean muscle mass.',
    };
  }

  const heightM = heightCm / 100;
  const bmiRaw = weightKg / (heightM * heightM);
  const bmi = Math.round(bmiRaw * 10) / 10;

  // Healthy weight range corresponds to BMI 18.5 - 24.9
  const minHealthyWeight = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxHealthyWeight = Math.round(24.9 * heightM * heightM * 10) / 10;

  // BMI Prime: Ratio of actual BMI to upper normal limit (25)
  const prime = Math.round((bmi / 25) * 100) / 100;

  let category: BMICalculationResult['category'] = 'Normal weight';
  let categoryColor = '#10b981'; // Emerald

  if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = '#3b82f6'; // Blue
  } else if (bmi <= 24.9) {
    category = 'Normal weight';
    categoryColor = '#10b981'; // Green
  } else if (bmi <= 29.9) {
    category = 'Overweight';
    categoryColor = '#f59e0b'; // Amber
  } else if (bmi <= 34.9) {
    category = 'Obesity Class I';
    categoryColor = '#f97316'; // Orange
  } else if (bmi <= 39.9) {
    category = 'Obesity Class II';
    categoryColor = '#ef4444'; // Red
  } else {
    category = 'Severe Obesity';
    categoryColor = '#991b1b'; // Dark Red
  }

  return {
    bmi,
    category,
    categoryColor,
    healthyWeightRangeKg: { min: minHealthyWeight, max: maxHealthyWeight },
    prime,
    disclaimer: 'Notice: BMI is a clinical screening metric and not an individual diagnostic evaluation. Athletic individuals with high muscle volume may index higher without excess body fat.',
  };
}

/**
 * 2. Basal Metabolic Rate (BMR) & Daily Calorie Calculator
 * Uses the Mifflin-St Jeor equation (clinically accepted gold standard).
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female' | 'other'
): number {
  // Mifflin-St Jeor:
  // Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
  // Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'female') {
    return Math.round(base - 161);
  }
  return Math.round(base + 5);
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,        // Desk job, little to no exercise
  lightly_active: 1.375, // Light exercise 1-3 days/week
  moderately_active: 1.55, // Moderate exercise 3-5 days/week
  very_active: 1.725,    // Heavy exercise 6-7 days/week
  extremely_active: 1.9, // Very strenuous daily physical labor/training
};

export function calculateDailyCalories(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female' | 'other',
  activity: ActivityLevel,
  goal: HealthGoal
): CalorieCalculationResult {
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const multiplier = ACTIVITY_MULTIPLIERS[activity] || 1.55;
  const tdee = Math.round(bmr * multiplier);

  let targetCalories = tdee;
  if (goal === 'weight_loss') {
    // 20% healthy caloric deficit (approx 400-500 kcal)
    targetCalories = Math.max(1200, Math.round(tdee - 500));
  } else if (goal === 'weight_gain' || goal === 'muscle_building') {
    // Moderate lean surplus (+350-400 kcal)
    targetCalories = Math.round(tdee + 350);
  }

  // Calculate tailored Macronutrient splits
  let pRatio = 0.25;
  let cRatio = 0.50;
  let fRatio = 0.25;

  if (goal === 'muscle_building') {
    pRatio = 0.30;
    cRatio = 0.45;
    fRatio = 0.25;
  } else if (goal === 'weight_loss') {
    pRatio = 0.35;
    cRatio = 0.35;
    fRatio = 0.30;
  }

  const proteinCalories = Math.round(targetCalories * pRatio);
  const carbsCalories = Math.round(targetCalories * cRatio);
  const fatCalories = Math.round(targetCalories * fRatio);

  const proteinGrams = Math.round(proteinCalories / 4);
  const carbsGrams = Math.round(carbsCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);
  // Healthy fiber recommendation: 14g per 1000 kcal
  const fiberGrams = Math.max(25, Math.round((targetCalories / 1000) * 14));

  return {
    bmr,
    tdee,
    targetCalories,
    formula: 'Mifflin-St Jeor Clinical Formula',
    macros: {
      proteinGrams,
      proteinCalories,
      proteinPercent: Math.round(pRatio * 100),
      carbsGrams,
      carbsCalories,
      carbsPercent: Math.round(cRatio * 100),
      fatGrams,
      fatCalories,
      fatPercent: Math.round(fRatio * 100),
      fiberGrams,
    },
  };
}

/**
 * 3. Dynamic Serving Size Recalculation Engine
 * Normalizes all food nutrients, vitamins, and minerals to the selected gram weight.
 */
export function scaleNutrients(
  baseNutrients: Macronutrients,
  baseVitamins: Vitamins,
  baseMinerals: Minerals,
  targetGrams: number
) {
  const factor = targetGrams / 100;
  const round1 = (val: number) => Math.round(val * factor * 10) / 10;
  const round2 = (val: number) => Math.round(val * factor * 100) / 100;
  const roundInt = (val: number) => Math.round(val * factor);

  const scaledNutrients: Macronutrients = {
    calories: roundInt(baseNutrients.calories),
    protein: round1(baseNutrients.protein),
    carbohydrates: round1(baseNutrients.carbohydrates),
    fat: round1(baseNutrients.fat),
    fiber: round1(baseNutrients.fiber),
    sugar: round1(baseNutrients.sugar),
    water: round1(baseNutrients.water),
    saturatedFat: baseNutrients.saturatedFat ? round1(baseNutrients.saturatedFat) : undefined,
    netCarbs: Math.max(0, round1(baseNutrients.netCarbs)),
  };

  const scaledVitamins: Vitamins = {
    vitaminA_mcg: round1(baseVitamins.vitaminA_mcg),
    vitaminB1_mg: round2(baseVitamins.vitaminB1_mg),
    vitaminB2_mg: round2(baseVitamins.vitaminB2_mg),
    vitaminB3_mg: round2(baseVitamins.vitaminB3_mg),
    vitaminB6_mg: round2(baseVitamins.vitaminB6_mg),
    vitaminB9_mcg: round1(baseVitamins.vitaminB9_mcg),
    vitaminB12_mcg: round2(baseVitamins.vitaminB12_mcg),
    vitaminC_mg: round1(baseVitamins.vitaminC_mg),
    vitaminD_iu: round1(baseVitamins.vitaminD_iu),
    vitaminE_mg: round2(baseVitamins.vitaminE_mg),
    vitaminK_mcg: round1(baseVitamins.vitaminK_mcg),
  };

  const scaledMinerals: Minerals = {
    calcium_mg: round1(baseMinerals.calcium_mg),
    iron_mg: round2(baseMinerals.iron_mg),
    magnesium_mg: round1(baseMinerals.magnesium_mg),
    phosphorus_mg: round1(baseMinerals.phosphorus_mg),
    potassium_mg: round1(baseMinerals.potassium_mg),
    sodium_mg: round1(baseMinerals.sodium_mg),
    zinc_mg: round2(baseMinerals.zinc_mg),
    copper_mg: round2(baseMinerals.copper_mg),
    manganese_mg: round2(baseMinerals.manganese_mg),
  };

  return {
    grams: targetGrams,
    nutrients: scaledNutrients,
    vitamins: scaledVitamins,
    minerals: scaledMinerals,
  };
}

/**
 * 4. Smart Comparison Metrics
 * Computes ratios like Protein per 100 calories and Fiber per 100 calories
 */
export function getSmartRatios(nutrients: Macronutrients) {
  const calories = Math.max(1, nutrients.calories);
  return {
    proteinPer100Kcal: Math.round((nutrients.protein / calories) * 1000) / 10,
    fiberPer100Kcal: Math.round((nutrients.fiber / calories) * 1000) / 10,
    carbProteinRatio: nutrients.protein > 0 ? Math.round((nutrients.carbohydrates / nutrients.protein) * 10) / 10 : 0,
    fatCalorieRatio: Math.round(((nutrients.fat * 9) / calories) * 100),
  };
}
