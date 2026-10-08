import { NextRequest, NextResponse } from "next/server";
import { FoodFilterOptions, FoodRepository } from "@/lib/db/repository";
import { AllergenType, DietaryType } from "@/types/nutrition";

const DIETARY_TYPES: Array<DietaryType | "all"> = [
  "all",
  "vegetarian",
  "vegan",
  "non-vegetarian",
  "seafood",
  "eggetarian",
];
const ALLERGENS: AllergenType[] = [
  "nuts",
  "dairy",
  "gluten",
  "soy",
  "eggs",
  "shellfish",
  "fish",
  "peanuts",
  "sesame",
];
const SORT_OPTIONS: NonNullable<FoodFilterOptions["sortBy"]>[] = [
  "score",
  "protein",
  "calories-low",
  "calories-high",
  "fiber",
  "name",
  "sugar-low",
];

function parseNonNegativeNumber(value: string | null, name: string) {
  if (value === null || value.trim() === "") return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${name} must be a non-negative number`);
  }
  return parsed;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const requestedDiet = searchParams.get("dietaryType") || "all";
    if (!DIETARY_TYPES.includes(requestedDiet as DietaryType | "all")) {
      return NextResponse.json({ success: false, error: "Invalid dietaryType" }, { status: 400 });
    }
    const dietaryType = requestedDiet as DietaryType | "all";
    const minProtein = parseNonNegativeNumber(searchParams.get("minProtein"), "minProtein");
    const maxCalories = parseNonNegativeNumber(searchParams.get("maxCalories"), "maxCalories");
    const minFiber = parseNonNegativeNumber(searchParams.get("minFiber"), "minFiber");
    const maxFat = parseNonNegativeNumber(searchParams.get("maxFat"), "maxFat");
    const maxSugar = parseNonNegativeNumber(searchParams.get("maxSugar"), "maxSugar");
    const minIron = parseNonNegativeNumber(searchParams.get("minIron"), "minIron");
    const minCalcium = parseNonNegativeNumber(searchParams.get("minCalcium"), "minCalcium");
    const allergensParam = searchParams.get("allergensExclude");
    const allergensExclude = allergensParam
      ? allergensParam.split(",").map((value) => value.trim()).filter(Boolean)
      : undefined;
    if (allergensExclude?.some((value) => !ALLERGENS.includes(value as AllergenType))) {
      return NextResponse.json({ success: false, error: "Invalid allergen" }, { status: 400 });
    }
    const requestedSort = searchParams.get("sortBy") || "score";
    if (!SORT_OPTIONS.includes(requestedSort as NonNullable<FoodFilterOptions["sortBy"]>)) {
      return NextResponse.json({ success: false, error: "Invalid sortBy" }, { status: 400 });
    }
    const sortBy = requestedSort as NonNullable<FoodFilterOptions["sortBy"]>;
    const limitParam = searchParams.get("limit");
    const limit = limitParam === null || limitParam.trim() === "" ? undefined : Number(limitParam);
    if (limit !== undefined && (!Number.isInteger(limit) || limit < 1 || limit > 100)) {
      return NextResponse.json({ success: false, error: "limit must be an integer from 1 to 100" }, { status: 400 });
    }

    const foods = FoodRepository.getFoods({
      search,
      category,
      dietaryType,
      minProtein,
      maxCalories,
      minFiber,
      maxFat,
      maxSugar,
      minIron,
      minCalcium,
      allergensExclude: allergensExclude as AllergenType[] | undefined,
      sortBy,
      limit,
    });

    return NextResponse.json({
      success: true,
      total: foods.length,
      foods,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
