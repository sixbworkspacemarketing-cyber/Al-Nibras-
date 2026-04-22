'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { Wallet } from 'lucide-react';
import ShariaComplianceBadge from '@/components/ShariaComplianceBadge';

interface BalanceCardProps {
  balance: number;
  label?: string;
  showSharia?: boolean;
  className?: string;
  variant?: 'parent' | 'child';
}

export default function BalanceCard({ balance, label, showSharia = true, className = '', variant = 'parent' }: BalanceCardProps) {
  const { t } = useLanguage();

  const gradients = {
    parent: 'from-purple-900/60 via-indigo-900/40 to-black/80',
    child: 'from-amber-900/40 via-yellow-900/30 to-black/80',
  };

  const borderColors = {
    parent: 'border-purple-500/20',
    child: 'border-yellow-500/20',
  };

  const formattedBalance = balance.toLocaleString('en-PK');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden bg-gradient-to-br ${gradients[variant]} p-6 md:p-8 rounded-3xl border ${borderColors[variant]} backdrop-blur-xl ${className}`}
    >
      {/* Decorative glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FFD700]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#DC2626]/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-4 h-4 text-[#FFD700]" />
          <p className="text-[#FFD700]/80 text-xs uppercase tracking-widest font-bold">
            {label || t('totalBalance')}
          </p>
        </div>

        <motion.h2
          key={balance}
          initial={{ scale: 1.05, color: '#FFD700' }}
          animate={{ scale: 1, color: '#FFFFFF' }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
        >
          PKR {formattedBalance}
        </motion.h2>

        {showSharia && <ShariaComplianceBadge size="sm" />}
      </div>
    </motion.div>
  );
}