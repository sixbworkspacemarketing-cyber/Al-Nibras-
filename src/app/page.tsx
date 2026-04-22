'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { Users, Wallet, BookOpen, Gamepad2, Receipt, ArrowRight, ArrowLeft, Shield } from 'lucide-react';

export default function HomePage() {
  const { t, isRTL } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => { 
    setMounted(true);
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    const { data } = await supabase.from('app_links').select('*').order('created_at', { ascending: true });
    if (data) setLinks(data);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#0a0a0a]" />;
  }

  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px]"
        />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-[5]">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FFD700] rounded-full"
            animate={{
              y: [-20, -120, -20],
              opacity: [0, 0.8, 0],
              x: [0, Math.random() * 60 - 30, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.4,
            }}
            style={{
              left: `${5 + i * 8}%`,
              top: `${50 + Math.random() * 40}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
              <Image src="/logo.png" alt="Al Nibras Logo" width={48} height={48} className="object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFA500]">
                AL NIBRAS
              </h1>
              <p className="text-[8px] text-gray-500 uppercase tracking-[0.3em] font-bold">Finance</p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 flex items-center justify-center drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]"
            >
              <Image src="/logo.png" alt="Al Nibras Logo" width={160} height={160} className="object-contain drop-shadow-2xl" priority />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">
              {t('appName')}
            </h2>
            <p className="text-sm md:text-base text-gray-400 max-w-md mx-auto">
              {t('tagline')}
            </p>
            <p className="text-xs text-gray-600 mt-3 uppercase tracking-[0.3em] font-bold">
              {t('selectRole')}
            </p>
          </motion.div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            {/* Parents Card - Purple */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link href="/parent-dashboard">
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/40 via-purple-800/20 to-indigo-900/30 p-8 md:p-10 cursor-pointer hover:border-purple-400/40 transition-all backdrop-blur-md min-h-[280px] flex flex-col justify-between"
                >
                  {/* Decorative elements */}
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-400/20 transition-all" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Users className="w-8 h-8 text-purple-400" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-1">
                      {t('parents')}
                    </h3>
                    <p className="text-xl md:text-2xl font-bold text-purple-300/80 mb-4" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
                      والدین
                    </p>

                    {/* Description */}
                    <p className="text-xs text-gray-400 leading-relaxed mb-6">
                      {t('parentsDesc')}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {[
                        { icon: <Wallet className="w-3 h-3" />, label: 'Banking' },
                        { icon: <Receipt className="w-3 h-3" />, label: 'Receipts' },
                        { icon: <BookOpen className="w-3 h-3" />, label: 'History' },
                      ].map((f, i) => (
                        <span key={i} className="flex items-center gap-1 text-[10px] font-bold text-purple-300/60 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/10">
                          {f.icon} {f.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="relative z-10 flex items-center gap-2 text-purple-300 group-hover:text-[#FFD700] transition-colors">
                    <span className="text-xs font-bold uppercase tracking-widest">Enter Dashboard</span>
                    <Arrow className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            {/* Children Card - Yellow */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link href="/child-dashboard">
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-900/30 via-yellow-900/20 to-orange-900/20 p-8 md:p-10 cursor-pointer hover:border-amber-400/40 transition-all backdrop-blur-md min-h-[280px] flex flex-col justify-between"
                >
                  {/* Decorative elements */}
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-all" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Gamepad2 className="w-8 h-8 text-amber-400" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-1">
                      {t('children')}
                    </h3>
                    <p className="text-xl md:text-2xl font-bold text-amber-300/80 mb-4" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
                      بچے
                    </p>

                    {/* Description */}
                    <p className="text-xs text-gray-400 leading-relaxed mb-6">
                      {t('childrenDesc')}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {[
                        { icon: <Wallet className="w-3 h-3" />, label: 'Wallet' },
                        { icon: <BookOpen className="w-3 h-3" />, label: 'Courses' },
                        { icon: <Gamepad2 className="w-3 h-3" />, label: 'Games' },
                      ].map((f, i) => (
                        <span key={i} className="flex items-center gap-1 text-[10px] font-bold text-amber-300/60 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/10">
                          {f.icon} {f.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="relative z-10 flex items-center gap-2 text-amber-300 group-hover:text-[#FFD700] transition-colors">
                    <span className="text-xs font-bold uppercase tracking-widest">Enter Dashboard</span>
                    <Arrow className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* Sharia compliance footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex items-center gap-2 text-emerald-500/60"
          >
            <Shield className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              ✓ {t('shariaCompliant')} • {t('zeroInterest')}
            </span>
          </motion.div>

          {/* Dynamic Quick Links from DB */}
          {links.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-12 w-full max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] flex-1 bg-white/5"></div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Quick Access</span>
                <div className="h-[1px] flex-1 bg-white/5"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {links.map((link) => (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group"
                  >
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors text-center">{link.title}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
          Al Nibras Finance © {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  );
}