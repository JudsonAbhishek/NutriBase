"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  PartyPopper,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";

type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  fact: string;
  category: string;
};

const QUESTIONS: QuizQuestion[] = [
  {
    question: "Which food is famous for beta-glucan, a soluble fiber linked with heart health?",
    options: ["Oats", "Watermelon", "Chicken breast", "Paneer"],
    answer: 0,
    fact: "Oats are naturally rich in beta-glucan. Pair them with fruit, yogurt, or nuts for a filling breakfast.",
    category: "Grains",
  },
  {
    question: "Which nutrient is especially abundant in citrus fruits such as lemon and orange?",
    options: ["Vitamin C", "Vitamin B12", "Vitamin D", "Sodium"],
    answer: 0,
    fact: "Vitamin C supports normal collagen formation and helps the body absorb non-heme iron from plant foods.",
    category: "Vitamins",
  },
  {
    question: "Which food is technically a legume, even though it is commonly grouped with nuts?",
    options: ["Peanut", "Almond", "Walnut", "Cashew"],
    answer: 0,
    fact: "Peanuts grow as legumes. They are a budget-friendly source of protein, healthy fats, and niacin.",
    category: "Food science",
  },
  {
    question: "Which leafy green is well known for vitamin K and folate?",
    options: ["Spinach", "White rice", "Mango", "Milk"],
    answer: 0,
    fact: "Spinach brings vitamin K, folate, carotenoids, and fiber to meals. Add a vitamin-C-rich food to support iron absorption.",
    category: "Vegetables",
  },
  {
    question: "Which food is a complete animal-protein source with choline and lutein?",
    options: ["Egg", "Apple", "Brown rice", "Cucumber"],
    answer: 0,
    fact: "Eggs provide all essential amino acids along with nutrients such as choline and lutein.",
    category: "Protein",
  },
  {
    question: "Which everyday food is made by fermenting milk and is a source of calcium and protein?",
    options: ["Curd / yogurt", "Lemon", "Chapati", "Carrot"],
    answer: 0,
    fact: "Curd and yogurt are fermented dairy foods. Choose plain versions when you want to keep added sugar lower.",
    category: "Dairy",
  },
  {
    question: "Which mineral is commonly associated with strong bones and is found in foods like milk and paneer?",
    options: ["Calcium", "Vitamin C", "Fiber", "Omega-3"],
    answer: 0,
    fact: "Calcium supports bones and teeth. Dairy, calcium-set tofu, leafy greens, and fortified foods can all contribute.",
    category: "Minerals",
  },
  {
    question: "What is the most useful first step when estimating nutrition for a larger serving?",
    options: ["Scale the 100g values to the serving weight", "Double every vitamin", "Ignore the serving size", "Only count calories"],
    answer: 0,
    fact: "Most nutrition labels and databases use a reference weight. Scaling the values to the actual grams gives a more useful estimate.",
    category: "Smart tracking",
  },
  {
    question: "Which vitamin can the body make in the skin after exposure to sunlight?",
    options: ["Vitamin D", "Vitamin B12", "Vitamin C", "Vitamin K"],
    answer: 0,
    fact: "Sunlight helps the skin produce vitamin D, though the amount varies with factors such as location, season, and skin coverage.",
    category: "Vitamins",
  },
  {
    question: "Which nutrient in bananas is important for normal muscle and nerve function?",
    options: ["Potassium", "Vitamin B12", "Sodium", "Vitamin D"],
    answer: 0,
    fact: "Bananas provide potassium, an electrolyte involved in normal muscle contraction and nerve signaling.",
    category: "Minerals",
  },
  {
    question: "Which pair of nutrients makes lentils a filling plant-based staple?",
    options: ["Protein and fiber", "Vitamin D and B12", "Vitamin C and sodium", "Water and vitamin A"],
    answer: 0,
    fact: "Lentils provide both plant protein and dietary fiber, and can be used in soups, dals, and salads.",
    category: "Protein",
  },
  {
    question: "Which type of fat is a major component of olive oil?",
    options: ["Monounsaturated fat", "Trans fat", "Only saturated fat", "Cholesterol"],
    answer: 0,
    fact: "Olive oil is rich in monounsaturated fat, especially oleic acid.",
    category: "Food science",
  },
  {
    question: "Which vitamin helps the body absorb iron from plant foods when eaten in the same meal?",
    options: ["Vitamin C", "Vitamin D", "Vitamin K", "Vitamin B12"],
    answer: 0,
    fact: "Vitamin C can improve absorption of non-heme iron found in beans, lentils, and leafy greens.",
    category: "Vitamins",
  },
  {
    question: "What makes brown rice a whole grain?",
    options: ["It retains its bran and germ", "It has added sugar", "It contains no carbohydrates", "It is made from oats"],
    answer: 0,
    fact: "Brown rice keeps the bran and germ, parts removed when producing white rice.",
    category: "Grains",
  },
  {
    question: "Which nutrient provides about 4 calories per gram?",
    options: ["Protein", "Water", "Vitamin C", "Fiber"],
    answer: 0,
    fact: "Protein provides about 4 calories per gram, as do carbohydrates. Fat provides about 9.",
    category: "Food science",
  },
  {
    question: "Which food is a well-known source of beta-carotene?",
    options: ["Carrot", "Chicken breast", "White rice", "Paneer"],
    answer: 0,
    fact: "Carrots contain beta-carotene, which the body can convert into vitamin A.",
    category: "Vegetables",
  },
  {
    question: "Which nutrient is the main building block used to repair and maintain body tissues?",
    options: ["Protein", "Sodium", "Vitamin C", "Water"],
    answer: 0,
    fact: "Dietary protein supplies amino acids used to build and maintain muscles and many other body tissues.",
    category: "Protein",
  },
  {
    question: "Which food is made from soybeans and is commonly used as a plant-based protein?",
    options: ["Tofu", "Butter", "Yogurt", "Oatmeal"],
    answer: 0,
    fact: "Tofu is made from soybeans and can contribute protein to a wide variety of meals.",
    category: "Protein",
  },
  {
    question: "Which type of fiber dissolves in water and is found in oats?",
    options: ["Soluble fiber", "Trans fat", "Cholesterol", "Insoluble protein"],
    answer: 0,
    fact: "Oats contain soluble beta-glucan fiber, which forms a gel when mixed with water.",
    category: "Grains",
  },
  {
    question: "Which nutrient is the body's primary source of energy during everyday activity?",
    options: ["Carbohydrate", "Vitamin D", "Calcium", "Water"],
    answer: 0,
    fact: "Carbohydrates are broken down into sugars that cells commonly use for energy.",
    category: "Food science",
  },
  {
    question: "Which food is naturally rich in omega-3 fats EPA and DHA?",
    options: ["Salmon", "Apple", "White bread", "Cucumber"],
    answer: 0,
    fact: "Fatty fish such as salmon provide the long-chain omega-3 fats EPA and DHA.",
    category: "Fats",
  },
  {
    question: "Which mineral is found in hemoglobin, the protein that carries oxygen in blood?",
    options: ["Iron", "Calcium", "Potassium", "Iodine"],
    answer: 0,
    fact: "Iron is part of hemoglobin, which carries oxygen from the lungs to tissues.",
    category: "Minerals",
  },
  {
    question: "Which of these is a fermented food?",
    options: ["Kimchi", "Plain water", "Raw rice", "Olive oil"],
    answer: 0,
    fact: "Kimchi is a fermented vegetable dish; fermentation gives it its characteristic tangy flavor.",
    category: "Food science",
  },
  {
    question: "Which food is a source of vitamin B12 in its natural, unfortified form?",
    options: ["Eggs", "Oranges", "Lentils", "Almonds"],
    answer: 0,
    fact: "Vitamin B12 occurs naturally in animal-derived foods such as eggs, dairy, fish, and meat.",
    category: "Vitamins",
  },
  {
    question: "What does the term '100g basis' mean on a nutrition entry?",
    options: ["Nutrients are listed for 100 grams of food", "The food must be eaten in 100 minutes", "It lists 100 servings", "It only counts 100 calories"],
    answer: 0,
    fact: "A 100-gram basis is a standard reference that makes it easier to compare foods in equal amounts.",
    category: "Smart tracking",
  },
  {
    question: "Which nut is known for providing alpha-linolenic acid, a plant omega-3 fat?",
    options: ["Walnut", "Macadamia", "Pistachio", "Hazelnut"],
    answer: 0,
    fact: "Walnuts are a notable source of alpha-linolenic acid (ALA), a plant-based omega-3 fatty acid.",
    category: "Fats",
  },
  {
    question: "Which nutrient helps build and maintain bones and teeth?",
    options: ["Calcium", "Vitamin C", "Fiber", "Omega-3"],
    answer: 0,
    fact: "Calcium is a major mineral in bones and teeth and also has other roles in the body.",
    category: "Minerals",
  },
  {
    question: "Which of these foods is naturally high in water?",
    options: ["Cucumber", "Walnuts", "Oats", "Peanut butter"],
    answer: 0,
    fact: "Cucumber has a high water content, which contributes to its light, refreshing texture.",
    category: "Vegetables",
  },
  {
    question: "What is dietary fiber?",
    options: ["A type of carbohydrate the body does not fully digest", "A type of vitamin", "A kind of animal protein", "A mineral found only in salt"],
    answer: 0,
    fact: "Dietary fiber is found in plant foods and is not fully digested by the body.",
    category: "Food science",
  },
  {
    question: "Which food group includes chickpeas, kidney beans, and lentils?",
    options: ["Legumes", "Citrus fruits", "Dairy", "Seafood"],
    answer: 0,
    fact: "Chickpeas, kidney beans, and lentils are legumes, valued for their protein and fiber.",
    category: "Food science",
  },
  {
    question: "Which fruit is a well-known source of vitamin C?",
    options: ["Guava", "Pear", "Watermelon", "Grapes"],
    answer: 0,
    fact: "Guava is a particularly vitamin-C-rich fruit; amounts vary by variety and ripeness.",
    category: "Vitamins",
  },
  {
    question: "Which nutrient is present in table salt and is also an electrolyte?",
    options: ["Sodium", "Iron", "Vitamin A", "Fiber"],
    answer: 0,
    fact: "Table salt contains sodium, an electrolyte the body needs in appropriate amounts.",
    category: "Minerals",
  },
  {
    question: "Which food is traditionally made by fermenting batter from rice and lentils?",
    options: ["Idli", "Chapati", "Paneer", "Hummus"],
    answer: 0,
    fact: "Idli is made from fermented rice-and-lentil batter and is commonly steamed.",
    category: "Food science",
  },
  {
    question: "Which part of an egg contains most of its fat?",
    options: ["Yolk", "White", "Shell", "Both shell membranes"],
    answer: 0,
    fact: "Most of an egg's fat is in the yolk; the white is mostly water and protein.",
    category: "Protein",
  },
  {
    question: "Which nutrient helps the body form collagen and also acts as an antioxidant?",
    options: ["Vitamin C", "Vitamin B12", "Sodium", "Vitamin D"],
    answer: 0,
    fact: "Vitamin C is needed for normal collagen formation and also functions as an antioxidant.",
    category: "Vitamins",
  },
  {
    question: "Which of these is a whole-grain food?",
    options: ["Oatmeal", "White sugar", "Butter", "Fruit juice"],
    answer: 0,
    fact: "Oatmeal is made from oats, a whole grain that provides fiber and other nutrients.",
    category: "Grains",
  },
  {
    question: "Which food is a common source of probiotics from live cultures?",
    options: ["Yogurt", "White rice", "Olive oil", "Apple juice"],
    answer: 0,
    fact: "Some yogurts contain live cultures. Check the label, since processing can affect them.",
    category: "Dairy",
  },
  {
    question: "Which type of fat is generally liquid at room temperature?",
    options: ["Unsaturated fat", "Trans fat only", "All saturated fat", "Dietary cholesterol"],
    answer: 0,
    fact: "Oils rich in unsaturated fats are generally liquid at room temperature, though there are exceptions.",
    category: "Fats",
  },
  {
    question: "Which leafy vegetable is a source of folate?",
    options: ["Spinach", "White bread", "Chicken skin", "Butter"],
    answer: 0,
    fact: "Spinach contains folate, a B vitamin used in cell division and other normal body processes.",
    category: "Vegetables",
  },
  {
    question: "Which food is made by coagulating milk proteins and pressing the curds?",
    options: ["Paneer", "Tempeh", "Hummus", "Oatmeal"],
    answer: 0,
    fact: "Paneer is a fresh cheese made by curdling milk and pressing the curds.",
    category: "Dairy",
  },
  {
    question: "What does 'added sugar' on a food label refer to?",
    options: ["Sugars added during processing or preparation", "All naturally occurring sugars in fruit", "The food's total carbohydrate", "Only sugar in dairy"],
    answer: 0,
    fact: "Added sugars are put into foods during processing or preparation, unlike sugars naturally present in whole fruit.",
    category: "Smart tracking",
  },
  {
    question: "Which food is a notable plant source of iron?",
    options: ["Lentils", "Cucumber", "Butter", "White rice"],
    answer: 0,
    fact: "Lentils provide non-heme iron. Eating them with vitamin-C-rich foods can help the body absorb it.",
    category: "Minerals",
  },
  {
    question: "Which vitamin is naturally present in many orange-colored vegetables as provitamin A carotenoids?",
    options: ["Vitamin A", "Vitamin B12", "Vitamin D", "Vitamin K"],
    answer: 0,
    fact: "Orange vegetables such as carrots and sweet potatoes contain carotenoids that can be converted to vitamin A.",
    category: "Vitamins",
  },
  {
    question: "Which food is a seed that is often used as a gluten-free grain alternative?",
    options: ["Quinoa", "Almond", "Peanut", "Chickpea"],
    answer: 0,
    fact: "Quinoa is a seed commonly prepared and eaten like a grain and is naturally gluten-free.",
    category: "Grains",
  },
  {
    question: "Which nutrient is essential for hydration and helps regulate body temperature?",
    options: ["Water", "Fiber", "Iron", "Vitamin E"],
    answer: 0,
    fact: "Water supports many body functions, including temperature regulation and transport of nutrients.",
    category: "Smart tracking",
  },
  {
    question: "Which food is a source of plant protein made from fermented soybeans?",
    options: ["Tempeh", "Butter", "Cheddar", "White rice"],
    answer: 0,
    fact: "Tempeh is a fermented soybean food that provides plant protein and a firm texture.",
    category: "Protein",
  },
  {
    question: "Which mineral is commonly added to iodized salt to help prevent iodine deficiency?",
    options: ["Iodine", "Calcium", "Magnesium", "Zinc"],
    answer: 0,
    fact: "Iodized salt is a widely used source of iodine, which the thyroid gland needs to make hormones.",
    category: "Minerals",
  },
];

