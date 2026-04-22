'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AchievementBadgeProps {
  icon: string;
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
  date?: string;
}

export default function AchievementBadge({ icon, title, description, points, unlocked, date }: AchievementBadgeProps) {
  return (
    <motion.div
      whileHover={{ scale: unlocked ? 1.05 : 1 }}
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all ${
        unlocked
          ? 'bg-gradient-to-br from-[#FFD700]/10 to-black/40 border-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.1)]'
          : 'bg-white/[0.02] border-white/5 opacity-40 grayscale'
      }`}
    >
      {/* Glow effect for unlocked */}
      {unlocked && (
        <div className="absolute -top-8 -right-8 w-20 h-20 bg-[#FFD700]/10 rounded-full blur-2xl" />
      )}

      <div className="relative z-10 flex items-center gap-3">
        <div className={`text-3xl ${unlocked ? '' : 'opacity-30'}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-bold truncate ${unlocked ? 'text-[#FFD700]' : 'text-gray-600'}`}>
            {title}
          </h4>
          <p className="text-[10px] text-gray-500 truncate">{description}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold text-[#FFD700]/60">+{points} pts</span>
            {unlocked && date && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="text-[10px] text-gray-600">{date}</span>
              </>
            )}
            {!unlocked && (
              <span className="text-[10px] text-gray-600 font-bold">🔒 Locked</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
