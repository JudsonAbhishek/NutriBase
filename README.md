# NutriBase — Food & Nutrition Intelligence Platform

> **A modern, responsive, high-performance platform for food discovery, nutrition analysis, multi-food comparisons, clinical health calculations, and personalized dietary matching.**

NutriBase is engineered as an end-to-end nutritional intelligence engine following the core product journey:
**DISCOVER → FILTER → UNDERSTAND → COMPARE → CALCULATE → PERSONALIZE → TRACK**

---

## 🌟 Key Highlights & Killer Features

### 1. 🎯 "Find Foods For Me" (Personalized Recommendation Engine)
Instead of manually searching through endless rows of data, users input:
* **Health Goal**: Muscle Building, Weight Loss, Clean Weight Gain, General Health & Longevity
* **Dietary Framework**: Vegetarian, 100% Vegan, Non-Vegetarian, Eggetarian, Pescatarian
* **Nutritional Priorities**: High Protein, High Fiber, Low Calorie, Low Sugar, High Iron, High Calcium
* **Macro Constraints**: Max calories / 100g, Min protein grams / 100g

The recommendation engine scores each food and provides human-readable explanations (e.g., *"Why this matches: Delivers 36.5g protein with high iron and zero cholesterol"*).

### 2. ⚖️ Multi-Food Comparison Engine
* Compare **2 to 5 foods simultaneously** side-by-side.
* **Recharts Visualizations**:
  * Side-by-side **Macronutrient Bar Charts**.
  * Multi-dimensional **Nutrient Density Radar Charts** (% Daily Value).
* **Smart Efficiency Ratios**:
  * Protein per 100 calories ($g / 100\text{ kcal}$).
  * Fiber per 100 calories ($g / 100\text{ kcal}$).
* **"Better For..." Winner Badges**: Instant callouts for Best Protein, Lowest Calorie, Highest Fiber, Best Caloric Efficiency.

### 3. 🔬 Interactive Serving Size Calculator
On every food detail page (`/food/[slug]`), users can switch between:
* `100g`, `250g`, `1 piece`, `1 cup`, `1 bowl`, `1 serving`, or **custom gram inputs**.
* Dynamically recalculates all **Calories, Protein, Carbs, Fat, Fiber, Sugar, Water**, as well as **11 Vitamins** and **9 Essential Minerals** in real time!

### 4. 📊 Transparent NutriBase Score (0 - 100)
A clean, non-dogmatic scoring algorithm that rewards positive nutrients and penalizes components to limit:
$$\text{Score} = 50 + \text{Protein pts (max 20)} + \text{Fiber pts (max 20)} + \text{Micronutrient pts (max 25)} - \text{Free Sugars} - \text{Sodium} - \text{Saturated Fat} - \text{Ultra-processing}$$
Every score includes an open breakdown of exact points gained and lost, plus dietary pros and cons.

### 5. 🧮 Scientific Health Calculators
* **BMI Calculator** (`/calculators/bmi`): Metric and imperial inputs, WHO classification meter, healthy weight range bracket, and BMI Prime.
* **BMR & Daily Calorie Calculator** (`/calculators/calories`): Uses the clinical **Mifflin-St Jeor formula** across 5 physical activity levels and goal deficits/surpluses.
* **Macro Split Calculator** (`/calculators/macros`): Personalized daily gram targets for Protein, Carbs, Healthy Fats, and Fiber with interactive Recharts donut visualization.
* **Composite Meal Nutrition Calculator** (`/calculators/meal-nutrition`): Enter combinations (e.g. 150g rice + 150g chicken breast + 80g dal + 100g spinach) to calculate total meal calories, macros, and micronutrients.

### 6. 🔄 Food Substitutions ("Find an Alternative")
Find healthy dietary swaps and view direct nutritional deltas:
* *Chicken Breast* $\rightarrow$ *Paneer, Atlantic Salmon, Firm Tofu* (delivering vegan or omega-3 profiles).
* *White Rice* $\rightarrow$ *Brown Rice, Quinoa, Ragi Millet* (+fiber and bone-building calcium).

