import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X, Search, Database, LayoutGrid } from 'lucide-react';

const ProductsCMS = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentProductId, setCurrentProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Antibiotics',
    image: '',
    description: '',
    stock: 0,
    showOnShop: true,
    showOnHome: false,
    showOnSchemes: false
  });

  const [categories, setCategories] = useState([]);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
         axios.get('https://ayuom-backend.vercel.app/api/products'),
         axios.get('https://ayuom-backend.vercel.app/api/categories').catch(() => ({ data: [] }))
      ]);
      if (prodRes.data && prodRes.data.length) {
        setProducts(prodRes.data);
      } else {
        setProducts([]);
      }
      if (catRes.data && catRes.data.length) {
         setCategories(catRes.data.map(c => c.name));
      } else {
         setCategories(['General']);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, product = null) => {
    setModalMode(mode);
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || '',
        category: product.category || 'Antibiotics',
        image: product.image,
        description: product.description || '',
        stock: product.stock || 0,
        showOnShop: product.showOnShop ?? true,
        showOnHome: product.showOnHome || false,
        showOnSchemes: product.showOnSchemes || false
      });
      setCurrentProductId(product._id);
    } else {
      setFormData({
        name: '', price: '', originalPrice: '', category: 'Antibiotics', 
        image: '', description: '', stock: 0, showOnShop: true, showOnHome: false, showOnSchemes: false
      });
      setCurrentProductId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        const res = await axios.post('https://ayuom-backend.vercel.app/api/products', formData, getAuthConfig());
        setProducts([res.data, ...products]);
        alert('Product added completely!');
      } else {
        const res = await axios.put(`https://ayuom-backend.vercel.app/api/products/${currentProductId}`, formData, getAuthConfig());
        setProducts(products.map(p => p._id === currentProductId ? res.data : p));
        alert('Product modified safely!');
      }
      setShowModal(false);
    } catch (err) {
      alert('Error saving data: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Erase this item completely from standard inventory and schemes?')) return;
    try {
      await axios.delete(`https://ayuom-backend.vercel.app/api/products/${id}`, getAuthConfig());
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert('Error deleting data: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredProducts = products.filter(p => {
     let matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
     let matchesFilter = true;
     if (activeFilter === 'Home') matchesFilter = p.showOnHome === true;
     if (activeFilter === 'Schemes') matchesFilter = p.showOnSchemes === true;
     if (activeFilter === 'Shop') matchesFilter = p.showOnShop === true;
     if (activeFilter === 'Out of Stock') matchesFilter = (p.stock || 0) <= 0;
     return matchesSearch && matchesFilter;
  });

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none underline decoration-primary-600 underline-offset-8">Master Records Engine</h2>
          <p className="text-slate-400 mt-4 font-bold uppercase tracking-[0.2em] text-[10px]">Real-time Database Management For Website & Schemes</p>
        </div>
        <div className="flex items-center gap-4 border border-surface-border bg-white rounded-3xl p-2 shadow-soft">
           <div className="flex bg-surface-light rounded-2xl overflow-hidden p-1">
              {['All', 'Shop', 'Home', 'Schemes', 'Out of Stock'].map((filter) => (
                <button 
                  key={filter} 
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeFilter === filter ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-primary-600'}`}
                >
                  {filter}
                </button>
              ))}
           </div>
           <button onClick={() => handleOpenModal('add')} className="bg-primary-600 hover:bg-primary-500 text-white font-black px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-2xl shadow-primary-500/30 flex items-center gap-2 active:scale-95 transition-all">
             <Plus className="w-4 h-4" /> Add Record
           </button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white border border-surface-border rounded-3xl px-6 py-4 mb-8 shadow-sm">
         <Search className="w-5 h-5 text-slate-400" />
         <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search database globally by generic name or category..." className="bg-transparent border-none outline-none text-sm font-bold w-full text-slate-900 placeholder:text-slate-300" />
      </div>

      <div className="bg-white rounded-[48px] overflow-hidden border border-surface-border shadow-soft">
        <table className="w-full text-left bg-white">
          <thead className="bg-surface-light border-b border-surface-border">
            <tr>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 w-1/3">Medicine Designation</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Segment</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Status</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Placements</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {loading ? (
               <tr>
                 <td colSpan="5" className="px-10 py-20 text-center text-slate-400 text-sm font-bold">Querying Grid Nodes...</td>
               </tr>
            ) : filteredProducts.length === 0 ? (
               <tr>
                 <td colSpan="5" className="px-10 py-20 text-center text-slate-400 text-sm font-bold">No records matched your query parameters.</td>
               </tr>
            ) : filteredProducts.map(p => (
              <tr key={p._id} className="hover:bg-primary-50/30 transition-all group">
                <td className="px-10 py-8 flex items-center gap-6">
                   <div className="w-16 h-16 bg-white rounded-2xl p-3 border border-surface-border shadow-sm group-hover:scale-110 transition-transform flex items-center justify-center shrink-0">
                      <img src={p.image} className="max-w-full max-h-full object-contain" alt="" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-slate-900 font-black uppercase text-sm italic tracking-tighter truncate">{p.name}</p>
                      <p className="text-[10px] font-black text-primary-600 tracking-widest mt-1 opacity-60">REF: {p._id.slice(-6).toUpperCase()}</p>
                   </div>
                </td>
                <td className="px-10 py-8">
                   <span className="px-4 py-1.5 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20">
                      {p.category}
                   </span>
                </td>
                <td className="px-10 py-8">
                   <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl inline-block min-w-[120px]">
                      <p className={`text-base font-black leading-none ${p.stock <= 0 ? 'text-rose-600' : p.stock < 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                         {p.stock} Units
                      </p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 border-t border-slate-200 pt-2">
                         {p.stock <= 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'In Stock'}
                      </p>
                   </div>
                </td>
                <td className="px-10 py-8">
                   <div className="flex items-center gap-2">
                       {p.showOnShop && <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-black" title="Shop">S</span>}
                       {p.showOnHome && <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-black" title="Home Banner">H</span>}
                       {p.showOnSchemes && <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-black" title="Active Scheme">A</span>}
                   </div>
                </td>
                <td className="px-10 py-8 text-right space-x-3 whitespace-nowrap">
                   <button onClick={() => handleOpenModal('edit', p)} className="p-3.5 bg-surface-light hover:bg-primary-600 rounded-xl text-slate-400 hover:text-white shadow-sm transition-all border border-surface-border"><Edit className="w-5 h-5" /></button>
                   <button onClick={() => handleDelete(p._id)} className="p-3.5 bg-surface-light hover:bg-rose-500 rounded-xl text-slate-400 hover:text-white shadow-sm transition-all border border-surface-border"><Trash2 className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[56px] w-full max-w-3xl overflow-hidden shadow-3xl border border-white/20 animate-in zoom-in-95 duration-300">
             <div className="p-12 border-b border-surface-border flex justify-between items-center bg-surface-light">
                <div className="space-y-1">
                   <h2 className="text-3xl font-black text-primary-600 italic uppercase tracking-tighter leading-none">{modalMode === 'add' ? 'Instantiate Record' : 'Modify Record'}</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Master Editor</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-4 bg-white rounded-2xl hover:bg-rose-500 hover:text-white transition-all text-slate-300 shadow-premium group">
                   <X className="group-hover:rotate-90 transition-transform" />
                </button>
             </div>
             <form onSubmit={handleSubmit} className="p-12 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
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
                             {categories.map(c => <option key={c}>{c}</option>)}
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
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Quantity</label>
                          <input required type="number" placeholder="e.g. 100" className="w-full bg-surface-light p-5 rounded-2xl font-black text-slate-900 border border-surface-border outline-none focus:bg-white focus:border-primary-500 transition-all text-sm tracking-tight placeholder:text-slate-300" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
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
                      <label className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${formData.showOnShop ? 'bg-purple-50 border-purple-200 shadow-purple-500/10' : 'bg-surface-light border-surface-border opacity-70'}`}>
                         <input type="checkbox" className="w-5 h-5 accent-purple-600 cursor-pointer" checked={formData.showOnShop} onChange={e => setFormData({...formData, showOnShop: e.target.checked})} />
                         <div>
                            <p className="font-black text-slate-800 text-sm outline-none">Shop Database</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Main Catalog</p>
                         </div>
                      </label>
                      <label className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${formData.showOnHome ? 'bg-orange-50 border-orange-200 shadow-orange-500/10' : 'bg-surface-light border-surface-border opacity-70'}`}>
                         <input type="checkbox" className="w-5 h-5 accent-orange-600 cursor-pointer" checked={formData.showOnHome} onChange={e => setFormData({...formData, showOnHome: e.target.checked})} />
                         <div>
                            <p className="font-black text-slate-800 text-sm">Home Promoted</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Landing Page</p>
                         </div>
                      </label>
                      <label className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${formData.showOnSchemes ? 'bg-emerald-50 border-emerald-200 shadow-emerald-500/10' : 'bg-surface-light border-surface-border opacity-70'}`}>
                         <input type="checkbox" className="w-5 h-5 accent-emerald-600 cursor-pointer" checked={formData.showOnSchemes} onChange={e => setFormData({...formData, showOnSchemes: e.target.checked})} />
                         <div>
                            <p className="font-black text-slate-800 text-sm">Schemes Active</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Bulk Offers</p>
                         </div>
                      </label>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 mt-4 px-2">Note: Toggling "Schemes Active" will immediately register this medicine under the primary promotional tier sitewide.</p>
                </div>

                <button type="submit" className="w-full bg-slate-900 py-6 rounded-[28px] font-black uppercase tracking-widest text-white shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all text-sm hover:bg-black group">
                   <Save className="w-5 h-5 group-hover:scale-110 transition-transform" /> Commit Changes to Database Hub
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsCMS;
