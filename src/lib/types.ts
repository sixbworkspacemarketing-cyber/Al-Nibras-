export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  role: "user" | "admin";
  parent_pin?: string;
  created_at?: string;
}

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category?: string;
  date: string;
}

export interface Goal {
  id: number;
  title: string;
  current: number;
  parentBonus: number;
  target: number;
  icon: string;
}

export interface RewardTask {
  id: number;
  title: string;
  reward: number;
  status: "pending" | "completed";
}

export interface PendingRequest {
  id: number;
  type: string;
  amount: number;
  recipient: string;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
  desc: string;
  requirement: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  hint: string;
}

export interface Book {
  id: number;
  title: string;
  url: string;
  created_at?: string;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  progress: number;
}

export interface Badge {
  id: number;
  title: string;
  icon: string;
  description?: string;
}

export interface Theme {
  bg: string;
  accent: string;
  cardBg: string;
  border: string;
  font: string;
  button: string;
  gradient: string;
}

export type Currency = "USD" | "PKR" | "AED";
export type FilterType = "all" | "income" | "expense";