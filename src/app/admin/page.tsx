"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Users, TrendingUp, TrendingDown, LogOut, ShieldAlert, Book, Plus, Trash2, GraduationCap, UserCheck, Mail, Calendar, Edit, Save, X, Award, Shield } from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ income: 0, expenses: 0, customers: 0, totalUsers: 0 });
    const [customers, setCustomers] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [libBooks, setLibBooks] = useState<any[]>([]);
    const [libCourses, setLibCourses] = useState<any[]>([]);
    const [libBadges, setLibBadges] = useState<any[]>([]);
    const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editType, setEditType] = useState<'book' | 'course' | 'badge' | null>(null);
    const [editData, setEditData] = useState<any>({});
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push('/login'); return; }
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
            if (!profile || profile.role !== 'admin') { router.push('/'); return; }
            setUser(session.user);
            fetchDashboardData();
        };
        checkUser();
    }, [router]);

    const fetchDashboardData = async () => {
        const [custRes, txRes, booksRes, coursesRes, usersRes, badgesRes] = await Promise.all([
            supabase.from('customers').select('*').order('created_at', { ascending: false }),
            supabase.from('transactions').select('*').order('created_at', { ascending: false }),
            supabase.from('app_books').select('*').order('created_at', { ascending: false }),
            supabase.from('app_courses').select('*').order('created_at', { ascending: false }),
            supabase.from('profiles').select('*').order('created_at', { ascending: false }),
            supabase.from('app_badges').select('*').order('created_at', { ascending: false })
        ]);

        if (custRes.data) { setCustomers(custRes.data); setStats(s => ({ ...s, customers: custRes.data.length })); }
        if (txRes.data) {
            setTransactions(txRes.data);
            let inc = 0, exp = 0;
            txRes.data.forEach(t => { t.type === 'income' ? inc += Number(t.amount) : exp += Number(t.amount); });
            setStats(s => ({ ...s, income: inc, expenses: exp }));
        }
        if (booksRes.data) setLibBooks(booksRes.data);
        if (coursesRes.data) setLibCourses(coursesRes.data);
        if (badgesRes.data) setLibBadges(badgesRes.data);
        if (usersRes.data) { setRegisteredUsers(usersRes.data); setStats(s => ({ ...s, totalUsers: usersRes.data.length })); }
        setLoading(false);
    };

    const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/login'); };

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        const f = new FormData(e.target as HTMLFormElement);
        await supabase.from('app_books').insert([{ title: f.get('title'), url: f.get('url') }]);
        (e.target as HTMLFormElement).reset();
        fetchDashboardData();
    };

    const handleDeleteBook = async (id: string) => { await supabase.from('app_books').delete().eq('id', id); fetchDashboardData(); };

    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        const f = new FormData(e.target as HTMLFormElement);
        await supabase.from('app_courses').insert([{ title: f.get('title'), description: f.get('description'), thumbnail: f.get('thumbnail') }]);
        (e.target as HTMLFormElement).reset();
        fetchDashboardData();
    };

    const handleDeleteCourse = async (id: string) => { await supabase.from('app_courses').delete().eq('id', id); fetchDashboardData(); };

    const handleAddBadge = async (e: React.FormEvent) => {
        e.preventDefault();
        const f = new FormData(e.target as HTMLFormElement);
        await supabase.from('app_badges').insert([{ title: f.get('title'), icon: f.get('icon'), description: f.get('description') }]);
        (e.target as HTMLFormElement).reset();
        fetchDashboardData();
    };

    const handleDeleteBadge = async (id: string) => { await supabase.from('app_badges').delete().eq('id', id); fetchDashboardData(); };

    const handleUpdate = async () => {
        if (!editingId || !editType) return;
        const table = editType === 'book' ? 'app_books' : editType === 'course' ? 'app_courses' : 'app_badges';
        await supabase.from(table).update(editData).eq('id', editingId);
        setEditingId(null); setEditType(null); setEditData({}); fetchDashboardData();
    };

    const handleToggleAdmin = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (userId === user.id) { alert("You can't change your own admin status!"); return; }
        await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
        fetchDashboardData();
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-600/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen relative bg-[#050505] p-4 sm:p-8 overflow-hidden font-sans">
            {/* Animated Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <nav className="bg-[#111111]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 mb-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-amber-400" />
                        <h1 className="text-xl font-bold text-white">Super Admin Portal</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400 hidden sm:block">{user?.email}</span>
                        <button onClick={handleSignOut} className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition flex items-center gap-2">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </nav>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><UserCheck className="w-3 h-3 text-indigo-400"/>Users</p>
                        <p className="text-3xl font-black text-white mt-1">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-400"/>Income</p>
                        <p className="text-3xl font-black text-emerald-400 mt-1">${stats.income}</p>
                    </div>
                    <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><TrendingDown className="w-3 h-3 text-red-400"/>Expenses</p>
                        <p className="text-3xl font-black text-red-400 mt-1">${stats.expenses}</p>
                    </div>
                    <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Users className="w-3 h-3 text-blue-400"/>Customers</p>
                        <p className="text-3xl font-black text-white mt-1">{stats.customers}</p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden mb-8">
                    <div className="p-4 border-b border-white/10 bg-indigo-500/10">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2"><UserCheck className="text-indigo-400"/> Registered Users</h2>
                    </div>
                    <div className="overflow-x-auto">
                        {registeredUsers.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">No registered users yet.</div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-black/30 border-b border-white/10">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase">#</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase">Email</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase">Name</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase">Role</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase">Joined</th>
                                        <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {registeredUsers.map((u, i) => (
                                        <tr key={u.id} className="hover:bg-white/5 transition">
                                            <td className="px-4 py-3 text-slate-500 font-mono text-xs">{i + 1}</td>
                                            <td className="px-4 py-3 text-white font-medium">{u.email}</td>
                                            <td className="px-4 py-3 text-slate-300">{u.full_name || '—'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                                    {u.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleToggleAdmin(u.id, u.role)} className={`p-2 rounded-lg border transition ${u.role === 'admin' ? 'text-red-400 border-red-500/20 hover:bg-red-500/20' : 'text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20'}`}>
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* CMS Section */}
                <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/10 bg-amber-500/10">
                        <h2 className="text-xl font-bold text-white">App Content Management (CMS)</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Books */}
                        <div className="space-y-4">
                            <div className="font-bold text-lg text-white border-b border-white/10 pb-2 flex items-center gap-2"><Book className="text-indigo-400" /> Books</div>
                            <form onSubmit={handleAddBook} className="flex flex-col gap-2 bg-black/30 p-4 rounded-xl border border-white/10">
                                <input name="title" required placeholder="Book Title" className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm" />
                                <input type="url" name="url" required placeholder="URL" className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm" />
                                <button type="submit" className="bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-500 flex items-center justify-center gap-1"><Plus className="w-4 h-4"/> Add</button>
                            </form>
                            <div className="space-y-2 max-h-[250px] overflow-y-auto">
                                {libBooks.map(b => (
                                    <div key={b.id} className="flex justify-between items-center p-3 bg-black/30 border border-white/10 rounded-lg">
                                        <div><p className="text-white text-sm font-bold">{b.title}</p><p className="text-slate-500 text-[10px]">{b.url}</p></div>
                                        <button onClick={() => handleDeleteBook(b.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Courses */}
                        <div className="space-y-4">
                            <div className="font-bold text-lg text-white border-b border-white/10 pb-2 flex items-center gap-2"><GraduationCap className="text-blue-400" /> Courses</div>
                            <form onSubmit={handleAddCourse} className="flex flex-col gap-2 bg-black/30 p-4 rounded-xl border border-white/10">
                                <input name="title" required placeholder="Course Title" className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm" />
                                <input name="description" placeholder="Description" className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm" />
                                <input name="thumbnail" placeholder="Icon (📚)" className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm" />
                                <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-500 flex items-center justify-center gap-1"><Plus className="w-4 h-4"/> Add</button>
                            </form>
                            <div className="space-y-2 max-h-[250px] overflow-y-auto">
                                {libCourses.map(c => (
                                    <div key={c.id} className="flex justify-between items-center p-3 bg-black/30 border border-white/10 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{c.thumbnail}</span>
                                            <div><p className="text-white text-sm font-bold">{c.title}</p><p className="text-slate-500 text-[10px]">{c.description}</p></div>
                                        </div>
                                        <button onClick={() => handleDeleteCourse(c.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="p-6 border-t border-white/10">
                        <div className="space-y-4">
                            <div className="font-bold text-lg text-white border-b border-white/10 pb-2 flex items-center gap-2"><Award className="text-amber-400" /> Badges</div>
                            <form onSubmit={handleAddBadge} className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-black/30 p-4 rounded-xl border border-white/10">
                                <input name="title" required placeholder="Title" className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm" />
                                <input name="icon" required placeholder="Icon (🏆)" className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm" />
                                <input name="description" placeholder="Description" className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm" />
                                <button type="submit" className="bg-amber-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-amber-500 flex items-center justify-center gap-1"><Plus className="w-4 h-4"/> Add</button>
                            </form>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {libBadges.map(bg => (
                                    <div key={bg.id} className="flex justify-between items-center p-3 bg-black/30 border border-white/10 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{bg.icon}</span>
                                            <div><p className="text-white text-sm font-bold">{bg.title}</p><p className="text-slate-500 text-[10px]">{bg.description}</p></div>
                                        </div>
                                        <button onClick={() => handleDeleteBadge(bg.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                {editingId && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-[#111111] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/10 bg-black/30 flex justify-between items-center">
                                <h3 className="font-bold text-white uppercase">Edit {editType}</h3>
                                <button onClick={() => setEditingId(null)} className="p-1 hover:bg-white/10 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div><label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Title</label>
                                <input value={editData.title || ''} onChange={e => setEditData({...editData, title: e.target.value})} className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white" /></div>
                                {editType === 'book' && <div><label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">URL</label>
                                <input value={editData.url || ''} onChange={e => setEditData({...editData, url: e.target.value})} className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white" /></div>}
                                <div className="flex gap-2 pt-2">
                                    <button onClick={handleUpdate} className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-500 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
                                    <button onClick={() => setEditingId(null)} className="flex-1 bg-white/10 text-white font-bold py-2 rounded-lg hover:bg-white/20">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}