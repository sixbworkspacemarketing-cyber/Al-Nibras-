"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  delay?: number;
}

export default function StatsCard({
  title,
  value,
  change,
  icon,
  trend = "neutral",
  delay = 0,
}: StatsCardProps) {
  const trendColors = {
    up: "text-green-400",
    down: "text-red-400",
    neutral: "text-gray-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md overflow-hidden group"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent pointer-events-none"
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{title}</p>
          {icon && <div className="text-[#D4AF37]">{icon}</div>}
        </div>
        <div className="flex items-end gap-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-black text-white"
          >
            {value}
          </motion.p>
          {change && (
            <span className={`text-xs font-medium ${trendColors[trend]}`}>
              {change}
            </span>
          )}
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.5 }}
          className="h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent mt-2 origin-left"
        />
      </div>
    </motion.div>
  );
}