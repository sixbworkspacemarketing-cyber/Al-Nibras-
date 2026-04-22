'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/ui/LanguageToggle';
import BackButton from '@/components/ui/BackButton';
import BalanceCard from '@/components/ui/BalanceCard';
import TransferModal from '@/components/TransferModal';
import ShariaComplianceBadge from '@/components/ShariaComplianceBadge';
import { sampleTransactions, Transaction } from '@/lib/receiptGenerator';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  History,
  BookOpen,
  Gamepad2,
  Receipt,
  Shield,
  Check,
  Eye,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Image from 'next/image';

export default function ParentDashboard() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleTransfer = (data: { child: string; amount: number; purpose: string }) => {
    const newTx: Transaction = {
      id: `TXN-2024-${String(transactions.length + 1).padStart(3, '0')}`,
      amount: data.amount,
      sender: 'Ahmed (Parent)',
      recipient: data.child,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      purpose: data.purpose,
      status: 'completed',
    };

    setTransactions([newTx, ...transactions]);
    setBalance((prev) => prev - data.amount);
    setIsTransferOpen(false);
    setShowSuccess(true);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#DC2626', '#FFD700', '#FFFFFF'],
    });

    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!mounted) return <div className="min-h-screen bg-[#0a0a0a]" />;

  const quickActions = [
    { icon: <Send className="w-5 h-5" />, label: t('transferMoney'), color: '#DC2626', action: () => setIsTransferOpen(true) },
    { icon: <History className="w-5 h-5" />, label: t('requestHistory'), color: '#8B5CF6', action: () => {} },
    { icon: <BookOpen className="w-5 h-5" />, label: t('courses'), color: '#3B82F6', action: () => router.push('/child-dashboard/courses') },
    { icon: <Gamepad2 className="w-5 h-5" />, label: t('games'), color: '#F59E0B', action: () => router.push('/child-dashboard/games') },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BackButton href="/" />
            <div className="w-10 h-10 flex items-center justify-center drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] bg-gradient-to-br from-[#FFD700]/10 to-[#AA841E]/10 rounded-xl">
              <Image src="/logo.png" alt="Al Nibras Logo" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight">{t('parentDashboard')}</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                <Users className="w-3 h-3" /> {t('parents')} • واﻟﺪﯾﻦ
              </p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        {/* Balance Card */}
        <BalanceCard balance={balance} variant="parent" className="mb-8" />

        {/* Quick Actions */}
        <section className="mb-10">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t('quickActions')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={action.action}
                className="group relative overflow-hidden p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-left"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border border-white/10"
                  style={{ backgroundColor: `${action.color}15`, color: action.color }}
                >
                  {action.icon}
                </div>
                <p className="text-xs font-bold text-white group-hover:text-[#FFD700] transition-colors">{action.label}</p>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: action.color }} />
              </motion.button>
            ))}
          </div>
        </section>

        {/* Recent Transactions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('recentTransactions')}</h3>
            <ShariaComplianceBadge size="sm" />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md overflow-hidden divide-y divide-white/5">
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 flex items-center justify-between group hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500 border border-white/5">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm group-hover:text-[#FFD700] transition-colors">
                      {tx.purpose} → {tx.recipient}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-500 font-bold">{tx.id}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[10px] text-gray-500 font-bold">{tx.date}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className={`text-[10px] font-bold ${tx.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {tx.status === 'completed' ? t('completed') : t('pending')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-black text-[#DC2626] tabular-nums">
                    -PKR {tx.amount.toLocaleString('en-PK')}
                  </p>
                  <button
                    onClick={() => router.push(`/parent-dashboard/receipt/${encodeURIComponent(tx.id)}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/30 transition-all uppercase tracking-widest"
                  >
                    <Eye className="w-3 h-3" />
                    {t('viewReceipt')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Transfer Modal */}
      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onTransfer={handleTransfer}
      />

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.4)] flex items-center gap-3 font-bold"
          >
            <Check className="w-6 h-6" />
            {t('transferSuccess')}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}