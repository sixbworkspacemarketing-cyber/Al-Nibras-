"use client";

import { Search, ArrowUpRight, ArrowDownLeft, Send, Book, Check } from "lucide-react";
import type { Transaction, FilterType } from "@/lib/types";

interface TransactionHistoryProps {
  transactions: Transaction[];
  searchQuery: string;
  filterType: FilterType;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: FilterType) => void;
}

function getTransactionIcon(category: string, type: string) {
  if (category === "study") return <Book className="w-5 h-5 md:w-6 md:h-6" />;
  if (category === "transfer") return <Send className="w-5 h-5 md:w-6 md:h-6" />;
  if (category === "reward") return <Check className="w-5 h-5 md:w-6 md:h-6" />;
  return type === "income"
    ? <ArrowDownLeft className="w-5 h-5 md:w-6 md:h-6" />
    : <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />;
}

export default function TransactionHistory({
  transactions,
  searchQuery,
  filterType,
  onSearchChange,
  onFilterChange,
}: TransactionHistoryProps) {
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <section className="mt-12 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight">
          Recent History
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#D4AF37] w-full sm:w-48"
            />
          </div>
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            {(["all", "income", "expense"] as const).map((type) => (
              <button
                key={type}
                onClick={() => onFilterChange(type)}
                className={`px-3 py-1 rounded-lg text-[10px] uppercase font-black transition-all ${
                  filterType === type
                    ? "bg-[#D4AF37] text-black"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-[1.5rem] md:rounded-[2.5rem] divide-y divide-white/5 overflow-hidden border border-white/10 backdrop-blur-md">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((t) => (
            <div
              key={t.id}
              className="p-4 md:p-5 flex justify-between items-center hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center ${
                    t.type === "income"
                      ? "bg-green-500/20 text-green-500"
                      : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {getTransactionIcon(t.category || "", t.type)}
                </div>
                <div>
                  <p className="font-bold text-sm md:text-lg text-white">{t.title}</p>
                  <p className="text-[10px] md:text-xs text-gray-500">{t.date}</p>
                </div>
              </div>
              <p
                className={`font-black text-base md:text-xl ${
                  t.type === "income" ? "text-green-500" : "text-white"
                }`}
              >
                {t.type === "income" ? "+" : ""}
                ${Math.abs(t.amount)}
              </p>
            </div>
          ))
        ) : (
          <div className="p-12 text-center opacity-50 flex flex-col items-center gap-3">
            <Search className="w-10 h-10 text-gray-500" />
            <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
              No transactions found
            </p>
          </div>
        )}
      </div>
    </section>
  );
}