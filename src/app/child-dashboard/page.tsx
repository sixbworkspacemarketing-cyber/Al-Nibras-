'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/ui/LanguageToggle';
import BackButton from '@/components/ui/BackButton';
import BalanceCard from '@/components/ui/BalanceCard';
import ShariaComplianceBadge from '@/components/ShariaComplianceBadge';
import {
  BookOpen,
  Gamepad2,
  ArrowDownLeft,
  Trophy,
  Star,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function ChildDashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'games'>('dashboard');
  const [stats, setStats] = useState({
    balance: 0,
    courses: 0,
    achievements: 0,
    transactions: [] as any[]
  });

  useEffect(() => { 
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const [profileRes, coursesRes, badgesRes] = await Promise.all([
      supabase.from('profiles').select('wallet_balance').eq('id', session.user.id).single(),
      supabase.from('app_courses').select('*', { count: 'exact', head: true }),
      supabase.from('app_badges').select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      balance: profileRes.data?.wallet_balance || 0,
      courses: coursesRes.count || 0,
      achievements: badgesRes.count || 0,
      transactions: [] // Still static for now as we don't have a transactions table yet
    });
  };

  if (!mounted) return <div className="min-h-screen bg-[#0a0a0a]" />;

  const totalReceived = stats.balance;

  const tabs = [
    { id: 'dashboard' as const, label: t('dashboard'), icon: <Star className="w-4 h-4" /> },
    { id: 'courses' as const, label: t('courses'), icon: <BookOpen className="w-4 h-4" /> },
    { id: 'games' as const, label: t('games'), icon: <Gamepad2 className="w-4 h-4" /> },
  ];

  const handleTabClick = (tab: typeof activeTab) => {
    if (tab === 'courses') {
      router.push('/child-dashboard/courses');
    } else if (tab === 'games') {
      router.push('/child-dashboard/games');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-yellow-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BackButton href="/" />
            <div className="w-10 h-10 flex items-center justify-center drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] bg-gradient-to-br from-[#FFD700]/10 to-[#AA841E]/10 rounded-xl">
              <Image src="/logo.png" alt="Al Nibras Logo" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
                {t('childDashboard')}
                <Sparkles className="w-5 h-5 text-[#FFD700]" />
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                {t('children')} • بچے
              </p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-8 p-1 bg-white/5 rounded-2xl border border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-[#FFD700] text-black shadow-[0_0_20px_rgba(255,215,0,0.2)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Balance Card */}
        <BalanceCard balance={totalReceived} label={t('myWallet')} variant="child" className="mb-8" />

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { icon: <ArrowDownLeft className="w-5 h-5 text-emerald-400" />, label: t('totalReceived'), value: `PKR ${stats.balance.toLocaleString('en-PK')}`, color: 'emerald' },
            { icon: <BookOpen className="w-5 h-5 text-blue-400" />, label: t('courses'), value: stats.courses.toString(), color: 'blue' },
            { icon: <Trophy className="w-5 h-5 text-amber-400" />, label: t('achievements'), value: stats.achievements.toString(), color: 'amber' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
            >
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <p className="text-lg font-black text-white">{stat.value}</p>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/child-dashboard/courses')}
            className="group relative overflow-hidden bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border border-blue-500/20 rounded-2xl p-6 text-left hover:border-blue-400/40 transition-all"
          >
            <BookOpen className="w-8 h-8 text-blue-400 mb-3" />
            <p className="text-base font-bold text-white">{t('courses')}</p>
            <p className="text-[10px] text-gray-500 mt-1">{stats.courses} {t('courses').toLowerCase()}</p>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-400/20 transition-all" />
          </motion.button>

          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/child-dashboard/games')}
            className="group relative overflow-hidden bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/20 rounded-2xl p-6 text-left hover:border-amber-400/40 transition-all"
          >
            <Gamepad2 className="w-8 h-8 text-amber-400 mb-3" />
            <p className="text-base font-bold text-white">{t('games')}</p>
            <p className="text-[10px] text-gray-500 mt-1">COMING SOON</p>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all" />
          </motion.button>
        </div>

        {/* Received Transfers */}
        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t('receivedTransfers')}</h3>
          <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md overflow-hidden divide-y divide-white/5">
            {stats.transactions.map((tx) => (
              <div key={tx.id} className="p-5 flex items-center justify-between group hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-white/5">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm group-hover:text-[#FFD700] transition-colors">{tx.purpose}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-500 font-bold">{t('from')}: {tx.from}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[10px] text-gray-500 font-bold">{tx.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-black text-emerald-400 tabular-nums">
                  +PKR {tx.amount.toLocaleString('en-PK')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Sharia Footer */}
        <div className="flex justify-center mt-8">
          <ShariaComplianceBadge size="sm" />
        </div>
      </div>
    </main>
  );
}