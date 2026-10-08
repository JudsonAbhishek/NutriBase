"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DailyLog, MealItemLog, UserProfile } from "@/types/nutrition";
import { calculateDailyCalories } from "@/lib/algorithms/healthCalculators";

export type Theme = "light" | "dark";

interface NutriContextType {
  theme: Theme;
  toggleTheme: () => void;
  // Comparisons
  compareList: string[]; // food slugs
  addToCompare: (slug: string) => boolean;
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;
  isInCompare: (slug: string) => boolean;

  // Favorites
  favorites: string[]; // food ids
  toggleFavorite: (foodId: string) => void;
  isFavorite: (foodId: string) => boolean;

  // Daily Meal Tracker Log
  dailyLog: DailyLog;
  addMealItem: (mealType: "breakfast" | "lunch" | "dinner" | "snacks", item: Omit<MealItemLog, "id">) => void;
  removeMealItem: (mealType: "breakfast" | "lunch" | "dinner" | "snacks", itemId: string) => void;
  clearDayLog: () => void;

  // Profile & Targets
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Nutrition Explorer",
  age: 28,
  gender: "male",
  heightCm: 175,
  weightKg: 70,
  activityLevel: "moderately_active",
  primaryGoal: "muscle_building",
  dietaryPreference: "all",
  allergies: [],
  targetCalories: 2350,
  targetProteinG: 145,
  targetCarbsG: 260,
  targetFatG: 65,
  targetFiberG: 32,
};

const NutriContext = createContext<NutriContextType | undefined>(undefined);

export function NutriProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [compareList, setCompareList] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>(["fruit-apple", "grain-oats", "meat-chicken-breast"]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [dailyLog, setDailyLog] = useState<DailyLog>({
    date: new Date().toISOString().split("T")[0],
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("nutribase_theme");
      const preferredTheme =
        savedTheme === "dark" || savedTheme === "light"
          ? savedTheme
          : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      setTheme(preferredTheme);

      const savedCompare = localStorage.getItem("nutribase_compare");
      if (savedCompare) {
        const parsedCompare: unknown = JSON.parse(savedCompare);
        if (Array.isArray(parsedCompare)) {
          const uniqueCompare = [...new Set(parsedCompare.filter(
            (slug): slug is string => typeof slug === "string"
          ))].slice(0, 5);
          setCompareList(uniqueCompare);
        }
      }

      const savedFavs = localStorage.getItem("nutribase_favs");
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedProfile = localStorage.getItem("nutribase_profile");
      if (savedProfile) setProfile(JSON.parse(savedProfile));

      const savedLog = localStorage.getItem("nutribase_dailylog");
      if (savedLog) {
        const parsed = JSON.parse(savedLog);
        const today = new Date().toISOString().split("T")[0];
        if (parsed.date === today) {
          setDailyLog(parsed);
        }
      }
    } catch (error) {
      console.warn("Unable to restore NutriBase local data:", error);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem("nutribase_theme", theme);
    } catch (error) {
      console.warn("Unable to save NutriBase theme preference:", error);
    }
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "light" ? "dark" : "light"));

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem("nutribase_compare", JSON.stringify(compareList));
    } catch (error) {
      console.warn("Unable to save NutriBase comparison data:", error);
    }
  }, [compareList]);

  useEffect(() => {
    try {
      localStorage.setItem("nutribase_favs", JSON.stringify(favorites));
    } catch (error) {
      console.warn("Unable to save NutriBase favorites:", error);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem("nutribase_profile", JSON.stringify(profile));
    } catch (error) {
      console.warn("Unable to save NutriBase profile:", error);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem("nutribase_dailylog", JSON.stringify(dailyLog));
    } catch (error) {
      console.warn("Unable to save NutriBase daily log:", error);
    }
  }, [dailyLog]);

  const addToCompare = (slug: string): boolean => {
    if (compareList.includes(slug)) return false;
    if (compareList.length >= 5) {
      alert("You can compare up to 5 foods at once. Please remove one first.");
      return false;
    }
    setCompareList((prev) =>
      prev.includes(slug) || prev.length >= 5 ? prev : [...prev, slug]
    );
    return true;
  };

  const removeFromCompare = (slug: string) => {
    setCompareList((prev) => prev.filter((s) => s !== slug));
  };

  const clearCompare = () => setCompareList([]);

  const isInCompare = (slug: string) => compareList.includes(slug);

  const toggleFavorite = (foodId: string) => {
    setFavorites((prev) =>
      prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]
    );
  };

  const isFavorite = (foodId: string) => favorites.includes(foodId);

  const addMealItem = (
    mealType: "breakfast" | "lunch" | "dinner" | "snacks",
    item: Omit<MealItemLog, "id">
  ) => {
    const newItem: MealItemLog = {
      ...item,
      id: `${item.foodId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setDailyLog((prev) => ({
      ...prev,
      [mealType]: [...prev[mealType], newItem],
    }));
  };

  const removeMealItem = (
    mealType: "breakfast" | "lunch" | "dinner" | "snacks",
    itemId: string
  ) => {
    setDailyLog((prev) => ({
      ...prev,
      [mealType]: prev[mealType].filter((i) => i.id !== itemId),
    }));
  };

  const clearDayLog = () => {
    setDailyLog({
      date: new Date().toISOString().split("T")[0],
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    });
  };

  const updateProfile = (partial: Partial<UserProfile>) => {
    setProfile((prev) => {
      const merged = { ...prev, ...partial };
      // Recalculate targets if physical stats changed
      if (partial.weightKg || partial.heightCm || partial.age || partial.activityLevel || partial.primaryGoal) {
        const calc = calculateDailyCalories(
          merged.weightKg,
          merged.heightCm,
          merged.age,
          merged.gender,
          merged.activityLevel,
          merged.primaryGoal
        );
        merged.targetCalories = calc.targetCalories;
        merged.targetProteinG = calc.macros.proteinGrams;
        merged.targetCarbsG = calc.macros.carbsGrams;
        merged.targetFatG = calc.macros.fatGrams;
        merged.targetFiberG = calc.macros.fiberGrams;
      }
      return merged;
    });
  };

  return (
    <NutriContext.Provider
      value={{
        theme,
        toggleTheme,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        favorites,
        toggleFavorite,
        isFavorite,
        dailyLog,
        addMealItem,
        removeMealItem,
        clearDayLog,
        profile,
        updateProfile,
      }}
    >
      {children}
    </NutriContext.Provider>
  );
}

export function useNutri() {
  const context = useContext(NutriContext);
  if (!context) {
    throw new Error("useNutri must be used within a NutriProvider");
  }
  return context;
}
