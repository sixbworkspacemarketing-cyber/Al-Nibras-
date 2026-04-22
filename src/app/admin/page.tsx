"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
    Users, TrendingUp, TrendingDown, LogOut, ShieldAlert, Book, Plus, Trash2, 
    GraduationCap, UserCheck, Mail, Calendar, Edit, Save, X, Award, Shield,
    Activity, Clock, Eye, Video, FileText, ChevronRight, BarChart3, Fingerprint,
    Search, Filter, Smartphone, CreditCard
} from 'lucide-react';
import Image from 'next/image';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { useToast } from '@/components/ui/ToastProvider';

export default function AdminDashboardPage() {
    const { showToast } = useToast();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ 
        income: 0, expenses: 0, customers: 0, totalUsers: 0, 
        onlineNow: 0, totalVisits: 0 
    });
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'lms' | 'logs'>('overview');
    const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [visitHistory, setVisitHistory] = useState<any[]>([]);
    const [libBooks, setLibBooks] = useState<any[]>([]);
    const [libCourses, setLibCourses] = useState<any[]>([]);
    const [libVideos, setLibVideos] = useState<any[]>([]);
    const [libBadges, setLibBadges] = useState<any[]>([]);
    const [appLinks, setAppLinks] = useState<any[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [assetType, setAssetType] = useState<'video' | 'book' | 'course' | 'badge' | 'link'>('video');
    const [editingId, setEditingId] = useState<string | null>(null);
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
        
        // Refresh online count every 30s
        const interval = setInterval(fetchOnlineCount, 30000);
        return () => clearInterval(interval);
    }, [router]);

    const fetchOnlineCount = async () => {
        const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gt('last_active_at', fiveMinsAgo);
        setStats(s => ({ ...s, onlineNow: count || 0 }));
    };

    const fetchDashboardData = async () => {
        const [usersRes, logsRes, statsRes, booksRes, coursesRes, videosRes, badgesRes, linksRes] = await Promise.all([
            supabase.from('profiles').select('*').order('created_at', { ascending: false }),
            supabase.from('audit_logs').select('*, profiles(full_name, email)').order('created_at', { ascending: false }).limit(50),
            supabase.from('site_stats').select('*').order('id', { ascending: false }).limit(14),
            supabase.from('app_books').select('*').order('created_at', { ascending: false }),
            supabase.from('app_courses').select('*').order('created_at', { ascending: false }),
            supabase.from('app_videos').select('*, app_courses(title)').order('created_at', { ascending: false }),
            supabase.from('app_badges').select('*').order('created_at', { ascending: false }),
            supabase.from('app_links').select('*').order('created_at', { ascending: false })
        ]);

        if (usersRes.data) {
            setRegisteredUsers(usersRes.data);
            setStats(s => ({ ...s, totalUsers: usersRes.data.length }));
        }
        if (logsRes.data) setAuditLogs(logsRes.data);
        if (statsRes.data) {
            const sortedStats = [...statsRes.data].reverse();
            setVisitHistory(sortedStats);
            const total = statsRes.data.reduce((acc, curr) => acc + (curr.visits_count || 0), 0);
            setStats(s => ({ ...s, totalVisits: total }));
        }
        if (booksRes.data) setLibBooks(booksRes.data);
        if (coursesRes.data) setLibCourses(coursesRes.data);
        if (videosRes.data) setLibVideos(videosRes.data);
        if (badgesRes.data) setLibBadges(badgesRes.data);
        if (linksRes.data) setAppLinks(linksRes.data);
        
        fetchOnlineCount();
        setLoading(false);
    };

    const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/login'); };

    const handleAddAsset = async (e: React.FormEvent) => {
        e.preventDefault();
        const f = new FormData(e.target as HTMLFormElement);
        const data: any = Object.fromEntries(f.entries());

        let table = '';
        let payload = {};

        switch(assetType) {
            case 'video': table = 'app_videos'; payload = { title: data.title, video_url: data.url, course_id: data.course_id || null }; break;
            case 'book': table = 'app_books'; payload = { title: data.title, author: data.author, url: data.url }; break;
            case 'course': table = 'app_courses'; payload = { title: data.title, description: data.description, category: data.category, price: Number(data.price) || 0 }; break;
            case 'badge': table = 'app_badges'; payload = { title: data.title, description: data.description, icon: data.icon }; break;
            case 'link': table = 'app_links'; payload = { title: data.title, url: data.url, category: data.category }; break;
        }

        const { error } = await supabase.from(table).insert([payload]);
        if (error) {
            showToast(error.message, 'error');
        } else {
            showToast(`${assetType.toUpperCase()} deployed successfully!`, 'success');
            setIsAddModalOpen(false);
            fetchDashboardData();
            (e.target as HTMLFormElement).reset();
        }
    };

    const handleDeleteAsset = async (table: string, id: string) => { 
        if (!confirm("Are you sure you want to delete this?")) return;
        const { error } = await supabase.from(table).delete().eq('id', id); 
        if (error) {
            showToast(error.message, 'error');
        } else {
            showToast('Asset removed from database.', 'info');
            fetchDashboardData(); 
        }
    };

    const handleToggleAdmin = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'child' : 'admin';
        if (userId === user.id) { 
            showToast("You can't change your own admin status!", 'error'); 
            return; 
        }
        const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
        if (error) {
            showToast(error.message, 'error');
        } else {
            showToast(`User role updated to ${newRole.toUpperCase()}`, 'success');
            fetchDashboardData();
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest animate-pulse">Initializing Secure Panel...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen relative bg-[#050505] overflow-hidden font-sans flex flex-col md:flex-row">
            {/* Ultra Premium Sidebar */}
            <aside className="w-full md:w-64 bg-[#0A0A0A] border-r border-white/5 p-6 flex flex-col z-20">
                <div className="mb-10 flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30">
                        <ShieldAlert className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-lg font-black text-white italic tracking-tighter">NIBRAS <span className="text-indigo-500">PRO</span></h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-sm font-bold">Overview</span>
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                        <Users className="w-5 h-5" />
                        <span className="text-sm font-bold">Students</span>
                    </button>
                    <button onClick={() => setActiveTab('lms')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'lms' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                        <GraduationCap className="w-5 h-5" />
                        <span className="text-sm font-bold">Learning CMS</span>
                    </button>
                    <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'logs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                        <Fingerprint className="w-5 h-5" />
                        <span className="text-sm font-bold">Audit Logs</span>
                    </button>
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-2xl">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold uppercase">{user?.email?.[0]}</div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">{user?.email}</p>
                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Super Admin</p>
                        </div>
                    </div>
                    <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all font-bold text-xs uppercase tracking-widest">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#050505] relative p-4 md:p-8">
                {/* Background Glows */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                {activeTab === 'overview' && (
                    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-[#111111] border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                                <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:opacity-20 transition-opacity"><Users className="w-24 h-24 text-indigo-500" /></div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Total Students</p>
                                <h4 className="text-4xl font-black text-white">{stats.totalUsers}</h4>
                                <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-400 font-bold">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>+12% this month</span>
                                </div>
                            </div>
                            <div className="bg-[#111111] border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                                <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:opacity-20 transition-opacity"><Activity className="w-24 h-24 text-emerald-500" /></div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Online Now</p>
                                <div className="flex items-center gap-3">
                                    <h4 className="text-4xl font-black text-white">{stats.onlineNow}</h4>
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                                </div>
                                <p className="mt-4 text-[10px] text-slate-500 font-bold">Last 5 minutes</p>
                            </div>
                            <div className="bg-[#111111] border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                                <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:opacity-20 transition-opacity"><Eye className="w-24 h-24 text-blue-500" /></div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Weekly Interactions</p>
                                <h4 className="text-4xl font-black text-white">{stats.totalVisits}</h4>
                                <p className="mt-4 text-[10px] text-slate-500 font-bold">Global Page Hits</p>
                            </div>
                            <div className="bg-[#111111] border border-emerald-500/20 p-6 rounded-3xl relative overflow-hidden group">
                                <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp className="w-24 h-24 text-emerald-500" /></div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">System Health</p>
                                <h4 className="text-3xl font-black text-emerald-400 italic">SECURE</h4>
                                <p className="mt-4 text-[10px] text-slate-500 font-bold">AES-256 Bit active</p>
                            </div>
                        </div>

                        {/* Graph Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-[#111111]/80 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem]">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-indigo-400" /> Activity Footprint
                                    </h3>
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Views</div>
                                    </div>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={visitHistory}>
                                            <defs>
                                                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                            <XAxis dataKey="id" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#111111', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                            />
                                            <Area type="monotone" dataKey="visits_count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] flex flex-col">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Fingerprint className="w-5 h-5 text-emerald-400" /> Recent Security
                                </h3>
                                <div className="flex-1 space-y-4">
                                    {auditLogs.slice(0, 5).map(log => (
                                        <div key={log.id} className="flex gap-4 group p-2 hover:bg-white/5 rounded-xl transition">
                                            <div className="w-1 h-8 bg-indigo-500 rounded-full mt-1"></div>
                                            <div>
                                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{log.action}</p>
                                                <p className="text-xs text-white line-clamp-1">{log.profiles?.full_name || 'Guest/System'}</p>
                                                <p className="text-[10px] text-slate-500">{new Date(log.created_at).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => setActiveTab('logs')} className="w-full mt-6 py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-1">
                                    See all footprints <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-bottom duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-white italic">STUDENT <span className="text-indigo-500">DATABASE</span></h2>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400" />
                                <input placeholder="Search CNIC, Name..." className="pl-10 pr-4 py-2 bg-[#111111] border border-white/5 rounded-xl text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>

                        <div className="bg-[#111111] rounded-[2rem] border border-white/5 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-black/40 border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Student</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verification</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Joined</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {registeredUsers.map(u => (
                                        <tr key={u.id} className="hover:bg-white/5 transition group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold">{u.full_name?.[0] || 'U'}</div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{u.full_name || u.email.split('@')[0]}</p>
                                                        <p className="text-[10px] text-slate-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-slate-400 flex items-center gap-1"><Smartphone className="w-3 h-3" /> {u.mobile_number || 'N/A'}</p>
                                                    <p className="text-[10px] text-slate-400 flex items-center gap-1"><CreditCard className="w-3 h-3" /> {u.cnic || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-[10px] text-slate-500 font-mono">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button onClick={() => handleToggleAdmin(u.id, u.role)} className="p-2 text-slate-500 hover:text-white transition">
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'lms' && (
                    <div className="max-w-6xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="flex justify-between items-center bg-[#111111] p-6 rounded-3xl border border-white/5">
                            <div>
                                <h2 className="text-2xl font-black text-white italic flex items-center gap-3">
                                    <GraduationCap className="text-indigo-500" /> LMS CORE <span className="text-slate-600">/ CMS</span>
                                </h2>
                                <p className="text-xs text-slate-500 font-bold uppercase mt-1">Manage books and video lectures</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setAssetType('video'); setIsAddModalOpen(true); }} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"><Plus className="w-4 h-4" /> Add Asset</button>
                            </div>
                        </div>

                        {/* Quick Links Section */}
                        <div className="bg-[#111111] p-8 rounded-[2.5rem] border border-white/5">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono"><Users className="text-indigo-400" /> QUICK_LINKS</h3>
                                <button onClick={() => { setAssetType('link'); setIsAddModalOpen(true); }} className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-white transition">+ Add New Link</button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {appLinks.map(link => (
                                    <div key={link.id} className="px-4 py-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 group hover:border-indigo-500/30 transition">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                        <p className="text-sm font-bold text-white">{link.title}</p>
                                        <button onClick={() => handleDeleteAsset('app_links', link.id)} title="Delete Link" className="opacity-0 group-hover:opacity-100 transition p-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Videos CMS */}
                            <div className="bg-[#111111] p-8 rounded-[2.5rem] border border-white/5">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-mono"><Video className="text-red-500" /> LECTURE_REPOSITORY</h3>
                                <div className="mb-8 p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                                    <p className="text-xs text-slate-500 font-bold uppercase mb-3">Live Feed Management</p>
                                    <button onClick={() => { setAssetType('video'); setIsAddModalOpen(true); }} className="w-full py-3 bg-white/5 border border-white/5 hover:bg-indigo-600 hover:border-indigo-600 text-white rounded-xl font-black text-xs transition uppercase flex items-center justify-center gap-2">
                                        <Video className="w-4 h-4" /> Add New Lecture
                                    </button>
                                </div>
                                
                                <div className="space-y-3">
                                    {libVideos.map(v => (
                                        <div key={v.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><Video className="w-5 h-5 text-red-500" /></div>
                                                <div>
                                                    <p className="text-sm font-bold text-white line-clamp-1">{v.title}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono italic">{v.app_courses?.title || 'Standalone'}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteAsset('app_videos', v.id)} className="p-2 text-slate-600 hover:text-red-500 transition opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Books CMS */}
                            <div className="bg-[#111111] p-8 rounded-[2.5rem] border border-white/5">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-mono"><Book className="text-blue-500" /> LIBRARY_HUB</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {libBooks.map(b => (
                                        <div key={b.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 group relative overflow-hidden">
                                            <div className="flex gap-4 items-start relative z-10">
                                                <div className="w-12 h-16 bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-lg shadow-xl flex items-center justify-center text-white"><FileText className="w-6 h-6" /></div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-black text-white">{b.title}</p>
                                                    <p className="text-[10px] text-indigo-400 font-bold uppercase mt-1">E-BOOK ACTIVE</p>
                                                    <button className="mt-3 text-[10px] font-bold text-slate-500 hover:text-white transition flex items-center gap-1 group">
                                                        VIEW SOURCE <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="absolute right-[-20px] bottom-[-20px] opacity-5 group-hover:opacity-20 transition-opacity"><Book className="w-24 h-24" /></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'logs' && (
                    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-white italic">AUDIT <span className="text-emerald-500">TRAIL</span></h2>
                                <p className="text-xs text-slate-500 font-bold uppercase">System-wide user footprint monitoring</p>
                            </div>
                            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-emerald-400 flex items-center gap-2"><Clock className="w-4 h-4" /> Live Stream</button>
                        </div>

                        <div className="space-y-3">
                            {auditLogs.map(log => (
                                <div key={log.id} className="bg-[#111111] p-5 rounded-3xl border border-white/5 flex items-center gap-6 group hover:border-emerald-500/20 transition">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-mono text-xs font-bold ring-4 ring-emerald-500/5 group-hover:bg-emerald-500 group-hover:text-white transition-all">LOG</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-black text-white uppercase tracking-widest">{log.action}</span>
                                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                            <span className="text-[10px] font-bold text-emerald-500">{log.profiles?.full_name || 'System / Guest'}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-mono line-clamp-1">{JSON.stringify(log.details)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-white mb-1">{new Date(log.created_at).toLocaleTimeString()}</p>
                                        <p className="text-[10px] text-slate-600 font-mono">{new Date(log.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Asset Creation Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#111111] border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-white italic">ADD NEW <span className="text-indigo-500">ASSET</span></h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Deploying to Production Database</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition"><X /></button>
                        </div>

                        <div className="p-8">
                            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
                                {(['video', 'book', 'course', 'badge', 'link'] as const).map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => setAssetType(type)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${assetType === type ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleAddAsset} className="space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Title</label>
                                        <input name="title" required className="w-full px-4 py-3 bg-black/60 border border-white/5 rounded-xl text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Enter title..." />
                                    </div>

                                    {(assetType === 'video' || assetType === 'book' || assetType === 'link') && (
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">URL / Link</label>
                                            <input name="url" required className="w-full px-4 py-3 bg-black/60 border border-white/5 rounded-xl text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="https://..." />
                                        </div>
                                    )}

                                    {assetType === 'video' && (
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Course Affinity</label>
                                            <select name="course_id" className="w-full px-4 py-3 bg-black/60 border border-white/5 rounded-xl text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none">
                                                <option value="">No Course Assigned (Standalone)</option>
                                                {libCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                            </select>
                                        </div>
                                    )}

                                    {assetType === 'book' && (
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Author</label>
                                            <input name="author" required className="w-full px-4 py-3 bg-black/60 border border-white/5 rounded-xl text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Author name" />
                                        </div>
                                    )}

                                    {(assetType === 'course' || assetType === 'badge') && (
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
                                            <textarea name="description" required className="w-full px-4 py-3 bg-black/60 border border-white/5 rounded-xl text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none min-h-[100px]" placeholder="Briefly describe this..."></textarea>
                                        </div>
                                    )}

                                    {assetType === 'course' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Price (Tokens)</label>
                                                <input name="price" type="number" required defaultValue="0" className="w-full px-4 py-3 bg-black/60 border border-white/5 rounded-xl text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Category</label>
                                                <input name="category" required className="w-full px-4 py-3 bg-black/60 border border-white/5 rounded-xl text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="e.g. Finance" />
                                            </div>
                                        </div>
                                    )}

                                    {assetType === 'badge' && (
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Icon Placeholder</label>
                                            <input name="icon" defaultValue="Award" className="w-full px-4 py-3 bg-black/60 border border-white/5 rounded-xl text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Lucide icon name" />
                                        </div>
                                    )}

                                    {assetType === 'link' && (
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Link Category</label>
                                            <select name="category" className="w-full px-4 py-3 bg-black/60 border border-white/5 rounded-xl text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none">
                                                <option value="social">Social Media</option>
                                                <option value="support">Help & Support</option>
                                                <option value="resource">Educational Resource</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs transition uppercase shadow-xl shadow-indigo-600/20">
                                    Commit {assetType.toUpperCase()} to chain
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}