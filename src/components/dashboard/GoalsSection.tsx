"use client";

import { motion } from "framer-motion";
import type { Goal, Currency } from "@/lib/types";
import { MIN_GOAL_ADD_AMOUNT } from "@/lib/constants";

interface GoalsSectionProps {
  goals: Goal[];
  balance: number;
  currency: Currency;
  currencySymbol: string;
  onAddToGoal: (goalId: number, amount: number) => void;
}

function convertCurrency(amount: number, currency: Currency): string {
  const rates: Record<Currency, number> = { USD: 1, PKR: 280, AED: 3.67 };
  const rate = rates[currency] || 1;
  return (amount * rate).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function GoalsSection({
  goals,
  balance,
  currency,
  currencySymbol,
  onAddToGoal,
}: GoalsSectionProps) {
  return (
    <section className="mt-8 md:mt-12">
      <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white">Savings Goals</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white/5 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 hover:border-[#D4AF37]/30 transition-all backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <span className="text-2xl md:text-3xl bg-white/10 p-2 md:p-3 rounded-xl">
                {goal.icon}
              </span>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm md:text-base">{goal.title}</h4>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Target: {currencySymbol}
                    {convertCurrency(goal.target, currency)}
                  </span>
                </div>
                <div className="flex gap-2 mt-1">
                  <p className="text-[10px] text-[#D4AF37] font-bold">
                    Kid: {currencySymbol}
                    {convertCurrency(goal.current, currency)}
                  </p>
                  {goal.parentBonus > 0 && (
                    <p className="text-[10px] text-gray-400 font-bold">
                      Bonus: {currencySymbol}
                      {convertCurrency(goal.parentBonus, currency)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full bg-white/10 h-2 md:h-3 rounded-full overflow-hidden relative flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="bg-[#D4AF37] h-full shadow-[0_0_10px_rgba(212,175,55,0.5)] z-10"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(goal.parentBonus / goal.target) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="bg-[#C0C0C0] h-full shadow-[0_0_10px_rgba(192,192,192,0.3)]"
              />
            </div>
            <button
              onClick={() => onAddToGoal(goal.id, MIN_GOAL_ADD_AMOUNT)}
              disabled={balance < MIN_GOAL_ADD_AMOUNT}
              className="w-full mt-4 bg-white/5 border border-white/10 text-white text-[10px] font-bold py-2 rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save {currencySymbol}
              {convertCurrency(MIN_GOAL_ADD_AMOUNT, currency)} to Goal
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}