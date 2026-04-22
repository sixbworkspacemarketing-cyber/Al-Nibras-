"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <PremiumBackground />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <div className="relative">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(212, 175, 55, 0.3)",
                "0 0 60px rgba(212, 175, 55, 0.6)",
                "0 0 20px rgba(212, 175, 55, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-40 h-40 rounded-3xl bg-gradient-to-br from-[#D4AF37]/20 to-[#997A1F]/10 border border-[#D4AF37]/30 flex items-center justify-center backdrop-blur-xl"
          >
            <img
              src="/logo.png"
              alt="Al Nibras Finance"
              className="w-32 h-32 object-contain drop-shadow-xl"
            />
          </motion.div>
          <motion.div
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl border-2 border-[#D4AF37]/50"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 mt-12 text-center space-y-6"
      >
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl font-black text-[#D4AF37] uppercase tracking-[0.3em]"
        >
          Al Nibras Finance
        </motion.h2>
        
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full"
          />
          <span className="text-gray-400 font-medium tracking-wider text-sm">
            Securing your session...
          </span>
        </div>

        <div className="flex justify-center gap-1 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 rounded-full bg-[#D4AF37]"
            />
          ))}
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 text-xs font-medium tracking-widest uppercase">
        Premium Islamic Banking
      </div>
    </div>
  );
}

function PremiumBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-30%] left-[-20%] w-[600px] h-[600px] bg-gradient-radial from-[#D4AF37]/20 to-transparent rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1.5, 1, 1.5],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-[-30%] right-[-20%] w-[800px] h-[800px] bg-gradient-radial from-[#D4AF37]/10 to-transparent rounded-full blur-[120px]"
      />
    </div>
  );
}