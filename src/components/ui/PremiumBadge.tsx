"use client";

import { motion } from "framer-motion";
import { Sparkles, Star, Zap } from "lucide-react";

interface PremiumBadgeProps {
  title: string;
  subtitle?: string;
  icon?: "sparkles" | "star" | "zap";
  variant?: "gold" | "silver" | "bronze";
}

export default function PremiumBadge({
  title,
  subtitle,
  icon = "sparkles",
  variant = "gold",
}: PremiumBadgeProps) {
  const colors = {
    gold: {
      bg: "from-[#D4AF37]/20 to-[#997A1F]/10",
      border: "border-[#D4AF37]/50",
      text: "text-[#D4AF37]",
      glow: "shadow-[0_0_30px_rgba(212,175,55,0.3)]",
    },
    silver: {
      bg: "from-gray-400/20 to-gray-600/10",
      border: "border-gray-400/50",
      text: "text-gray-300",
      glow: "shadow-[0_0_30px_rgba(156,163,175,0.3)]",
    },
    bronze: {
      bg: "from-orange-400/20 to-orange-600/10",
      border: "border-orange-400/50",
      text: "text-orange-300",
      glow: "shadow-[0_0_30px_rgba(251,146,60,0.3)]",
    },
  };

  const icons = {
    sparkles: Sparkles,
    star: Star,
    zap: Zap,
  };

  const Icon = icons[icon];
  const style = colors[variant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative px-4 py-2 rounded-xl bg-gradient-to-r ${style.bg} border ${style.border} ${style.glow} backdrop-blur-md flex items-center gap-2`}
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Icon className={`w-4 h-4 ${style.text}`} />
      </motion.div>
      <div>
        <p className={`text-xs font-black uppercase tracking-wider ${style.text}`}>
          {title}
        </p>
        {subtitle && (
          <p className="text-[10px] text-gray-400 font-medium">{subtitle}</p>
        )}
      </div>
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${style.text.replace('text-', 'bg-')}`}
      />
    </motion.div>
  );
}