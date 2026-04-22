'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { ShieldCheck } from 'lucide-react';

interface ShariaComplianceBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ShariaComplianceBadge({ size = 'md', className = '' }: ShariaComplianceBadgeProps) {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: 'text-[10px] px-2.5 py-1 gap-1',
    md: 'text-xs px-4 py-2 gap-2',
    lg: 'text-sm px-5 py-2.5 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={`inline-flex items-center ${sizeClasses[size]} bg-emerald-500/10 border border-emerald-500/30 rounded-full font-bold text-emerald-400 backdrop-blur-sm ${className}`}>
      <ShieldCheck className={iconSizes[size]} />
      <span>✓ {t('shariaCompliant')}</span>
      <span className="text-emerald-500/60">({t('zeroInterest')})</span>
    </div>
  );
}