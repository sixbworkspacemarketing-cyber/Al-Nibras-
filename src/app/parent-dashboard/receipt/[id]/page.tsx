'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/ui/LanguageToggle';
import BackButton from '@/components/ui/BackButton';
import ShariaComplianceBadge from '@/components/ShariaComplianceBadge';
import { sampleTransactions, downloadReceipt, copyReceiptToClipboard } from '@/lib/receiptGenerator';
import { Download, Copy, Check, Clock, CheckCircle2, Shield } from 'lucide-react';

export default function ReceiptPage() {
  const params = useParams();
  const { t, lang, isRTL } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const txId = decodeURIComponent(params.id as string);
  const tx = sampleTransactions.find((t) => t.id === txId) || sampleTransactions[0];

  const handleDownload = () => {
    downloadReceipt(tx, lang);
  };

  const handleCopy = async () => {
    await copyReceiptToClipboard(tx, lang);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) return <div className="min-h-screen bg-[#0a0a0a]" />;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 md:px-8 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <BackButton href="/parent-dashboard" />
          <LanguageToggle />
        </header>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-md"
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFA500]">
              AL NIBRAS FINANCE
            </h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mt-1">
              {t('transactionReceipt')}
            </p>
          </div>

          {/* Transaction ID & Status */}
          <div className="flex items-center justify-between mb-6 p-3 bg-white/5 rounded-xl">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{t('transactionId')}</p>
              <p className="text-sm font-bold text-white mt-0.5">{tx.id}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
              tx.status === 'completed'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {tx.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {tx.status === 'completed' ? t('completed') : t('pending')}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 my-6" />

          {/* Amount */}
          <div className="text-center py-6">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mb-2">{t('amount')}</p>
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-5xl font-black text-[#DC2626]"
            >
              PKR {tx.amount.toLocaleString('en-PK')}
            </motion.p>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 my-6" />

          {/* Details */}
          <div className="space-y-4">
            {[
              { label: t('sender'), value: tx.sender },
              { label: t('recipient'), value: tx.recipient },
              { label: t('dateTime'), value: `${tx.date} • ${tx.time}` },
              { label: t('purpose'), value: tx.purpose },
            ].map((detail, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <span className="text-xs text-gray-500 font-bold">{detail.label}</span>
                <span className="text-sm font-bold text-white">{detail.value}</span>
              </div>
            ))}
          </div>

          {/* Sharia Badge */}
          <div className="flex justify-center my-8">
            <ShariaComplianceBadge size="lg" />
          </div>

          {/* Note */}
          <p className="text-center text-[10px] text-gray-600 leading-relaxed">
            {t('receiptNote')}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          {/* Download */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-3 bg-[#DC2626] text-white font-black py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-[#B91C1C] transition-colors shadow-[0_0_30px_rgba(220,38,38,0.3)]"
          >
            <Download className="w-5 h-5" />
            {t('downloadReceipt')}
          </motion.button>

          {/* Copy */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400">{t('copied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                {t('copyToClipboard')}
              </>
            )}
          </motion.button>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-[10px] text-gray-600 font-bold">
          Al Nibras Finance © {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}