'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/ui/LanguageToggle';
import BackButton from '@/components/ui/BackButton';
import { Check, Lock, Clock, PlayCircle, BookOpen } from 'lucide-react';

const allCourses: Record<string, { title: string; color: string; icon: string; description: string; lessons: { id: number; title: string; duration: string; completed: boolean; locked: boolean }[] }> = {
  'islamic-studies': {
    title: 'Islamic Studies',
    color: '#10B981',
    icon: '🕌',
    description: 'Learn the fundamentals of Islamic finance, Zakat, Sadaqah, and the principles of halal earning and spending.',
    lessons: [
      { id: 1, title: 'Introduction to Islamic Finance', duration: '15 min', completed: true, locked: false },
      { id: 2, title: 'Understanding Zakat', duration: '20 min', completed: true, locked: false },
      { id: 3, title: 'The Concept of Sadaqah', duration: '18 min', completed: true, locked: false },
      { id: 4, title: 'Halal vs Haram Earning', duration: '25 min', completed: false, locked: false },
      { id: 5, title: 'Islamic Banking Principles', duration: '22 min', completed: false, locked: false },
      { id: 6, title: 'Riba (Interest) in Islam', duration: '20 min', completed: false, locked: false },
      { id: 7, title: 'Waqf and Endowments', duration: '15 min', completed: false, locked: true },
      { id: 8, title: 'Takaful (Islamic Insurance)', duration: '18 min', completed: false, locked: true },
      { id: 9, title: 'Sukuk (Islamic Bonds)', duration: '25 min', completed: false, locked: true },
      { id: 10, title: 'Ethical Investment in Islam', duration: '20 min', completed: false, locked: true },
      { id: 11, title: 'Financial Planning as a Muslim', duration: '22 min', completed: false, locked: true },
      { id: 12, title: 'Final Assessment', duration: '30 min', completed: false, locked: true },
    ],
  },
  'mathematics': {
    title: 'Mathematics',
    color: '#3B82F6',
    icon: '🔢',
    description: 'Master mathematical concepts including arithmetic, algebra, and financial mathematics.',
    lessons: [
      { id: 1, title: 'Numbers & Place Value', duration: '15 min', completed: true, locked: false },
      { id: 2, title: 'Addition & Subtraction', duration: '20 min', completed: true, locked: false },
      { id: 3, title: 'Multiplication Tables', duration: '18 min', completed: false, locked: false },
      { id: 4, title: 'Division Basics', duration: '22 min', completed: false, locked: false },
      { id: 5, title: 'Fractions Made Easy', duration: '25 min', completed: false, locked: true },
      { id: 6, title: 'Decimals & Percentages', duration: '20 min', completed: false, locked: true },
      { id: 7, title: 'Money & Currency Math', duration: '18 min', completed: false, locked: true },
      { id: 8, title: 'Budgeting with Math', duration: '22 min', completed: false, locked: true },
    ],
  },
  'science': {
    title: 'Science',
    color: '#8B5CF6',
    icon: '🔬',
    description: 'Explore the wonders of science through engaging experiments and activities.',
    lessons: [
      { id: 1, title: 'What is Science?', duration: '12 min', completed: false, locked: false },
      { id: 2, title: 'The Scientific Method', duration: '18 min', completed: false, locked: false },
      { id: 3, title: 'Living Things', duration: '20 min', completed: false, locked: false },
      { id: 4, title: 'Forces & Motion', duration: '22 min', completed: false, locked: true },
      { id: 5, title: 'Light & Sound', duration: '18 min', completed: false, locked: true },
    ],
  },
  'language': {
    title: 'Language',
    color: '#F59E0B',
    icon: '📖',
    description: 'Improve your Urdu and English language skills with exercises.',
    lessons: [
      { id: 1, title: 'Urdu Alphabets (حروف)', duration: '15 min', completed: true, locked: false },
      { id: 2, title: 'Basic Urdu Words', duration: '18 min', completed: true, locked: false },
      { id: 3, title: 'English Vocabulary', duration: '20 min', completed: true, locked: false },
      { id: 4, title: 'Sentence Formation', duration: '22 min', completed: false, locked: false },
      { id: 5, title: 'Reading Comprehension', duration: '25 min', completed: false, locked: true },
    ],
  },
  'life-skills': {
    title: 'Life Skills',
    color: '#EC4899',
    icon: '🌟',
    description: 'Essential life skills including financial literacy for young Muslims.',
    lessons: [
      { id: 1, title: 'Time Management', duration: '12 min', completed: true, locked: false },
      { id: 2, title: 'Setting Goals', duration: '15 min', completed: true, locked: false },
      { id: 3, title: 'Saving Money', duration: '18 min', completed: true, locked: false },
      { id: 4, title: 'Helping Others', duration: '14 min', completed: true, locked: false },
      { id: 5, title: 'Being Responsible', duration: '16 min', completed: false, locked: false },
    ],
  },
  'technology': {
    title: 'Technology',
    color: '#06B6D4',
    icon: '💻',
    description: 'Discover coding basics and digital literacy.',
    lessons: [
      { id: 1, title: 'What is Coding?', duration: '15 min', completed: true, locked: false },
      { id: 2, title: 'Internet Safety', duration: '12 min', completed: false, locked: false },
      { id: 3, title: 'Basic HTML', duration: '25 min', completed: false, locked: false },
      { id: 4, title: 'Digital Citizenship', duration: '18 min', completed: false, locked: true },
    ],
  },
};

