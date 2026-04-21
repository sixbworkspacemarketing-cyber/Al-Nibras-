"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export default function PremiumButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  icon,
}: PremiumButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#D4AF37] to-[#997A1F] text-black hover:from-[#F2D06B] hover:to-[#D4AF37] shadow-lg shadow-[#D4AF37]/30",
    secondary:
      "bg-white/10 border border-white/20 text-white hover:bg-white/20",
    outline:
      "bg-transparent border-2 border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        boxShadow: isHovered
          ? [
              "0 0 20px rgba(212, 175, 55, 0.3)",
              "0 0 40px rgba(212, 175, 55, 0.5)",
              "0 0 20px rgba(212, 175, 55, 0.3)",
            ]
          : "0 0 0px rgba(212, 175, 55, 0)",
      }}
      transition={{ duration: 0.3 }}
      className={`
        relative overflow-hidden rounded-xl font-bold uppercase tracking-widest
        ${sizeClasses[size]} ${variantStyles[variant]}
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300 flex items-center justify-center gap-2
        ${className}
      `}
    >
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            transform: "translateX(-100%)",
            animation: "shimmer 1.5s infinite",
          }}
        />
      )}
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon && <span className="text-lg">{icon}</span>}
          {children}
        </>
      )}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </motion.button>
  );
}