const QUESTIONS_PER_ROUND = 8;

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function createQuizRound(): QuizQuestion[] {
  return shuffle(QUESTIONS)
    .slice(0, QUESTIONS_PER_ROUND)
    .map((question) => {
      const correctOption = question.options[question.answer];
      const options = shuffle(question.options);
      return {
        ...question,
        options,
        answer: options.indexOf(correctOption),
      };
    });
}

export default function FoodFactsQuizPage() {
  const [roundQuestions, setRoundQuestions] = useState(() =>
    QUESTIONS.slice(0, QUESTIONS_PER_ROUND)
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = roundQuestions[questionIndex];
  const progress = ((questionIndex + (selectedAnswer !== null ? 1 : 0)) / roundQuestions.length) * 100;
  const answeredCorrectly = selectedAnswer === question?.answer;

  const resultMessage = useMemo(() => {
    const percentage = Math.round((score / roundQuestions.length) * 100);
    if (percentage === 100) return "Perfect score! Your food-fact powers are glowing.";
    if (percentage >= 75) return "Brilliant work! You have a strong nutrition instinct.";
    if (percentage >= 50) return "Nice run! A few more facts and you will be unstoppable.";
    return "Good first round! Every answer is one more fact for your toolkit.";
  }, [roundQuestions.length, score]);

  React.useEffect(() => {
    setRoundQuestions(createQuizRound());
  }, []);

  const chooseAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null || !question) return;
    setSelectedAnswer(optionIndex);
    if (optionIndex === question.answer) setScore((current) => current + 1);
  };

  const nextQuestion = () => {
    if (questionIndex === roundQuestions.length - 1) {
      setFinished(true);
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
  };

  const restart = () => {
    setRoundQuestions(createQuizRound());
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-slate-50 to-white dark:from-emerald-950/30 dark:via-slate-950 dark:to-slate-950 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/70 bg-emerald-100/80 dark:bg-emerald-500/15 dark:border-emerald-400/40 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-4 h-4" />
            NutriBase Fun Lab
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Food Facts <span className="text-emerald-600 dark:text-emerald-400">Quiz</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Test your food knowledge with quick MCQs, instant feedback, and a useful fact after every answer.
          </p>
        </div>

        {!finished ? (
          <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-xl shadow-emerald-900/5 dark:shadow-black/30 overflow-hidden">
            <div className="h-2 bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${Math.max(progress, ((questionIndex + 1) / roundQuestions.length) * 100)}%` }}
              />
            </div>
            <div className="p-5 sm:p-9">
              <div className="flex items-center justify-between gap-4 mb-8">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  <Zap className="w-4 h-4" />
                  {question.category}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Question {questionIndex + 1} of {roundQuestions.length}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-slate-900 dark:text-white max-w-3xl">
                {question.question}
              </h2>

              <div className="grid gap-3 mt-8">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswer === optionIndex;
                  const isCorrect = optionIndex === question.answer;
                  let stateClass =
                    "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10";
                  if (selectedAnswer !== null && isCorrect) {
                    stateClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15";
                  } else if (isSelected && !isCorrect) {
                    stateClass = "border-rose-400 bg-rose-50 dark:bg-rose-500/15";
                  }
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => chooseAnswer(optionIndex)}
                      disabled={selectedAnswer !== null}
                      className={`flex items-center justify-between gap-3 w-full rounded-2xl border-2 px-4 py-4 text-left transition-all ${stateClass}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-xs font-black text-slate-500 dark:text-slate-300">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{option}</span>
                      </span>
                      {selectedAnswer !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div className={`mt-6 rounded-2xl border p-4 ${answeredCorrectly ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10" : "border-amber-300 bg-amber-50 dark:bg-amber-500/10"}`}>
                  <div className="flex gap-3">
                    <Lightbulb className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-black text-slate-900 dark:text-white">
                        {answeredCorrectly ? "Correct! Nice one." : `The answer is ${question.options[question.answer]}.`}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{question.fact}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 mt-8">
                <span className="text-sm font-black text-slate-500 dark:text-slate-400">
                  Score: <span className="text-emerald-600 dark:text-emerald-400">{score}</span>
                </span>
                <button
                  type="button"
                  onClick={nextQuestion}
                  disabled={selectedAnswer === null}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {questionIndex === roundQuestions.length - 1 ? "See my result" : "Next question"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-xl shadow-emerald-900/5 dark:shadow-black/30 p-8 sm:p-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-100 dark:bg-amber-500/15 text-amber-500">
              {score >= 6 ? <Trophy className="w-10 h-10" /> : <PartyPopper className="w-10 h-10" />}
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Quiz complete</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{score} / {roundQuestions.length}</h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">{resultMessage}</p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <button type="button" onClick={restart} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700">
                <RotateCcw className="w-4 h-4" /> Play again
              </button>
              <Link href="/search" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-3 text-sm font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                Explore the food database <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