export default function CourseDetailPage() {
  const params = useParams();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const courseId = params.id as string;
  const course = allCourses[courseId] || allCourses['islamic-studies'];

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-[#0a0a0a]" />;

  const completedCount = course.lessons.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / course.lessons.length) * 100);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[30%] w-[400px] h-[400px] rounded-full blur-[120px]" style={{ backgroundColor: `${course.color}08` }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <BackButton href="/child-dashboard/courses" />
          <LanguageToggle />
        </header>

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border border-white/10"
              style={{ backgroundColor: `${course.color}15` }}
            >
              {course.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{course.title}</h1>
              <p className="text-xs text-gray-500 mt-1">{course.lessons.length} {t('lessons')} • {completedCount} {t('completed')}</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{course.description}</p>

          {/* Progress */}
          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-gray-500 uppercase tracking-widest">{t('progress')}</span>
              <span style={{ color: course.color }}>{progressPercent}%</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: course.color }}
              />
            </div>
          </div>
        </motion.div>

        {/* Lessons List */}
        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t('lessons')}</h3>
          <div className="space-y-2">
            {course.lessons.map((lesson, i) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  lesson.locked
                    ? 'bg-white/[0.02] border-white/5 opacity-40'
                    : lesson.completed
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white/5 border-white/10 hover:border-white/20 cursor-pointer'
                }`}
              >
                {/* Status Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0 ${
                  lesson.completed ? '' : lesson.locked ? 'bg-white/5' : ''
                }`} style={lesson.completed ? { backgroundColor: `${course.color}20`, color: course.color } : {}}>
                  {lesson.completed ? (
                    <Check className="w-5 h-5" />
                  ) : lesson.locked ? (
                    <Lock className="w-4 h-4 text-gray-600" />
                  ) : (
                    <PlayCircle className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Lesson Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${lesson.completed ? 'text-gray-400 line-through' : lesson.locked ? 'text-gray-600' : 'text-white'}`}>
                    {lesson.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3 text-gray-600" />
                    <span className="text-[10px] text-gray-600 font-bold">{lesson.duration}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${
                  lesson.completed
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : lesson.locked
                    ? 'text-gray-600 bg-white/5'
                    : 'text-amber-400 bg-amber-500/10'
                }`}>
                  {lesson.completed ? '✓' : lesson.locked ? '🔒' : t('play')}
                </span>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}