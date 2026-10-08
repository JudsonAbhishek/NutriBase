import { FOOD_CATEGORIES } from "@/data/categories";
import { FOODS } from "@/data/foods";
import { AllergenType, DietaryType, FoodItem, HealthGoal } from "@/types/nutrition";

export interface FoodFilterOptions {
  category?: string;
  dietaryType?: DietaryType | "all";
  search?: string;
  minProtein?: number;
  maxCalories?: number;
  minFiber?: number;
  maxFat?: number;
  maxSugar?: number;
  minIron?: number;
  minCalcium?: number;
  minPotassium?: number;
  minVitaminC?: number;
  minVitaminA?: number;
  allergensExclude?: AllergenType[];
  tags?: string[];
  sortBy?: "score" | "protein" | "calories-low" | "calories-high" | "fiber" | "name" | "sugar-low";
  limit?: number;
}

export class FoodRepository {
  private static uniqueByImage(foods: FoodItem[]): FoodItem[] {
    const seenImages = new Set<string>();
    return foods.filter((food) => {
      if (seenImages.has(food.imageUrl)) return false;
      seenImages.add(food.imageUrl);
      return true;
    });
  }

  /**
   * Global multi-attribute filter and natural language search
   */
  static getFoods(options: FoodFilterOptions = {}): FoodItem[] {
    let results = [...FOODS];

    // 1. Natural Language Query Decomposition
    if (options.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      const terms = q.split(/\s+/);

      // Check for intent keywords in search
      const wantsVeg = q.includes("veg") && !q.includes("non-veg");
      const wantsVegan = q.includes("vegan");
      const wantsHighProtein = q.includes("high protein") || q.includes("rich in protein") || q.includes("protein");
      const wantsLowCal = q.includes("low calorie") || q.includes("low cal") || q.includes("weight loss");
      const wantsHighIron = q.includes("iron");
      const wantsHighFiber = q.includes("fiber") || q.includes("high fiber");
      const wantsHighVitC = q.includes("vitamin c");
      const wantsLowSugar = q.includes("low sugar");

      results = results.filter((food) => {
        // Direct name, category, or tag match
        const nameMatch = food.name.toLowerCase().includes(q) || 
                          (food.hindiName && food.hindiName.toLowerCase().includes(q)) ||
                          (food.scientificName && food.scientificName.toLowerCase().includes(q)) ||
                          food.categoryName.toLowerCase().includes(q) ||
                          food.tags.some(t => t.toLowerCase().includes(q));

        if (nameMatch) return true;

        // Intent matching
        let matchesIntent = true;
        if (wantsVeg && !(food.dietaryType === "vegetarian" || food.dietaryType === "vegan")) {
          matchesIntent = false;
        }
        if (wantsVegan && food.dietaryType !== "vegan") {
          matchesIntent = false;
        }
        if (wantsHighProtein && food.nutrients.protein < 10) {
          matchesIntent = false;
        }
        if (wantsLowCal && food.nutrients.calories > 90) {
          matchesIntent = false;
        }
        if (wantsHighIron && food.minerals.iron_mg < 2.5) {
          matchesIntent = false;
        }
        if (wantsHighFiber && food.nutrients.fiber < 3.5) {
          matchesIntent = false;
        }
        if (wantsHighVitC && food.vitamins.vitaminC_mg < 25) {
          matchesIntent = false;
        }
        if (wantsLowSugar && food.nutrients.sugar > 5) {
          matchesIntent = false;
        }

        // Check if any single token matches
        const tokenMatch = terms.some(term => 
          term.length > 2 && (
            food.name.toLowerCase().includes(term) ||
            food.categoryName.toLowerCase().includes(term) ||
            food.tags.some(t => t.toLowerCase().includes(term))
          )
        );

        return matchesIntent && (tokenMatch || wantsHighProtein || wantsLowCal || wantsHighIron || wantsHighFiber || wantsHighVitC || wantsLowSugar);
      });
    }

    // 2. Category Filter
    if (options.category && options.category !== "all") {
      results = results.filter(
        (f) => f.categoryId.toLowerCase() === options.category?.toLowerCase() ||
               f.categoryName.toLowerCase() === options.category?.toLowerCase()
      );
    }

    // 3. Dietary Type Filter
    if (options.dietaryType && options.dietaryType !== "all") {
      if (options.dietaryType === "vegetarian") {
        results = results.filter(f => f.dietaryType === "vegetarian" || f.dietaryType === "vegan");
      } else {
        results = results.filter((f) => f.dietaryType === options.dietaryType);
      }
    }

    // 4. Quantitative Nutrition Thresholds
    if (options.minProtein !== undefined) {
      results = results.filter((f) => f.nutrients.protein >= options.minProtein!);
    }
    if (options.maxCalories !== undefined) {
      results = results.filter((f) => f.nutrients.calories <= options.maxCalories!);
    }
    if (options.minFiber !== undefined) {
      results = results.filter((f) => f.nutrients.fiber >= options.minFiber!);
    }
    if (options.maxFat !== undefined) {
      results = results.filter((f) => f.nutrients.fat <= options.maxFat!);
    }
    if (options.maxSugar !== undefined) {
      results = results.filter((f) => f.nutrients.sugar <= options.maxSugar!);
    }
    if (options.minIron !== undefined) {
      results = results.filter((f) => f.minerals.iron_mg >= options.minIron!);
    }
    if (options.minCalcium !== undefined) {
      results = results.filter((f) => f.minerals.calcium_mg >= options.minCalcium!);
    }
    if (options.minPotassium !== undefined) {
      results = results.filter((f) => f.minerals.potassium_mg >= options.minPotassium!);
    }
    if (options.minVitaminC !== undefined) {
      results = results.filter((f) => f.vitamins.vitaminC_mg >= options.minVitaminC!);
    }
    if (options.minVitaminA !== undefined) {
      results = results.filter((f) => f.vitamins.vitaminA_mcg >= options.minVitaminA!);
    }

    // 5. Allergen Exclusions
    if (options.allergensExclude && options.allergensExclude.length > 0) {
      results = results.filter(
        (f) => !f.allergens.some((a) => options.allergensExclude!.includes(a))
      );
    }

    // 6. Tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter((f) =>
        options.tags!.every((t) => f.tags.includes(t))
      );
    }

    // 7. Sorting
    switch (options.sortBy) {
      case "protein":
        results.sort((a, b) => b.nutrients.protein - a.nutrients.protein);
        break;
      case "calories-low":
        results.sort((a, b) => a.nutrients.calories - b.nutrients.calories);
        break;
      case "calories-high":
        results.sort((a, b) => b.nutrients.calories - a.nutrients.calories);
        break;
      case "fiber":
        results.sort((a, b) => b.nutrients.fiber - a.nutrients.fiber);
        break;
      case "sugar-low":
        results.sort((a, b) => a.nutrients.sugar - b.nutrients.sugar);
        break;
      case "name":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "score":
      default:
        results.sort((a, b) => b.nutritionScore.totalScore - a.nutritionScore.totalScore);
        break;
    }

    if (options.limit && options.limit > 0) {
      return results.slice(0, options.limit);
    }

    return results;
  }

  static getFoodBySlug(slug: string): FoodItem | undefined {
    return FOODS.find((f) => f.slug.toLowerCase() === slug.toLowerCase());
  }

  static getFoodById(id: string): FoodItem | undefined {
    return FOODS.find((f) => f.id === id);
  }

  static getCategories() {
    return FOOD_CATEGORIES.map((cat) => ({
      ...cat,
      itemCount: FOODS.filter((f) => f.categoryId === cat.id).length,
    }));
  }

  /**
   * Compare 2 to 5 foods
   */
  static getComparison(slugs: string[]): FoodItem[] {
    return slugs
      .map((slug) => FoodRepository.getFoodBySlug(slug))
      .filter((f): f is FoodItem => Boolean(f))
      .slice(0, 5);
  }

  /**
   * Dynamic Rankings
   */
  static getRankings(rankType: string, limit: number = 20): FoodItem[] {
    const all = FoodRepository.uniqueByImage([...FOODS]);
    switch (rankType) {
      case "high-protein":
        return all.sort((a, b) => b.nutrients.protein - a.nutrients.protein).slice(0, limit);
      case "low-calorie":
        return all.sort((a, b) => a.nutrients.calories - b.nutrients.calories).slice(0, limit);
      case "high-fiber":
        return all.sort((a, b) => b.nutrients.fiber - a.nutrients.fiber).slice(0, limit);
      case "rich-in-iron":
        return all.sort((a, b) => b.minerals.iron_mg - a.minerals.iron_mg).slice(0, limit);
      case "rich-in-calcium":
        return all.sort((a, b) => b.minerals.calcium_mg - a.minerals.calcium_mg).slice(0, limit);
      case "rich-in-vitamin-c":
        return all.sort((a, b) => b.vitamins.vitaminC_mg - a.vitamins.vitaminC_mg).slice(0, limit);
      case "best-vegetarian-protein":
        return all
          .filter((f) => f.dietaryType === "vegetarian" || f.dietaryType === "vegan")
          .sort((a, b) => b.nutrients.protein - a.nutrients.protein)
          .slice(0, limit);
      case "best-fruits-for-fiber":
        return all
          .filter((f) => f.categoryId === "fruits")
          .sort((a, b) => b.nutrients.fiber - a.nutrients.fiber)
          .slice(0, limit);
      default:
        return all.sort((a, b) => b.nutritionScore.totalScore - a.nutritionScore.totalScore).slice(0, limit);
    }
  }

  /**
   * The Killer Feature: Personalized Food Discovery Engine
   */
  static recommendFoods(criteria: {
    goal: HealthGoal;
    diet: "all" | DietaryType;
    priorities: string[]; // ['high_protein', 'high_fiber', 'low_calorie', 'low_sugar', 'high_iron', 'high_calcium']
    cuisine?: string;
    maxCalories?: number;
    minProtein?: number;
  }): { food: FoodItem; matchReason: string; matchScore: number }[] {
    let pool = [...FOODS];

    // Filter diet
    if (criteria.diet && criteria.diet !== "all") {
      if (criteria.diet === "vegetarian") {
        pool = pool.filter((f) => f.dietaryType === "vegetarian" || f.dietaryType === "vegan");
      } else {
        pool = pool.filter((f) => f.dietaryType === criteria.diet);
      }
    }

    if (criteria.maxCalories) {
      pool = pool.filter((f) => f.nutrients.calories <= criteria.maxCalories!);
    }
    if (criteria.minProtein) {
      pool = pool.filter((f) => f.nutrients.protein >= criteria.minProtein!);
    }

    // Score each candidate against user criteria
    const scored = pool.map((food) => {
      let score = food.nutritionScore.totalScore;
      const reasons: string[] = [];

      // Goal specific scoring
      if (criteria.goal === "muscle_building") {
        score += food.nutrients.protein * 2.2;
        if (food.nutrients.protein >= 15) {
          reasons.push(`Contains high-density protein (${food.nutrients.protein}g / 100g) for muscle repair`);
        }
      } else if (criteria.goal === "weight_loss") {
        if (food.nutrients.calories <= 80) {
          score += 25;
          reasons.push(`Ultra-low calorie density (${food.nutrients.calories} kcal / 100g) allows high volume eating`);
        }
        if (food.nutrients.fiber >= 3) {
          score += food.nutrients.fiber * 2;
          reasons.push(`High fiber promotes sustained fullness`);
        }
        if (food.nutrients.sugar > 12) score -= 15;
      } else if (criteria.goal === "general_health") {
        score += (food.nutrients.fiber * 1.5) + (food.vitamins.vitaminC_mg * 0.3);
        reasons.push(`Broad-spectrum micronutrient density with ${food.nutritionScore.ratingTier} health score`);
      }

      // Priority adjustments
      if (criteria.priorities.includes("high_protein") && food.nutrients.protein >= 12) {
        score += 20;
        if (!reasons.some(r => r.includes("protein"))) {
          reasons.push(`Delivers ${food.nutrients.protein}g protein per 100g`);
        }
      }
      if (criteria.priorities.includes("high_fiber") && food.nutrients.fiber >= 4) {
        score += 15;
        reasons.push(`Rich in fiber (${food.nutrients.fiber}g) for metabolic health`);
      }
      if (criteria.priorities.includes("low_calorie") && food.nutrients.calories <= 60) {
        score += 15;
        reasons.push(`Light calorie footprint (${food.nutrients.calories} kcal)`);
      }
      if (criteria.priorities.includes("high_iron") && food.minerals.iron_mg >= 2.5) {
        score += 15;
        reasons.push(`Valuable Iron source (${food.minerals.iron_mg}mg)`);
      }
      if (criteria.priorities.includes("high_calcium") && food.minerals.calcium_mg >= 150) {
        score += 15;
        reasons.push(`Exceptional Calcium content (${food.minerals.calcium_mg}mg)`);
      }
      if (criteria.priorities.includes("low_sugar") && food.nutrients.sugar <= 3) {
        score += 10;
        reasons.push(`Very low sugar (${food.nutrients.sugar}g)`);
      }

      const matchReason = reasons.length > 0 
        ? reasons.join(". ") + "." 
        : `Matches your dietary criteria with a verified NutriScore of ${food.nutritionScore.totalScore}/100.`;

      return {
        food,
        matchReason,
        matchScore: Math.round(score),
      };
    });

    return scored.sort((a, b) => b.matchScore - a.matchScore);
  }
}
