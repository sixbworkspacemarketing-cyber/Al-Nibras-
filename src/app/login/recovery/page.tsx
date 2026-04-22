"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function RecoveryPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#050505] overflow-hidden font-sans">
            {/* Ultra Premium Animated Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-700/10 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-md w-full relative z-10">
                {/* Logo Section */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <Image
                        src="/logo.png"
                        alt="Al Nibras Finance"
                        width={280}
                        height={100}
                        className="object-contain drop-shadow-2xl mb-4"
                        priority
                    />
                    <p className="text-slate-400 text-xs tracking-[0.2em] uppercase font-bold mt-2 flex items-center gap-2 justify-center">
                        <ShieldCheck className="w-4 h-4 text-indigo-400" />
                        Account Recovery
                    </p>
                </div>

                {/* Premium Glass Card */}
                <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                    <div className="relative">
                        <h3 className="text-2xl font-semibold text-white mb-8 text-center tracking-tight">
                            Set New Password
                        </h3>

                        {success ? (
                            <div className="text-center space-y-6 py-4">
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold text-white">Password Updated!</h4>
                                    <p className="text-slate-400 text-sm">Your security credentials have been successfully updated. Redirecting you to login...</p>
                                </div>
                                <div className="pt-4">
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 animate-[progress_3s_linear]"></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleUpdatePassword}>
                                {error && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">New Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                            <input 
                                                type="password" 
                                                required 
                                                value={password} 
                                                onChange={(e) => setPassword(e.target.value)} 
                                                className="block w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-700 text-sm focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all" 
                                                placeholder="••••••••" 
                                                minLength={6} 
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Confirm New Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                            <input 
                                                type="password" 
                                                required 
                                                value={confirmPassword} 
                                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                                className="block w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-700 text-sm focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all" 
                                                placeholder="••••••••" 
                                                minLength={6} 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-2 py-4 rounded-xl shadow-lg shadow-indigo-600/10 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                    {!loading && <ArrowRight className="w-4 h-4" />}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="mt-10 text-center flex items-center justify-center gap-2 text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Secure Password Update Environment</span>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </div>
    );
}
