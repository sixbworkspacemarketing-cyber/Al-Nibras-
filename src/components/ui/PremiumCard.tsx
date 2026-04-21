"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface PremiumCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  glowColor?: string;
  gradient?: boolean;
}

export default function PremiumCard({
  children,
  glowColor = "#D4AF37",
  gradient = false,
  className = "",
  ...props
}: PremiumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative ${className}`}
      {...props}
    >
      <div
        className="absolute -inset-[1px] rounded-[2rem]"
        style={{
          background: `linear-gradient(135deg, ${glowColor}40, transparent 50%, ${glowColor}20)`,
          filter: "blur(8px)",
          opacity: 0.5,
        }}
      />
      <div
        className={`relative rounded-[2rem] backdrop-blur-xl ${
          gradient
            ? `bg-gradient-to-br from-[${glowColor}]/10 to-black/60`
            : "bg-white/5"
        } border border-white/10`}
      >
        {children}
      </div>
    </motion.div>
  );
}