export const APP_NAME = "Al Nibras Finance";

export const DEFAULT_CURRENCY = "USD";
export const CURRENCIES = ["USD", "PKR", "AED"] as const;
export const EXCHANGE_RATES = {
  USD: 1,
  PKR: 280,
  AED: 3.67,
} as const;

export const QUIZ_REWARD_AMOUNT = 2;
export const STUDY_REWARD_AMOUNT = 5;
export const MIN_GOAL_ADD_AMOUNT = 10;

export const LEARNING_COURSE_DURATION_SECONDS = 10;
export const COURSE_PROGRESS_INCREMENT = 10;

export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 1.5,
} as const;

export const CONFETTI_CONFIG = {
  particleCount: 150,
  spread: 70,
  origin: { y: 0.6 },
  colors: ["#D4AF37", "#FFFFFF", "#997A1F"],
} as const;

export const STORAGE_KEYS = {
  balance: "balance",
  transactions: "transactions",
  courses: "courses",
  rewardTasks: "rewardTasks",
  pendingRequests: "pendingRequests",
  pendingRewards: "pendingRewards",
  matchingEnabled: "matchingEnabled",
  goals: "goals",
  parentRating: "parentRating",
  isPremium: "isPremium",
  currency: "currency",
} as const;

export const THEME = {
  accent: "#D4AF37",
  premiumAccent: "#F2D06B",
} as const;

export const API_RATE_LIMIT = {
  maxRequests: 100,
  windowMs: 60 * 1000,
} as const;