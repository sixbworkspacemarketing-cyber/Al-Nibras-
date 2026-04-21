"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Transaction, Goal } from "./types";

interface AppContextType {
  balance: number;
  setBalance: (balance: number) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  income: number;
  expenses: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBalance = localStorage.getItem("balance");
      if (savedBalance) setBalance(parseFloat(savedBalance));

      const savedTransactions = localStorage.getItem("transactions");
      if (savedTransactions) {
        const tx = JSON.parse(savedTransactions);
        setTransactions(tx);
        const inc = tx.filter((t: Transaction) => t.type === "income")
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
        const exp = tx.filter((t: Transaction) => t.type === "expense")
          .reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0);
        setIncome(inc);
        setExpenses(exp);
      }

      const savedGoals = localStorage.getItem("goals");
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    }
  }, []);

  return (
    <AppContext.Provider value={{
      balance,
      setBalance,
      transactions,
      setTransactions,
      goals,
      setGoals,
      income,
      expenses
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}