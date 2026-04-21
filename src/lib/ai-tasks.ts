import type { Transaction, Goal } from "./types";

export interface TaskResult {
  success: boolean;
  result: string | number;
  details?: string;
}

export interface TaskContext {
  balance: number;
  transactions: Transaction[];
  goals: Goal[];
  income: number;
  expenses: number;
}

export function executeTask(
  task: string,
  params: Record<string, unknown>,
  context: TaskContext
): TaskResult {
  const taskLower = task.toLowerCase();

  if (taskLower.includes("zakat") || taskLower.includes("calculate")) {
    return calculateZakat(context.balance, context.income);
  }

  if (taskLower.includes("saving") || taskLower.includes("ratio")) {
    return calculateSavingsRatio(context.income, context.expenses);
  }

  if (taskLower.includes("goal") || taskLower.includes("bicycle") || taskLower.includes("target")) {
    return calculateGoalProgress(params.goalName as string, context.goals);
  }

  if (taskLower.includes("health") || taskLower.includes("score")) {
    return calculateHealthScore(context.income, context.expenses);
  }

  if (taskLower.includes("barakah") || taskLower.includes("blessing")) {
    return analyzeBarakah(context.balance, context.transactions);
  }

  return {
    success: false,
    result: 0,
    details: "I understand the task but need more information."
  };
}

function calculateZakat(balance: number, income: number): TaskResult {
  const nisabThreshold = 612.5;
  const totalWealth = balance + (income * 0.1);

  if (totalWealth < nisabThreshold) {
    return {
      success: true,
      result: 0,
      details: `Your wealth ($${totalWealth.toFixed(2)}) is below the Nisab ($${nisabThreshold}). Zakat is not obligatory yet. Keep saving!`
    };
  }

  const yearlyZakat = totalWealth * 0.025;
  return {
    success: true,
    result: Number(yearlyZakat.toFixed(2)),
    details: `With your wealth of $${totalWealth.toFixed(2)}, your yearly Zakat is $${yearlyZakat.toFixed(2)}. This should be given to those in need.`
  };
}

function calculateSavingsRatio(income: number, expenses: number): TaskResult {
  if (income === 0) {
    return { success: true, result: "0%", details: "No income recorded yet!" };
  }

  const ratio = ((income - expenses) / income) * 100;
  const emoji = ratio >= 80 ? "Great" : ratio >= 50 ? "Good" : "Needs work";
  
  return {
    success: true,
    result: `${Math.round(ratio)}%`,
    details: `Your savings ratio is ${Math.round(ratio)}% - ${emoji}!`
  };
}

function calculateGoalProgress(goalName: string, goals: Goal[]): TaskResult {
  const goal = goals.find(g =>
    g.title.toLowerCase().includes(goalName.toLowerCase())
  );

  if (!goal) {
    return { success: true, result: 0, details: `I don't see a goal called "${goalName}".` };
  }

  const progress = (goal.current / goal.target) * 100;
  const remaining = goal.target - goal.current - goal.parentBonus;

  return {
    success: true,
    result: `${Math.round(progress)}%`,
    details: `${goal.title}: ${Math.round(progress)}% complete! You need $${remaining.toFixed(2)} more.`
  };
}

function calculateHealthScore(income: number, expenses: number): TaskResult {
  if (income === 0) {
    return { success: true, result: 50, details: "Start saving to see your health score!" };
  }

  const savings = income - expenses;
  const score = savings >= income * 0.5 ? 100
    : savings >= income * 0.3 ? 75
    : savings >= income * 0.1 ? 50
    : 25;

  return {
    success: true,
    result: score,
    details: `Financial Health Score: ${score}/100`
  };
}

function analyzeBarakah(balance: number, transactions: Transaction[]): TaskResult {
  const sadaqah = transactions.filter(t =>
    t.category === "sadaqah" || t.title.toLowerCase().includes("charity")
  ).length;

  const barakahLevel = sadaqah >= 5 ? "High" : sadaqah >= 3 ? "Good" : "Building";

  return {
    success: true,
    result: barakahLevel,
    details: `Your Barakah Level: ${barakahLevel}. You have ${sadaqah} acts of charity. Giving Sadaqah brings Barakah!`
  };
}

export function detectTaskIntent(userInput: string): string | null {
  const input = userInput.toLowerCase();

  const taskPatterns: Record<string, RegExp> = {
    calculateZakat: /zakat|zsakat|zak.t/,
    savingsRatio: /saving.*ratio|ratio|save.*percent/,
    goalProgress: /goal.*progress|how.*goal|bicycle|target/i,
    healthScore: /health.*score|score|financial/i,
    analyzeBarakah: /barakah|blessing|sadaqah|charity/i,
  };

  for (const [task, pattern] of Object.entries(taskPatterns)) {
    if (pattern.test(input)) {
      return task;
    }
  }

  return null;
}