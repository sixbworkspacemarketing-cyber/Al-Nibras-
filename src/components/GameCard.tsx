'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GameCardProps {
  title: string;
  icon: string;
  description: string;
  points: number;
  color: string;
  onClick?: () => void;
}

export default function GameCard({ title, icon, description, points, color, onClick }: GameCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:border-white/20 transition-all"
    >
      {/* Background glow */}
      <div
        className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-15 group-hover:opacity-30 transition-opacity"
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

      {/* Description */}
      <p className="text-xs text-gray-400 mb-4 line-clamp-2">{description}</p>

      {/* Points & Play */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[#FFD700]">
          <span className="text-sm">⭐</span>
          <span className="text-xs font-bold">{points} pts</span>
        </div>
        <div
          className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border"
          style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}
        >
          Play →
        </div>
      </div>
    </motion.div>
  );
}
