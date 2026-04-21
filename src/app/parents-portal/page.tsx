'use client';

import NibrasAIChat from '@/components/NibrasAIChat';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Wallet, 
  Lock, 
  Check, 
  X, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Settings, 
  Smartphone, 
  Globe, 
  Award, 
  History,
  TrendingUp,
  GraduationCap,
  Users,
  Bell,
  AlertTriangle,
  Crown,
  BarChart3,
  Wifi,
  Cpu
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import confetti from 'canvas-confetti';

export default function ParentsPortal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(true);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [spendingLimit, setSpendingLimit] = useState(5000);
  const [cardHolderName, setCardHolderName] = useState("AHMED");
  const [cardColor, setCardColor] = useState("#000000");
  const [onlineShopping, setOnlineShopping] = useState(true);
  const [sendMoneyPermission, setSendMoneyPermission] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [balanceLS, setBalanceLS] = useState<number>(0);
  const [pendingRewardsLS, setPendingRewardsLS] = useState<number>(0);
  const [transactionsLS, setTransactionsLS] = useState<any[]>([]);
  const [microCoverEnabled, setMicroCoverEnabled] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [exchangeRates] = useState({ USD: 1, PKR: 280, AED: 3.67 });

  // Mock Data for Kids
  const kids = [
    { id: 1, name: "Ahmed", balance: 1240.50, courseProgress: 85, icon: "/logo-new.png" },
    { id: 2, name: "Ali", balance: 450.00, courseProgress: 45, icon: "💰" }
  ];

  const [pendingRewards, setPendingRewards] = useState([
    { id: 101, kid: "Ahmed", module: "Islamic Finance Basics", amount: 5, date: "2 hours ago" },
    { id: 102, kid: "Ali", module: "The Art of Saving", amount: 5, date: "Yesterday" }
  ]);

  const [recentActivity, setRecentActivity] = useState<Array<{ id: number; kid: string; title: string; amount: number; type: "income" | "expense"; date: string }>>([
    { id: 1, kid: "Ahmed", title: "School Canteen", amount: -15, type: "expense", date: "Today, 10:30 AM" },
    { id: 2, kid: "Ahmed", title: "Monthly Allowance", amount: 50, type: "income", date: "Yesterday" },
    { id: 3, kid: "Ali", title: "Bookstore", amount: -25, type: "expense", date: "Feb 28" },
  ]);

  useEffect(() => {
    setHasMounted(true);
    try {
      const savedBalance = localStorage.getItem("balance");
      const savedTransactions = localStorage.getItem("transactions");
      const savedPendingRewards = localStorage.getItem("pendingRewards");
      const savedPremium = localStorage.getItem("isPremium");
      const savedCurrency = localStorage.getItem("currency");
      
      if (savedPremium) setIsPremium(JSON.parse(savedPremium));
      if (savedCurrency) setCurrency(savedCurrency);
      if (savedBalance) {
        const b = parseFloat(savedBalance);
        if (!Number.isNaN(b)) setBalanceLS(b);
      }
      if (savedPendingRewards) {
        const pr = parseFloat(savedPendingRewards);
        if (!Number.isNaN(pr)) setPendingRewardsLS(pr);
      }
      if (savedTransactions) {
        const tx = JSON.parse(savedTransactions);
        if (Array.isArray(tx)) {
          setTransactionsLS(tx);
          setRecentActivity(
            tx.map((t: any) => ({
              id: t.id ?? Date.now(),
              kid: "Ahmed",
              title: t.title ?? "Transaction",
              amount: t.amount ?? 0,
              type: t.type === "income" ? "income" : "expense",
              date: t.date ?? "Just now",
            }))
          );
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    const onStorage = () => {
      const savedCurrency = localStorage.getItem("currency");
      if (savedCurrency) setCurrency(savedCurrency);
    };
    const onFocus = () => {
      const savedCurrency = localStorage.getItem("currency");
      if (savedCurrency) setCurrency(savedCurrency);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const convertCurrency = (amount: number) => {
    const rate = (exchangeRates as any)[currency] || 1;
    return (amount * rate).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const currencySymbol = currency === "PKR" ? "Rs" : currency === "AED" ? "د.إ" : "$";

  const handleVerifyPin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setPinError("Session expired, please login again");
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('parent_pin')
        .eq('id', session.user.id)
        .single();

      const correctPin = profile?.parent_pin || "1234";

      if (enteredPin === correctPin) {
        setAuthorized(true);
        setPinModalOpen(false);
        setPinError(null);
      } else {
        setPinError("Wrong PIN, try again");
        setEnteredPin("");
      }
    } catch (err) {
      setPinError("Error verifying PIN");
    }
  };

  const handleApproveReward = (id: number) => {
    const reward = pendingRewards.find(r => r.id === id);
    setPendingRewards(prev => prev.filter(r => r.id !== id));
    setShowSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#D4AF37", "#FFFFFF", "#997A1F"]
    });
    setTimeout(() => setShowSuccess(false), 3000);
    if (reward) {
      try {
        const savedBalance = localStorage.getItem("balance");
        const savedPendingRewards = localStorage.getItem("pendingRewards");
        const savedTransactions = localStorage.getItem("transactions");
        const currentBalance = savedBalance ? parseFloat(savedBalance) : 0;
        const currentPending = savedPendingRewards ? parseFloat(savedPendingRewards) : 0;
        const newBalance = currentBalance + reward.amount;
        const newPending = Math.max(currentPending - reward.amount, 0);
        const currentTx = savedTransactions ? JSON.parse(savedTransactions) : [];
        const newTxEntry = {
          id: Date.now(),
          title: "Learning Rewards",
          amount: reward.amount,
          type: "income",
          category: "study",
          date: "Just now",
        };
        const newTx = [newTxEntry, ...currentTx];
        localStorage.setItem("balance", newBalance.toString());
        localStorage.setItem("pendingRewards", newPending.toString());
        localStorage.setItem("transactions", JSON.stringify(newTx));
        setBalanceLS(newBalance);
        setPendingRewardsLS(newPending);
        setTransactionsLS(newTx);
        setRecentActivity(
          newTx.map((t: any) => ({
            id: t.id,
            kid: "Ahmed",
            title: t.title,
            amount: t.amount,
            type: t.type === "income" ? "income" : "expense",
            date: t.date,
          }))
        );
      } catch {}
    }
  };

  if (!hasMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
      <AnimatePresence>
        {pinModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111] border-2 border-[#D4AF37]/40 p-8 rounded-[2.5rem] w-full max-w-xs relative text-center"
            >
              <h3 className="text-xl font-black text-white mb-2">Parent Access</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-6">Enter 4-digit PIN</p>
              <input
                type="password"
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="****"
                maxLength={4}
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 text-3xl font-bold text-center tracking-[1em] focus:outline-none focus:border-[#D4AF37] text-[#D4AF37]"
              />
              {pinError && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mb-4 text-xs font-bold text-red-400 bg-red-500/10 px-3 py-2 rounded-xl"
                >
                  {pinError}
                </motion.div>
              )}
              <button
                onClick={handleVerifyPin}
                className="w-full bg-[#D4AF37] text-black font-black py-3 rounded-2xl shadow-lg hover:bg-[#F2D06B] transition-colors uppercase tracking-widest"
              >
                Verify PIN
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-24 md:h-36 flex items-center justify-between relative">
          {/* Left Side: Text Branding */}
          <div className="flex items-center">
            <span className="text-[#D4AF37] font-black tracking-[0.2em] text-xs md:text-sm uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              AL NIBRAS FINANCE
            </span>
          </div>

          {/* Center: Logo and Text Branding */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
            <img 
              src="/logo-new.png" 
              alt="Al-Nibras Logo" 
              className="h-20 md:h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
            />
            <h1 className="mt-1 font-serif text-xl md:text-2xl font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] to-[#AA841E] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              AL NIBRAS
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsFrozen(!isFrozen)}
              className={`group flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all active:scale-95 border-2 ${
                isFrozen 
                ? 'bg-red-600 border-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)]' 
                : 'bg-black border-red-500/50 text-red-500 hover:bg-red-500/10 shadow-[0_0_20px_rgba(220,38,38,0.1)]'
              }`}
            >
              <Lock className={`w-4 h-4 ${isFrozen ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">{isFrozen ? 'All Cards Frozen' : 'Freeze All Cards'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          
          {/* Left Column: Family Overview & Activity */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Family Overview Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Users className="text-[#D4AF37] w-6 h-6" />
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Family Overview</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {kids.map((kid) => (
                  <motion.div 
                    key={kid.id}
                    whileHover={{ y: -5 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all"
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl overflow-hidden">
                            {kid.icon.startsWith('/') ? (
                              <img src={kid.icon} alt={kid.name} className="w-full h-full object-contain" />
                            ) : (
                              kid.icon
                            )}
                          </div>
                          <div>
                            <h3 className="font-black text-lg">{kid.name}</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Active Balance</p>
                          </div>
                        </div>
                        <TrendingUp className="w-5 h-5 text-[#D4AF37]/50" />
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-3xl font-black text-white tabular-nums">
                          {currencySymbol}{convertCurrency(kid.name === "Ahmed" ? balanceLS : kid.balance)}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-gray-500">Course Progress</span>
                          <span className="text-[#D4AF37]">{kid.courseProgress}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${kid.courseProgress}%` }}
                            className="bg-gradient-to-r from-[#997A1F] to-[#D4AF37] h-full shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Decorative Background Glow */}
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl group-hover:bg-[#D4AF37]/10 transition-all" />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Pending Rewards Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Award className="text-[#D4AF37] w-6 h-6" />
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Pending Rewards</h2>
              </div>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {pendingRewards.length > 0 ? (
                    pendingRewards.map((reward) => (
                      <motion.div 
                        key={reward.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/5 border border-white/10 p-5 md:p-6 rounded-[2rem] backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-[#D4AF37]/20 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                            <GraduationCap className="text-[#D4AF37] w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">{reward.kid}</span>
                              <span className="w-1 h-1 rounded-full bg-white/20" />
                              <span className="text-[10px] text-gray-500 font-bold">{reward.date}</span>
                            </div>
                            <p className="font-bold text-white mt-0.5">{reward.module}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="text-right">
                            <p className="text-xl font-black text-green-500">+{currencySymbol}{convertCurrency(reward.amount)}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Completion Bonus</p>
                          </div>
                          <button 
                            onClick={() => handleApproveReward(reward.id)}
                            className="flex-1 md:flex-none bg-[#D4AF37] text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#F2D06B] transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                          >
                            Approve
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-white/5 border border-white/5 p-12 rounded-[2.5rem] text-center opacity-50">
                      <Check className="mx-auto w-12 h-12 text-[#D4AF37] mb-4" />
                      <p className="text-sm font-bold uppercase tracking-widest">All Rewards Processed</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Dark Premium Activity List */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <History className="text-[#D4AF37] w-6 h-6" />
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Recent Family Activity</h2>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-md overflow-hidden divide-y divide-white/5">
                {recentActivity.map((item) => (
                  <div key={item.id} className="p-5 md:p-6 flex items-center justify-between hover:bg-white/5 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} border border-white/5`}>
                        {item.type === 'income' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">{item.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-tighter">{item.kid}</span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span className="text-[10px] text-gray-500 font-bold">{item.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className={`text-lg md:text-xl font-black tabular-nums ${item.type === 'income' ? 'text-green-500' : 'text-white'}`}>
                      {item.type === 'income' ? '+' : '-'}{currencySymbol}{convertCurrency(Math.abs(item.amount))}
                    </p>
                  </div>
                ))}
                <button className="w-full py-4 text-[10px] font-black text-gray-500 hover:text-[#D4AF37] uppercase tracking-widest transition-colors">
                  View Detailed Statement
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Control Center */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Control Center Sidebar Card */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md shadow-2xl relative overflow-hidden">
              <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
                <Settings className="text-[#D4AF37] w-5 h-5" />
                Control Center
              </h3>
              
              <div className="space-y-10">
                {/* 3D Black Platinum Card Customizer */}
                {isPremium && (
                   <div className="pt-2">
                     <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-2 block">Personalized Platinum Card</label>
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Child's Name for Card</label>
                     <input 
                       type="text" 
                       value={cardHolderName} 
                       onChange={(e) => setCardHolderName(e.target.value.toUpperCase())}
                       placeholder="AHMED"
                       className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-black text-white focus:outline-none focus:border-[#D4AF37] uppercase tracking-widest"
                     />
 
                     <motion.div 
                       key={cardHolderName}
                       whileHover={{ rotateY: 12, rotateX: -6 }}
                       style={{ perspective: 1000 }}
                       className="mt-6 w-full aspect-[1.58/1] rounded-[1.5rem] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[#D4AF37] transition-all"
                     >
                       {/* Obsidian Black + Brushed Metal Gradient */}
                       <div
                         className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2c2c2c] to-[#000000]"
                       />
                       
                       {/* Brushed Metal Texture Overlay */}
                       <div className="absolute inset-0 opacity-10 pointer-events-none" 
                         style={{ 
                           backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px)',
                           backgroundSize: '100% 2px'
                         }} 
                       />

                       {/* Subtle metallic sheen */}
                       <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-30 pointer-events-none" />
 
                       {/* Card Content */}
                       <div className="relative h-full p-8 text-white flex flex-col">
                         {/* Top Row: Chip + Logo */}
                         <div className="flex justify-between items-start mb-2">
                           {/* Gold Sim Chip */}
                           <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-[#F7E28B] via-[#D4AF37] to-[#997A1F] relative overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_2px_4px_rgba(0,0,0,0.3)] border border-[#D4AF37]/50">
                             <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-[2px] p-[3px] opacity-40">
                               <div className="border-r border-b border-black/20" />
                               <div className="border-r border-b border-black/20" />
                               <div className="border-b border-black/20" />
                               <div className="border-r border-black/20" />
                               <div className="border-r border-black/20" />
                               <div />
                             </div>
                           </div>
                           
                           <div className="flex flex-col items-end gap-1 pb-2">
                              <div className="flex flex-col items-center">
                                <img 
                                  src="/logo-new.png" 
                                  alt="Al-Nibras Logo" 
                                  className="w-24 md:w-28 h-auto object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" 
                                />
                                <span className="mt-0.5 font-serif text-[10px] font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] to-[#AA841E] drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]">
                                  AL NIBRAS
                                </span>
                              </div>
                              <div className="mt-1 text-[8px] font-black tracking-[0.1em] text-[#D4AF37] bg-black/40 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 backdrop-blur-md uppercase shadow-inner">
                                Elite Member
                              </div>
                            </div>
                         </div>
 
                         {/* Middle Row: Contactless Icon */}
                         <div className="flex items-center gap-4 mt-1">
                           <Wifi className="w-6 h-6 text-[#D4AF37]/60 rotate-90" strokeWidth={1.5} />
                         </div>
 
                         {/* Card Number */}
                         <div className="mt-auto mb-4">
                           <p className="text-lg md:text-xl tracking-[0.25em] font-mono text-[#D4AF37] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] font-bold">
                             **** **** **** 1234
                           </p>
                         </div>
 
                         {/* Embossed Name & Expiry */}
                         <div className="flex items-end justify-between">
                           <div className="flex flex-col">
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Card Holder</p>
                             <p className="text-sm md:text-base font-black uppercase tracking-[0.15em] text-[#D4AF37] drop-shadow-[1px_2px_2px_rgba(0,0,0,0.8)]">
                               {cardHolderName || "AHMED"}
                             </p>
                           </div>
                           <div className="text-right">
                             <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Valid Thru</p>
                             <p className="text-xs font-bold text-[#D4AF37] tracking-widest drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">03/28</p>
                           </div>
                         </div>
 
                         {/* Shine sweep animation */}
                          <motion.div
                            initial={{ x: '-150%', skewX: -20 }}
                            animate={{ x: '150%', skewX: -20 }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
                            className="pointer-events-none absolute inset-0 w-1/2"
                            style={{
                              background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.1) 50%, transparent 100%)',
                              filter: 'blur(20px)',
                            }}
                          />
                        </div>
                      </motion.div>
 
                     {/* Order Button + Toast */}
                     <div className="mt-4">
                       <button
                         onClick={() => {
                           setShowSuccess(false);
                           setShowSuccess(true);
                           setTimeout(() => setShowSuccess(false), 1500);
                           alert('Coming Soon');
                         }}
                         className="w-full bg-[#D4AF37] text-black font-black py-3 rounded-xl text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-[#F2D06B] transition-colors"
                       >
                         Request Physical Premium Card
                       </button>
                     </div>
                   </div>
                )}

                {/* Spending Limit Slider */}
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Spending Limit</label>
                    <span className="text-xs font-black text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 rounded-xl border border-[#D4AF37]/20">{currencySymbol}{convertCurrency(spendingLimit)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="1000" 
                    step="10"
                    value={spendingLimit}
                    onChange={(e) => setSpendingLimit(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                  />
                  <div className="flex justify-between mt-3 text-[9px] text-gray-500 font-black uppercase tracking-widest">
                    <span>{currencySymbol}{convertCurrency(10)}</span>
                    <span>{currencySymbol}{convertCurrency(1000)}</span>
                  </div>
                </div>

                {/* Permission Toggles */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-[#D4AF37] transition-all">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Online Shopping</p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">E-commerce access</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setOnlineShopping(!onlineShopping)}
                      className={`w-12 h-6 rounded-full transition-all relative border border-white/10 ${onlineShopping ? 'bg-[#D4AF37]' : 'bg-white/5'}`}
                    >
                      <motion.div 
                        animate={{ x: onlineShopping ? 24 : 4 }} 
                        className={`absolute top-1 w-3.5 h-3.5 rounded-full shadow-sm ${onlineShopping ? 'bg-black' : 'bg-white/20'}`} 
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-[#D4AF37] transition-all">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Send Money</p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">P2P Transfers</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSendMoneyPermission(!sendMoneyPermission)}
                      className={`w-12 h-6 rounded-full transition-all relative border border-white/10 ${sendMoneyPermission ? 'bg-[#D4AF37]' : 'bg-white/5'}`}
                    >
                      <motion.div 
                        animate={{ x: sendMoneyPermission ? 24 : 4 }} 
                        className={`absolute top-1 w-3.5 h-3.5 rounded-full shadow-sm ${sendMoneyPermission ? 'bg-black' : 'bg-white/20'}`} 
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-10 pt-8 border-t border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Shield className="text-green-500 w-4 h-4" />
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">
                  Security protocols active. <br/>Account is 100% secure.
                </p>
              </div>
            </div>

            {/* Quick Tips / Warning */}
            <div className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-6 flex items-start gap-4">
              <AlertTriangle className="text-red-500 w-6 h-6 shrink-0 mt-1" />
              <div>
                <h4 className="font-black text-red-500 text-xs uppercase tracking-widest mb-1">Alert Center</h4>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  Freezing all cards will immediately stop all POS and Online transactions across all family accounts.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-green-500/20 p-8 rounded-[2.5rem] backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Shield className="text-green-500 w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Family Protection (Takaful)</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Micro-Takaful for everyday safety</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">
                  <Shield className="inline w-3.5 h-3.5 mr-1" /> Certified Shariah Compliant
                </span>
              </div>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
                <div>
                  <p className="text-sm font-bold text-white">Micro-Accident Cover</p>
                  <p className="text-[10px] text-gray-500">Starts at Rs. 50/month</p>
                </div>
                <button 
                  onClick={() => setMicroCoverEnabled(!microCoverEnabled)}
                  className={`w-12 h-6 rounded-full transition-all relative border ${microCoverEnabled ? 'bg-green-500 border-green-500' : 'bg-white/10 border-white/10'}`}
                >
                  <motion.div 
                    animate={{ x: microCoverEnabled ? 24 : 4 }} 
                    className={`absolute top-1 w-4 h-4 rounded-full shadow-sm ${microCoverEnabled ? 'bg-white' : 'bg-white/20'}`} 
                  />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-3">
                Pay-as-you-go coverage designed for families, priced for mass access.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div className="bg-[#D4AF37] text-black px-10 py-5 rounded-[2.5rem] shadow-[0_0_50px_rgba(212,175,55,0.4)] flex flex-col items-center gap-2 border-4 border-black/10">
              <Check className="w-12 h-12" strokeWidth={4} />
              <p className="font-black text-2xl uppercase tracking-tighter">Approved!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <NibrasAIChat mode="parent" userName="Parent" />
    </div>
  );
}
