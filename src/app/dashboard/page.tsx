"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import NibrasAIChat from '@/components/NibrasAIChat';
import { LogOut, Users, TrendingUp, TrendingDown, Plus, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) router.push('/login');
            else {
                setUser(session.user);
                fetchCustomers();
                fetchTransactions();
            }
            setLoading(false);
        };
        checkUser();
    }, [router]);

    const fetchCustomers = async () => {
        const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
        if (data) setCustomers(data);
    };

    const fetchTransactions = async () => {
        const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
        if (data) setTransactions(data);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleAddCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        await supabase.from('customers').insert([{ name, user_id: user.id }]);
        (e.target as HTMLFormElement).reset();
        fetchCustomers();
    };

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const type = formData.get('type') as string;
        const amount = formData.get('amount') as string;
        const description = formData.get('description') as string;
        await supabase.from('transactions').insert([{ type, amount: parseFloat(amount), description, date: new Date().toISOString().split('T')[0], user_id: user.id }]);
        (e.target as HTMLFormElement).reset();
        fetchTransactions();
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-600/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen relative bg-[#050505] p-4 sm:p-8 overflow-hidden font-sans">
            {/* Animated Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <Image src="/logo.png" alt="Al Nibras" width={200} height={60} className="object-contain" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-bold text-sm flex items-center gap-2">
                            Main App <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button onClick={handleSignOut} className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition flex items-center gap-2">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Add Customer Card */}
                    <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/10 p-6 rounded-2xl">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-400" /> Add Customer</h2>
                        <form onSubmit={handleAddCustomer} className="space-y-4">
                            <input name="name" type="text" placeholder="Customer Name" required className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-indigo-500/50 outline-none" />
                            <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Add Customer
                            </button>
                        </form>
                        <div className="mt-4 space-y-2">
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Recent Customers</p>
                            {customers.length === 0 ? <p className="text-slate-500 text-sm">No customers yet.</p> : customers.slice(0,5).map(c => (
                                <div key={c.id} className="p-3 bg-white/5 rounded-xl border border-white/5 text-white text-sm">{c.name}</div>
                            ))}
                        </div>
                    </div>

                    {/* Add Transaction Card */}
                    <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/10 p-6 rounded-2xl">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-400" /> Add Transaction
                        </h2>
                        <form onSubmit={handleAddTransaction} className="space-y-4">
                            <div className="flex gap-2">
                                <select name="type" className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white" required>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                                <input name="amount" type="number" step="0.01" placeholder="Amount" required className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white" />
                            </div>
                            <input name="description" type="text" placeholder="Description" required className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white" />
                            <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Record Transaction
                            </button>
                        </form>
                        <div className="mt-4 space-y-2">
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Recent Transactions</p>
                            {transactions.length === 0 ? <p className="text-slate-500 text-sm">No transactions yet.</p> : transactions.slice(0,5).map(t => (
                                <div key={t.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between">
                                    <span className="text-white text-sm">{t.description}</span>
                                    <span className={t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}>
                                        {t.type === 'income' ? '+' : '-'}${t.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <NibrasAIChat mode="mentor" userName={user?.email?.split('@')[0] || "Friend"} />
            </div>
        </div>
    );
}