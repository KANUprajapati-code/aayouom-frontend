/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, Package, Users, ShoppingBag, 
  Settings, LogOut, Search, Plus, 
  Edit, Trash2, CheckCircle2, XCircle, 
  TrendingUp, ArrowUpRight, Bell, LayoutDashboard, 
  Database, Activity, X, Save, Image as ImageIcon,
  Globe, ShieldCheck, Zap, FileText, Tag, Sparkles, Wand2
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config/api';

// CMS Components
import GlobalCMSHub from '../components/admin/GlobalCMSHub';
import ProductsCMS from '../components/admin/ProductsCMS';
import CategoriesCMS from '../components/admin/CategoriesCMS';
import SchemesCMS from '../components/admin/SchemesCMS';
import PagesCMS from '../components/admin/PagesCMS';
import BulkOrderCMS from '../components/admin/BulkOrderCMS';
import AboutCMS from '../components/admin/AboutCMS';
import UserApprovalCMS from '../components/admin/UserApprovalCMS';
import AdminWalletCMS from '../components/admin/AdminWalletCMS';
import { ShoppingBag as shoppingBagIcon, Wallet } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const navigate = useNavigate();
  
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const dashboardStats = [
    { label: 'Total Revenue', value: '₹1401', trend: '+101', icon: BarChart3, color: 'text-unicorn-cyan', bg: 'bg-unicorn-cyan/10' },
    { label: 'Total Orders', value: '29', trend: 'Lifetime', icon: ShoppingBag, color: 'text-unicorn-magenta', bg: 'bg-unicorn-magenta/10' },
    { label: 'Total Customers', value: '10', trend: 'Registered Users', icon: Users, color: 'text-unicorn-purple', bg: 'bg-unicorn-purple/10' },
    { label: 'Consultations', value: '10', trend: 'Doctor Bookings', icon: Activity, color: 'text-secondary-500', bg: 'bg-secondary-500/10' }
  ];

  const lowStockItems = useMemo(() => products.filter(p => (p.stock || 0) <= 10).slice(0, 5), [products]);

  const fetchData = async () => {
    // Only fetch if essential for the specific view or on mount
    setLoading(true);
    try {
      const prodRes = await axios.get(`${API_BASE_URL}/products`).catch(() => ({ data: [] }));
      setProducts(prodRes.data);

      const token = localStorage.getItem('token');
      if (token) {
        const userRes = await axios.get(`${API_BASE_URL}/admin/users/pending`, getAuthConfig()).catch(() => ({ data: [] }));
        setPendingUsers(userRes.data);
      }
    } catch (err) {
      console.error('Fetch error in Admin Dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Only fetch on mount to optimize performance

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Database },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'doctors', label: 'Doctors', icon: ShieldCheck },
    { id: 'doctorbookings', label: 'Doctor Bookings', icon: Activity },
    { id: 'categories', label: 'Categories', icon: Package },
    { id: 'consultationcat', label: 'Consultation Categories', icon: Zap },
    { id: 'promocodes', label: 'Promo Codes', icon: Tag },
    { id: 'wallet', label: 'Wallet Management', icon: Wallet },
    { id: 'bulkorders', label: 'Bulk Orders', icon: shoppingBagIcon },
    { id: 'homecms', label: 'Home CMS', icon: Globe },
    { id: 'aboutcms', label: 'About CMS', icon: FileText },
    { id: 'messages', label: 'Messages', icon: Bell }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
             {/* Top Stats Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02, translateY: -5 }}
                    className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-soft hover:shadow-premium transition-all group overflow-hidden relative"
                  >
                     <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-unicorn-cyan/10 to-unicorn-magenta/10 rounded-full blur-2xl group-hover:blur-xl transition-all"></div>
                     <div className="flex items-center justify-between mb-4 relative z-10">
                        <p className="text-[11px] font-black text-text-muted uppercase tracking-wider">{stat.label}</p>
                        <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl shadow-inner`}>
                           <stat.icon size={20} />
                        </div>
                     </div>
                     <h3 className="text-3xl font-black text-text-main mb-1 relative z-10">{stat.value}</h3>
                     <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60 relative z-10">{stat.trend}</p>
                  </motion.div>
                ))}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                   <div className="bg-white/40 backdrop-blur-md p-10 rounded-[40px] border border-white/40 shadow-soft overflow-hidden relative">
                      <div className="flex items-center justify-between mb-10 relative z-10">
                         <div>
                            <h3 className="text-2xl font-black text-text-main tracking-tighter italic uppercase">Sales Performance</h3>
                            <p className="text-[10px] font-black text-text-muted mt-2 uppercase tracking-[0.2em]">Live Data Stream • Grid Node 01</p>
                         </div>
                         <select className="bg-white/50 backdrop-blur border border-white/20 text-text-main px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-white transition-all shadow-sm">
                            <option>Monthly View</option>
                            <option>Yearly View</option>
                         </select>
                      </div>
                      <div className="h-64 flex items-end justify-between px-6 pt-10 border-b border-l border-white/20 relative z-10">
                         {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((m) => (
                           <div key={m} className="flex flex-col items-center gap-4 group/bar">
                              <div className="relative w-12 flex flex-col justify-end">
                                 <motion.div 
                                   initial={{ height: 0 }}
                                   animate={{ height: `${Math.random() * 100 + 40}%` }}
                                   className="w-full bg-gradient-to-t from-unicorn-indigo via-unicorn-purple to-unicorn-cyan rounded-t-xl group-hover/bar:brightness-110 transition-all shadow-lg"
                                 ></motion.div>
                              </div>
                              <span className="text-[9px] font-black text-text-silver uppercase tracking-widest">{m}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white/40 backdrop-blur-md p-10 rounded-[40px] border border-white/40 shadow-soft overflow-hidden relative">
                       <h3 className="text-sm font-black text-text-main uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                          <Activity className="text-unicorn-magenta" size={16} /> Critical Alerts
                       </h3>
                       <div className="space-y-6">
                          {lowStockItems.length > 0 ? lowStockItems.map(p => (
                            <div key={p._id} className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/20">
                               <div className="space-y-1">
                                  <p className="text-[10px] font-black text-text-main uppercase truncate w-32">{p.name}</p>
                                  <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">STOCK: {p.stock}</p>
                               </div>
                               <button onClick={() => { setCategoryFilter(p.category); setActiveTab('products'); }} className="p-2 bg-text-main text-white rounded-xl hover:bg-black transition-all">
                                  <Plus size={14} />
                               </button>
                            </div>
                          )) : (
                            <p className="text-[10px] font-black text-text-muted text-center py-4 uppercase tracking-widest opacity-40 italic">System Nominal • All Stocks Valid</p>
                          )}
                       </div>
                    </div>

                    <button 
                      onClick={() => setActiveTab('users')} 
                      className="w-full p-10 bg-gradient-to-br from-unicorn-indigo via-unicorn-purple to-unicorn-magenta rounded-[40px] shadow-unicorn hover:scale-[1.02] active:scale-95 transition-all text-white group flex flex-col items-center gap-5 overflow-hidden relative"
                    >
                       <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
                       <Users size={32} className="relative z-10" />
                       <div className="text-center relative z-10">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 mb-1">Onboarding Grid</p>
                          <h4 className="text-lg font-black uppercase italic tracking-tighter">{pendingUsers.length} Pending Authentications</h4>
                       </div>
                    </button>
                 </div>
              </div>
           </motion.section>
        );
      case 'products': return <ProductsCMS initialFilter={categoryFilter} />;
      case 'homecms': return <GlobalCMSHub />;
      case 'categories': return (
        <CategoriesCMS 
          onManageProducts={(categoryName) => {
            setCategoryFilter(categoryName);
            setActiveTab('products');
          }} 
        />
      );
      case 'schemes': return <SchemesCMS />;
      case 'pages': return <PagesCMS />;
      case 'bulkorders': return <BulkOrderCMS />;
      case 'aboutcms': return <AboutCMS />;
      case 'users':
      case 'doctors': return <UserApprovalCMS />;
      case 'wallet': return <AdminWalletCMS />;
      default:
        return (
          <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
             <div className="w-32 h-32 bg-white/20 backdrop-blur-xl border border-white/20 rounded-[48px] flex items-center justify-center text-white shadow-unicorn relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-unicorn-cyan via-unicorn-purple to-unicorn-magenta opacity-20 group-hover:opacity-40 transition-opacity"></div>
                 <Wand2 size={56} className="relative z-10 animate-pulse text-white" />
             </div>
             <div className="space-y-2">
               <h2 className="text-3xl font-black text-text-main uppercase italic tracking-tighter">{activeTab.replace(/([A-Z])/g, ' $1')} Node</h2>
               <p className="font-black text-text-muted uppercase tracking-[0.5em] text-[10px]">Syncing with Master Ethereal Instance...</p>
             </div>
             <button onClick={() => setActiveTab('overview')} className="px-12 py-5 bg-text-main text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-105 transition-all active:scale-95">Return to Nexus</button>
          </div>
        );
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen text-text-main selection:bg-unicorn-magenta/30 selection:text-text-main">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-unicorn-cyan/5 via-transparent to-transparent opacity-60 pointer-events-none"></div>
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-80 h-screen fixed left-0 top-0 bg-slate-900 border-r border-white/5 flex flex-col z-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-unicorn-indigo/10 via-transparent to-unicorn-magenta/10 opacity-40"></div>
        
        <div className="p-12 relative z-10">
           <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-unicorn group-hover:rotate-12 transition-transform duration-500">
              <Zap className="text-text-main w-6 h-6" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white italic tracking-tighter leading-none">WEDOME</h1>
              <span className="text-[8px] font-black text-unicorn-cyan uppercase tracking-[0.5em] mt-1 block">Hyper-Nexus</span>
            </div>
           </Link>
        </div>

        <div className="flex-grow overflow-y-auto px-6 py-6 scrollbar-hide relative z-10">
           <nav className="space-y-2">
              <p className="px-6 py-4 text-[9px] font-black text-text-silver/40 uppercase tracking-[0.4em]">Administrative Modules</p>
              {menuItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)} 
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all relative overflow-hidden group ${activeTab === item.id ? 'bg-white/10 text-white shadow-lg' : 'text-text-silver hover:bg-white/5 hover:text-white'}`}
                >
                  {activeTab === item.id && (
                    <motion.div layoutId="bg-side" className="absolute left-0 top-0 w-1 h-full bg-unicorn-cyan shadow-[0_0_15px_rgba(0,210,255,0.8)]"></motion.div>
                  )}
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-unicorn-cyan' : 'opacity-40 group-hover:opacity-100'} transition-all`} />
                  <span>{item.label}</span>
                </button>
              ))}
           </nav>
        </div>
        
        <div className="mt-auto p-10 border-t border-white/5 relative z-10 bg-slate-950/20 backdrop-blur-md">
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-4 py-4 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all border border-rose-500/20">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow ml-80 min-h-screen relative z-10 flex flex-col">
        <header className="h-24 bg-white/20 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-12 sticky top-0 z-40">
           <div className="flex flex-col">
              <h2 className="text-2xl font-black text-text-main capitalize tracking-tighter italic uppercase">{activeTab}</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-unicorn-cyan to-unicorn-magenta rounded-full mt-1"></div>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 bg-white/40 border border-white/40 py-3 px-6 rounded-3xl shadow-soft">
                 <div className="flex flex-col text-right">
                    <span className="text-[10px] font-black text-text-silver uppercase tracking-widest">Active Operator</span>
                    <span className="text-sm font-black text-text-main italic tracking-tight">Kanu Prajapati</span>
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-unicorn-indigo to-unicorn-purple flex items-center justify-center font-black text-white shadow-premium border border-white/20">
                    K
                 </div>
              </div>
           </div>
        </header>

        <div className="p-12 flex-grow overflow-y-auto custom-scrollbar">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
