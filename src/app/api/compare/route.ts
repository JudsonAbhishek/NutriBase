import { NextRequest, NextResponse } from "next/server";
import { FoodRepository } from "@/lib/db/repository";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slugsParam = searchParams.get("slugs") || "";
    const slugs = slugsParam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const foods = FoodRepository.getComparison(slugs);

    return NextResponse.json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
