'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/ui/LanguageToggle';
import BackButton from '@/components/ui/BackButton';
import CourseCard from '@/components/CourseCard';
import { BookOpen } from 'lucide-react';

const coursesData = [
  { id: 'islamic-studies', title: 'islamicStudies', icon: '🕌', lessonsCount: 12, difficulty: 'beginner', progress: 65, color: '#10B981', description: 'Learn the fundamentals of Islamic finance, Zakat, Sadaqah, and the principles of halal earning and spending.' },
  { id: 'mathematics', title: 'mathematics', icon: '🔢', lessonsCount: 15, difficulty: 'intermediate', progress: 30, color: '#3B82F6', description: 'Master mathematical concepts including arithmetic, algebra, and financial mathematics with interactive exercises.' },
  { id: 'science', title: 'science', icon: '🔬', lessonsCount: 10, difficulty: 'beginner', progress: 0, color: '#8B5CF6', description: 'Explore the wonders of science through engaging experiments, videos, and hands-on activities.' },
  { id: 'language', title: 'language', icon: '📖', lessonsCount: 20, difficulty: 'beginner', progress: 45, color: '#F59E0B', description: 'Improve your Urdu and English language skills with reading, writing, and vocabulary building exercises.' },
  { id: 'life-skills', title: 'lifeSkills', icon: '🌟', lessonsCount: 8, difficulty: 'beginner', progress: 80, color: '#EC4899', description: 'Learn essential life skills including time management, communication, and financial literacy for young Muslims.' },
  { id: 'technology', title: 'technology', icon: '💻', lessonsCount: 14, difficulty: 'advanced', progress: 10, color: '#06B6D4', description: 'Discover the world of technology, coding basics, and digital literacy in a safe, Islamic-oriented environment.' },
];

export default function CoursesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-[#0a0a0a]" />;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BackButton href="/child-dashboard" />
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-400" />
                {t('lms')}
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                6 {t('courses')} • {t('startLearning')}
              </p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="text-center flex-1">
            <p className="text-2xl font-black text-white">6</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">{t('courses')}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center flex-1">
            <p className="text-2xl font-black text-[#FFD700]">79</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">{t('lessons')}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center flex-1">
            <p className="text-2xl font-black text-emerald-400">38%</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">{t('progress')}</p>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coursesData.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <CourseCard
                title={t(course.title as any)}
                icon={course.icon}
                lessonsCount={course.lessonsCount}
                difficulty={t(course.difficulty as any)}
                progress={course.progress}
                color={course.color}
                onClick={() => router.push(`/child-dashboard/courses/${course.id}`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}