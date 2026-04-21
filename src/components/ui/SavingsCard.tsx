"use client";

import { motion } from "framer-motion";
import { Plus, ArrowUpRight, ArrowDownLeft, Wallet, Globe } from "lucide-react";
import type { Currency } from "@/lib/types";
import { EXCHANGE_RATES } from "@/lib/constants";

interface SavingsCardProps {
  balance: number;
  currency: Currency;
  isPremium: boolean;
  onAddMoney: () => void;
  onSendMoney: () => void;
  onCurrencyChange: (currency: Currency) => void;
}

export default function SavingsCard({
  balance,
  currency,
  isPremium,
  onAddMoney,
  onSendMoney,
  onCurrencyChange,
}: SavingsCardProps) {
  const theme = isPremium
    ? {
        bg: "bg-[#121212]",
        accent: "text-[#D4AF37]",
        cardBg: "bg-white/5",
        border: "border-[#D4AF37]/20",
        button: "bg-[#D4AF37] hover:bg-[#F2D06B]",
        gradient: "from-[#1a1a1a] to-[#0a0a0a]",
      }
    : {
        bg: "bg-black",
        accent: "text-[#D4AF37]",
        cardBg: "bg-white/5",
        border: "border-white/10",
        button: "bg-[#D4AF37] hover:bg-[#F2D06B]",
        gradient: "from-[#001f3f]/40 to-black/60",
      };

  const convertCurrency = (amount: number) => {
    const rate = EXCHANGE_RATES[currency] || 1;
    return (amount * rate).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const currencySymbol = currency === "PKR" ? "Rs" : currency === "AED" ? "د.إ" : "$";

  return (
    <motion.div
      animate={{
        borderColor: isPremium
          ? ["rgba(212,175,55,0.4)", "rgba(212,175,55,0.8)", "rgba(212,175,55,0.4)"]
          : ["rgba(212,175,55,0.2)", "rgba(212,175,55,0.6)", "rgba(212,175,55,0.2)"],
        boxShadow: isPremium
          ? ["0 0 0px rgba(212,175,55,0)", "0 0 40px rgba(212,175,55,0.4)", "0 0 0px rgba(212,175,55,0)"]
          : ["0 0 0px rgba(212,175,55,0)", "0 0 20px rgba(212,175,55,0.2)", "0 0 0px rgba(212,175,55,0)"],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={`md:col-span-8 bg-gradient-to-br ${theme.gradient} p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border ${theme.border} relative overflow-hidden backdrop-blur-xl flex flex-col items-start`}
    >
      <div
        className={`mb-4 text-[10px] font-black ${
          isPremium
            ? "bg-[#D4AF37]/20 border-[#D4AF37]/30 text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.3)]"
            : "bg-white/10 border-white/10 text-white"
        } border px-3 py-1 rounded-lg`}
      >
        {isPremium ? "Platinum Account" : "Free Forever"}
      </div>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wallet className={`w-4 h-4 ${theme.accent}`} />
            <p className={`${theme.accent}/80 text-xs md:text-sm uppercase tracking-widest`}>
              Total Balance
            </p>
          </div>
          <motion.h2
            key={`${balance}-${currency}`}
            initial={{ scale: 1.1, color: "#D4AF37" }}
            animate={{ scale: 1, color: "#FFFFFF" }}
            className="text-4xl md:text-5xl font-bold mb-6 md:mb-8"
          >
            {currencySymbol}
            {convertCurrency(balance)}
          </motion.h2>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
          <Globe className="w-3.5 h-3.5 text-gray-500 ml-2" />
          {(["USD", "PKR", "AED"] as const).map((cur) => (
            <button
              key={cur}
              onClick={() => onCurrencyChange(cur as Currency)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                currency === cur ? "bg-[#D4AF37] text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              {cur}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <button
          onClick={onAddMoney}
          className={`${theme.button} text-black font-bold py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all text-sm md:text-base`}
        >
          <Plus size={18} /> Add Money
        </button>
        <button
          onClick={onSendMoney}
          className="bg-white/5 border border-white/10 py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm md:text-base"
        >
          <ArrowUpRight size={18} /> Send
        </button>
      </div>
    </motion.div>
  );
}