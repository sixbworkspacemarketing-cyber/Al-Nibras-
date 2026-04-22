'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CourseCardProps {
  title: string;
  icon: string;
  lessonsCount: number;
  difficulty: string;
  progress?: number;
  color: string;
  onClick?: () => void;
}

export default function CourseCard({ title, icon, lessonsCount, difficulty, progress = 0, color, onClick }: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:border-white/20 transition-all"
    >
      {/* Background glow */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ backgroundColor: color }}
      />

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-white/10"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#FFD700] transition-colors">
        {title}
      </h3>

      {/* Meta */}
      <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">
        <span>{lessonsCount} lessons</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>{difficulty}</span>
      </div>

      {/* Progress bar */}
      {progress > 0 && (
        <div className="mt-auto">
          <div className="flex justify-between text-[10px] font-bold mb-1">
            <span className="text-gray-500 uppercase tracking-widest">Progress</span>
            <span style={{ color }}>{progress}%</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
