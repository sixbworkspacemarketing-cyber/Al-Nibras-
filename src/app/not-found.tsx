import Link from "next/link";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      
      <div className="relative z-10 bg-white/5 border border-red-500/20 p-10 rounded-3xl backdrop-blur-md max-w-md w-full">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        
        <h1 className="text-6xl font-black text-white mb-2">404</h1>
        <h2 className="text-xl font-bold text-red-400 mb-4 uppercase tracking-widest">Page Not Found</h2>
        
        <p className="text-gray-400 text-sm mb-8">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 w-full py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition border border-white/10 font-bold tracking-widest uppercase text-xs"
        >
          <Home className="w-4 h-4" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}