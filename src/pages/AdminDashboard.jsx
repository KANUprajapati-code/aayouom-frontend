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
                            <div key={m} className="flex flex-col items-center gap-4 group">
                               <motion.div 
                                 initial={{ height: 0 }}
                                 animate={{ height: "100%" }}
                                 className="w-14 h-40 bg-unicorn-cyan/5 rounded-t-2xl group-hover:bg-unicorn-magenta/10 transition-all relative overflow-hidden"
                               >
                                  <motion.div 
                                    initial={{ y: 200 }}
                                    animate={{ y: m === 'Apr' ? 0 : 50 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-unicorn-purple to-unicorn-cyan h-3/4 opacity-40 group-hover:opacity-60"
                                  ></motion.div>
                               </motion.div>
                               <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{m}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                   
                   <div className="bg-white/40 backdrop-blur-md rounded-[40px] border border-white/40 shadow-soft overflow-hidden">
                      <div className="p-10 border-b border-white/20 flex items-center justify-between">
                         <div>
                            <h3 className="text-2xl font-black text-text-main tracking-tighter italic uppercase">Recent Activity</h3>
                            <p className="text-[10px] font-black text-text-muted mt-2 uppercase tracking-[0.2em]">Latest Transactional Ledger</p>
                         </div>
                         <button onClick={() => setActiveTab('orders')} className="px-6 py-3 bg-white/50 rounded-2xl text-[10px] font-black uppercase text-secondary-500 tracking-widest hover:bg-secondary-500 hover:text-white transition-all border border-white/20 shadow-sm flex items-center gap-2">
                            View All <ArrowUpRight size={14} />
                         </button>
                      </div>
                      <div className="p-10">
                         <table className="w-full text-left">
                            <thead>
                               <tr className="text-[10px] font-black uppercase text-text-silver tracking-[0.2em]">
                                  <th className="pb-8">ID</th>
                                  <th className="pb-8">Customer</th>
                                  <th className="pb-8">Date</th>
                                  <th className="pb-8">Amount</th>
                                  <th className="pb-8 text-right">Status</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10 text-sm font-bold text-text-main">
                               {[1,2,3].map(i => (
                                  <tr key={i} className="group">
                                     <td className="py-6 text-text-silver font-mono">#ORD-{6900 + i}</td>
                                     <td className="py-6 italic font-black">Anonymous User</td>
                                     <td className="py-6 text-text-muted">Apr {8-i}, 2026</td>
                                     <td className="py-6 font-black text-unicorn-magenta">₹{999+(i*100)}</td>
                                     <td className="py-6 text-right">
                                        <span className="px-4 py-2 bg-unicorn-cyan/10 text-unicorn-cyan rounded-xl text-[10px] font-black uppercase border border-unicorn-cyan/20">Pending</span>
                                     </td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                   </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md p-10 rounded-[40px] border border-white/40 shadow-soft">
                   <div className="flex items-center gap-4 mb-10 text-secondary-500">
                      <div className="w-12 h-12 bg-secondary-500/10 rounded-2xl flex items-center justify-center">
                        <Bell className="w-6 h-6 animate-pulse" />
                      </div>
                      <h3 className="text-xl font-black tracking-tighter uppercase italic">Inventory Pulse</h3>
                   </div>
                   <div className="space-y-6">
                      {loading ? (
                         <div className="py-10 text-center animate-pulse">
                            <div className="w-8 h-8 border-2 border-unicorn-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-[10px] font-black text-text-silver uppercase tracking-widest">Scanning Grid...</p>
                         </div>
                      ) : lowStockItems.length === 0 ? (
                         <div className="py-20 text-center">
                            <div className="w-20 h-20 bg-unicorn-cyan/5 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-unicorn-cyan/10">
                               <CheckCircle2 size={40} className="text-unicorn-cyan opacity-40" />
                            </div>
                            <p className="text-[11px] font-black text-text-silver uppercase tracking-[0.2em]">Inventory Optimal</p>
                         </div>
                      ) : lowStockItems.map(item => (
                         <motion.div key={item._id} whileHover={{ x: 5 }} className="p-5 bg-white/30 rounded-3xl border border-white/40 group hover:bg-white/60 transition-all border-l-4 border-l-secondary-500 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <p className="text-xs font-black text-text-main uppercase tracking-tight truncate max-w-[150px] italic">{item.name}</p>
                                  <p className="text-[9px] font-black text-text-silver uppercase tracking-widest mt-1">SKU: {item._id.slice(-8).toUpperCase()}</p>
                               </div>
                               <div className={`text-xs font-black px-3 py-1 rounded-lg ${item.stock <= 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-secondary-500/10 text-secondary-500'}`}>
                                  {item.stock} left
                               </div>
                            </div>
                            <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${Math.max(10, (item.stock || 0) * 10)}%` }}
                                 className="h-full bg-gradient-to-r from-secondary-500 to-unicorn-magenta"
                               ></motion.div>
                            </div>
                         </motion.div>
                      ))}
                   </div>
                   <button onClick={() => setActiveTab('products')} className="w-full mt-10 py-5 bg-text-main hover:bg-black text-white rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] transition-all shadow-xl active:scale-95">
                      Open Warehouse
                   </button>
                </div>
             </div>
          </motion.section>
        );
      case 'products': return <ProductsCMS />;
      case 'homecms': return <GlobalCMSHub />;
      case 'categories': return <CategoriesCMS />;
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
    <div className="min-h-screen bg-slate-50 flex text-text-main font-sans overflow-hidden">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-unicorn-cyan/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-unicorn-magenta/10 rounded-full blur-[120px]"></div>
         <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-unicorn-purple/5 rounded-full blur-[100px]"></div>
      </div>

      {/* SIDEBAR */}
      <aside className="w-80 bg-text-main text-white flex flex-col fixed h-full z-50 overflow-y-auto border-r border-white/5 shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-950 to-purple-950 opacity-95"></div>
        
        <div className="p-10 relative z-10">
           <div className="flex flex-col gap-2 mb-12">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gradient-to-br from-unicorn-cyan to-unicorn-magenta rounded-xl flex items-center justify-center shadow-unicorn">
                    <Sparkles className="w-6 h-6 text-white" />
                 </div>
                 <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Unicorn<br/><span className="text-unicorn-cyan text-xs tracking-[0.4em] not-italic font-bold">Admin Hub</span></h2>
              </div>
           </div>
           
           <nav className="space-y-2">
              <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] mb-6 opacity-40 px-4">Core Protocol</p>
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
