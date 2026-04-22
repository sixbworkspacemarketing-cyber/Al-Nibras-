'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/ui/LanguageToggle';
import BackButton from '@/components/ui/BackButton';
import { Trophy, Medal, Crown, Star } from 'lucide-react';

const leaderboardData = [
  { rank: 1, name: 'Ali Ahmed', points: 2450, avatar: '👦', badge: '🥇' },
  { rank: 2, name: 'Sara Khan', points: 2180, avatar: '👧', badge: '🥈' },
  { rank: 3, name: 'Hassan Raza', points: 1950, avatar: '👦', badge: '🥉' },
  { rank: 4, name: 'Fatima Ali', points: 1720, avatar: '👧', badge: '' },
  { rank: 5, name: 'Omar Syed', points: 1590, avatar: '👦', badge: '' },
  { rank: 6, name: 'Ayesha Malik', points: 1430, avatar: '👧', badge: '' },
  { rank: 7, name: 'Bilal Shah', points: 1280, avatar: '👦', badge: '' },
  { rank: 8, name: 'Zainab Noor', points: 1150, avatar: '👧', badge: '' },
  { rank: 9, name: 'Hamza Qureshi', points: 980, avatar: '👦', badge: '' },
  { rank: 10, name: 'Maryam Iqbal', points: 850, avatar: '👧', badge: '' },
];

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-[#0a0a0a]" />;

  const myRank = 4;
  const myPoints = 385;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 md:px-8 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BackButton href="/child-dashboard/games" />
            <div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FFD700]" />
                {t('leaderboard')}
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Top Performers</p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 mb-10">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 border-2 border-gray-400 flex items-center justify-center text-3xl mx-auto mb-2">
              {leaderboardData[1].avatar}
            </div>
            <p className="text-xs font-bold text-white">{leaderboardData[1].name}</p>
            <p className="text-[10px] text-gray-500 font-bold">{leaderboardData[1].points} pts</p>
            <div className="mt-2 w-20 h-24 bg-gradient-to-t from-gray-500/20 to-gray-500/5 rounded-t-xl flex items-center justify-center">
              <span className="text-2xl">🥈</span>
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <Crown className="w-6 h-6 text-[#FFD700] mx-auto mb-1" />
            <div className="w-20 h-20 rounded-full bg-[#FFD700]/10 border-2 border-[#FFD700] flex items-center justify-center text-4xl mx-auto mb-2 shadow-[0_0_30px_rgba(255,215,0,0.2)]">
              {leaderboardData[0].avatar}
            </div>
            <p className="text-sm font-black text-[#FFD700]">{leaderboardData[0].name}</p>
            <p className="text-[10px] text-gray-500 font-bold">{leaderboardData[0].points} pts</p>
            <div className="mt-2 w-24 h-32 bg-gradient-to-t from-[#FFD700]/20 to-[#FFD700]/5 rounded-t-xl flex items-center justify-center">
              <span className="text-3xl">🥇</span>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 border-2 border-amber-700 flex items-center justify-center text-3xl mx-auto mb-2">
              {leaderboardData[2].avatar}
            </div>
            <p className="text-xs font-bold text-white">{leaderboardData[2].name}</p>
            <p className="text-[10px] text-gray-500 font-bold">{leaderboardData[2].points} pts</p>
            <div className="mt-2 w-20 h-16 bg-gradient-to-t from-amber-700/20 to-amber-700/5 rounded-t-xl flex items-center justify-center">
              <span className="text-2xl">🥉</span>
            </div>
          </motion.div>
        </div>

        {/* Your Rank */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#FFD700]">Your Rank</p>
              <p className="text-[10px] text-gray-500">#{myRank} • {myPoints} points</p>
            </div>
          </div>
          <span className="text-2xl font-black text-[#FFD700]">#{myRank}</span>
        </motion.div>

        {/* Full List */}
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden divide-y divide-white/5">
          {leaderboardData.map((player, i) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 flex items-center justify-between hover:bg-white/5 transition-all ${
                player.rank <= 3 ? 'bg-white/[0.02]' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-sm font-black w-8 text-center ${
                  player.rank === 1 ? 'text-[#FFD700]' : player.rank === 2 ? 'text-gray-400' : player.rank === 3 ? 'text-amber-700' : 'text-gray-600'
                }`}>
                  {player.badge || `#${player.rank}`}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl border border-white/10">
                  {player.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{player.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold">{t('rank')} #{player.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-[#FFD700] tabular-nums">{player.points.toLocaleString()}</p>
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{t('points')}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}