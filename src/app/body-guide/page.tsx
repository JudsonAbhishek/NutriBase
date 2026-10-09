import { BodyGuide, GuideFood } from "@/components/features/BodyGuide";
import { FoodRepository } from "@/lib/db/repository";

const RECOMMENDED_FOOD_SLUGS = [
  "salmon",
  "whole-egg",
  "walnuts",
  "oats",
  "carrot",
  "spinach",
  "orange",
  "milk",
  "curd",
  "broccoli",
  "red-lentils",
  "paneer",
  "almonds",
];

export default function BodyGuidePage() {
  const foods: GuideFood[] = RECOMMENDED_FOOD_SLUGS
    .map((slug) => FoodRepository.getFoodBySlug(slug))
    .filter((food): food is NonNullable<typeof food> => Boolean(food))
    .map((food) => ({
      slug: food.slug,
      name: food.name,
      imageUrl: food.imageUrl,
      dietaryType: food.dietaryType,
    }));

  return <BodyGuide foods={foods} />;
}
