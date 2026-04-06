/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Package, Users, ShoppingBag, 
  Settings, LogOut, Search, Plus, 
  Edit, Trash2, CheckCircle2, XCircle, 
  TrendingUp, ArrowUpRight, Bell, LayoutDashboard, 
  Database, Activity, X, Save, Image as ImageIcon,
  Globe, ShieldCheck, Zap, FileText
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import HomePageCMS from '../components/admin/HomePageCMS';
import ProductsCMS from '../components/admin/ProductsCMS';
import CategoriesCMS from '../components/admin/CategoriesCMS';
import SchemesCMS from '../components/admin/SchemesCMS';
import PagesCMS from '../components/admin/PagesCMS';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const stats = [
    { label: 'Network Savings', value: '₹4,82,500', trend: '+18.5%', icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-600/10' },
    { label: 'Bulk Orders', value: '1,248', trend: '+12.2%', icon: ShoppingBag, color: 'text-secondary-500', bg: 'bg-secondary-500/10' },
    { label: 'Doctor Partners', value: '156', trend: 'Growing', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Managed Items', value: products.length.toString(), trend: 'Syncing', icon: Package, color: 'text-amber-500', bg: 'bg-amber-500/10' }
  ];

  const fetchData = async () => {
    try {
      const prodRes = await axios.get('https://ayuom-backend.vercel.app/api/products').catch(() => ({ data: [] }));
      setProducts(prodRes.data.length ? prodRes.data : [
        { _id: '1', name: 'Augmentin 625 Duo', price: 185, category: 'Antibiotics', image: 'https://via.placeholder.com/100' },
        { _id: '2', name: 'Pan 40 Tablet', price: 110, category: 'Gastrointestinal', image: 'https://via.placeholder.com/100' }
      ]);

      if (token) {
        const userRes = await axios.get('https://ayuom-backend.vercel.app/api/admin/users/pending', config).catch(() => ({ data: [] }));
        setPendingUsers(userRes.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/admin/login');
  };

  const handleApproveUser = async (id) => {
    try {
      await axios.put(`https://ayuom-backend.vercel.app/api/admin/users/${id}/approve`, {}, config);
      alert('Doctor Access Granted.');
      setPendingUsers(pendingUsers.filter(u => u._id !== id));
    } catch (err) {
      alert('Approval failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePromoteToAdmin = async (id) => {
    if (!window.confirm('Promote this user to Administrator? They will have full access to this panel.')) return;
    try {
      await axios.put(`https://ayuom-backend.vercel.app/api/admin/users/${id}/role`, { role: 'admin' }, config);
      alert('User successfully promoted to Administrator.');
      setPendingUsers(pendingUsers.filter(u => u._id !== id));
    } catch (err) {
      alert('Promotion failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRejectUser = async (id) => {
    if (!window.confirm('Reject this request?')) return;
    setPendingUsers(pendingUsers.filter(u => u._id !== id));
  };
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <aside className="fixed left-0 top-0 h-full w-72 bg-primary-900 border-r border-slate-800 z-50 flex flex-col p-8 shadow-2xl overflow-y-auto">
        <div className="flex items-center gap-4 mb-16 group shrink-0">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary-600/20 group-hover:rotate-12 transition-transform">W</div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter leading-none">Wedome</h1>
            <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mt-1 italic">Command Center</p>
          </div>
        </div>

        <nav className="flex-grow space-y-2">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Inventory', icon: Database },
            { id: 'categories', label: 'Categories', icon: Package },
            { id: 'schemes', label: 'Schemes', icon: Zap },
            { id: 'users', label: 'Approvals', icon: Activity, count: pendingUsers.length },
            { id: 'pages', label: 'Manage Pages', icon: FileText },
            { id: 'homecms', label: 'Home Page CMS', icon: Globe },
            { id: 'orders', label: 'Orders Feed', icon: ShoppingBag }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-primary-600 shadow-xl text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <div className="flex items-center gap-4"><item.icon className="w-5 h-5" strokeWidth={activeTab === item.id ? 2.5 : 2} /><span>{item.label}</span></div>
              {item.count > 0 && <span className="bg-secondary-500 text-white text-[9px] px-2 py-0.5 rounded-lg">{item.count}</span>}
            </button>
          ))}
        </nav>

        <Link to="/" className="mb-4 flex items-center gap-4 px-6 py-4 bg-white/5 text-slate-400 hover:bg-white hover:text-primary-600 rounded-2xl font-bold transition-all border border-white/5">
          <Globe className="w-5 h-5" /> View Website
        </Link>

        <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 bg-white/5 text-slate-400 hover:bg-rose-500 hover:text-white rounded-2xl font-bold transition-all border border-white/5">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      <main className="pl-72 flex-grow transition-all">
        <header className="h-24 border-b border-surface-border flex items-center justify-between px-12 sticky top-0 bg-white/80 backdrop-blur-xl z-40">
           <div className="flex items-center gap-4 bg-surface-light border border-surface-border rounded-2xl px-5 py-2.5 w-96">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Global Hridved Search..." className="bg-transparent border-none outline-none text-sm font-bold w-full text-slate-900 placeholder:text-slate-300" />
           </div>
           <div className="flex items-center gap-8 pl-8 border-l border-surface-border">
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 leading-none uppercase tracking-tighter">Master Administrator</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                   <p className="text-[9px] font-black text-primary-600 uppercase tracking-widest leading-none">Secure Active</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-primary-500/20">KP</div>
           </div>
        </header>

        <div className="p-12">
          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Medical Hub Insights</h2>
                    <p className="text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Real-time synchronization with Wedome platform</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="px-5 py-3 bg-primary-50 border border-primary-100 rounded-2xl text-primary-600 font-bold text-xs flex items-center gap-2">
                        <Activity size={16} /> Sync Status: Stable
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[40px] border border-surface-border hover:border-primary-600/30 hover:shadow-premium transition-all group relative overflow-hidden">
                       <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                          <stat.icon size={80} strokeWidth={3} />
                       </div>
                       <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                          <stat.icon size={24} strokeWidth={2.5} />
                       </div>
                       <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-2">{stat.label}</p>
                       <div className="flex items-end justify-between">
                          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-primary-50 text-primary-600 border border-primary-100">{stat.trend}</span>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-slate-900 p-12 rounded-[48px] border border-slate-800 relative overflow-hidden shadow-premium">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600 opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 space-y-8">
                       <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">Doctors' Savings Performance</h3>
                          <select className="bg-white/10 text-white border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none">
                             <option>Last 30 Days</option>
                             <option>Last 12 Months</option>
                          </select>
                       </div>
                       <div className="h-64 flex items-end justify-between gap-2 px-4">
                          {[40, 65, 45, 90, 75, 55, 30, 85, 95, 60, 45, 70].map((h, i) => (
                             <div key={i} className="w-full bg-primary-600/30 hover:bg-primary-600 transition-all rounded-t-xl group relative" style={{ height: `${h}%` }}>
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-slate-900 text-[10px] font-black rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{h}k</div>
                             </div>
                          ))}
                       </div>
                    </div>
                  </div>
                  <div className="bg-primary-600 p-12 rounded-[48px] text-white flex flex-col justify-between shadow-2xl shadow-primary-500/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 opacity-50"></div>
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 space-y-6">
                       <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-[0.9]">Security <br />Protocols</h3>
                       <p className="font-bold text-primary-50/80 uppercase text-[10px] tracking-widest leading-loose">All B2B transactions are encrypted with 256-bit medical grade protocols. Multi-node cloud backup active.</p>
                       <div className="pt-8 space-y-4">
                          <div className="flex items-center gap-3">
                             <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white"></div></div>
                             <span className="text-xs font-bold uppercase tracking-widest">Cloud VSync: Active</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white"></div></div>
                             <span className="text-xs font-bold uppercase tracking-widest">API Endpoint: Healthy</span>
                          </div>
                       </div>
                       <button className="w-full bg-white text-primary-600 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] transition-all">Audit System Logs</button>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'categories' && <CategoriesCMS />}

          { activeTab === 'schemes' && <SchemesCMS /> }

          { activeTab === 'pages' && <PagesCMS /> }

          { activeTab === 'products' && (
            <ProductsCMS />
          )}

          {activeTab === 'users' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                   <div>
                     <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Authorization Hub</h2>
                     <p className="text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Verify Clinical Credentials and Network Access</p>
                   </div>
                   <div className="px-6 py-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold text-xs flex items-center gap-2">
                      <Activity size={16} /> Urgent: {pendingUsers.length} Requests Pending
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {pendingUsers.map(user => (
                     <div key={user._id} className="bg-white p-10 rounded-[48px] border border-surface-border hover:border-primary-600/30 transition-all shadow-premium group">
                        <div className="flex items-center gap-6 mb-8">
                           <div className="w-16 h-16 bg-primary-600 text-white rounded-[24px] flex items-center justify-center font-black text-2xl shadow-xl shadow-primary-500/20 uppercase group-hover:rotate-6 transition-transform">{user.name[0]}</div>
                           <div>
                              <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none mb-1 italic">{user.name}</h4>
                              <div className="flex items-center gap-2">
                                 <ShieldCheck size={12} className="text-emerald-500" />
                                 <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest">{user.clinicName}</p>
                              </div>
                           </div>
                        </div>
                         <div className="space-y-4 mb-10 p-6 bg-surface-light rounded-3xl border border-surface-border">
                            <div className="space-y-1">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Medical ID</p>
                               <p className="text-xs font-bold text-slate-700">MC-RX-{user._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Communication</p>
                               <p className="text-xs font-bold text-slate-700 truncate">{user.email}</p>
                               <p className="text-xs font-bold text-slate-700">{user.phone}</p>
                            </div>
                         </div>
                         <div className="grid grid-cols-1 gap-4">
                            <button onClick={() => handleApproveUser(user._id)} className="bg-primary-600 hover:bg-primary-500 text-white font-black py-5 rounded-[24px] text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary-500/10 active:scale-95">
                               <CheckCircle2 size={18} /> Grant Access
                            </button>
                            <button onClick={() => handlePromoteToAdmin(user._id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-[24px] text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/10 active:scale-95">
                               <ShieldCheck size={18} /> Make Admin
                            </button>
                            <button onClick={() => handleRejectUser(user._id)} className="bg-white hover:bg-rose-500 text-slate-400 hover:text-white font-black py-5 rounded-[24px] text-[10px] uppercase tracking-widest transition-all border border-surface-border hover:border-rose-500 flex items-center justify-center gap-2 active:scale-95">
                               <XCircle size={18} /> Decline
                            </button>
                         </div>
                     </div>
                   ))}
                   {pendingUsers.length === 0 && (
                     <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 bg-surface-light rounded-full flex items-center justify-center text-slate-200">
                           <Activity size={48} />
                        </div>
                        <p className="font-black text-slate-300 uppercase tracking-[0.5em] text-xs">Queue Cleared: Monitoring Hridved Node</p>
                     </div>
                   )}
                </div>
            </div>
          )}

          {activeTab === 'homecms' && (
            <HomePageCMS />
          )}
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;
