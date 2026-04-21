'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Lock, User, ArrowLeft, Phone, ShieldCheck, Heart, Database, MapPin } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20"
      >
        {/* Navigation */}
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 text-[#D4AF37] font-black text-xs uppercase tracking-widest mb-12 hover:opacity-80 transition-all"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* Glassmorphic Container */}
        <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden shadow-2xl">
          {/* Header */}
          <header className="mb-12 relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-[#D4AF37] uppercase tracking-tighter mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              Al Nibras Finance: Securing Your Family's Financial Future
            </p>
          </header>

          {/* Sections */}
          <div className="space-y-12 relative z-10">
            
            {/* Kids & Parents */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                  <Heart className="text-[#D4AF37] w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Kids & Parents</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed ml-14">
                Protecting our younger users is our top priority. At Al Nibras Finance, kids' accounts are only created with explicit <span className="text-white font-bold italic">parental consent</span>. We ensure that every child's financial journey starts under the guidance and supervision of their legal guardians.
              </p>
            </section>

            {/* Data Collection */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                  <Database className="text-[#D4AF37] w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Data Collection</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed ml-14">
                We collect essential information to provide the best educational and financial experience. This includes <span className="text-white font-bold">name, age</span> (to tailor educational modules), and <span className="text-white font-bold italic">parent verification details</span>. We never share personal data with third parties for marketing purposes.
              </p>
            </section>

            {/* Parents Portal */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                  <User className="text-[#D4AF37] w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Parents Portal</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed ml-14">
                The <span className="text-[#D4AF37] font-bold uppercase tracking-tighter">Parents Portal</span> is your command center. Parents have <span className="text-white font-bold italic">full control</span> over their child's spending limits, account status, and educational data. You can monitor progress and approve rewards in real-time, ensuring a safe and transparent environment.
              </p>
            </section>

            {/* Security */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                  <ShieldCheck className="text-[#D4AF37] w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Security</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed ml-14">
                Financial security is non-negotiable. We use <span className="text-white font-bold italic">industry-standard encryption</span> and advanced security protocols to protect all financial transactions and sensitive data. Your family's assets are guarded with the same rigor as global banking systems.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mt-4 ml-14 bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-4 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
              >
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="text-[#D4AF37] w-4 h-4" />
                  <span className="text-[#D4AF37] font-bold tracking-widest text-[10px] uppercase">
                    Elite members' data is protected by VIP Multi-Layer Encryption & Private Cloud Shielding.
                  </span>
                </div>
              </motion.div>
            </section>

            {/* Contact Us */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                  <Phone className="text-[#D4AF37] w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Contact Us</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed ml-14">
                For any privacy-related queries or support, please contact us at <span className="text-white font-bold italic">0300-8813750</span> or visit us at <span className="text-white font-bold italic">Mustafai School System, Changa Manga</span>.
              </p>
            </section>

          </div>

          {/* Footer Decoration */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Support Footer */}
        <footer className="mt-16 text-center border-t border-white/5 pt-12">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 shadow-lg shadow-[#D4AF37]/5">
              <Phone className="text-[#D4AF37] w-4 h-4" />
              <span className="text-gray-400 text-sm font-bold tracking-widest">0300-8813750</span>
            </div>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 shadow-lg shadow-[#D4AF37]/5">
              <MapPin className="text-[#D4AF37] w-4 h-4" />
              <span className="text-gray-400 text-sm font-bold tracking-widest">Mustafai School System, Changa Manga</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-8">
            © 2026 Al Nibras Finance. All Rights Reserved.
          </p>
        </footer>

      </motion.main>
    </div>
  );
}
