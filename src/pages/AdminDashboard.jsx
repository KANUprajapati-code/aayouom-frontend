/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, Package, Users, ShoppingBag, 
  Settings, LogOut, Search, Plus, 
  Edit, Trash2, CheckCircle2, XCircle, 
  TrendingUp, ArrowUpRight, Bell, LayoutDashboard, 
  Database, Activity, X, Save, Image as ImageIcon,
  Globe, ShieldCheck, Zap, FileText, Tag, Sparkles, Building2
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
import BrandsCMS from '../components/admin/BrandsCMS';
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
    { label: 'Total Revenue', value: '₹1401', trend: '+10%', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Orders', value: '29', trend: 'Lifetime', icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Customers', value: '10', trend: 'Registered Users', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Consultations', value: '10', trend: 'Doctor Bookings', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  const lowStockItems = useMemo(() => products.filter(p => (p.stock || 0) <= 10).slice(0, 5), [products]);

  const fetchData = async () => {
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
  }, []);

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
    { id: 'brands', label: 'Brands CMS', icon: Building2 },
    { id: 'schemes', label: 'Schemes CMS', icon: Zap },
    { id: 'consultationcat', label: 'Consultation Categories', icon: Zap },
    { id: 'promocodes', label: 'Promo Codes', icon: Tag },
    { id: 'wallet', label: 'Wallet Management', icon: Wallet },
    { id: 'bulkorders', label: 'Bulk Orders', icon: shoppingBagIcon },
    { id: 'homecms', label: 'Home CMS', icon: Globe },
    { id: 'pages', label: 'Pages CMS', icon: FileText },
    { id: 'aboutcms', label: 'About CMS', icon: FileText },
    { id: 'messages', label: 'Messages', icon: Bell }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                     <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                        <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
                           <stat.icon size={20} />
                        </div>
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                     <p className="text-[10px] font-medium text-slate-400 mt-1">{stat.trend}</p>
                  </div>
                ))}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                   <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                         <h3 className="text-lg font-bold text-slate-900">Sales Overview</h3>
                         <select className="bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-semibold outline-none">
                            <option>Monthly View</option>
                            <option>Yearly View</option>
                         </select>
                      </div>
                      <div className="h-64 flex items-end justify-between px-4 pt-10 border-b border-l border-slate-100">
                         {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((m) => (
                           <div key={m} className="flex flex-col items-center gap-2 group">
                              <div className="relative w-10 bg-blue-100 rounded-t-lg group-hover:bg-blue-500 transition-all" style={{ height: `${Math.random() * 100 + 40}px` }}></div>
                              <span className="text-[10px] font-semibold text-slate-400">{m}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                       <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                          <Activity className="text-rose-500" size={16} /> Low Stock Alerts
                       </h3>
                       <div className="space-y-4">
                          {lowStockItems.length > 0 ? lowStockItems.map(p => (
                            <div key={p._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                               <div className="overflow-hidden">
                                  <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                                  <p className="text-[10px] font-bold text-rose-500">STOCK: {p.stock}</p>
                               </div>
                               <button onClick={() => { setCategoryFilter(p.category); setActiveTab('products'); }} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                                  <Plus size={14} />
                               </button>
                            </div>
                          )) : (
                            <p className="text-xs text-slate-400 text-center py-6">All items are in stock.</p>
                          )}
                       </div>
                    </div>

                    <button 
                      onClick={() => setActiveTab('users')} 
                      className="w-full p-8 bg-slate-900 rounded-2xl shadow-lg hover:bg-slate-800 transition-all text-white flex flex-col items-center gap-4"
                    >
                       <Users size={28} />
                       <div className="text-center">
                          <h4 className="text-sm font-bold uppercase tracking-wider">{pendingUsers.length} Pending Approvals</h4>
                          <p className="text-[10px] opacity-60 mt-1 uppercase tracking-widest">User Authentication Required</p>
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
      case 'brands': return <BrandsCMS />;
      case 'schemes': return <SchemesCMS />;
      case 'pages': return <PagesCMS />;
      case 'bulkorders': return <BulkOrderCMS />;
      case 'aboutcms': return <AboutCMS />;
      case 'users':
      case 'doctors': return <UserApprovalCMS />;
      case 'wallet': return <AdminWalletCMS />;
      default: return <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">Coming Soon</div>;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-72 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 flex flex-col z-50">
        <div className="p-8 border-b border-slate-100 flex items-center gap-3">
           <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">
              W
           </div>
           <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">WEDOME</h1>
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block">Admin Portal</span>
           </div>
        </div>

        <div className="flex-grow overflow-y-auto px-4 py-6 scrollbar-hide">
           <nav className="space-y-1">
              {menuItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)} 
                  className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-xs font-bold transition-all ${activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <item.icon size={18} className={activeTab === item.id ? 'text-blue-600' : 'opacity-60'} />
                  <span>{item.label}</span>
                </button>
              ))}
           </nav>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3">
           <Link to="/" className="w-full flex items-center justify-center gap-3 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold text-xs transition-all shadow-md">
              <Globe size={16} />
              <span>Back to Website</span>
           </Link>
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-3 bg-white text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs transition-all border border-rose-100">
              <LogOut size={16} />
              <span>Logout Account</span>
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow ml-72 min-h-screen flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
           <h2 className="text-xl font-bold text-slate-900 capitalize tracking-tight">{activeTab}</h2>
           
           <div className="flex items-center gap-4">
              <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator</p>
                 <p className="text-xs font-bold text-slate-900">Kanu Prajapati</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200">
                 K
              </div>
           </div>
        </header>

        <div className="p-10 flex-grow">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
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
