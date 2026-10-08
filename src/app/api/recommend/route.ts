import { NextRequest, NextResponse } from "next/server";
import { FoodRepository } from "@/lib/db/repository";
import { DietaryType, HealthGoal } from "@/types/nutrition";

const GOALS: HealthGoal[] = ["weight_loss", "weight_gain", "muscle_building", "general_health", "maintenance"];
const DIETS: Array<DietaryType | "all"> = ["all", "vegetarian", "vegan", "non-vegetarian", "seafood", "eggetarian"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goal, diet, priorities, maxCalories, minProtein } = body;
    if (!GOALS.includes(goal || "general_health")) {
      return NextResponse.json({ success: false, error: "Invalid goal" }, { status: 400 });
    }
    if (!DIETS.includes(diet || "all")) {
      return NextResponse.json({ success: false, error: "Invalid diet" }, { status: 400 });
    }
    const requestedPriorities = priorities || ["high_protein"];
    if (!Array.isArray(requestedPriorities) || requestedPriorities.some((priority) => typeof priority !== "string")) {
      return NextResponse.json({ success: false, error: "priorities must be an array of strings" }, { status: 400 });
    }
    const parseConstraint = (value: unknown, name: string) => {
      if (value === undefined || value === null || value === "") return undefined;
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${name} must be a non-negative number`);
      return parsed;
    };

    const recommendations = FoodRepository.recommendFoods({
      goal: goal || "general_health",
      diet: diet || "all",
      priorities: requestedPriorities,
      maxCalories: parseConstraint(maxCalories, "maxCalories"),
      minProtein: parseConstraint(minProtein, "minProtein"),
    });

    return NextResponse.json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
