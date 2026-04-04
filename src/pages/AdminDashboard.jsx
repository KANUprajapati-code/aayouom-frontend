import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Package, Users, ShoppingBag, 
  Settings, LogOut, Search, Plus, 
  Edit, Trash2, CheckCircle2, XCircle, 
  TrendingUp, ArrowUpRight, Bell, LayoutDashboard, 
  Database, Activity, X, Save, Image as ImageIcon,
  Globe, ShieldCheck, Zap
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import HomePageCMS from '../components/admin/HomePageCMS';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentProductId, setCurrentProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Antibiotics',
    image: '',
    description: '',
    showOnShop: true,
    showOnHome: false,
    showOnSchemes: false
  });
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [categories, setCategories] = useState([
    { id: 1, name: 'Antibiotics', brands: ['GlaxoSmithKline', 'Alkem', 'Cipla'] },
    { id: 2, name: 'Gastrointestinal', brands: ['Alkem Laboratories', 'Abbott', 'Cadila'] },
    { id: 3, name: 'Analgesics', brands: ['GSK', 'Intas', 'Lupin'] }
  ]);
  const [schemes, setSchemes] = useState([
    { id: 1, title: 'Buy 10 Get 2 Free', category: 'Antibiotics', status: 'Active' },
    { id: 2, title: 'Extra 5% on 20+', category: 'Gastrointestinal', status: 'Active' },
    { id: 3, title: 'Bulk Discount 15%', category: 'Cardiac', status: 'Inactive' }
  ]);

  const stats = [
    { label: 'Network Savings', value: '₹4,82,500', trend: '+18.5%', icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-600/10' },
    { label: 'Bulk Orders', value: '1,248', trend: '+12.2%', icon: ShoppingBag, color: 'text-secondary-500', bg: 'bg-secondary-500/10' },
    { label: 'Doctor Partners', value: '156', trend: 'Growing', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Managed Items', value: products.length.toString(), trend: 'Syncing', icon: Package, color: 'text-amber-500', bg: 'bg-amber-500/10' }
  ];

  const [schemesHeroData, setSchemesHeroData] = useState({
    title: '', subtitle: '', description: '', imageUrl: ''
  });
  const [isUpdatingHero, setIsUpdatingHero] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const prodRes = await axios.get('https://ayuom-backend.vercel.app/api/products').catch(() => ({ data: [] }));
      setProducts(prodRes.data.length ? prodRes.data : [
        { _id: '1', name: 'Augmentin 625 Duo', price: 185, category: 'Antibiotics', image: 'https://via.placeholder.com/100' },
        { _id: '2', name: 'Pan 40 Tablet', price: 110, category: 'Gastrointestinal', image: 'https://via.placeholder.com/100' }
      ]);
      
      const contentRes = await axios.get('https://ayuom-backend.vercel.app/api/content/schemes').catch(() => ({ data: null }));
      if (contentRes.data) setSchemesHeroData(contentRes.data);

      if (token) {
        const userRes = await axios.get('https://ayuom-backend.vercel.app/api/admin/users/pending', config).catch(() => ({ data: [] }));
        setPendingUsers(userRes.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

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

  // Product Actions
  const handleOpenProductModal = (mode, product = null) => {
    setModalMode(mode);
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || '',
        category: product.category,
        image: product.image,
        description: product.description || '',
        showOnShop: product.showOnShop ?? true,
        showOnHome: product.showOnHome || false,
        showOnSchemes: product.showOnSchemes || false
      });
      setCurrentProductId(product._id);
    } else {
      setFormData({ name: '', price: '', originalPrice: '', category: 'Antibiotics', image: '', description: '', showOnShop: true, showOnHome: false, showOnSchemes: false });
      setCurrentProductId(null);
    }
    setShowProductModal(true);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        const res = await axios.post('https://ayuom-backend.vercel.app/api/products', formData, config);
        setProducts([res.data, ...products]);
        alert('Product added successfully!');
      } else {
        const res = await axios.put(`https://ayuom-backend.vercel.app/api/products/${currentProductId}`, formData, config);
        setProducts(products.map(p => p._id === currentProductId ? res.data : p));
        alert('Product updated successfully!');
      }
      setShowProductModal(false);
    } catch (err) {
      alert('Error saving product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Erase this product from the database?')) return;
    try {
      await axios.delete(`https://ayuom-backend.vercel.app/api/products/${id}`, config);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert('Error deleting product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateHero = async (e) => {
    e.preventDefault();
    setIsUpdatingHero(true);
    try {
      await axios.put('https://ayuom-backend.vercel.app/api/content/schemes', schemesHeroData, config);
      alert('Schemes Hero section updated successfully!');
    } catch (err) {
      alert('Failed to update hero: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdatingHero(false);
    }
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

          {activeTab === 'categories' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="flex justify-between items-end mb-12">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Category Matrix</h2>
                    <p className="text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Manage Therapeutic Segments and Brands</p>
                  </div>
                  <button className="btn-primary px-8 py-4 rounded-2xl text-[10px] shadow-premium">
                    <Plus className="w-4 h-4" /> New Main Category
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categories.map((cat) => (
                    <div key={cat.id} className="card !p-8 space-y-6">
                       <div className="flex justify-between items-start">
                          <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center border border-primary-100">
                             <Package size={24} />
                          </div>
                          <div className="flex gap-2">
                             <button className="p-2 bg-surface-light hover:bg-primary-50 text-slate-400 hover:text-primary-600 rounded-lg transition-all"><Edit size={14}/></button>
                             <button className="p-2 bg-surface-light hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all"><Trash2 size={14}/></button>
                          </div>
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{cat.name}</h4>
                          <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1 italic">{cat.brands.length} Brands Synced</p>
                       </div>
                       <div className="pt-4 border-t border-surface-border">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Associated Brands</p>
                          <div className="flex flex-wrap gap-2">
                             {cat.brands.map(brand => (
                               <span key={brand} className="px-3 py-1.5 bg-surface-light border border-surface-border rounded-lg text-[10px] font-bold text-slate-600">{brand}</span>
                             ))}
                             <button className="px-3 py-1.5 bg-primary-50 text-primary-600 border border-primary-100 rounded-lg text-[10px] font-black hover:bg-primary-600 hover:text-white transition-all">+ Add</button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'schemes' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
               <div className="flex justify-between items-end mb-12">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Schemes Optimizer</h2>
                    <p className="text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Configure Volume-based Pricing Models</p>
                  </div>
                  <button className="btn-primary px-8 py-4 rounded-2xl text-[10px] shadow-premium">
                    <Zap className="w-4 h-4" /> Create New Scheme
                  </button>
               </div>

               {/* Hero Banner Editor */}
               <div className="bg-white rounded-[40px] border border-surface-border shadow-soft p-10 mb-8 flex flex-col lg:flex-row gap-10">
                  <div className="lg:w-1/3">
                    <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase leading-none mb-2">Promotion Settings</h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">Modify the main hero banner on the `/schemes` page. This is the first thing doctors will see when looking for bulk discounts.</p>
                  </div>
                  <form onSubmit={handleUpdateHero} className="lg:w-2/3 space-y-6 bg-surface-light p-8 rounded-[32px] border border-surface-border">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Promotion Title</label>
                        <input type="text" value={schemesHeroData.title || ''} onChange={(e) => setSchemesHeroData({...schemesHeroData, title: e.target.value})} className="w-full bg-white p-4 rounded-2xl font-black text-slate-900 border border-surface-border outline-none focus:border-primary-500 transition-all uppercase text-sm" placeholder="e.g. Professional Medical Schemes" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subtitle</label>
                        <input type="text" value={schemesHeroData.subtitle || ''} onChange={(e) => setSchemesHeroData({...schemesHeroData, subtitle: e.target.value})} className="w-full bg-white p-4 rounded-2xl font-medium text-slate-800 border border-surface-border outline-none focus:border-primary-500 transition-all text-sm" placeholder="e.g. Exclusive discounts for registered clinics." />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Description</label>
                        <textarea value={schemesHeroData.description || ''} onChange={(e) => setSchemesHeroData({...schemesHeroData, description: e.target.value})} className="w-full bg-white p-4 rounded-2xl font-medium text-slate-600 border border-surface-border outline-none focus:border-primary-500 transition-all text-sm min-h-[100px]" placeholder="Detailed description of current offers..." />
                      </div>
                    </div>
                    <button type="submit" disabled={isUpdatingHero} className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all disabled:opacity-50">
                      {isUpdatingHero ? 'Syncing with Server...' : <><Save size={16} /> Sync Promotion Hero</>}
                    </button>
                  </form>
               </div>

               <div className="bg-white rounded-[40px] border border-surface-border shadow-premium overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-surface-light border-b border-surface-border">
                        <tr>
                           <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Offer Designation</th>
                           <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Applicable Segment</th>
                           <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                           <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Control</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-surface-border">
                        {schemes.map(scheme => (
                           <tr key={scheme.id} className="hover:bg-primary-50/20 transition-all">
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-black">
                                       %
                                    </div>
                                    <p className="font-black text-slate-800 uppercase italic tracking-tighter">{scheme.title}</p>
                                 </div>
                              </td>
                              <td className="px-10 py-6">
                                 <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {scheme.category}
                                 </span>
                              </td>
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${scheme.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${scheme.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                       {scheme.status}
                                    </span>
                                 </div>
                              </td>
                              <td className="px-10 py-6 text-right">
                                 <button className="text-primary-600 font-black text-[10px] uppercase tracking-widest hover:underline">Toggle status</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="flex justify-between items-end mb-12">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none underline decoration-primary-600 underline-offset-8">Central Inventory</h2>
                    <p className="text-slate-400 mt-4 font-bold uppercase tracking-[0.2em] text-[10px]">Real-time Database Record Management</p>
                  </div>
                  <button onClick={() => handleOpenProductModal('add')} className="bg-primary-600 hover:bg-primary-500 text-white font-black px-10 py-5 rounded-3xl text-[10px] uppercase tracking-widest shadow-2xl shadow-primary-500/30 flex items-center gap-3 active:scale-95 transition-all">
                    <Plus className="w-5 h-5" /> Add Master Specification
                  </button>
               </div>
               
               <div className="bg-white rounded-[48px] overflow-hidden border border-surface-border shadow-soft">
                  <table className="w-full text-left">
                    <thead className="bg-surface-light border-b border-surface-border">
                      <tr>
                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Medicine Designation</th>
                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Segment</th>
                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Unit Price</th>
                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Commit Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {products.map(p => (
                        <tr key={p._id} className="hover:bg-primary-50/30 transition-all group">
                          <td className="px-10 py-8 flex items-center gap-6">
                             <div className="w-16 h-16 bg-white rounded-2xl p-3 border border-surface-border shadow-sm group-hover:scale-110 transition-transform flex items-center justify-center shrink-0">
                                <img src={p.image} className="max-w-full max-h-full object-contain" alt="" />
                             </div>
                             <div>
                                <p className="text-slate-900 font-black uppercase text-sm italic tracking-tighter">{p.name}</p>
                                <p className="text-[10px] font-black text-primary-600 tracking-widest mt-1 opacity-60">REF_ID: {p._id.slice(-8).toUpperCase()}</p>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <span className="px-4 py-1.5 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20">
                                {p.category}
                             </span>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex flex-col">
                                <span className="font-black text-slate-900 text-lg">₹{p.price}</span>
                                <span className="text-[10px] font-black text-slate-400 line-through opacity-60">MRP ₹{p.price + 45}</span>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-right space-x-3">
                             <button onClick={() => handleOpenProductModal('edit', p)} className="p-3.5 bg-surface-light hover:bg-primary-600 rounded-xl text-slate-400 hover:text-white shadow-sm transition-all border border-surface-border"><Edit className="w-5 h-5" /></button>
                             <button onClick={() => handleDeleteProduct(p._id)} className="p-3.5 bg-surface-light hover:bg-rose-500 rounded-xl text-slate-400 hover:text-white shadow-sm transition-all border border-surface-border"><Trash2 className="w-5 h-5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
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

      {showProductModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[56px] w-full max-w-2xl overflow-hidden shadow-3xl border border-white/20 animate-in zoom-in-95 duration-300">
             <div className="p-12 border-b border-surface-border flex justify-between items-center bg-surface-light">
                <div className="space-y-1">
                   <h2 className="text-3xl font-black text-primary-600 italic uppercase tracking-tighter leading-none">{modalMode === 'add' ? 'New Specification' : 'Modify Record'}</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database Node: US-EAST-HRIDVED</p>
                </div>
                <button onClick={() => setShowProductModal(false)} className="p-4 bg-white rounded-2xl hover:bg-rose-500 hover:text-white transition-all text-slate-300 shadow-premium group">
                   <X className="group-hover:rotate-90 transition-transform" />
                </button>
             </div>
             <form onSubmit={handleSubmitProduct} className="p-12 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* SECTION 1: Basic Information */}
                <div>
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2"><div className="w-1.5 h-4 bg-primary-600 rounded-full"></div> Basic Information</h3>
                   <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medicine Nomenclature</label>
                        <input required type="text" placeholder="e.g. AUGMENTIN 625 DUO" className="w-full bg-surface-light p-5 rounded-2xl font-black text-slate-900 border border-surface-border outline-none focus:bg-white focus:border-primary-500 transition-all uppercase text-sm tracking-tight placeholder:text-slate-300" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-1 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Therapeutic Segment</label>
                           <select className="w-full bg-surface-light p-5 rounded-2xl font-black text-slate-900 border border-surface-border outline-none focus:bg-white transition-all appearance-none cursor-pointer" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                             {categories.map(c => <option key={c.id}>{c.name}</option>)}
                           </select>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinical Description</label>
                        <textarea rows="3" placeholder="Enter dosage instructions, uses, and contraindications..." className="w-full bg-surface-light p-5 rounded-2xl font-bold text-slate-700 border border-surface-border outline-none focus:bg-white focus:border-primary-500 transition-all text-sm tracking-tight placeholder:text-slate-300 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                     </div>
                   </div>
                </div>

                <div className="h-px w-full bg-surface-border"></div>

                {/* SECTION 2: Pricing */}
                <div>
                   <h3 className="text-sm font-black text-emerald-800 uppercase tracking-widest mb-6 flex items-center gap-2"><div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div> Commerce & Pricing</h3>
                   <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Procurement Price (₹)</label>
                          <input required type="number" placeholder="0.00" className="w-full bg-emerald-50/50 p-5 rounded-2xl font-black text-emerald-900 border border-emerald-100 outline-none focus:bg-emerald-50 focus:border-emerald-500 transition-all uppercase text-sm tracking-tight placeholder:text-slate-300" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Original MRP (₹)</label>
                          <input type="number" placeholder="0.00" className="w-full bg-surface-light p-5 rounded-2xl font-black text-slate-900 border border-surface-border outline-none focus:bg-white focus:border-primary-500 transition-all uppercase text-sm tracking-tight placeholder:text-slate-300 line-through opacity-70" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} />
                       </div>
                   </div>
                </div>

                <div className="h-px w-full bg-surface-border"></div>

                {/* SECTION 3: Media */}
                <div>
                   <h3 className="text-sm font-black text-blue-800 uppercase tracking-widest mb-6 flex items-center gap-2"><div className="w-1.5 h-4 bg-blue-500 rounded-full"></div> Media Assets</h3>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Static Asset URI (Image URL)</label>
                      <input required type="text" placeholder="https://..." className="w-full bg-surface-light p-5 rounded-2xl font-black text-blue-900 border border-surface-border outline-none focus:bg-blue-50 focus:border-blue-500 transition-all text-xs tracking-widest placeholder:text-slate-300" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                   </div>
                </div>

                <div className="h-px w-full bg-surface-border"></div>

                {/* SECTION 4: Placements */}
                <div>
                   <h3 className="text-sm font-black text-purple-800 uppercase tracking-widest mb-6 flex items-center gap-2"><div className="w-1.5 h-4 bg-purple-500 rounded-full"></div> UI Placement Assignments</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <label className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${formData.showOnShop ? 'bg-purple-50 border-purple-200' : 'bg-surface-light border-surface-border opacity-60'}`}>
                         <input type="checkbox" className="w-5 h-5 accent-purple-600 cursor-pointer" checked={formData.showOnShop} onChange={e => setFormData({...formData, showOnShop: e.target.checked})} />
                         <div>
                            <p className="font-black text-slate-800 text-sm">Shop Database</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Main Catalog</p>
                         </div>
                      </label>
                      <label className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${formData.showOnHome ? 'bg-orange-50 border-orange-200' : 'bg-surface-light border-surface-border opacity-60'}`}>
                         <input type="checkbox" className="w-5 h-5 accent-orange-600 cursor-pointer" checked={formData.showOnHome} onChange={e => setFormData({...formData, showOnHome: e.target.checked})} />
                         <div>
                            <p className="font-black text-slate-800 text-sm">Home Promoted</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Landing Page</p>
                         </div>
                      </label>
                      <label className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${formData.showOnSchemes ? 'bg-emerald-50 border-emerald-200' : 'bg-surface-light border-surface-border opacity-60'}`}>
                         <input type="checkbox" className="w-5 h-5 accent-emerald-600 cursor-pointer" checked={formData.showOnSchemes} onChange={e => setFormData({...formData, showOnSchemes: e.target.checked})} />
                         <div>
                            <p className="font-black text-slate-800 text-sm">Schemes Active</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Bulk Offers</p>
                         </div>
                      </label>
                   </div>
                </div>

                <button type="submit" className="w-full bg-primary-600 py-6 rounded-[28px] font-black uppercase tracking-widest text-white shadow-2xl shadow-primary-500/40 flex items-center justify-center gap-4 active:scale-95 transition-all text-sm group">
                   <Save className="w-5 h-5 group-hover:scale-110 transition-transform" /> Commit Changes to Hub
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
