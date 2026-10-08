import { Macronutrients, Minerals, NutritionScoreBreakdown, Vitamins } from "@/types/nutrition";

/**
 * Transparent Food Scoring Algorithm (0 - 100)
 * Evaluates positive dietary components (Protein, Fiber, Essential Micronutrients)
 * and applies measured deductions for components to limit (Free sugars, excessive Sodium,
 * Saturated fat density, and heavy industrial processing).
 */
export function calculateNutritionScore(
  nutrients: Macronutrients,
  vitamins: Vitamins,
  minerals: Minerals,
  processing: 'Unprocessed/Whole' | 'Minimally Processed' | 'Processed' | 'Ultra-processed' = 'Unprocessed/Whole'
): NutritionScoreBreakdown {
  let baseScore = 50; // Start at neutral median
  const pros: string[] = [];
  const cons: string[] = [];

  // 1. Protein Points (Max +20 points)
  // 1g protein per 100g gives ~1 point, capped at 20
  const proteinPoints = Math.min(20, Math.round(nutrients.protein * 1.0));
  if (nutrients.protein >= 15) {
    pros.push(`Excellent protein source (${nutrients.protein}g / 100g)`);
  } else if (nutrients.protein >= 8) {
    pros.push(`Good protein content (${nutrients.protein}g / 100g)`);
  }

  // 2. Fiber Points (Max +20 points)
  // Dietary fiber is crucial for gut health and satiety. 1g fiber gives 3 points, capped at 20
  const fiberPoints = Math.min(20, Math.round(nutrients.fiber * 2.8));
  if (nutrients.fiber >= 6) {
    pros.push(`High in dietary fiber (${nutrients.fiber}g / 100g) promoting digestive health`);
  } else if (nutrients.fiber >= 3) {
    pros.push(`Decent fiber contributor (${nutrients.fiber}g / 100g)`);
  }

  // 3. Micronutrient Density Points (Max +25 points)
  // Check against Daily Values (DV): Vit A, C, D, B12, Iron, Calcium, Potassium, Magnesium
  let microScore = 0;
  if (vitamins.vitaminC_mg >= 18) microScore += 4; // >= 20% DV
  if (vitamins.vitaminA_mcg >= 180) microScore += 3;
  if (vitamins.vitaminB12_mcg >= 0.5) microScore += 4;
  if (vitamins.vitaminD_iu >= 100) microScore += 4;
  if (vitamins.vitaminB9_mcg >= 60) microScore += 3;
  if (minerals.iron_mg >= 2.5) microScore += 4;
  if (minerals.calcium_mg >= 150) microScore += 4;
  if (minerals.potassium_mg >= 400) microScore += 4;
  if (minerals.magnesium_mg >= 60) microScore += 3;
  const micronutrientPoints = Math.min(25, microScore);

  if (vitamins.vitaminC_mg >= 30) pros.push(`Rich in Vitamin C (${vitamins.vitaminC_mg}mg)`);
  if (minerals.iron_mg >= 3) pros.push(`Contains significant Iron (${minerals.iron_mg}mg)`);
  if (minerals.calcium_mg >= 200) pros.push(`Excellent source of Calcium (${minerals.calcium_mg}mg)`);
  if (minerals.potassium_mg >= 450) pros.push(`High in Potassium (${minerals.potassium_mg}mg)`);

  // 4. Sugar Deduction (Up to -15 points)
  // Naturally occurring sugars in whole fruits have less penalty than concentrated or added
  let sugarDeduction = 0;
  if (nutrients.sugar > 18) {
    sugarDeduction = 12;
    cons.push(`Elevated sugar content (${nutrients.sugar}g / 100g)`);
  } else if (nutrients.sugar > 10) {
    sugarDeduction = 6;
  } else if (nutrients.sugar > 5) {
    sugarDeduction = 2;
  }

  // 5. Sodium Deduction (Up to -10 points)
  // > 400mg sodium per 100g is high
  let sodiumDeduction = 0;
  if (minerals.sodium_mg > 600) {
    sodiumDeduction = 10;
    cons.push(`High sodium level (${minerals.sodium_mg}mg / 100g)`);
  } else if (minerals.sodium_mg > 300) {
    sodiumDeduction = 5;
    cons.push(`Moderate sodium level (${minerals.sodium_mg}mg / 100g)`);
  }

  // 6. Saturated Fat / Excess Calorie Deduction (Up to -10 points)
  let fatCalorieDeduction = 0;
  const satFat = nutrients.saturatedFat || 0;
  if (satFat > 8) {
    fatCalorieDeduction += 6;
    cons.push(`Higher saturated fat content (${satFat}g / 100g)`);
  }
  if (nutrients.calories > 450 && nutrients.water < 10 && nutrients.fiber < 4) {
    fatCalorieDeduction += 4;
  }
  fatCalorieDeduction = Math.min(10, fatCalorieDeduction);

  // 7. Processing Level Deduction
  let processingDeduction = 0;
  if (processing === 'Ultra-processed') {
    processingDeduction = 12;
    cons.push('Ultra-processed food item');
  } else if (processing === 'Processed') {
    processingDeduction = 5;
  } else if (processing === 'Unprocessed/Whole') {
    pros.push('Natural, whole food with intact bio-availability');
  }

  // Compute final score clamped to 15 - 98
  const rawTotal = baseScore 
    + (proteinPoints * 0.9) 
    + (fiberPoints * 0.9) 
    + (micronutrientPoints * 0.8) 
    - sugarDeduction 
    - sodiumDeduction 
    - fatCalorieDeduction 
    - processingDeduction;

  const totalScore = Math.max(15, Math.min(98, Math.round(rawTotal)));

  let ratingTier: NutritionScoreBreakdown['ratingTier'] = 'Moderate';
  let color = '#f59e0b'; // Amber

  if (totalScore >= 80) {
    ratingTier = 'Excellent';
    color = '#10b981'; // Emerald
  } else if (totalScore >= 65) {
    ratingTier = 'Good';
    color = '#34d399'; // Mint/Green
  } else if (totalScore >= 45) {
    ratingTier = 'Moderate';
    color = '#f59e0b'; // Amber
  } else {
    ratingTier = 'Limit Consumption';
    color = '#ef4444'; // Red
  }

  const summary = totalScore >= 75
    ? 'High nutrient density with an advantageous balance of vital macronutrients and essential vitamins.'
    : totalScore >= 55
    ? 'Nutrient-rich staple with good dietary value when enjoyed as part of a balanced meal.'
    : 'Best enjoyed in moderation or paired with high-fiber, nutrient-dense foods.';

  return {
    totalScore,
    ratingTier,
    color,
    proteinPoints,
    fiberPoints,
    micronutrientPoints,
    sugarDeduction,
    sodiumDeduction,
    fatCalorieDeduction,
    processingLevel: processing,
    processingDeduction,
    summary,
    pros,
    cons: cons.length > 0 ? cons : ['None notable in standard portions'],
  };
}
