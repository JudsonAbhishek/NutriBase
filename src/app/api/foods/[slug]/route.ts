import { NextRequest, NextResponse } from "next/server";
import { FoodRepository } from "@/lib/db/repository";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const food = FoodRepository.getFoodBySlug(params.slug);

    if (!food) {
      return NextResponse.json(
        { success: false, error: "Food item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      food,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
