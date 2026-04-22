'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/ui/LanguageToggle';
import BackButton from '@/components/ui/BackButton';
import CourseCard from '@/components/CourseCard';
import { BookOpen } from 'lucide-react';

import { supabase } from '@/lib/supabase';

export default function CoursesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    setMounted(true);
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('app_courses')
      .select('*, app_videos(count)')
      .order('created_at', { ascending: false });
    
    if (data) {
      setCourses(data);
    }
    setLoading(false);
  };

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
                {courses.length} {t('courses')} • {t('startLearning')}
              </p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="text-center flex-1">
            <p className="text-2xl font-black text-white">{courses.length}</p>
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
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <CourseCard
                title={course.title}
                icon={course.category === 'islamic' ? '🕌' : '📖'}
                lessonsCount={course.app_videos?.[0]?.count || 0}
                difficulty="Beginner"
                progress={0}
                color={course.category === 'islamic' ? '#10B981' : '#3B82F6'}
                onClick={() => router.push(`/child-dashboard/courses/${course.id}`)}
              />
            </motion.div>
          ))}
          {courses.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No courses available yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}