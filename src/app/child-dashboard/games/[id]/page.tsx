'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/ui/LanguageToggle';
import BackButton from '@/components/ui/BackButton';
import { Star, Clock, RotateCcw, Check, X, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

// Game data definitions
const gameConfigs: Record<string, {
  title: string; icon: string; color: string;
  type: 'quiz' | 'matching' | 'memory';
  questions?: { question: string; options: string[]; answer: string }[];
  pairs?: { id: number; text: string; match: string }[];
  cards?: string[];
}> = {
  'quranic-matching': {
    title: 'Quranic Verse Matching', icon: '📖', color: '#10B981', type: 'quiz',
    questions: [
      { question: 'What does "Bismillah" mean?', options: ['In the name of Allah', 'Peace be upon you', 'God is great', 'Thank God'], answer: 'In the name of Allah' },
      { question: 'How many Surahs are in the Quran?', options: ['100', '114', '120', '99'], answer: '114' },
      { question: 'Which Surah is called "The Opening"?', options: ['Al-Baqarah', 'Al-Fatiha', 'Al-Ikhlas', 'An-Nas'], answer: 'Al-Fatiha' },
      { question: 'What is the longest Surah?', options: ['Al-Baqarah', 'Al-Imran', 'An-Nisa', 'Al-Maidah'], answer: 'Al-Baqarah' },
      { question: 'Surah Al-Ikhlas teaches about?', options: ['Prayer', 'Oneness of Allah', 'Charity', 'Fasting'], answer: 'Oneness of Allah' },
    ],
  },
  'math-challenges': {
    title: 'Math Challenges', icon: '🧮', color: '#3B82F6', type: 'quiz',
    questions: [
      { question: 'What is 15 × 12?', options: ['170', '180', '190', '160'], answer: '180' },
      { question: 'PKR 500 + PKR 750 = ?', options: ['PKR 1150', 'PKR 1250', 'PKR 1350', 'PKR 1050'], answer: 'PKR 1250' },
      { question: 'If you save PKR 100 daily for 30 days, total?', options: ['PKR 2000', 'PKR 3000', 'PKR 2500', 'PKR 3500'], answer: 'PKR 3000' },
      { question: 'What is 25% of PKR 2000?', options: ['PKR 400', 'PKR 500', 'PKR 600', 'PKR 300'], answer: 'PKR 500' },
      { question: '√144 = ?', options: ['10', '11', '12', '14'], answer: '12' },
    ],
  },
  'quiz-master': {
    title: 'Quiz Master', icon: '🧠', color: '#8B5CF6', type: 'quiz',
    questions: [
      { question: 'What is Zakat?', options: ['Charity', 'Prayer', 'Fasting', 'Pilgrimage'], answer: 'Charity' },
      { question: 'What is Riba?', options: ['Interest', 'Trade', 'Charity', 'Saving'], answer: 'Interest' },
      { question: 'How many pillars of Islam?', options: ['3', '4', '5', '6'], answer: '5' },
      { question: 'What is Sadaqah?', options: ['Voluntary charity', 'Obligatory tax', 'Fasting', 'Prayer'], answer: 'Voluntary charity' },
      { question: 'Takaful is Islamic ___?', options: ['Banking', 'Insurance', 'Trading', 'Funding'], answer: 'Insurance' },
    ],
  },
  'word-builder': {
    title: 'Word Builder', icon: '📝', color: '#F59E0B', type: 'quiz',
    questions: [
      { question: 'Unscramble: Z-A-K-A-T', options: ['ZAKAT', 'TAKAZ', 'KAZAT', 'AZKAT'], answer: 'ZAKAT' },
      { question: 'Unscramble: S-A-L-A-H', options: ['SALAH', 'LAHSA', 'HALAS', 'ALASH'], answer: 'SALAH' },
      { question: 'Unscramble: Q-U-R-A-N', options: ['QURAN', 'RANQU', 'NUQAR', 'AQURN'], answer: 'QURAN' },
      { question: 'Unscramble: H-A-L-A-L', options: ['HALAL', 'ALLAH', 'LALAH', 'ALLHA'], answer: 'HALAL' },
      { question: 'Unscramble: S-U-K-U-K', options: ['SUKUK', 'KUKUS', 'USKUK', 'KUSUK'], answer: 'SUKUK' },
    ],
  },
  'logic-puzzles': {
    title: 'Logic Puzzles', icon: '🧩', color: '#EC4899', type: 'quiz',
    questions: [
      { question: 'If 3 pencils cost PKR 30, how much for 7?', options: ['PKR 70', 'PKR 60', 'PKR 80', 'PKR 50'], answer: 'PKR 70' },
      { question: 'What comes next: 2, 4, 8, 16, ?', options: ['24', '28', '32', '30'], answer: '32' },
      { question: 'Ali has PKR 1000, spends half, saves rest. Savings?', options: ['PKR 400', 'PKR 500', 'PKR 600', 'PKR 300'], answer: 'PKR 500' },
      { question: 'Fill: Mon, Tue, Wed, ___, Fri', options: ['Thu', 'Sat', 'Sun', 'Mon'], answer: 'Thu' },
      { question: 'If a=1, b=2, c=3... what is a+b+c?', options: ['5', '6', '7', '8'], answer: '6' },
    ],
  },
  'memory-game': {
    title: 'Memory Game', icon: '🎴', color: '#06B6D4', type: 'memory',
    cards: ['🕌', '📖', '🌙', '⭐', '🤲', '💰', '🕌', '📖', '🌙', '⭐', '🤲', '💰'],
  },
};

function QuizGame({ config, onComplete }: { config: typeof gameConfigs[string]; onComplete: (score: number) => void }) {
  const { t } = useLanguage();
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(15);

  const questions = config.questions || [];

  useEffect(() => {
    if (gameOver || isCorrect !== null) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleAnswer('');
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQ, gameOver, isCorrect]);

  const handleAnswer = (answer: string) => {
    if (isCorrect !== null) return;
    const correct = answer === questions[currentQ]?.answer;
    setSelected(answer);
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (currentQ + 1 < questions.length) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
        setIsCorrect(null);
        setTimer(15);
      } else {
        setGameOver(true);
        onComplete(correct ? score + 1 : score);
      }
    }, 1500);
  };

  if (gameOver) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-black text-[#FFD700] mb-2">{t('gameOver')}</h2>
        <p className="text-lg text-gray-400 mb-6">{t('score')}: {score}/{questions.length}</p>
        <div className="flex items-center justify-center gap-2 text-[#FFD700] mb-8">
          <Star className="w-5 h-5" />
          <span className="font-bold">+{score * 10} {t('points')}</span>
        </div>
      </motion.div>
    );
  }

  const q = questions[currentQ];
  if (!q) return null;

  return (
    <div>
      {/* Progress & Timer */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-bold text-gray-500">
          {currentQ + 1}/{questions.length}
        </span>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className={`text-sm font-black tabular-nums ${timer <= 5 ? 'text-red-500' : 'text-white'}`}>{timer}s</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/5 h-1 rounded-full mb-8 overflow-hidden">
        <motion.div
          animate={{ width: `${((currentQ) / questions.length) * 100}%` }}
          className="h-full rounded-full"
          style={{ backgroundColor: config.color }}
        />
      </div>

      {/* Question */}
      <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <h3 className="text-xl font-bold text-white mb-8 text-center">{q.question}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map((opt) => (
            <motion.button
              key={opt}
              whileHover={isCorrect === null ? { scale: 1.02 } : {}}
              whileTap={isCorrect === null ? { scale: 0.98 } : {}}
              onClick={() => handleAnswer(opt)}
              disabled={isCorrect !== null}
              className={`p-4 rounded-xl text-sm font-bold border transition-all ${
                selected === opt
                  ? isCorrect
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-red-500/20 border-red-500/50 text-red-400'
                  : opt === q.answer && isCorrect === false
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : 'bg-white/5 border-white/10 text-white hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {selected === opt && isCorrect && <Check className="w-4 h-4" />}
                {selected === opt && !isCorrect && <X className="w-4 h-4" />}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function MemoryGame({ config, onComplete }: { config: typeof gameConfigs[string]; onComplete: (score: number) => void }) {
  const { t } = useLanguage();
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const shuffled = (config.cards || [])
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    setCards(shuffled);
  }, []);

  const handleFlip = useCallback((id: number) => {
    if (flipped.length === 2 || cards[id]?.matched || flipped.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === first || c.id === second ? { ...c, matched: true } : c)));
          setFlipped([]);
          const allMatched = cards.filter((c) => !c.matched).length <= 2;
          if (allMatched) {
            setGameOver(true);
            onComplete(Math.max(1, 6 - Math.floor(moves / 3)));
          }
        }, 500);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  }, [flipped, cards, moves, onComplete]);

  if (gameOver) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-black text-[#FFD700] mb-2">{t('congratulations')}</h2>
        <p className="text-lg text-gray-400 mb-2">{moves} moves</p>
        <div className="flex items-center justify-center gap-2 text-[#FFD700]">
          <Star className="w-5 h-5" />
          <span className="font-bold">+{Math.max(10, 60 - moves * 3)} {t('points')}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Moves: {moves}</span>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          {cards.filter((c) => c.matched).length / 2}/{(config.cards || []).length / 2} pairs
        </span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFlip(card.id)}
            className={`aspect-square rounded-xl text-3xl flex items-center justify-center border transition-all ${
              card.matched
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : flipped.includes(card.id)
                ? 'bg-white/10 border-white/20'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            {(flipped.includes(card.id) || card.matched) ? card.emoji : '?'}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function GamePlayPage() {
  const params = useParams();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const gameId = params.id as string;
  const config = gameConfigs[gameId] || gameConfigs['quiz-master'];

  useEffect(() => { setMounted(true); }, []);

  const handleComplete = (score: number) => {
    setFinalScore(score);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#DC2626', '#10B981'],
    });
  };

  const handleRestart = () => {
    setGameStarted(false);
    setFinalScore(null);
    setTimeout(() => setGameStarted(true), 100);
  };

  if (!mounted) return <div className="min-h-screen bg-[#0a0a0a]" />;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[40%] w-[400px] h-[400px] rounded-full blur-[120px]" style={{ backgroundColor: `${config.color}08` }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 md:px-8 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <BackButton href="/child-dashboard/games" />
          <LanguageToggle />
        </header>

        {/* Game Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{config.icon}</div>
          <h1 className="text-2xl font-black text-white mb-1">{config.title}</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
            {config.type === 'memory' ? t('memoryGame') : t('quizMaster')}
          </p>
        </div>

        {/* Game Area */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
          {!gameStarted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-sm text-gray-400 mb-8">Ready to play? Test your knowledge and earn points!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGameStarted(true)}
                className="px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest text-black shadow-lg"
                style={{ backgroundColor: config.color }}
              >
                {t('playNow')} 🎮
              </motion.button>
            </motion.div>
          ) : config.type === 'memory' ? (
            <MemoryGame config={config} onComplete={handleComplete} />
          ) : (
            <QuizGame config={config} onComplete={handleComplete} />
          )}
        </div>

        {/* Restart / Back buttons */}
        {finalScore !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex gap-3"
          >
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              {t('tryAgain')}
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm uppercase tracking-widest text-black"
              style={{ backgroundColor: config.color }}
            >
              <Trophy className="w-4 h-4" />
              {t('leaderboard')}
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}