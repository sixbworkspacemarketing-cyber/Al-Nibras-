'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  className?: string;
  variant?: 'default' | 'ghost';
}

export default function BackButton({ href, className = '', variant = 'default' }: BackButtonProps) {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  const Arrow = isRTL ? ArrowRight : ArrowLeft;

  const baseClasses = variant === 'ghost'
    ? 'text-gray-400 hover:text-white'
    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20';

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${baseClasses} ${className}`}
    >
      <Arrow className="w-4 h-4" />
      <span>{t('back')}</span>
    </button>
  );
}