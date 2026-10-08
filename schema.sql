-- ==============================================================================
-- NutriBase MySQL Database Architecture
-- Normalized Schema for Food & Nutrition Intelligence Platform
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `nutribase` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nutribase`;

-- 1. Food Categories
CREATE TABLE IF NOT EXISTS `food_categories` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT,
    `icon` VARCHAR(50),
    `color` VARCHAR(20),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Master Foods Table
CREATE TABLE IF NOT EXISTS `foods` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `slug` VARCHAR(120) NOT NULL UNIQUE,
    `name` VARCHAR(150) NOT NULL,
    `scientific_name` VARCHAR(150) NULL,
    `category_id` VARCHAR(50) NOT NULL,
    `subcategory` VARCHAR(100) NULL,
    `dietary_type` ENUM('vegetarian', 'vegan', 'non-vegetarian', 'seafood', 'eggetarian') NOT NULL DEFAULT 'vegetarian',
    `description` TEXT,
    `image_url` VARCHAR(500),
    `data_source` VARCHAR(150) DEFAULT 'USDA FoodData Central / IFCT',
    `reference_basis` VARCHAR(50) DEFAULT '100g edible portion',
    `nutrition_score` INT UNSIGNED DEFAULT 75,
    `score_breakdown` JSON NULL,
    `is_verified` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_foods_category` (`category_id`),
    INDEX `idx_foods_dietary` (`dietary_type`),
    INDEX `idx_foods_name` (`name`),
    CONSTRAINT `fk_foods_category` FOREIGN KEY (`category_id`) REFERENCES `food_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Core Macronutrients & Energy (per 100g)
CREATE TABLE IF NOT EXISTS `food_nutrients` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `food_id` VARCHAR(64) NOT NULL UNIQUE,
    `calories` DECIMAL(7,2) NOT NULL DEFAULT 0.00,
    `protein` DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    `carbohydrates` DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    `fat` DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    `fiber` DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    `sugar` DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    `water` DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    `saturated_fat` DECIMAL(6,2) DEFAULT 0.00,
    `monounsaturated_fat` DECIMAL(6,2) DEFAULT 0.00,
    `polyunsaturated_fat` DECIMAL(6,2) DEFAULT 0.00,
    `trans_fat` DECIMAL(6,2) DEFAULT 0.00,
    `cholesterol_mg` DECIMAL(7,2) DEFAULT 0.00,
    `net_carbs` DECIMAL(6,2) GENERATED ALWAYS AS (GREATEST(0, carbohydrates - fiber)) STORED,
    `protein_calorie_ratio` DECIMAL(5,2) GENERATED ALWAYS AS (CASE WHEN calories > 0 THEN (protein * 4 / calories) * 100 ELSE 0 END) STORED,
    INDEX `idx_nutrients_calories` (`calories`),
    INDEX `idx_nutrients_protein` (`protein`),
    INDEX `idx_nutrients_fiber` (`fiber`),
    CONSTRAINT `fk_nutrients_food` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Vitamins (per 100g)
CREATE TABLE IF NOT EXISTS `vitamins` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `food_id` VARCHAR(64) NOT NULL UNIQUE,
    `vitamin_a_mcg` DECIMAL(7,2) DEFAULT 0.00,
    `vitamin_b1_mg` DECIMAL(6,3) DEFAULT 0.000, -- Thiamine
    `vitamin_b2_mg` DECIMAL(6,3) DEFAULT 0.000, -- Riboflavin
    `vitamin_b3_mg` DECIMAL(6,3) DEFAULT 0.000, -- Niacin
    `vitamin_b6_mg` DECIMAL(6,3) DEFAULT 0.000, -- Pyridoxine
    `vitamin_b9_mcg` DECIMAL(7,2) DEFAULT 0.00, -- Folate
    `vitamin_b12_mcg` DECIMAL(6,2) DEFAULT 0.00, -- Cobalamin
    `vitamin_c_mg` DECIMAL(7,2) DEFAULT 0.00,  -- Ascorbic acid
    `vitamin_d_iu` DECIMAL(7,2) DEFAULT 0.00,  -- Cholecalciferol
    `vitamin_e_mg` DECIMAL(6,2) DEFAULT 0.00,  -- Alpha-tocopherol
    `vitamin_k_mcg` DECIMAL(7,2) DEFAULT 0.00, -- Phylloquinone
    CONSTRAINT `fk_vitamins_food` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Minerals (per 100g)
CREATE TABLE IF NOT EXISTS `minerals` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `food_id` VARCHAR(64) NOT NULL UNIQUE,
    `calcium_mg` DECIMAL(7,2) DEFAULT 0.00,
    `iron_mg` DECIMAL(6,2) DEFAULT 0.00,
    `magnesium_mg` DECIMAL(7,2) DEFAULT 0.00,
    `phosphorus_mg` DECIMAL(7,2) DEFAULT 0.00,
    `potassium_mg` DECIMAL(7,2) DEFAULT 0.00,
    `sodium_mg` DECIMAL(7,2) DEFAULT 0.00,
    `zinc_mg` DECIMAL(6,2) DEFAULT 0.00,
    `copper_mg` DECIMAL(6,3) DEFAULT 0.000,
    `manganese_mg` DECIMAL(6,3) DEFAULT 0.000,
    `selenium_mcg` DECIMAL(6,2) DEFAULT 0.00,
    CONSTRAINT `fk_minerals_food` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Food Servings & Measurement Normalization
CREATE TABLE IF NOT EXISTS `food_servings` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `food_id` VARCHAR(64) NOT NULL,
    `unit_name` VARCHAR(50) NOT NULL, -- 'cup', 'piece', 'bowl', 'tablespoon', 'serving'
    `label` VARCHAR(100) NOT NULL,    -- '1 medium piece (182g)', '1 cup sliced (165g)'
    `grams_equivalent` DECIMAL(7,2) NOT NULL,
    `is_default` BOOLEAN DEFAULT FALSE,
    INDEX `idx_servings_food` (`food_id`),
    CONSTRAINT `fk_servings_food` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Food Allergens
CREATE TABLE IF NOT EXISTS `food_allergens` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `food_id` VARCHAR(64) NOT NULL,
    `allergen_type` ENUM('nuts', 'dairy', 'gluten', 'soy', 'eggs', 'shellfish', 'fish', 'peanuts', 'sesame') NOT NULL,
    UNIQUE KEY `unique_food_allergen` (`food_id`, `allergen_type`),
    CONSTRAINT `fk_allergens_food` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Food Tags & Classifications
CREATE TABLE IF NOT EXISTS `food_tags` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `food_id` VARCHAR(64) NOT NULL,
    `tag` VARCHAR(60) NOT NULL,
    INDEX `idx_tags_food` (`food_id`),
    INDEX `idx_tags_name` (`tag`),
    CONSTRAINT `fk_tags_food` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Food Substitutions
CREATE TABLE IF NOT EXISTS `food_substitutes` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `source_food_id` VARCHAR(64) NOT NULL,
    `substitute_food_id` VARCHAR(64) NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `substitution_ratio` DECIMAL(4,2) DEFAULT 1.00,
    CONSTRAINT `fk_sub_source` FOREIGN KEY (`source_food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sub_target` FOREIGN KEY (`substitute_food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Users & Nutrition Profiles
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `email` VARCHAR(191) NOT NULL UNIQUE,
    `name` VARCHAR(100),
    `avatar_url` VARCHAR(500),
    `role` ENUM('user', 'admin') DEFAULT 'user',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `user_profiles` (
    `user_id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `age` INT UNSIGNED,
    `gender` ENUM('male', 'female', 'other') DEFAULT 'male',
    `height_cm` DECIMAL(5,2),
    `weight_kg` DECIMAL(5,2),
    `activity_level` ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active') DEFAULT 'moderately_active',
    `primary_goal` ENUM('weight_loss', 'weight_gain', 'muscle_building', 'general_health', 'maintenance') DEFAULT 'general_health',
    `dietary_preference` ENUM('all', 'vegetarian', 'vegan', 'non-vegetarian', 'eggetarian') DEFAULT 'all',
    `cuisine_preference` VARCHAR(100) DEFAULT 'Indian',
    `target_calories` INT UNSIGNED,
    `target_protein_g` INT UNSIGNED,
    `target_carbs_g` INT UNSIGNED,
    `target_fat_g` INT UNSIGNED,
    `target_fiber_g` INT UNSIGNED,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. User Favorites
CREATE TABLE IF NOT EXISTS `user_favorites` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `user_id` VARCHAR(64) NOT NULL,
    `item_type` ENUM('food', 'comparison', 'meal', 'recipe') NOT NULL,
    `item_id` VARCHAR(100) NOT NULL,
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_user_fav` (`user_id`, `item_type`, `item_id`),
    CONSTRAINT `fk_fav_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. Meals & Daily Nutrition Tracker
CREATE TABLE IF NOT EXISTS `user_meals` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `user_id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `meal_type` ENUM('breakfast', 'lunch', 'dinner', 'snack', 'custom') DEFAULT 'custom',
    `logged_at` DATE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_meals_user_date` (`user_id`, `logged_at`),
    CONSTRAINT `fk_meals_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `user_meal_items` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `meal_id` VARCHAR(64) NOT NULL,
    `food_id` VARCHAR(64) NOT NULL,
    `serving_id` VARCHAR(64) NULL,
    `quantity` DECIMAL(6,2) NOT NULL DEFAULT 1.00,
    `grams` DECIMAL(7,2) NOT NULL,
    CONSTRAINT `fk_mealitems_meal` FOREIGN KEY (`meal_id`) REFERENCES `user_meals` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_mealitems_food` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. Recipes
CREATE TABLE IF NOT EXISTS `recipes` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(150) NOT NULL UNIQUE,
    `description` TEXT,
    `prep_time_minutes` INT UNSIGNED,
    `cook_time_minutes` INT UNSIGNED,
    `servings` INT UNSIGNED DEFAULT 2,
    `dietary_type` ENUM('vegetarian', 'vegan', 'non-vegetarian', 'seafood', 'eggetarian') DEFAULT 'vegetarian',
    `cuisine` VARCHAR(100) DEFAULT 'Indian',
    `instructions` JSON,
    `image_url` VARCHAR(500),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `recipe_ingredients` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `recipe_id` VARCHAR(64) NOT NULL,
    `food_id` VARCHAR(64) NOT NULL,
    `quantity_grams` DECIMAL(7,2) NOT NULL,
    `unit_label` VARCHAR(80) NOT NULL,
    CONSTRAINT `fk_recing_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_recing_food` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;
