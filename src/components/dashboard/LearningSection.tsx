"use client";

import { motion } from "framer-motion";
import { Book, Plus, ArrowUpRight, HelpCircle } from "lucide-react";
import type { Course, Book as BookType } from "@/lib/types";

interface LearningSectionProps {
  books: BookType[];
  courses: Course[];
  studyingCourseId: number | null;
  studyTimer: number;
  pendingRewards: number;
  currency: string;
  currencySymbol: string;
  onCourseProgress: (courseId: number, progress: number) => void;
  onStartCourse: (id: number) => void;
}

function convertCurrency(amount: number, currency: string): string {
  const rates: Record<string, number> = { USD: 1, PKR: 280, AED: 3.67 };
  const rate = rates[currency] || 1;
  return (amount * rate).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function LearningSection({
  books,
  courses,
  studyingCourseId,
  studyTimer,
  pendingRewards,
  currency,
  currencySymbol,
  onStartCourse,
}: LearningSectionProps) {
  const completedCoursesCount = courses.filter((c) => c.progress === 100).length;

  return (
    <section className="mt-12 md:mt-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
            Learning & Rewards
          </h3>
          <p className="text-gray-400 text-xs md:text-sm mb-3">
            Study and earn rewards for your savings!
          </p>
          <div className="inline-block text-[9px] font-bold bg-white/10 border border-white/10 text-white px-2 py-1 rounded">
            Islamic Education • Free Forever
          </div>
        </div>
        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-2 rounded-2xl flex items-center gap-3">
          <div className="bg-[#D4AF37] p-1.5 rounded-lg text-black">
            <Plus className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
              Pending Rewards
            </p>
            <p className="text-lg font-bold text-[#D4AF37]">
              {currencySymbol}
              {convertCurrency(pendingRewards, currency)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Book className="w-5 h-5 text-indigo-400" />
            <h4 className="text-sm font-black text-white uppercase tracking-widest">
              Mustafai Library
            </h4>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-4 h-[350px] overflow-y-auto no-scrollbar space-y-3">
            {books.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <Book className="w-8 h-8 text-gray-700 mb-2" />
                <p className="text-[10px] text-gray-500 font-bold uppercase">
                  Library empty
                </p>
              </div>
            ) : (
              books.map((book) => (
                <a
                  key={book.id}
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                    <Book className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{book.title}</p>
                    <p className="text-[8px] text-gray-500 uppercase tracking-tighter">
                      Read Now • Free
                    </p>
                  </div>
                  <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                </a>
              ))
            )}
          </div>
        </motion.div>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#D4AF37]/20 to-black/60 rounded-[2rem] md:rounded-[2.5rem] border-2 border-[#D4AF37]/30 p-5 md:p-6 flex flex-col items-center text-center group hover:border-[#D4AF37] transition-all backdrop-blur-xl relative overflow-hidden h-fit"
          >
            <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-tighter">
              Daily Quiz
            </div>
            <HelpCircle className="text-[#D4AF37] mb-4 w-10 h-10 md:w-12 md:h-12" />
            <h4 className="font-bold text-base md:text-lg mb-2 text-white">
              Daily Wisdom Quiz
            </h4>
            <p className="text-gray-400 text-[10px] md:text-xs mb-6">
              Answer correctly to earn{" "}
              <span className="text-[#D4AF37] font-bold">
                {currencySymbol}
                {convertCurrency(2, currency)} reward!
              </span>
            </p>
            <button className="w-full bg-[#D4AF37] text-black font-black py-3 rounded-xl md:rounded-2xl text-xs md:text-sm hover:bg-[#F2D06B] transition-all uppercase tracking-widest mt-auto">
              Start Quiz
            </button>
          </motion.div>

          {courses.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center justify-center text-gray-500 text-xs font-bold uppercase italic">
              Loading Courses...
            </div>
          ) : (
            courses.slice(0, 1).map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#001f3f]/30 rounded-[2rem] md:rounded-[2.5rem] border border-[#D4AF37]/10 overflow-hidden flex flex-col group hover:border-[#D4AF37]/40 transition-all backdrop-blur-md"
              >
                <div className="h-28 bg-gradient-to-br from-[#001f3f] to-black flex items-center justify-center text-4xl relative">
                  {studyingCourseId === course.id ? (
                    <div className="text-2xl font-black text-[#D4AF37]">
                      {studyTimer}s
                    </div>
                  ) : (
                    <span className="group-hover:scale-110 transition-transform">
                      {course.thumbnail || "📚"}
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-bold text-sm text-white mb-1 truncate">
                    {course.title}
                  </h4>
                  <p className="text-gray-400 text-[10px] mb-3 line-clamp-1">
                    {course.description}
                  </p>
                  <button
                    onClick={() => onStartCourse(course.id)}
                    className="mt-auto w-full bg-white/5 border border-white/10 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all"
                  >
                    Study Now
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {courses.slice(1).map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-[1.5rem] border border-white/5 p-4 flex gap-4 items-center group hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              {course.thumbnail || "📖"}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-white text-xs truncate">{course.title}</h5>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="bg-[#D4AF37] h-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span className="text-[8px] text-[#D4AF37] font-bold">
                  {course.progress}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}