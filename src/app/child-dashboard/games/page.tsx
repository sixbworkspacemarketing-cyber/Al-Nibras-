'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/ui/LanguageToggle';
import BackButton from '@/components/ui/BackButton';
import GameCard from '@/components/GameCard';
import AchievementBadge from '@/components/AchievementBadge';
import { Gamepad2, Trophy, Star, Medal } from 'lucide-react';

const gamesData = [
  { id: 'quranic-matching', title: 'quranicMatching', icon: '📖', description: 'Match Quranic verses with their meanings in this beautiful card matching game.', points: 50, color: '#10B981' },
  { id: 'math-challenges', title: 'mathChallenges', icon: '🧮', description: 'Solve fun math problems and earn points! Race against the clock.', points: 40, color: '#3B82F6' },
  { id: 'quiz-master', title: 'quizMaster', icon: '🧠', description: 'Test your knowledge of Islamic studies, science, and general knowledge.', points: 60, color: '#8B5CF6' },
  { id: 'word-builder', title: 'wordBuilder', icon: '📝', description: 'Build words from jumbled letters in both Urdu and English.', points: 35, color: '#F59E0B' },
  { id: 'logic-puzzles', title: 'logicPuzzles', icon: '🧩', description: 'Solve tricky logic puzzles and brain teasers to sharpen your mind.', points: 45, color: '#EC4899' },
  { id: 'memory-game', title: 'memoryGame', icon: '🎴', description: 'Flip cards and find matching pairs. Train your memory!', points: 30, color: '#06B6D4' },
];

const achievementsData = [
  { icon: '🏆', title: 'First Win', description: 'Win your first game', points: 10, unlocked: true, date: 'Mar 15, 2024' },
  { icon: '🔥', title: 'Streak Master', description: '5 games in a row', points: 25, unlocked: true, date: 'Mar 14, 2024' },
  { icon: '🌟', title: 'Quick Thinker', description: 'Answer in under 5 seconds', points: 15, unlocked: true, date: 'Mar 13, 2024' },
  { icon: '🎯', title: 'Perfect Score', description: '100% on a quiz', points: 50, unlocked: true, date: 'Mar 12, 2024' },
  { icon: '📚', title: 'Scholar', description: 'Complete all courses', points: 100, unlocked: false },
  { icon: '🏅', title: 'Champion', description: 'Reach #1 on leaderboard', points: 75, unlocked: false },
  { icon: '💎', title: 'Diamond Player', description: '1000 total points', points: 200, unlocked: false },
  { icon: '🌍', title: 'Global Star', description: 'Play every game type', points: 60, unlocked: false },
];

export default function GamesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<'games' | 'achievements'>('games');
  const totalPoints = 385;

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-[#0a0a0a]" />;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BackButton href="/child-dashboard" />
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-amber-400" />
                {t('gamificationHub')}
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                6 {t('games')} • {t('earnedPoints')}: {totalPoints}
              </p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        {/* Points & Leaderboard bar */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-gradient-to-r from-amber-900/20 to-yellow-900/10 border border-amber-500/20 rounded-2xl">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#FFD700]">{totalPoints}</p>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">{t('points')}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/child-dashboard/games/leaderboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-xs font-bold uppercase tracking-widest hover:bg-[#FFD700]/20 transition-all"
          >
            <Trophy className="w-4 h-4" />
            {t('leaderboard')}
          </button>
        </div>

        {/* Section Toggle */}
        <div className="flex items-center gap-2 mb-8 p-1 bg-white/5 rounded-2xl border border-white/10">
          {[
            { id: 'games' as const, label: t('games'), icon: <Gamepad2 className="w-4 h-4" /> },
            { id: 'achievements' as const, label: t('achievements'), icon: <Medal className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeSection === tab.id
                  ? 'bg-[#FFD700] text-black shadow-[0_0_20px_rgba(255,215,0,0.2)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        {activeSection === 'games' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gamesData.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GameCard
                  title={t(game.title as any)}
                  icon={game.icon}
                  description={game.description}
                  points={game.points}
                  color={game.color}
                  onClick={() => router.push(`/child-dashboard/games/${game.id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {activeSection === 'achievements' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievementsData.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <AchievementBadge {...badge} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}