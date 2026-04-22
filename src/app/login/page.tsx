"use client";
// Force build fix update v1


import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [cnic, setCnic] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
            const { error } = await supabase.auth.resetPasswordForEmail(identifier, {
                redirectTo: `${window.location.origin}/login/recovery`,
            });
            if (error) {
                setError(error.message);
            } else {
                setResetSent(true);
            }
        } else if (isSignUp) {
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                setLoading(false);
                return;
            }
            const { error } = await supabase.auth.signUp({
                email: identifier,
                password,
                options: {
                    data: {
                        full_name: identifier.split('@')[0],
                        mobile_number: mobileNumber,
                        cnic: cnic,
                        role: 'child'
                    }
                }
            });
            if (error) {
                setError(error.message);
            } else {
                alert('Success! Please verify your email to activate your account.');
                setIsSignUp(false);
                setPassword('');
            }
        } else {
            let loginEmail = identifier;
            
            // Check if identifier is NOT an email
            if (!identifier.includes('@')) {
                const { data: profile, error: searchError } = await supabase
                    .from('profiles')
                    .select('email')
                    .or(`mobile_number.eq."${identifier}",cnic.eq."${identifier}"`)
                    .maybeSingle();
                
                if (searchError || !profile?.email) {
                    setError("Could not find an account with that Mobile/CNIC");
                    setLoading(false);
                    return;
                }
                loginEmail = profile.email;
            }

            const { error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
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
                        Secure Access Portal
                    </p>
                </div>

                {/* Premium Glass Card */}
                <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                    <div className="relative">
                        <h3 className="text-2xl font-semibold text-white mb-8 text-center tracking-tight">
                            {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome'}
                        </h3>

                        {resetSent ? (
                            <div className="text-center space-y-6">
                                <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm font-medium">
                                    Check your email <span className="text-white">{identifier}</span> for the reset link.
                                </div>
                                <button onClick={() => { setIsForgotPassword(false); setResetSent(false); }} className="text-indigo-400 hover:text-indigo-300 font-bold text-sm uppercase tracking-widest transition-colors">
                                    Back to Login
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-4" onSubmit={handleAuth}>
                                {error && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">
                                            {isSignUp ? 'Email Address' : 'Identifier'}
                                        </label>
                                        <div className="relative group">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                            <input 
                                                type="text" 
                                                required 
                                                value={identifier} 
                                                onChange={(e) => setIdentifier(e.target.value)} 
                                                className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-700 text-sm focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all" 
                                                placeholder={isSignUp ? "your@email.com" : "Email, Mobile, or CNIC"} 
                                            />
                                        </div>
                                    </div>

                                    {isSignUp && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Mobile</label>
                                                <input type="tel" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="block w-full px-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-700 text-sm focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all" placeholder="03xx..." />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">CNIC</label>
                                                <input type="text" required value={cnic} onChange={(e) => setCnic(e.target.value)} className="block w-full px-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-700 text-sm focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all" placeholder="42xxx..." />
                                            </div>
                                        </div>
                                    )}

                                    {!isForgotPassword && (
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1 flex justify-between">
                                                <span>Password</span>
                                                {!isSignUp && <button type="button" onClick={() => setIsForgotPassword(true)} className="text-indigo-400 hover:text-indigo-300 text-[10px]">Forgot?</button>}
                                            </label>
                                            <div className="relative group">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-700 text-sm focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all" placeholder="••••••••" minLength={6} />
                                            </div>
                                        </div>
                                    )}

                                    {isSignUp && (
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Confirm Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-700 text-sm focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all" placeholder="••••••••" minLength={6} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-4 py-4 rounded-xl shadow-lg shadow-indigo-600/10 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Processing...' : isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Create Verified Account' : 'Sign In'}
                                    {!loading && <ArrowRight className="w-4 h-4" />}
                                </button>
                                
                                {isForgotPassword && (
                                    <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest hover:text-white transition-colors pt-4">
                                        Cancel
                                    </button>
                                )}
                            </form>
                        )}

                        <div className="mt-8 text-center text-sm">
                            <span className="text-slate-500">{isSignUp ? 'Already have an account?' : "New to Al Nibras?"}</span>
                            {' '}
                            <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="font-bold text-white hover:text-indigo-300 transition-colors">
                                {isSignUp ? 'Sign In' : 'Apply Now'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-10 text-center flex items-center justify-center gap-2 text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>256-bit Secure Encryption</span>
                </div>
            </div>
        </div>
    );
}
