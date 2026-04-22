// Complete EN/UR translation dictionary for Al Nibras Finance
export type Language = 'en' | 'ur';

export const translations = {
  // ─── Home Screen ───
  appName: { en: 'Al Nibras Finance', ur: 'النبراس فائنانس' },
  tagline: { en: 'Islamic Finance for Families', ur: 'خاندانوں کے لیے اسلامی مالیات' },
  parents: { en: 'Parents', ur: 'والدین' },
  children: { en: 'Children', ur: 'بچے' },
  parentsDesc: { en: 'Access parent banking dashboard, transfer pocket money, view transactions & generate receipts', ur: 'والدین کا بینکنگ ڈیش بورڈ، جیب خرچ بھیجیں، لین دین دیکھیں اور رسید بنائیں' },
  childrenDesc: { en: 'Access child wallet, view pocket money, browse courses & play learning games', ur: 'بچوں کا والیٹ، جیب خرچ دیکھیں، کورسز براؤز کریں اور گیمز کھیلیں' },
  selectRole: { en: 'Select Your Role', ur: 'اپنا کردار منتخب کریں' },

  // ─── Common ───
  back: { en: 'Back', ur: 'واپس' },
  home: { en: 'Home', ur: 'ہوم' },
  balance: { en: 'Balance', ur: 'بیلنس' },
  totalBalance: { en: 'Total Balance', ur: 'کل بیلنس' },
  amount: { en: 'Amount', ur: 'رقم' },
  status: { en: 'Status', ur: 'حالت' },
  date: { en: 'Date', ur: 'تاریخ' },
  time: { en: 'Time', ur: 'وقت' },
  completed: { en: 'Completed', ur: 'مکمل' },
  pending: { en: 'Pending', ur: 'زیرالتوا' },
  confirm: { en: 'Confirm', ur: 'تصدیق' },
  cancel: { en: 'Cancel', ur: 'منسوخ' },
  search: { en: 'Search', ur: 'تلاش' },
  loading: { en: 'Loading...', ur: 'لوڈ ہو رہا ہے...' },
  currency: { en: 'PKR', ur: 'روپے' },
  noData: { en: 'No data available', ur: 'کوئی ڈیٹا دستیاب نہیں' },

  // ─── Parent Dashboard ───
  parentDashboard: { en: 'Parent Dashboard', ur: 'والدین ڈیش بورڈ' },
  transferMoney: { en: 'Transfer Money', ur: 'رقم بھیجیں' },
  requestHistory: { en: 'Request History', ur: 'درخواست کی تاریخ' },
  courses: { en: 'Courses', ur: 'کورسز' },
  games: { en: 'Games', ur: 'گیمز' },
  quickActions: { en: 'Quick Actions', ur: 'فوری کارروائیاں' },
  recentTransactions: { en: 'Recent Transactions', ur: 'حالیہ لین دین' },
  sendPocketMoney: { en: 'Send Pocket Money', ur: 'جیب خرچ بھیجیں' },
  selectChild: { en: 'Select Child', ur: 'بچہ منتخب کریں' },
  enterAmount: { en: 'Enter Amount', ur: 'رقم درج کریں' },
  selectPurpose: { en: 'Select Purpose', ur: 'مقصد منتخب کریں' },
  pocketMoney: { en: 'Pocket Money', ur: 'جیب خرچ' },
  allowance: { en: 'Allowance', ur: 'وظیفہ' },
  reward: { en: 'Reward', ur: 'انعام' },
  gift: { en: 'Gift', ur: 'تحفہ' },
  transferSuccess: { en: 'Transfer Successful!', ur: 'رقم کامیابی سے بھیجی گئی!' },
  viewReceipt: { en: 'View Receipt', ur: 'رسید دیکھیں' },
  transactionId: { en: 'Transaction ID', ur: 'ٹرانزیکشن ID' },
  recipient: { en: 'Recipient', ur: 'وصول کنندہ' },
  sender: { en: 'Sender', ur: 'بھیجنے والا' },

  // ─── Receipt ───
  transactionReceipt: { en: 'Transaction Receipt', ur: 'ٹرانزیکشن رسید' },
  downloadReceipt: { en: 'Download Receipt', ur: 'رسید ڈاؤن لوڈ کریں' },
  copyToClipboard: { en: 'Copy to Clipboard', ur: 'کلپ بورڈ پر کاپی کریں' },
  copied: { en: 'Copied!', ur: 'کاپی ہو گیا!' },
  purpose: { en: 'Purpose', ur: 'مقصد' },
  dateTime: { en: 'Date & Time', ur: 'تاریخ اور وقت' },
  shariaCompliant: { en: 'SHARIA COMPLIANT', ur: 'شریعت کے مطابق' },
  zeroInterest: { en: '0% Interest', ur: '0% سود' },
  receiptNote: { en: 'This transaction follows Islamic finance principles', ur: 'یہ لین دین اسلامی مالیاتی اصولوں کے مطابق ہے' },

  // ─── Child Dashboard ───
  childDashboard: { en: 'Child Dashboard', ur: 'بچوں کا ڈیش بورڈ' },
  myWallet: { en: 'My Wallet', ur: 'میرا والیٹ' },
  receivedTransfers: { en: 'Received Transfers', ur: 'موصول شدہ رقم' },
  totalReceived: { en: 'Total Received', ur: 'کل موصول شدہ' },
  from: { en: 'From', ur: 'کس سے' },

  // ─── LMS ───
  lms: { en: 'Learning Hub', ur: 'تعلیمی مرکز' },
  islamicStudies: { en: 'Islamic Studies', ur: 'اسلامی تعلیم' },
  mathematics: { en: 'Mathematics', ur: 'ریاضی' },
  science: { en: 'Science', ur: 'سائنس' },
  language: { en: 'Language', ur: 'زبان' },
  lifeSkills: { en: 'Life Skills', ur: 'لائف سکلز' },
  technology: { en: 'Technology', ur: 'ٹیکنالوجی' },
  lessons: { en: 'Lessons', ur: 'اسباق' },
  progress: { en: 'Progress', ur: 'پیش رفت' },
  enrolled: { en: 'Enrolled', ur: 'داخلہ شدہ' },
  startLearning: { en: 'Start Learning', ur: 'سیکھنا شروع کریں' },
  continueLearning: { en: 'Continue Learning', ur: 'سیکھنا جاری رکھیں' },
  completed_lesson: { en: 'Completed', ur: 'مکمل' },
  notStarted: { en: 'Not Started', ur: 'شروع نہیں ہوا' },
  inProgress: { en: 'In Progress', ur: 'جاری ہے' },
  difficulty: { en: 'Difficulty', ur: 'مشکل' },
  beginner: { en: 'Beginner', ur: 'ابتدائی' },
  intermediate: { en: 'Intermediate', ur: 'درمیانہ' },
  advanced: { en: 'Advanced', ur: 'ایڈوانسڈ' },
  minutes: { en: 'min', ur: 'منٹ' },
  courseDetails: { en: 'Course Details', ur: 'کورس کی تفصیلات' },

  // ─── Gamification ───
  gamificationHub: { en: 'Gamification Hub', ur: 'گیمیفیکیشن ہب' },
  quranicMatching: { en: 'Quranic Verse Matching', ur: 'قرآنی آیت ملاپ' },
  mathChallenges: { en: 'Math Challenges', ur: 'ریاضی چیلنجز' },
  quizMaster: { en: 'Quiz Master', ur: 'کوئز ماسٹر' },
  wordBuilder: { en: 'Word Builder', ur: 'لفظ ساز' },
  logicPuzzles: { en: 'Logic Puzzles', ur: 'لاجک پزلز' },
  memoryGame: { en: 'Memory Game', ur: 'یاداشت گیم' },
  points: { en: 'Points', ur: 'پوائنٹس' },
  score: { en: 'Score', ur: 'اسکور' },
  play: { en: 'Play', ur: 'کھیلیں' },
  achievements: { en: 'Achievements', ur: 'کامیابیاں' },
  badges: { en: 'Badges', ur: 'بیجز' },
  leaderboard: { en: 'Leaderboard', ur: 'لیڈر بورڈ' },
  rank: { en: 'Rank', ur: 'درجہ' },
  earnedPoints: { en: 'Earned Points', ur: 'حاصل شدہ پوائنٹس' },
  unlocked: { en: 'Unlocked', ur: 'ان لاک' },
  locked: { en: 'Locked', ur: 'لاک' },
  playNow: { en: 'Play Now', ur: 'ابھی کھیلیں' },
  correct: { en: 'Correct!', ur: 'صحیح!' },
  incorrect: { en: 'Incorrect!', ur: 'غلط!' },
  nextQuestion: { en: 'Next Question', ur: 'اگلا سوال' },
  gameOver: { en: 'Game Over', ur: 'گیم ختم' },
  tryAgain: { en: 'Try Again', ur: 'دوبارہ کوشش کریں' },
  congratulations: { en: 'Congratulations!', ur: 'مبارک ہو!' },
  level: { en: 'Level', ur: 'لیول' },
  timer: { en: 'Timer', ur: 'ٹائمر' },
  dashboard: { en: 'Dashboard', ur: 'ڈیش بورڈ' },

  // ─── Sharia ───
  shariaCompliance: { en: 'Sharia Compliance', ur: 'شریعت کی تعمیل' },
  interestFree: { en: 'Interest-Free', ur: 'سود سے پاک' },
  halalCertified: { en: 'Halal Certified', ur: 'حلال تصدیق شدہ' },

  // ─── Language ───
  switchLanguage: { en: 'اردو', ur: 'EN' },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Language): string {
  return translations[key]?.[lang] || translations[key]?.['en'] || key;
}
