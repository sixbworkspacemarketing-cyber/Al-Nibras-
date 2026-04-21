"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Send, 
  X, 
  Minus, 
  Sparkles, 
  Loader2,
  BrainCircuit,
  User,
  Bot
} from "lucide-react";
import { useNibrasAI } from "@/hooks/useNibrasAI";
import type { Transaction, Goal } from "@/lib/types";
import { useAppContext } from "@/lib/AppContext";

interface NibrasAIChatProps {
  mode?: "mentor" | "parent" | "curiosity";
  initialMessage?: string;
  userName?: string;
  childAge?: number;
  balance?: number;
  transactions?: Array<{ id: number; title: string; amount: number; type: string; category?: string; date: string }>;
  goals?: Array<{ id: number; title: string; current: number; parentBonus: number; target: number; icon: string }>;
  income?: number;
  expenses?: number;
}

export default function NibrasAIChat({ 
  mode = "mentor", 
  initialMessage,
  userName = "Friend",
  childAge,
}: NibrasAIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const appContext = useAppContext();
  const chatContext = { 
    balance: appContext.balance, 
    transactions: appContext.transactions, 
    goals: appContext.goals, 
    income: appContext.income, 
    expenses: appContext.expenses 
  };
  
  const { messages, isLoading, sendMessage } = useNibrasAI(mode);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const text = input;
    setInput("");
    await sendMessage(text, { userName, childAge, context: chatContext });
  };

  const botTitle = 
    mode === "mentor" ? "Nibras Buddy" : 
    mode === "parent" ? "Nibras Parent Coach" : 
    "Nibras Explorer";

  const botTagline = 
    mode === "mentor" ? "Your AI Financial Mentor" : 
    mode === "parent" ? "Supporting Your Child's Growth" : 
    "Sparking Curiosity & Learning";

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center hover:scale-110 transition-transform group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <BrainCircuit className="w-8 h-8" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-5 h-5 text-white fill-white" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="bg-[#121212] border border-[#D4AF37]/30 w-[350px] sm:w-[400px] h-[500px] sm:h-[600px] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#D4AF37]/20 to-transparent border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-black">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider">{botTitle}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{botTagline}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Salam, {userName}!</h4>
                    <p className="text-gray-500 text-xs">
                      {mode === "mentor" 
                        ? "I'm your Nibras Buddy. Ask me anything about savings, Barakah, or how to reach your goals!" 
                        : mode === "parent"
                        ? "How can I help you today with your child's financial education journey?"
                        : "Ready to explore the world? Ask me anything and let's find the answers together!"}
                    </p>
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ x: m.role === "user" ? 10 : -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] flex items-start gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                      m.role === "user" ? "bg-white/10 text-white" : "bg-[#D4AF37] text-black"
                    }`}>
                      {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      m.role === "user" 
                        ? "bg-white/10 text-white rounded-tr-none" 
                        : "bg-[#1A1A1A] border border-white/5 text-gray-200 rounded-tl-none"
                    }`}>
                      {m.content}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && messages[messages.length - 1]?.content === "" && (
                <div className="flex justify-start">
                  <div className="bg-[#1A1A1A] border border-white/5 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/50 border-t border-white/5">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Nibras Buddy..."
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-[#D4AF37] text-black disabled:opacity-50 disabled:bg-gray-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#D4AF37]/20"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
