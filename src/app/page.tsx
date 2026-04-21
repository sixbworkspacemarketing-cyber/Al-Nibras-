"use client";


import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NibrasAIChat from "@/components/NibrasAIChat";
import AppPreview from "@/components/AppPreview";
import PremiumBackground from "@/components/PremiumBackground";
import LoadingScreen from "@/components/LoadingScreen";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';
import { useTheme } from "@/lib/ThemeContext";
import { requestNotificationPermission, showNotification } from "@/lib/notifications";
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  ChevronRight,
  Lightbulb,
  X,
  Check,
  Bell,
  Shield,
  Book,
  Send,
  HelpCircle,
  TrendingUp,
  Globe,
  Crown,
  Wallet,
  BarChart3,
  Award,
  CreditCard,
  LayoutDashboard,
  Play,
  Search,
  Filter,
  Moon,
  Sun,
  Loader2,
  Sparkles,
  Star,
  Zap
} from "lucide-react";
import confetti from "canvas-confetti";

const quotes = [
  "Saving just $1 a day becomes $365 in a year! 💰",
  "Sharing with others (Sadaqah) brings Barakah to your wealth. ✨",
  "Small drops make an ocean. Start saving today! 🌊",
  "Always plan your spending before going to the shop! 📝",
];

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [hasMounted, setHasMounted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
        if (profile.role === 'admin') {
          router.push('/admin');
          return;
        }
      } else {
        // Fallback for missing profile
        setUserProfile({ full_name: session.user.email?.split('@')[0], role: 'user' });
      }

      setAuthChecked(true);
      requestNotificationPermission();
    };
    checkAuth();
  }, [router]);

  const userName = userProfile?.full_name || "User";

  const [isPremium, setIsPremium] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [exchangeRates] = useState({ USD: 1, PKR: 280, AED: 3.67 });
  const [balance, setBalance] = useState(1240.50);
  const [dailyQuote, setDailyQuote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [inputAmount, setInputAmount] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendRecipient, setSendRecipient] = useState("");

  const [transactions, setTransactions] = useState([
    { id: 1, title: "Pocket Money", amount: 50, type: "income", category: "deposit", date: "Today" },
    { id: 2, title: "Ice Cream", amount: -15, type: "expense", category: "transfer", date: "Yesterday" },
  ]);

  const [rewardTasks, setRewardTasks] = useState([
    { id: 1, title: "Read 5 pages of a book", reward: 5, status: "pending" },
    { id: 2, title: "Pray Salah on time", reward: 2, status: "pending" },
    { id: 3, title: "Clean your study desk", reward: 3, status: "completed" },
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    { id: 101, type: "Send Money", amount: 20, recipient: "Friend", date: "10 mins ago" },
  ]);

  const [pendingRewards, setPendingRewards] = useState(0);
  const [studyingCourseId, setStudyingCourseId] = useState<number | null>(null);
  const [studyTimer, setStudyTimer] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");

  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizResult, setQuizResult] = useState<{ success: boolean; message: string } | null>(null);

  const [matchingEnabled, setMatchingEnabled] = useState(false);
  const [parentRating, setParentRating] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [previouslyUnlocked, setPreviouslyUnlocked] = useState<string[]>([]);
  const [lastUnlockedBadge, setLastUnlockedBadge] = useState<string | null>(null);
  const [hoveredBadgeId, setHoveredBadgeId] = useState<string | null>(null);

  const [goals, setGoals] = useState([
    { id: 1, title: "New Bicycle", current: 350, parentBonus: 35, target: 500, icon: "🚲" },
    { id: 2, title: "Gaming Console", current: 800, parentBonus: 80, target: 1200, icon: "🎮" },
  ]);

  const [courses, setCourses] = useState<any[]>([]);
  const [adminBadges, setAdminBadges] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);

  // 2. Constants
  const quizQuestions = [
    {
      question: "What is Zakat?",
      options: ["Charity", "Prayer", "Fasting", "Hajj"],
      correctAnswer: "Charity",
      hint: "It is one of the Five Pillars of Islam that involves giving to the needy. ✨"
    },
    {
      question: "What is Sadaqah?",
      options: ["Voluntary Charity", "Obligatory Tax", "Daily Prayer", "Holy Pilgrimage"],
      correctAnswer: "Voluntary Charity",
      hint: "It's an act of giving that you do out of the kindness of your heart! ❤️"
    },
    {
      question: "What is the meaning of 'Barakah'?",
      options: ["Blessing", "Money", "Work", "Sleep"],
      correctAnswer: "Blessing",
      hint: "It means an increase or growth in goodness. ✨"
    }
  ];

  // 3. Derived State/Calculations (Depends on base states)
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSpent = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  const spendingRatio = totalIncome > 0 ? Math.min((totalSpent / totalIncome) * 100, 100) : 0;
  const savingRatio = 100 - spendingRatio;
  const healthScore = Math.round(Math.min(100, Math.max(0, savingRatio)));

  const completedCoursesCount = courses.filter(c => c.progress === 100).length;

  const achievements = [
    {
      id: 'first-saver',
      title: 'First Saver',
      icon: '🏆',
      unlocked: balance >= 100,
      desc: 'Balance > $100',
      requirement: 'Save more than $100 in total balance to unlock! 💰'
    },
    {
      id: 'course-master',
      title: 'Course Master',
      icon: '🎓',
      unlocked: completedCoursesCount >= 2,
      desc: '2 Courses Done',
      requirement: 'Complete at least 2 learning courses to become a master! 📖'
    },
    {
      id: 'smart-shopper',
      title: 'Smart Shopper',
      icon: '🛍️',
      unlocked: savingRatio >= 80 && totalIncome > 0,
      desc: '80% Savings',
      requirement: 'Keep your monthly savings ratio above 80% to earn this! ✨'
    }
  ];

  const dailyQuiz = hasMounted ? quizQuestions[new Date().getDate() % quizQuestions.length] : quizQuestions[0];

  // 4. Utility Functions
  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.1); // A5

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      // Audio play failed silenty
    }
  };

  const getTransactionIcon = (category: string, type: string) => {
    if (category === 'study') return <Book className="w-5 h-5 md:w-6 md:h-6" />;
    if (category === 'transfer') return <Send className="w-5 h-5 md:w-6 md:h-6" />;
    if (category === 'reward') return <Check className="w-5 h-5 md:w-6 md:h-6" />;
    return type === 'income' ? <ArrowDownLeft className="w-5 h-5 md:w-6 md:h-6" /> : <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />;
  };

  const refreshQuote = () => {
    setDailyQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  // 5. Handlers
  const handleStartLearning = (id: number) => {
    if (studyingCourseId) return;
    setStudyingCourseId(id);
    setStudyTimer(10);
  };

  const handleApproveReward = async () => {
    const { validateParentPin } = await import("@/app/actions");
    const result = await validateParentPin(enteredPin);
    
    if (result.valid) {
      if (pendingRewards > 0) {
        setBalance(prev => prev + pendingRewards);
        setTransactions([
          { id: Date.now(), title: "Learning Rewards", amount: pendingRewards, type: "income", category: "study", date: "Just now" },
          ...transactions
        ]);
        setPendingRewards(0);
        setShowSuccess(true);
        showNotification("Reward Approved! 🎉", `Ahmed received $${pendingRewards} for learning.`);
        setTimeout(() => setShowSuccess(false), 3000);
      }
      setPinModalOpen(false);
      setEnteredPin("");
    } else {
      alert(result.error || "Incorrect PIN! Please check your parent PIN.");
      setEnteredPin("");
    }
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === dailyQuiz.correctAnswer) {
      setQuizResult({ success: true, message: "Correct! $2 Reward added to Pending Rewards. 🎉" });
      setPendingRewards(prev => prev + 2);
      playSuccessSound();
      showNotification("Quiz Master! 🧠", "You answered correctly and earned a reward!");
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#FFFFFF", "#997A1F"]
      });
      setTimeout(() => {
        setQuizModalOpen(false);
        setQuizAnswer("");
        setQuizResult(null);
      }, 3000);
    } else {
      setQuizResult({ success: false, message: `Oops! Hint: ${dailyQuiz.hint}` });
    }
  };

  const handleAddMoneyToGoal = (goalId: number, amount: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = goal.current + amount;
        const bonusAmount = matchingEnabled ? Math.floor(amount / 10) * 1 : 0;
        return {
          ...goal,
          current: newCurrent,
          parentBonus: (goal.parentBonus || 0) + bonusAmount
        };
      }
      return goal;
    }));
  };

  const handleApproveRequest = (id: number, amount: number, recipient: string) => {
    setBalance(prev => prev - amount);
    setTransactions([
      {
        id: Date.now(), title: `Transfer to ${recipient}`, amount: -amount, type: "expense", date: "Just now",
        category: ""
      },
      ...transactions
    ]);
    setPendingRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleDeclineRequest = (id: number) => {
    setPendingRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleCompleteTask = (id: number, reward: number) => {
    setRewardTasks(prev => prev.map(task =>
      task.id === id ? { ...task, status: "completed" } : task
    ));
    setBalance(prev => prev + reward);
    playSuccessSound();
    showNotification("Task Complete! ✅", `You finished "${rewardTasks.find(t => t.id === id)?.title}" and earned $${reward}!`);
    setTransactions([
      { id: Date.now(), title: "Task Reward", amount: reward, type: "income", category: "reward", date: "Just now" },
      ...transactions
    ]);
  };

  const handleAddMoney = () => {
    const amount = parseFloat(inputAmount);
    if (amount > 0) {
      setBalance(prev => prev + amount);
      setTransactions([
        { id: Date.now(), title: "Deposit", amount: amount, type: "income", category: "deposit", date: "Just now" },
        ...transactions
      ]);
      playSuccessSound();
      showNotification("Money Added! 💰", `$${amount} successfully added to your balance.`);
      setIsModalOpen(false);
      setInputAmount("");
    }
  };

  const handleSendMoney = () => {
    const amount = parseFloat(sendAmount);
    if (amount > 0 && amount <= balance && sendRecipient.trim() !== "") {
      setBalance(prev => prev - amount);
      setTransactions([
        { id: Date.now(), title: `Transfer to ${sendRecipient}`, amount: -amount, type: "expense", category: "transfer", date: "Just now" },
        ...transactions
      ]);
      showNotification("Money Sent! 🚀", `$${amount} sent to ${sendRecipient}.`);
      setIsSendModalOpen(false);
      setSendAmount("");
      setSendRecipient("");
    } else if (amount > balance) {
      alert("Incomplete Balance! ❌");
    }
  };

  // 6. Effects
  useEffect(() => {
    const savedBalance = localStorage.getItem("balance");
    const savedTransactions = localStorage.getItem("transactions");
    const savedRewardTasks = localStorage.getItem("rewardTasks");
    const savedPendingRequests = localStorage.getItem("pendingRequests");
    const savedPendingRewards = localStorage.getItem("pendingRewards");
    const savedMatching = localStorage.getItem("matchingEnabled");
    const savedGoals = localStorage.getItem("goals");
    const savedRating = localStorage.getItem("parentRating");
    const savedPremium = localStorage.getItem("isPremium");
    const savedCurrency = localStorage.getItem("currency");

    if (savedBalance) setBalance(parseFloat(savedBalance));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedRewardTasks) setRewardTasks(JSON.parse(savedRewardTasks));
    if (savedPendingRequests) setPendingRequests(JSON.parse(savedPendingRequests));
    if (savedPendingRewards) setPendingRewards(parseFloat(savedPendingRewards));
    if (savedMatching) setMatchingEnabled(JSON.parse(savedMatching));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedRating) setParentRating(parseInt(savedRating));
    if (savedPremium) setIsPremium(JSON.parse(savedPremium));
    if (savedCurrency) setCurrency(savedCurrency);

    setHasMounted(true);
    refreshQuote();

    const fetchCMS = async () => {
      const [booksRes, coursesRes, badgesRes] = await Promise.all([
        supabase.from('app_books').select('*'),
        supabase.from('app_courses').select('*'),
        supabase.from('app_badges').select('*')
      ]);
      if (booksRes.data) setBooks(booksRes.data);
      if (coursesRes.data) {
        setCourses(coursesRes.data.map((c: any) => ({ ...c, progress: Math.floor(Math.random() * 30) }))); // Random progress for now
      }
      if (badgesRes.data) setAdminBadges(badgesRes.data);
    };
    fetchCMS();
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem("balance", balance.toString());
      localStorage.setItem("transactions", JSON.stringify(transactions));
      localStorage.setItem("courses", JSON.stringify(courses));
      localStorage.setItem("rewardTasks", JSON.stringify(rewardTasks));
      localStorage.setItem("pendingRequests", JSON.stringify(pendingRequests));
      localStorage.setItem("pendingRewards", pendingRewards.toString());
      localStorage.setItem("matchingEnabled", JSON.stringify(matchingEnabled));
      localStorage.setItem("goals", JSON.stringify(goals));
      localStorage.setItem("parentRating", parentRating.toString());
      localStorage.setItem("isPremium", JSON.stringify(isPremium));
      localStorage.setItem("currency", currency);
    }
  }, [balance, transactions, courses, rewardTasks, pendingRequests, pendingRewards, matchingEnabled, goals, parentRating, isPremium, currency, hasMounted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (studyingCourseId && studyTimer > 0) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev - 1);
      }, 1000);
    } else if (studyingCourseId && studyTimer === 0) {
      if (studyingCourseId !== null) {
        setPendingRewards(prev => prev + 5);
        setCourses(prev => prev.map(course =>
          course.id === studyingCourseId ? { ...course, progress: Math.min(course.progress + 10, 100) } : course
        ));
        setStudyingCourseId(null);
        alert("Lesson Completed! $5 added to Pending Rewards. 🎉");
      }
    }
    return () => clearInterval(interval);
  }, [studyingCourseId, studyTimer]);

  useEffect(() => {
    if (!hasMounted) return;
    const currentlyUnlocked = achievements.filter(a => a.unlocked).map(a => a.id);
    const newlyUnlocked = currentlyUnlocked.filter(id => !previouslyUnlocked.includes(id));
    if (newlyUnlocked.length > 0) {
      const badge = achievements.find(a => a.id === newlyUnlocked[0]);
      setLastUnlockedBadge(newlyUnlocked[0]);
      playSuccessSound();
      showNotification("Achievement Unlocked! 🏆", `You earned the "${badge?.title}" badge!`);
      setPreviouslyUnlocked(currentlyUnlocked);
      setTimeout(() => setLastUnlockedBadge(null), 2000);
    }
  }, [achievements, hasMounted, previouslyUnlocked]);

  if (!hasMounted || !authChecked) return <LoadingScreen />;

  const currentTheme = isPremium
    ? {
      bg: "bg-[#121212]", // Deep Charcoal
      accent: "text-[#D4AF37]", // Gold Leaf
      cardBg: "bg-white/5",
      border: "border-[#D4AF37]/20",
      font: "font-serif",
      button: "bg-[#D4AF37] hover:bg-[#F2D06B]",
      gradient: "from-[#1a1a1a] to-[#0a0a0a]"
    }
    : {
      bg: "bg-black",
      accent: "text-[#D4AF37]",
      cardBg: "bg-white/5",
      border: "border-white/10",
      font: "font-sans",
      button: "bg-[#D4AF37] hover:bg-[#F2D06B]",
      gradient: "from-[#001f3f]/40 to-black/60"
    };

  const convertCurrency = (amount: number) => {
    const rate = (exchangeRates as any)[currency] || 1;
    return (amount * rate).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const currencySymbol = currency === "PKR" ? "Rs" : currency === "AED" ? "د.إ" : "$";

  const [showPreview, setShowPreview] = useState(false);

  return (
    <main className={`min-h-screen ${currentTheme.bg} ${currentTheme.font} text-white max-w-6xl mx-auto relative pb-20 overflow-hidden`}>
      <PremiumBackground />
      
      {/* Floating Particles */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-[5]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D4AF37] rounded-full"
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
              x: [0, Math.random() * 50 - 25, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${15 + i * 15}%`,
              top: `${60 + Math.random() * 30}%`,
            }}
          />
        ))}
      </motion.div>
      
      {/* Header Container - Mobile Optimized */}
      <div className="flex justify-between items-center w-full p-4 md:p-8 relative">
        {/* Left Side: Text Branding - Hidden on mobile, shown on desktop */}
        <div className="hidden md:flex items-center">
          <span className="text-[#D4AF37] font-black tracking-[0.3em] text-sm md:text-base uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            AL NIBRAS FINANCE
          </span>
        </div>

        {/* Center: Logo and Text Branding - Mobile optimized */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
          <img
            src="/logo-new.png"
            alt="Al-Nibras Logo"
            className="h-16 md:h-20 lg:h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
          />
          <h1 className="mt-1 font-serif text-lg md:text-xl lg:text-2xl font-bold tracking-[0.2em] md:tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] to-[#AA841E] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            AL NIBRAS
          </h1>
        </div>

        {/* Right Side: Controls - Mobile optimized */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* Habits Circle Container - Hidden on mobile */}
          <div className="hidden lg:flex flex-col items-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-3 backdrop-blur-md hover:border-[#D4AF37]/30 transition-colors"
            >
              <div className="relative w-10 h-10">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="40%" className="stroke-white/5 fill-none" strokeWidth="5" />
                  <motion.circle
                    cx="50%" cy="50%" r="40%"
                    className="stroke-red-500/40 fill-none"
                    strokeWidth="5"
                    strokeDasharray="100 100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 100 - spendingRatio }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                  <motion.circle
                    cx="50%" cy="50%" r="40%"
                    className="stroke-[#D4AF37] fill-none"
                    strokeWidth="5"
                    strokeDasharray="100 100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: spendingRatio }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[7px] font-black text-[#D4AF37]">{Math.round(savingRatio)}%</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-gray-500 font-black uppercase tracking-tighter">Habits</span>
                <span className="text-[10px] text-white font-black">{Math.round(savingRatio)}%</span>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle - Mobile optimized */}
            <button
              onClick={toggleTheme}
              className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-[#D4AF37] hover:bg-white/10 transition-all active:scale-95 shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
            </button>

            {/* Elite Class Toggle - Mobile optimized */}
            <button
              onClick={() => setIsPremium(!isPremium)}
              className={`relative z-30 flex items-center gap-1 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl border transition-all active:scale-95 min-h-[44px] ${isPremium ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-white/5 border-white/10 text-white font-bold hover:bg-white/10'}`}
              aria-label={isPremium ? "Exit Elite Class" : "Go Premium"}
            >
              {isPremium ? <Crown className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#D4AF37]" />}
              <span className="hidden sm:inline text-xs uppercase tracking-widest">{isPremium ? "Elite Class" : "Go Premium"}</span>
            </button>

            {/* Security Shield Link - Mobile optimized */}
            <Link
              href="/parents-portal"
              className="relative z-20 inline-flex items-center justify-center p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] active:scale-95 min-w-[44px] min-h-[44px]"
              aria-label="Parents Portal"
            >
              <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="px-6">
        {/* Greeting Section - Mobile optimized */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter"
            >
              Salam, <span className="text-[#D4AF37]">{userName}!</span> 👋
            </motion.h1>
            <p className="text-gray-500 text-[9px] md:text-xs mt-1 md:mt-2 uppercase tracking-[0.3em] font-black">
              Personal Dashboard • <span className={isPremium ? "text-[#D4AF37]" : "text-green-500"}>{isPremium ? "Elite Member" : "Standard Tier"}</span>
            </p>
          </div>
          
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 bg-white/5 border border-[#D4AF37]/30 rounded-xl md:rounded-2xl hover:bg-[#D4AF37]/10 transition-all group min-h-[44px]"
            aria-label="Watch app preview"
          >
            <div className="w-7 h-7 md:w-8 md:h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-black group-hover:scale-110 transition-transform">
              <Play className="w-3 h-3 md:w-4 md:h-4 fill-current" />
            </div>
            <div className="text-left">
              <p className="text-[9px] md:text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Quick Tour</p>
              <p className="text-[7px] md:text-[8px] text-gray-500 uppercase font-bold">Watch App Preview</p>
            </div>
          </button>
        </div>

        {/* App Preview Section */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 48 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="relative">
                <button 
                  onClick={() => setShowPreview(false)}
                  className="absolute -top-2 -right-2 z-50 w-8 h-8 bg-black border border-white/10 rounded-full flex items-center justify-center text-white hover:text-[#D4AF37] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <AppPreview 
                  videoUrls={{
                    mp4: "https://assets.mixkit.co/videos/preview/mixkit-financial-data-on-a-tablet-screen-23347-large.mp4", // Placeholder
                  }}
                  thumbnail="/logo-new.png"
                  title="Al Nibras Experience"
                  description="See how we're revolutionizing Islamic finance for the next generation."
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievement Badges Row */}
        <section className="mb-8 overflow-hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {(adminBadges && adminBadges.length > 0 ? adminBadges : achievements).map((badge) => (
              <motion.div
                key={badge.id ?? badge.title}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 flex items-center gap-3 p-3 rounded-2xl border relative bg-gradient-to-br from-[#D4AF37]/20 to-black/40 border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                <div className="relative z-10 text-2xl md:text-3xl drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]">
                  {typeof badge.icon === "string" ? badge.icon : (badge.icon ?? "🏅")}
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-tighter text-[#D4AF37]">
                    {badge.title ?? badge.title}
                  </p>
                  {"kid" in badge ? (
                    <p className="text-[8px] md:text-[10px] text-gray-400 font-medium whitespace-nowrap">Assigned to: {badge.kid}</p>
                  ) : (
                    <p className="text-[8px] md:text-[10px] text-gray-400 font-medium whitespace-nowrap">{badge.desc}</p>
                  )}
                </div>
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse ml-1 relative z-10" />
              </motion.div>
            ))}
            {adminBadges.length === 0 && (
              <div className="text-[10px] md:text-xs text-gray-500 font-bold whitespace-nowrap">New badges coming soon!</div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Savings Card */}
          <motion.div
            animate={{
              borderColor: isPremium ? ["rgba(212,175,55,0.4)", "rgba(212,175,55,0.8)", "rgba(212,175,55,0.4)"] : ["rgba(212,175,55,0.2)", "rgba(212,175,55,0.6)", "rgba(212,175,55,0.2)"],
              boxShadow: isPremium ? ["0 0 0px rgba(212,175,55,0)", "0 0 40px rgba(212,175,55,0.4)", "0 0 0px rgba(212,175,55,0)"] : ["0 0 0px rgba(212,175,55,0)", "0 0 20px rgba(212,175,55,0.2)", "0 0 0px rgba(212,175,55,0)"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={`md:col-span-8 bg-gradient-to-br ${currentTheme.gradient} p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border ${currentTheme.border} relative overflow-hidden backdrop-blur-xl flex flex-col items-start`}
          >
            <div className={`mb-4 text-[10px] font-black ${isPremium ? 'bg-[#D4AF37]/20 border-[#D4AF37]/30 text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'bg-white/10 border-white/10 text-white'} border px-3 py-1 rounded-lg`}>
              {isPremium ? "Platinum Account" : "Free Forever"}
            </div>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className={`w-4 h-4 ${currentTheme.accent}`} />
                  <p className={`${currentTheme.accent}/80 text-xs md:text-sm uppercase tracking-widest`}>Total Balance</p>
                </div>
                <motion.h2 key={`${balance}-${currency}`} initial={{ scale: 1.1, color: "#D4AF37" }} animate={{ scale: 1, color: "#FFFFFF" }} className="text-4xl md:text-5xl font-bold mb-6 md:mb-8">
                  {currencySymbol}{convertCurrency(balance)}
                </motion.h2>
              </div>
              <div className="flex items-center gap-1 md:gap-2 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                <Globe className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-500 ml-1 md:ml-2" />
                {["USD", "PKR", "AED"].map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setCurrency(cur)}
                    className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[9px] md:text-[10px] font-black transition-all min-w-[36px] md:min-w-0 ${currency === cur ? "bg-[#D4AF37] text-black" : "text-gray-400 hover:text-white"}`}
                    aria-label={`Switch to ${cur} currency`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <button onClick={() => setIsModalOpen(true)} className={`${currentTheme.button} text-black font-bold py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all text-sm md:text-base min-h-[44px]`}>
                <Plus size={16} className="md:size-[18px]" /> Add Money
              </button>
              <button onClick={() => setIsSendModalOpen(true)} className="bg-white/5 border border-white/10 py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm md:text-base min-h-[44px]">
                <ArrowUpRight size={16} className="md:size-[18px]" /> Send
              </button>
            </div>
          </motion.div>

          {/* Wisdom */}
          <div className="md:col-span-4 bg-[#D4AF37]/10 p-6 rounded-[2rem] md:rounded-[2.5rem] border border-[#D4AF37]/20 flex flex-col justify-between backdrop-blur-md">
            <div>
              <Lightbulb className="text-[#D4AF37] mb-4" size={20} />
              <p className="text-xs md:text-sm italic text-gray-300">"{dailyQuote || "Loading wisdom..."}"</p>
            </div>
            <button onClick={refreshQuote} className="text-[#D4AF37] text-[10px] md:text-xs mt-4 flex items-center gap-1 hover:underline">
              Get New Tip <ChevronRight className="w-3 h-3 md:w-[14px] md:h-[14px]" />
            </button>
          </div>
        </div>

        {/* Goals Section */}
        <section className="mt-8 md:mt-12">
          <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white">Savings Goals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {goals.map(goal => (
              <div key={goal.id} className="bg-white/5 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 hover:border-[#D4AF37]/30 transition-all backdrop-blur-sm">
                <div className="flex items-center gap-3 md:gap-4 mb-4">
                  <span className="text-2xl md:text-3xl bg-white/10 p-2 md:p-3 rounded-xl">{goal.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm md:text-base">{goal.title}</h4>
                      <span className="text-[10px] text-gray-500 font-medium">Target: {currencySymbol}{convertCurrency(goal.target)}</span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <p className="text-[10px] text-[#D4AF37] font-bold">Kid: {currencySymbol}{convertCurrency(goal.current)}</p>
                      {goal.parentBonus > 0 && <p className="text-[10px] text-gray-400 font-bold">Bonus: {currencySymbol}{convertCurrency(goal.parentBonus)}</p>}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-white/10 h-2 md:h-3 rounded-full overflow-hidden relative flex">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(goal.current / goal.target) * 100}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="bg-[#D4AF37] h-full shadow-[0_0_10px_rgba(212,175,55,0.5)] z-10" />
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(goal.parentBonus / goal.target) * 100}%` }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }} className="bg-[#C0C0C0] h-full shadow-[0_0_10px_rgba(192,192,192,0.3)]" />
                </div>
                <button
                  onClick={() => {
                    const amount = 10;
                    if (balance >= amount) {
                      setBalance(prev => prev - amount);
                      handleAddMoneyToGoal(goal.id, amount);
                      setTransactions([{ id: Date.now(), title: `Saved for ${goal.title}`, amount: -amount, type: "expense", category: "transfer", date: "Just now" }, ...transactions]);
                    } else {
                      alert("Not enough balance! ❌");
                    }
                  }}
                  className="w-full mt-4 bg-white/5 border border-white/10 text-white text-[10px] font-bold py-2.5 rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all uppercase tracking-widest min-h-[44px]"
                  aria-label={`Save ${currencySymbol}${convertCurrency(10)} to ${goal.title}`}
                >
                  Save {currencySymbol}{convertCurrency(10)} to Goal
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <ShieldCheck className="text-green-500 w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Financial Health Score</h3>
                <p className="text-[10px] text-gray-500">Higher scores may unlock better Islamic Financing or Takaful rates.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-black text-green-500">{healthScore}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">Out of 100</div>
            </div>
          </div>
        </section>

        {/* Premium Elite Features: Investment Literacy */}
        {isPremium && (
          <section className="mt-12 md:mt-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#997A1F] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <TrendingUp className="text-black w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Investment Literacy</h3>
                <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest">Future Investor Module</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-[#D4AF37]/20 p-6 rounded-[2rem] backdrop-blur-md">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Gold Price (XAU)</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-white">$2,145.20</p>
                  <span className="text-green-500 text-[10px] font-bold">+1.2% ↑</span>
                </div>
                <div className="mt-4 h-16 w-full bg-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/10 flex items-end gap-1 p-2">
                  {[40, 60, 45, 70, 55, 80, 75].map((h, i) => (
                    <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="flex-1 bg-[#D4AF37]/30 rounded-t-sm" />
                  ))}
                </div>
              </div>
              <div className="bg-white/5 border border-[#D4AF37]/20 p-6 rounded-[2rem] backdrop-blur-md">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Portfolio Growth</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-white">+14.5%</p>
                  <BarChart3 className="text-[#D4AF37] w-5 h-5" />
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Ahmed's strategic savings are growing! ✨</p>
              </div>
              <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 p-6 rounded-[2rem] backdrop-blur-md flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-white text-sm mb-1 uppercase tracking-tight">Stock Market Basics</h4>
                  <p className="text-[10px] text-gray-400">Learn how companies grow and share profits.</p>
                </div>
                <button className="w-full mt-4 bg-[#D4AF37] text-black font-black py-2 rounded-xl text-[10px] uppercase tracking-widest">Open Course</button>
              </div>
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]">📚</div>
              <h3 className="text-xl md:text-2xl font-bold text-white">Islamic Library</h3>
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Premium Reading</p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {books && books.length > 0 ? (
              books.map((b: any) => (
                <motion.div key={b.id} whileHover={{ scale: 1.03 }} className="min-w-[240px] bg-white/5 border border-white/10 p-5 rounded-[1.5rem] backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-bold text-white mb-2">{b.title}</p>
                    <p className="text-[10px] text-gray-500 mb-4 break-all">{b.url}</p>
                  </div>
                  <a href={b.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center bg-[#D4AF37] text-black font-black px-4 py-2 rounded-xl text-[10px] hover:bg-[#F2D06B] transition">Read Now</a>
                </motion.div>
              ))
            ) : (
              <div className="text-[10px] md:text-xs text-gray-500 font-bold whitespace-nowrap">New books coming soon!</div>
            )}
          </div>
        </section>

        {/* Learning Section */}
        <section className="mt-12 md:mt-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Learning & Rewards</h3>
              <p className="text-gray-400 text-xs md:text-sm mb-3">Study and earn rewards for your savings!</p>
              <div className={`inline-block text-[9px] font-black ${isPremium ? 'bg-[#D4AF37]/20 border-[#D4AF37]/30 text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'bg-white/10 border-white/10 text-white'} border px-2 py-1 rounded`}>
                Islamic Education • {isPremium ? "Elite Access" : "Free Forever"}
              </div>
            </div>
            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-2 rounded-2xl flex items-center gap-3">
              <div className="bg-[#D4AF37] p-1.5 rounded-lg text-black"><Plus className="w-4 h-4" aria-hidden="true" /></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Pending Rewards</p>
                <p className="text-lg font-bold text-[#D4AF37]">{currencySymbol}{convertCurrency(pendingRewards)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Library Section */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Book className="w-5 h-5 text-indigo-400" />
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Mustafai Library</h4>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-4 h-[350px] overflow-y-auto no-scrollbar space-y-3">
                {books.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <Book className="w-8 h-8 text-gray-700 mb-2" />
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Library empty</p>
                  </div>
                ) : (
                  books.map((book) => (
                    <a 
                      key={book.id} 
                      href={book.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                        <Book className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{book.title}</p>
                        <p className="text-[8px] text-gray-500 uppercase tracking-tighter">Read Now • Free</p>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                    </a>
                  ))
                )}
              </div>
            </motion.div>

            {/* Daily Quiz & Learning Modules */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#D4AF37]/20 to-black/60 rounded-[2rem] md:rounded-[2.5rem] border-2 border-[#D4AF37]/30 p-5 md:p-6 flex flex-col items-center text-center group hover:border-[#D4AF37] transition-all backdrop-blur-xl relative overflow-hidden h-fit">
                <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-tighter">Daily Quiz</div>
                <HelpCircle className="text-[#D4AF37] mb-4 w-10 h-10 md:w-12 md:h-12" />
                <h4 className="font-bold text-base md:text-lg mb-2 text-white">Daily Wisdom Quiz</h4>
                <p className="text-gray-400 text-[10px] md:text-xs mb-6">Answer correctly to earn <span className="text-[#D4AF37] font-bold">{currencySymbol}{convertCurrency(2)} reward!</span></p>
                <button onClick={() => setQuizModalOpen(true)} className="w-full bg-[#D4AF37] text-black font-black py-3 rounded-xl md:rounded-2xl text-xs md:text-sm hover:bg-[#F2D06B] transition-all uppercase tracking-widest min-h-[44px]">Start Quiz</button>
              </motion.div>

              {courses.length === 0 ? (
                 <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center justify-center text-gray-500 text-xs font-bold uppercase italic">
                    Loading Courses...
                 </div>
              ) : (
                courses.slice(0, 1).map((course) => (
                  <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#001f3f]/30 rounded-[2rem] md:rounded-[2.5rem] border border-[#D4AF37]/10 overflow-hidden flex flex-col group hover:border-[#D4AF37]/40 transition-all backdrop-blur-md">
                    <div className="h-28 bg-gradient-to-br from-[#001f3f] to-black flex items-center justify-center text-4xl relative">
                      {studyingCourseId === course.id ? (
                        <div className="text-2xl font-black text-[#D4AF37]">{studyTimer}s</div>
                      ) : (
                        <span className="group-hover:scale-110 transition-transform">{course.thumbnail || "📚"}</span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-bold text-sm text-white mb-1 truncate">{course.title}</h4>
                      <p className="text-gray-400 text-[10px] mb-3 line-clamp-1">{course.description}</p>
                      <button onClick={() => handleStartLearning(course.id)} className="mt-auto w-full bg-white/5 border border-white/10 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all min-h-[44px]">
                        Study Now
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Remaining Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {courses.slice(1).map((course, index) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white/5 rounded-[1.5rem] border border-white/5 p-4 flex gap-4 items-center group hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {course.thumbnail || "📖"}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-white text-xs truncate">{course.title}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="bg-[#D4AF37] h-full" style={{ width: `${course.progress}%` }} />
                    </div>
                    <span className="text-[8px] text-[#D4AF37] font-bold">{course.progress}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* History */}
        <section className="mt-12 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight">Recent History</h3>
            
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search transactions..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#D4AF37] w-full sm:w-48"
                />
              </div>
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                {(["all", "income", "expense"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1 rounded-lg text-[10px] uppercase font-black transition-all ${filterType === type ? "bg-[#D4AF37] text-black" : "text-gray-500 hover:text-white"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-[1.5rem] md:rounded-[2.5rem] divide-y divide-white/5 overflow-hidden border border-white/10 backdrop-blur-md">
            {filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
              <div key={t.id} className="p-4 md:p-5 flex justify-between items-center hover:bg-white/5 transition-all">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center ${t.type === 'income' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {getTransactionIcon(t.category || '', t.type)}
                  </div>
                  <div>
                    <p className="font-bold text-sm md:text-lg text-white">{t.title}</p>
                    <p className="text-[10px] md:text-xs text-gray-500">{t.date}</p>
                  </div>
                </div>
                <p className={`font-black text-base md:text-xl ${t.type === 'income' ? 'text-green-500' : 'text-white'}`}>
                  {t.type === 'income' ? '+' : ''}${Math.abs(t.amount)}
                </p>
              </div>
            )) : (
              <div className="p-12 text-center opacity-50 flex flex-col items-center gap-3">
                <Search className="w-10 h-10 text-gray-500" />
                <p className="text-sm font-bold uppercase tracking-widest text-gray-500">No transactions found</p>
              </div>
            )}
          </div>
        </section>

        {/* Parents Portal */}
        <section className="mt-16 mb-16 border-t border-white/10 pt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#D4AF37] rounded-xl md:rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <Shield className="text-black w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">Parents Control Center</h3>
              <p className="text-gray-400 text-[10px] md:text-sm">Secure management for Ahmed's account</p>
            </div>
            <button onClick={() => setIsReportModalOpen(true)} className="ml-auto bg-[#D4AF37] text-black text-[10px] md:text-xs font-black px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl hover:bg-[#F2D06B] transition-all uppercase tracking-widest shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2">
              <Book className="w-4 h-4" aria-hidden="true" /> Weekly Report Card
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#001f3f]/20 rounded-[2rem] md:rounded-[2.5rem] border border-[#D4AF37]/10 p-6 md:p-8 backdrop-blur-md">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-base md:text-lg flex items-center gap-2 text-[#D4AF37]"><Plus className="w-4 h-4" /> Daily Tasks</h4>
                <span className="text-[8px] md:text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded-full font-bold uppercase tracking-wider">Parents Only</span>
              </div>
              <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${matchingEnabled ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-gray-500'}`}><Shield className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-white text-sm">Matching Contribution</p>
                    <p className="text-[10px] text-gray-400">Parent adds $1 for every $10 saved</p>
                  </div>
                </div>
                <button onClick={() => setMatchingEnabled(!matchingEnabled)} className={`w-12 h-6 rounded-full transition-all relative ${matchingEnabled ? 'bg-[#D4AF37]' : 'bg-white/10'}`}>
                  <motion.div animate={{ x: matchingEnabled ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>
              <div className="space-y-3">
                {rewardTasks.map(task => (
                  <div key={task.id} className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5 flex items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-white text-xs md:text-base">{task.title}</p>
                      <p className="text-[#D4AF37] text-[10px] md:text-sm font-bold">+${task.reward} Reward</p>
                    </div>
                    {task.status === "pending" ? (
                      <button onClick={() => handleCompleteTask(task.id, task.reward)} className="bg-[#D4AF37] text-black text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#F2D06B] transition-colors">Confirm Completion</button>
                    ) : (
                      <div className="flex items-center gap-1 text-green-500 font-bold text-[10px] md:text-sm bg-green-500/10 px-2 py-1 rounded-lg"><Check className="w-3.5 h-3.5" /> Done</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#001f3f]/20 rounded-[2rem] md:rounded-[2.5rem] border border-[#D4AF37]/10 p-6 md:p-8 backdrop-blur-md">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-base md:text-lg flex items-center gap-2 text-[#D4AF37]"><Bell className="w-4 h-4" /> Pending Approvals</h4>
                {pendingRequests.length > 0 && <span className="w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full font-bold">{pendingRequests.length}</span>}
              </div>
              {pendingRequests.length > 0 ? (
                <div className="space-y-3">
                  {pendingRequests.map(req => (
                    <div key={req.id} className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-gray-400 text-[8px] uppercase tracking-widest">{req.type}</p>
                          <p className="font-bold text-white text-base">${req.amount} to {req.recipient}</p>
                          <p className="text-gray-500 text-[8px]">{req.date}</p>
                        </div>
                        <p className="text-red-400 font-bold text-sm">-${req.amount}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleApproveRequest(req.id, req.amount, req.recipient)} className="bg-green-500 text-white text-[10px] py-2 rounded-lg hover:bg-green-600 transition-colors">Approve</button>
                        <button onClick={() => handleDeclineRequest(req.id)} className="bg-red-500/10 text-red-500 text-[10px] py-2 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors">Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 opacity-50">
                  <ShieldCheck className="text-gray-500 mb-2 w-10 h-10" aria-hidden="true" />
                  <p className="text-gray-400 text-xs">No pending requests</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 bg-white/5 p-5 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 flex flex-col sm:flex-row gap-4 justify-around items-center text-center backdrop-blur-md">
            <div><p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Kid's Savings</p><p className="text-xl font-bold text-white">${balance.toLocaleString()}</p></div>
            <div className="w-full sm:w-px h-px sm:h-10 bg-white/10" />
            <div><p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Tasks Done</p><p className="text-xl font-bold text-white">{rewardTasks.filter(t => t.status === "completed").length}</p></div>
            <div className="w-full sm:w-px h-px sm:h-10 bg-white/10" />
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Pending Rewards</p>
              <p className="text-xl font-bold text-[#D4AF37] flex items-center gap-2 justify-center">${pendingRewards.toFixed(2)} {pendingRewards > 0 && <button onClick={() => setPinModalOpen(true)} className="bg-[#D4AF37] text-black text-[8px] px-2 py-1 rounded-lg font-black">Approve</button>}</p>
            </div>
            <div className="w-full sm:w-px h-px sm:h-10 bg-white/10" />
            <div><p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Account Safety</p><p className="text-xl font-bold text-green-500 flex items-center gap-2 justify-center"><ShieldCheck className="w-[18px] h-[18px]" /> 100%</p></div>
          </div>
        </section>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#111] border border-[#D4AF37]/30 p-8 rounded-[2.5rem] w-full max-w-sm relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X /></button>
              <h3 className="text-xl font-bold mb-6 text-[#D4AF37]">Add Savings</h3>
              <input type="number" value={inputAmount} onChange={(e) => setInputAmount(e.target.value)} placeholder="Enter amount ($)" autoFocus className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-2xl font-bold text-center focus:outline-none focus:border-[#D4AF37]" />
              <button onClick={handleAddMoney} className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-2xl shadow-lg hover:bg-[#F2D06B] transition-colors">Confirm Deposit</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSendModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#111] border border-[#D4AF37]/30 p-8 rounded-[2.5rem] w-full max-w-sm relative">
              <button onClick={() => setIsSendModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X /></button>
              <h3 className="text-xl font-bold mb-6 text-[#D4AF37]">Send Money</h3>
              <div className="space-y-4">
                <input type="text" value={sendRecipient} onChange={(e) => setSendRecipient(e.target.value)} placeholder="Recipient Name" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#D4AF37]" />
                <input type="number" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} placeholder="Amount ($)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xl font-bold text-center focus:outline-none focus:border-[#D4AF37]" />
                <button onClick={handleSendMoney} className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-2xl shadow-lg hover:bg-[#F2D06B] transition-colors mt-2">Send Now 🚀</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quizModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#111] border-2 border-[#D4AF37]/50 p-8 rounded-[2.5rem] w-full max-w-sm relative text-center">
              <button onClick={() => { setQuizModalOpen(false); setQuizResult(null); setQuizAnswer(""); }} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X /></button>
              <HelpCircle className="mx-auto text-[#D4AF37] mb-4 w-12 h-12" />
              <h3 className="text-xl font-bold mb-4 text-white">Daily Wisdom Quiz</h3>
              <p className="text-gray-300 mb-8 font-medium text-lg">"{dailyQuiz.question}"</p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {dailyQuiz.options.map((option) => (
                  <button key={option} onClick={() => setQuizAnswer(option)} className={`p-4 rounded-2xl font-bold transition-all border-2 ${quizAnswer === option ? "bg-[#D4AF37] text-black border-[#D4AF37]" : "bg-white/5 text-white border-white/10 hover:border-white/20"}`}>{option}</button>
                ))}
              </div>
              {quizResult && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className={`mb-6 p-4 rounded-2xl text-xs font-bold ${quizResult.success ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-400"}`}>{quizResult.message}</motion.div>}
              <button onClick={handleQuizSubmit} disabled={!quizAnswer || (quizResult?.success ?? false)} className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-2xl shadow-lg hover:bg-[#F2D06B] transition-colors uppercase tracking-widest disabled:opacity-50">Submit Answer</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <div className="bg-[#D4AF37] text-black px-8 py-4 rounded-[2rem] shadow-[0_0_50px_rgba(212,175,55,0.5)] flex flex-col items-center gap-2 border-4 border-black/10">
              <Check className="w-12 h-12" strokeWidth={4} />
              <p className="font-black text-2xl uppercase tracking-tighter">Approved!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#111] border-2 border-[#D4AF37]/50 p-8 rounded-[2.5rem] w-full max-w-xs relative text-center">
              <button onClick={() => setPinModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X /></button>
              <Shield className="mx-auto text-[#D4AF37] mb-4 w-12 h-12" />
              <h3 className="text-xl font-bold mb-2 text-white">Parent Verification</h3>
              <p className="text-gray-400 text-xs mb-6">Enter PIN to approve rewards</p>
              <input type="password" value={enteredPin} onChange={(e) => setEnteredPin(e.target.value)} placeholder="****" maxLength={4} autoFocus className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-3xl font-bold text-center tracking-[1em] focus:outline-none focus:border-[#D4AF37] text-[#D4AF37]" />
              <button onClick={handleApproveReward} className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-2xl shadow-lg hover:bg-[#F2D06B] transition-colors uppercase tracking-widest">Verify & Approve</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#111] border-2 border-[#D4AF37]/50 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] w-full max-w-lg relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl" />
              <button onClick={() => setIsReportModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
              <div className="text-center mb-8 md:mb-10">
                <div className="bg-[#D4AF37] w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(212,175,55,0.4)]"><Book className="text-black w-8 h-8 md:w-10 md:h-10" /></div>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Weekly Report Card</h3>
                <p className="text-[#D4AF37] text-xs md:text-sm font-bold tracking-widest uppercase mt-1">Summary for Ahmed</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8 md:mb-10">
                <div className="bg-white/5 p-4 rounded-[1.5rem] border border-white/10 text-center"><p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2">Money Earned</p><p className="text-2xl font-black text-green-500">${totalIncome.toFixed(2)}</p></div>
                <div className="bg-white/5 p-4 rounded-[1.5rem] border border-white/10 text-center"><p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2">Lessons Done</p><p className="text-2xl font-black text-[#D4AF37]">{completedCoursesCount}</p></div>
              </div>
              <div className="bg-[#001f3f]/30 p-6 rounded-[2rem] border border-[#D4AF37]/20 text-center relative">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">Parent's Rating</p>
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setParentRating(star)} className="transition-all transform hover:scale-125"><Shield size={32} className={`${star <= parentRating ? "fill-[#D4AF37] text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" : "text-white/10"}`} /></button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 italic">{parentRating === 0 ? "Rate Ahmed's behavior this week!" : parentRating === 5 ? "MashAllah! Excellent behavior! ✨" : parentRating >= 3 ? "Good job! Keep improving! 👍" : "Needs more focus! 💪"}</p>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="w-full mt-8 bg-[#D4AF37] text-black font-black py-4 rounded-2xl shadow-lg hover:bg-[#F2D06B] transition-all uppercase tracking-widest">Close Report</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <footer className="mt-20 mb-8 text-center border-t border-white/10 pt-8 space-y-2">
        <div className="text-[10px] text-gray-500 font-bold tracking-widest">Al‑Nibras Finance — Empowering the Next Generation of Financially Responsible Muslims.</div>
        <Link href="/privacy" className="block text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-[#D4AF37] transition-colors">
          Privacy Policy
        </Link>
      </footer>
    <NibrasAIChat mode="mentor" userName="Friend" />
</main>
  );
}
