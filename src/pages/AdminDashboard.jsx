/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Package, Users, ShoppingBag, 
  Settings, LogOut, Search, Plus, 
  Edit, Trash2, CheckCircle2, XCircle, 
  TrendingUp, ArrowUpRight, Bell, LayoutDashboard, 
  Database, Activity, X, Save, Image as ImageIcon,
  Globe, ShieldCheck, Zap, FileText, Tag
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import GlobalCMSHub from '../components/admin/GlobalCMSHub';
import ProductsCMS from '../components/admin/ProductsCMS';
import CategoriesCMS from '../components/admin/CategoriesCMS';
import SchemesCMS from '../components/admin/SchemesCMS';
import PagesCMS from '../components/admin/PagesCMS';
import BulkOrderCMS from '../components/admin/BulkOrderCMS';
import AboutCMS from '../components/admin/AboutCMS';
import UserApprovalCMS from '../components/admin/UserApprovalCMS';
import { ShoppingBag as shoppingBagIcon } from 'lucide-react';

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
    { label: 'Total Revenue', value: '₹1401', trend: '+101', icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: '29', trend: 'Lifetime', icon: ShoppingBag, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Total Customers', value: '10', trend: 'Registered Users', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Consultations', value: '10', trend: 'Doctor Bookings', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' }
  ];

  const lowStockItems = products.filter(p => (p.stock || 0) <= 10).slice(0, 5);

  const fetchData = async () => {
    setLoading(true);
    try {
      const prodRes = await axios.get('https://ayuom-backend.vercel.app/api/products').catch(() => ({ data: [] }));
      setProducts(prodRes.data);

      const token = localStorage.getItem('token');
      if (token) {
        const userRes = await axios.get('https://ayuom-backend.vercel.app/api/admin/users/pending', getAuthConfig()).catch(() => ({ data: [] }));
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
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex text-slate-800 font-sans">
      {/* SIDEBAR - Styled like reference video */}
      <aside className="w-80 bg-primary-800 text-white flex flex-col fixed h-full z-50 overflow-y-auto">
        <div className="p-8 pb-4">
           <div className="flex flex-col gap-1 mb-10">
              <span className="text-[10px] font-bold text-primary-300 uppercase tracking-widest opacity-60">Website</span>
              <div className="flex items-center gap-3">
                 <Globe className="w-5 h-5 text-primary-400" />
                 <h2 className="text-xl font-black subpixel-antialiased tracking-tight">Admin</h2>
              </div>
           </div>
           
           <div className="px-2">
              <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-6 opacity-40">Management</p>
              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'products', label: 'Products', icon: Database },
                  { id: 'orders', label: 'Orders', icon: ShoppingBag },
                  { id: 'users', label: 'Users', icon: Users },
                  { id: 'doctors', label: 'Doctors', icon: ShieldCheck },
                  { id: 'doctorbookings', label: 'Doctor Bookings', icon: Activity },
                  { id: 'categories', label: 'Categories', icon: Package },
                  { id: 'consultationcat', label: 'Consultation Categories', icon: Zap },
                  { id: 'promocodes', label: 'Promo Codes', icon: Tag },
                  { id: 'bulkorders', label: 'Bulk Orders', icon: shoppingBagIcon },
                  { id: 'homecms', label: 'Home CMS', icon: Globe },
                  { id: 'aboutcms', label: 'About CMS', icon: FileText },
                  { id: 'messages', label: 'Messages', icon: Bell }
                ].map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveTab(item.id)} 
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-sm font-bold transition-all ${activeTab === item.id ? 'bg-white/10 text-white' : 'text-primary-100 hover:bg-white/5 active:bg-white/15'}`}
                  >
                    <item.icon className="w-5 h-5 opacity-70" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
           </div>
        </div>
        
        <div className="mt-auto p-8 border-t border-white/5">
           <button onClick={handleLogout} className="flex items-center gap-4 text-rose-400 hover:text-rose-300 font-bold text-sm transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow ml-80 min-h-screen">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
           <h2 className="text-xl font-bold text-slate-800 capitalize tracking-tight">{activeTab}</h2>
           <div className="flex items-center gap-4 text-slate-500">
              <span className="text-sm font-medium">Welcome, <span className="text-slate-900 font-bold">Kanu Prajapati</span></span>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 shadow-sm">K</div>
           </div>
        </header>

        <div className="p-10">
          {activeTab === 'overview' && (
            <section className="space-y-10">
               {/* Top Stats Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {dashboardStats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                       <div className="flex items-center justify-between mb-4">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                          <div className={`p-2.5 ${stat.bg} ${stat.color} rounded-xl`}>
                             <stat.icon size={18} />
                          </div>
                       </div>
                       <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{stat.trend}</p>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Left: Sales Performance Placeholder */}
                  <div className="lg:col-span-2 space-y-8">
                     <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[400px]">
                        <div className="flex items-center justify-between mb-10">
                           <div>
                              <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-none">Sales Performance</h3>
                              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Revenue trends over the last 6 months</p>
                           </div>
                           <select className="bg-slate-50 border border-slate-100 text-slate-500 px-4 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                              <option>Monthly View</option>
                              <option>Yearly View</option>
                           </select>
                        </div>
                        {/* Mock Chart Area */}
                        <div className="h-64 flex items-end justify-between px-6 pt-10 border-b border-l border-slate-50 relative">
                           {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((m) => (
                              <div key={m} className="flex flex-col items-center gap-4 group">
                                 <div className="w-12 h-40 bg-primary-100/40 rounded-t-lg group-hover:bg-primary-500/10 transition-colors relative overflow-hidden">
                                    <div className="absolute bottom-0 left-0 w-full bg-emerald-500/20 h-1/2 group-hover:h-3/4 transition-all duration-700"></div>
                                 </div>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                     
                     {/* Recent Orders Placeholder */}
                     <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                           <div>
                              <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-none">Recent Orders</h3>
                              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Latest transactions from our store</p>
                           </div>
                           <button onClick={() => setActiveTab('orders')} className="text-[10px] font-black uppercase text-primary-600 tracking-widest hover:underline flex items-center gap-1">
                              View All Orders <ArrowUpRight size={14} />
                           </button>
                        </div>
                        <div className="p-8">
                           <table className="w-full text-left">
                              <thead>
                                 <tr className="text-[10px] font-bold uppercase text-slate-300 tracking-widest">
                                    <th className="pb-6">Order ID</th>
                                    <th className="pb-6">Customer</th>
                                    <th className="pb-6">Date</th>
                                    <th className="pb-6">Amount</th>
                                    <th className="pb-6 text-right">Status</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50 text-sm font-bold">
                                 {[1,2,3].map(i => (
                                    <tr key={i} className="group">
                                       <td className="py-5 text-slate-400">#ORD-69D{i}FA</td>
                                       <td className="py-5 text-slate-900 font-black italic">Guest User</td>
                                       <td className="py-5 text-slate-500 font-medium">Apr {8-i}, 2026</td>
                                       <td className="py-5 text-slate-900">₹{999+(i*100)}</td>
                                       <td className="py-5 text-right">
                                          <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] uppercase">Pending</span>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>

                  {/* Right: Low Stock Alerts section */}
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                     <div className="flex items-center gap-3 mb-10 text-rose-600">
                        <Bell className="w-5 h-5 animate-bounce" />
                        <h3 className="text-lg font-bold tracking-tight">Low Stock Alerts</h3>
                     </div>
                     <div className="space-y-6">
                        {loading ? (
                           <p className="text-xs font-bold text-slate-400 animate-pulse">Checking Grid Nodes...</p>
                        ) : lowStockItems.length === 0 ? (
                           <div className="py-10 text-center">
                              <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-4 opacity-20" />
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inventory is Healthy</p>
                           </div>
                        ) : lowStockItems.map(item => (
                           <div key={item._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-rose-50 hover:border-rose-100 transition-all">
                              <div className="flex justify-between items-start mb-2">
                                 <div>
                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[150px]">{item.name}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">SKU: {item._id.slice(-8).toUpperCase()}</p>
                                 </div>
                                 <p className={`text-sm font-black ${item.stock <= 0 ? 'text-rose-600' : 'text-amber-600'}`}>
                                    {item.stock} left
                                 </p>
                              </div>
                              <div className="h-1 bg-slate-200 rounded-full overflow-hidden mt-3">
                                 <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${Math.max(10, (item.stock || 0) * 10)}%` }}></div>
                              </div>
                           </div>
                        ))}
                     </div>
                     <button onClick={() => setActiveTab('products')} className="w-full mt-10 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
                        View All Inventory
                     </button>
                  </div>
               </div>
            </section>
          )}

          {activeTab === 'products' && <ProductsCMS />}
          {activeTab === 'homecms' && <GlobalCMSHub />}
          {activeTab === 'categories' && <CategoriesCMS />}
          {activeTab === 'schemes' && <SchemesCMS />}
          {activeTab === 'pages' && <PagesCMS />}
          {activeTab === 'bulkorders' && <BulkOrderCMS />}
          {activeTab === 'aboutcms' && <AboutCMS />}
          {activeTab === 'users' && <UserApprovalCMS />}
          {activeTab === 'doctors' && <UserApprovalCMS />}
          
          {/* Missing Section Placeholders */}
          {['orders', 'users', 'doctors', 'doctorbookings', 'consultationcat', 'promocodes', 'messages'].includes(activeTab) && (
            <div className="py-40 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
               <div className="w-24 h-24 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center text-slate-200">
                  <Activity size={48} className="animate-spin-slow" />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">{activeTab.replace(/([A-Z])/g, ' $1')} Node</h2>
                 <p className="font-black text-slate-300 uppercase tracking-[0.4em] text-[10px]">Synchronizing with Primary Server Instance...</p>
               </div>
               <button onClick={() => setActiveTab('overview')} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Return to Master Dashboard</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
