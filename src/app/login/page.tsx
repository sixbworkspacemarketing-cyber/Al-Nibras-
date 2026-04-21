"use client";
// Force build fix update v1


import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isForgotPassword) {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login?type=recovery`,
            });
            if (error) {
                setError(error.message);
            } else {
                setResetSent(true);
            }
        } else if (isSignUp) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: email.split('@')[0],
                    }
                }
            });
            if (error) {
                setError(error.message);
            } else {
                alert('Success! Please verify your email or log in.');
                setIsSignUp(false);
                setPassword('');
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                setError(error.message);
            } else {
                router.push('/');
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#050505] overflow-hidden font-sans">
            {/* Ultra Premium Animated Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-700/10 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10">
                {/* Logo Section */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <Image
                        src="/logo-new.png"
                        alt="Al Nibras Finance"
                        width={280}
                        height={100}
                        className="object-contain drop-shadow-2xl mb-4"
                        priority
                    />
                    <p className="text-slate-400 text-xs tracking-[0.2em] uppercase font-bold mt-2 flex items-center gap-2 justify-center">
                        <ShieldCheck className="w-4 h-4 text-indigo-400" />
                        Secure Financial Access
                    </p>
                </div>

                {/* Premium Glass Card */}
                <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Inner subtle glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                    <div className="relative">
                        <h3 className="text-2xl font-semibold text-white mb-8 text-center tracking-tight">
                            {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create your account' : 'Welcome back'}
                        </h3>

                        {resetSent ? (
                            <div className="text-center space-y-6">
                                <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm font-medium">
                                    Password reset link has been sent to <span className="text-white">{email}</span>. Please check your inbox.
                                </div>
                                <button
                                    onClick={() => {
                                        setIsForgotPassword(false);
                                        setResetSent(false);
                                    }}
                                    className="text-indigo-400 hover:text-indigo-300 font-bold text-sm uppercase tracking-widest transition-colors"
                                >
                                    Back to Login
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleAuth}>
                                {error && (
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium shadow-inner">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                                            Email Address
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block w-full pl-14 px-4 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none shadow-inner"
                                                placeholder="hello@example.com"
                                            />
                                        </div>
                                    </div>

                                    {!isForgotPassword && (
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1 flex justify-between">
                                                <span>Password</span>
                                                {!isSignUp && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => setIsForgotPassword(true)}
                                                        className="text-indigo-400 hover:text-indigo-300 capitalize tracking-normal text-xs font-medium"
                                                    >
                                                        Forgot?
                                                    </button>
                                                )}
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                                </div>
                                                <input
                                                    type="password"
                                                    required={!isForgotPassword}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="block w-full pl-14 px-4 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none shadow-inner"
                                                    placeholder="••••••••"
                                                    minLength={6}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-2 py-4 px-4 rounded-2xl shadow-lg shadow-indigo-600/20 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111111] focus:ring-indigo-500 transition-all disabled:opacity-50 group flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Processing...' : isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Create Account' : 'Sign In'}
                                    {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </button>
                                
                                {isForgotPassword && (
                                    <button 
                                        type="button" 
                                        onClick={() => setIsForgotPassword(false)}
                                        className="w-full text-center text-xs text-slate-500 font-bold uppercase tracking-widest hover:text-white transition-colors pt-2"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </form>
                        )}

                        <div className="mt-8 text-center text-sm text-slate-400">
                            {isSignUp ? 'Already have an account?' : "New to Al Nibras?"}
                            {' '}
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setError(null);
                                }}
                                className="font-semibold text-white hover:text-indigo-300 mt-3 block w-full outline-none transition-colors"
                            >
                                {isSignUp ? 'Sign in to your account' : 'Apply for an account'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer or badge */}
                <div className="mt-10 text-center flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" />
                    <span>256-bit Bank-Grade Encryption</span>
                </div>
            </div>
        </div>
    );
}
