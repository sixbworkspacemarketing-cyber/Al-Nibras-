'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { X, ShieldCheck, User, ChevronDown } from 'lucide-react';
import ShariaComplianceBadge from '@/components/ShariaComplianceBadge';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (data: { child: string; amount: number; purpose: string }) => void;
}

const children = ['Ali', 'Sara', 'Hassan'];
const purposes = ['pocketMoney', 'allowance', 'reward', 'gift'] as const;

export default function TransferModal({ isOpen, onClose, onTransfer }: TransferModalProps) {
  const { t } = useLanguage();
  const [selectedChild, setSelectedChild] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [showChildDropdown, setShowChildDropdown] = useState(false);
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!selectedChild || !amount || !purpose) {
      setError('Please fill all fields');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Enter a valid amount');
      return;
    }
    onTransfer({ child: selectedChild, amount: numAmount, purpose });
    setSelectedChild('');
    setAmount('');
    setPurpose('');
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-md p-8 relative"
          >
            {/* Close */}
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <h2 className="text-xl font-black text-white mb-1">{t('sendPocketMoney')}</h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-8">{t('transferMoney')}</p>

            {/* Select Child */}
            <div className="mb-5 relative">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('selectChild')}</label>
              <button
                onClick={() => { setShowChildDropdown(!showChildDropdown); setShowPurposeDropdown(false); }}
                className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-white hover:border-[#FFD700]/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className={selectedChild ? 'text-white' : 'text-gray-500'}>{selectedChild || t('selectChild')}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showChildDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showChildDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden"
                  >
                    {children.map((child) => (
                      <button
                        key={child}
                        onClick={() => { setSelectedChild(child); setShowChildDropdown(false); }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${selectedChild === child ? 'text-[#FFD700] bg-white/5' : 'text-white'}`}
                      >
                        {child}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Amount */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('enterAmount')}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DC2626] font-bold text-sm">PKR</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-14 text-xl font-bold text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Purpose */}
            <div className="mb-6 relative">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('selectPurpose')}</label>
              <button
                onClick={() => { setShowPurposeDropdown(!showPurposeDropdown); setShowChildDropdown(false); }}
                className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-white hover:border-[#FFD700]/30 transition-colors"
              >
                <span className={purpose ? 'text-white' : 'text-gray-500'}>{purpose ? t(purpose as any) : t('selectPurpose')}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showPurposeDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showPurposeDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden"
                  >
                    {purposes.map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPurpose(p); setShowPurposeDropdown(false); }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${purpose === p ? 'text-[#FFD700] bg-white/5' : 'text-white'}`}
                      >
                        {t(p)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sharia Badge */}
            <div className="mb-6 flex justify-center">
              <ShariaComplianceBadge size="md" />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-xs font-bold mb-4 text-center">{error}</p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#DC2626] text-white font-black py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-[#B91C1C] transition-colors shadow-[0_0_30px_rgba(220,38,38,0.3)]"
            >
              {t('confirm')} {t('transferMoney')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}