### 7. 📅 Daily Nutrition Tracker & Meal Builder
* Log meals across **Breakfast, Lunch, Dinner, and Snacks**.
* Real-time progress bars tracking calories and macros against daily targets.
* 1-click meal logging from the Serving Calculator or Composite Meal Builder.

### 8. 📝 Personal Notes, Hydration & Body Guide
* Create searchable text notes and checklists, attach date/time reminders, and keep note/task data in this browser.
* Track water and other beverages against a customizable fluid goal, review previous-day logs, and configure a reminder schedule around personal waking and sleeping times.
* Explore a keyboard-accessible body-and-nutrition guide with food recommendations linked to NutriBase food detail pages.
* Personal notes and hydration records use browser `localStorage` (not account-synced). Reminder times and schedules are saved, but browser notifications and background alarms are not enabled.

### 9. 🏆 SEO-Optimized Food Rankings
Dynamic leaderboards based on standardized 100g reference values:
* *Top 20 High Protein Foods*
* *Top 20 Low Calorie Foods*
* *Top 20 High Fiber Foods*
* *Top Iron-Rich Foods*
* *Top Calcium-Rich Foods*
* *Best Protein Sources for Vegetarians*
* *Best Fruits for Fiber*

### 10. 🛡️ Admin Management Portal (`/admin`)
* Add new food records, edit nutritional values, and manage categories.
* Instant JSON batch export.
* Responsive search and filtering table.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (Strict typing) |
| **Styling** | Tailwind CSS with custom health-tech color palette |
| **Charts** | Recharts (Responsive Pie, Bar, and Radar charts) |
| **Icons** | Lucide React |
| **Database** | MySQL (normalized schema in `schema.sql`) + resilient in-memory fallback |
| **Data Quality** | USDA FoodData Central & ICMR-NIN Indian Food Composition Tables |

---

## 🗄️ Database Architecture (MySQL)

A fully normalized relational schema is provided in [`schema.sql`](file:///e:/NutriBase/schema.sql):
* `food_categories`: Taxonomies with slugs, icons, and colors.
* `foods`: Core metadata, descriptions, dietary classification, and data source attribution.
* `food_nutrients`: Macronutrients, calories, fiber, sugar, water, and generated net carbs.
* `vitamins`: 11 essential vitamins (A, B1, B2, B3, B6, B9 Folate, B12, C, D, E, K).
* `minerals`: 9 vital minerals (Calcium, Iron, Magnesium, Potassium, Sodium, Phosphorus, Zinc, Copper, Manganese).
* `food_servings`: Standardized unit conversions normalized to gram weights.
* `food_allergens`: Allergen associations (nuts, dairy, gluten, soy, eggs, shellfish).
* `food_tags`: High-protein, diabetic-friendly, keto, heart-healthy tags.
* `food_substitutes`: Relational source $\leftrightarrow$ substitute pairings with reasons and ratios.
* `users` & `user_profiles`: Biometrics (height, weight, activity, goals, targets).
* `user_meals` & `user_meal_items`: Daily food tracker logs.

### Running with MySQL
1. Ensure MySQL is running on port 3306.
2. Configure `.env.local`:
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/nutribase"
   ```
3. Run the database seed and migration script:
   ```bash
   npm run db:seed
   ```
> **Note on Portability:** NutriBase includes an automatic in-memory data repository fallback. If MySQL is not running locally, the application runs seamlessly out-of-the-box without crashing or throwing connection errors!

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 📱 Mobile-First User Experience

* **Responsive Navigation**: Top header on desktop, smooth collapsible menu, and quick-access fixed bottom navigation on mobile devices.
* **Touch-Friendly Controls**: Interactive portion stepper, range sliders, and multi-select filter pills.
* **Instant Search**: Natural queries supported (`"high protein vegetarian"`, `"foods high in iron"`, `"low calorie fruits"`).

---

## ⚖️ Clinical & Health Disclaimer
NutriBase provides nutritional values, dietary calculations, and educational indexes for general wellness and fitness planning. It is not intended as medical diagnosis, treatment, or a substitute for personal consultation with a physician or registered dietitian.
