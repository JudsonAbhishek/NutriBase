export type DietaryType = 
  | 'vegetarian' 
  | 'vegan' 
  | 'non-vegetarian' 
  | 'seafood' 
  | 'eggetarian';

export type AllergenType = 
  | 'nuts' 
  | 'dairy' 
  | 'gluten' 
  | 'soy' 
  | 'eggs' 
  | 'shellfish' 
  | 'fish' 
  | 'peanuts' 
  | 'sesame';

export type ActivityLevel = 
  | 'sedentary' 
  | 'lightly_active' 
  | 'moderately_active' 
  | 'very_active' 
  | 'extremely_active';

export type HealthGoal = 
  | 'weight_loss' 
  | 'weight_gain' 
  | 'muscle_building' 
  | 'general_health' 
  | 'maintenance';

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
  itemCount?: number;
}

export interface ServingOption {
  unit: string;
  label: string;
  grams: number;
  isDefault?: boolean;
}

export interface Macronutrients {
  calories: number; // kcal
  protein: number;  // g
  carbohydrates: number; // g
  fat: number;      // g
  fiber: number;    // g
  sugar: number;    // g
  water: number;    // g
  saturatedFat?: number; // g
  monounsaturatedFat?: number; // g
  polyunsaturatedFat?: number; // g
  transFat?: number; // g
  cholesterolMg?: number; // mg
  netCarbs: number; // g
}

export interface Vitamins {
  vitaminA_mcg: number;  // DV: 900 mcg
  vitaminB1_mg: number;  // Thiamine, DV: 1.2 mg
  vitaminB2_mg: number;  // Riboflavin, DV: 1.3 mg
  vitaminB3_mg: number;  // Niacin, DV: 16 mg
  vitaminB6_mg: number;  // DV: 1.7 mg
  vitaminB9_mcg: number; // Folate, DV: 400 mcg
  vitaminB12_mcg: number;// DV: 2.4 mcg
  vitaminC_mg: number;   // DV: 90 mg
  vitaminD_iu: number;   // DV: 800 IU (20 mcg)
  vitaminE_mg: number;   // DV: 15 mg
  vitaminK_mcg: number;  // DV: 120 mcg
}

export interface Minerals {
  calcium_mg: number;     // DV: 1300 mg
  iron_mg: number;        // DV: 18 mg
  magnesium_mg: number;   // DV: 420 mg
  phosphorus_mg: number;  // DV: 1250 mg
  potassium_mg: number;   // DV: 4700 mg
  sodium_mg: number;      // DV: 2300 mg max
  zinc_mg: number;        // DV: 11 mg
  copper_mg: number;      // DV: 0.9 mg
  manganese_mg: number;   // DV: 2.3 mg
  selenium_mcg?: number;  // DV: 55 mcg
}

export interface NutritionScoreBreakdown {
  totalScore: number; // 0 - 100
  ratingTier: 'Excellent' | 'Good' | 'Moderate' | 'Limit Consumption';
  color: string;
  proteinPoints: number;     // max 20
  fiberPoints: number;       // max 20
  micronutrientPoints: number; // max 25
  sugarDeduction: number;    // up to -15
  sodiumDeduction: number;   // up to -10
  fatCalorieDeduction: number; // up to -10
  processingLevel: 'Unprocessed/Whole' | 'Minimally Processed' | 'Processed' | 'Ultra-processed';
  processingDeduction: number; // up to -10
  summary: string;
  pros: string[];
  cons: string[];
}

export interface FoodSubstitute {
  foodId: string;
  foodSlug: string;
  foodName: string;
  imageUrl: string;
  reason: string;
  proteinDiff: number; // difference in grams per 100g
  calorieDiff: number;
  fiberDiff: number;
}

export interface FoodItem {
  id: string;
  slug: string;
  name: string;
  hindiName?: string;
  scientificName?: string;
  categoryId: string;
  categoryName: string;
  subcategory?: string;
  dietaryType: DietaryType;
  description: string;
  imageUrl: string;
  dataSource: string;
  referenceBasis: string; // e.g. "100g edible portion"
  lastUpdated: string;
  isVerified: boolean;
  
  // Nutrients per 100g
  nutrients: Macronutrients;
  vitamins: Vitamins;
  minerals: Minerals;
  
  servings: ServingOption[];
  allergens: AllergenType[];
  tags: string[];
  cuisineTags?: string[];
  
  // Calculated / dynamic
  nutritionScore: NutritionScoreBreakdown;
  betterFor: string[]; // e.g. ['High Protein', 'Rich in Vitamin C', 'Low Calorie']
  substitutes?: FoodSubstitute[];
}

export interface DailyValues {
  calories: 2000;
  protein: 50;
  carbs: 275;
  fat: 78;
  fiber: 28;
  vitaminA_mcg: 900;
  vitaminB1_mg: 1.2;
  vitaminB2_mg: 1.3;
  vitaminB3_mg: 16;
  vitaminB6_mg: 1.7;
  vitaminB9_mcg: 400;
  vitaminB12_mcg: 2.4;
  vitaminC_mg: 90;
  vitaminD_iu: 800;
  vitaminE_mg: 15;
  vitaminK_mcg: 120;
  calcium_mg: 1300;
  iron_mg: 18;
  magnesium_mg: 420;
  phosphorus_mg: 1250;
  potassium_mg: 4700;
  sodium_mg: 2300;
  zinc_mg: 11;
  copper_mg: 0.9;
  manganese_mg: 2.3;
}

export interface BMICalculationResult {
  bmi: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obesity Class I' | 'Obesity Class II' | 'Severe Obesity';
  categoryColor: string;
  healthyWeightRangeKg: { min: number; max: number };
  prime: number;
  disclaimer: string;
}

export interface CalorieCalculationResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  formula: string;
  macros: {
    proteinGrams: number;
    proteinCalories: number;
    proteinPercent: number;
    carbsGrams: number;
    carbsCalories: number;
    carbsPercent: number;
    fatGrams: number;
    fatCalories: number;
    fatPercent: number;
    fiberGrams: number;
  };
}

export interface MealItemLog {
  id: string;
  foodId: string;
  foodName: string;
  imageUrl: string;
  servingLabel: string;
  quantity: number;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  breakfast: MealItemLog[];
  lunch: MealItemLog[];
  dinner: MealItemLog[];
  snacks: MealItemLog[];
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  primaryGoal: HealthGoal;
  dietaryPreference: 'all' | DietaryType;
  allergies: AllergenType[];
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  targetFiberG: number;
}
