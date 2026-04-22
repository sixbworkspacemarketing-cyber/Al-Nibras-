'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-white/10 hover:border-[#FFD700]/30 transition-all active:scale-95 ${className}`}
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4 text-[#FFD700] group-hover:rotate-45 transition-transform" />
      <span className="text-xs font-bold uppercase tracking-wider">
        {t('switchLanguage')}
      </span>
      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
    </button>
  );
}