import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Edit, Trash2, Plus, X, Save, Sparkles, Wand2, Database, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/api';

const CategoriesCMS = ({ onManageProducts }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: '', imageUrl: '', brandsStr: '' });
  const [loading, setLoading] = useState(true);
  
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/categories`),
        axios.get(`${API_BASE_URL}/products`).catch(() => ({ data: [] }))
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, cat = null) => {
    setModalMode(mode);
    if (mode === 'edit' && cat) {
      setFormData({ 
        name: cat.name, 
        imageUrl: cat.imageUrl || '', 
        brandsStr: cat.brands ? cat.brands.join(', ') : '' 
      });
      setCurrentId(cat._id);
    } else {
      setFormData({ name: '', imageUrl: '', brandsStr: '' });
      setCurrentId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const brands = formData.brandsStr.split(',').map(b => b.trim()).filter(b => b);
      const payload = { name: formData.name, imageUrl: formData.imageUrl, brands };
      
      if (modalMode === 'add') {
        const res = await axios.post(`${API_BASE_URL}/categories`, payload, getAuthConfig());
        setCategories([...categories, res.data]);
      } else {
        const res = await axios.put(`${API_BASE_URL}/categories/${currentId}`, payload, getAuthConfig());
        setCategories(categories.map(c => c._id === currentId ? res.data : c));
      }
      setShowModal(false);
    } catch (err) {
      alert('Error saving category: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this therapeutic segment from the database?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/categories/${id}`, getAuthConfig());
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      alert('Error deleting category: ' + (err.response?.data?.message || err.message));
    }
  };

  const getProductCount = (categoryName) => {
    return products.filter(p => p.category === categoryName).length;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-12 pb-24 font-sans">
       <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white/40 backdrop-blur-md p-12 rounded-[56px] border border-white/40 shadow-soft relative overflow-hidden group">
          <div className="absolute -left-10 -top-10 w-48 h-48 bg-unicorn-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-black text-text-main italic tracking-tighter uppercase leading-none flex items-center gap-5">
              <div className="p-4 bg-gradient-to-br from-unicorn-indigo via-unicorn-purple to-unicorn-magenta rounded-3xl shadow-unicorn">
                 <Package size={32} className="text-white" />
              </div>
              Category Matrix
            </h2>
            <p className="text-text-silver mt-4 font-black uppercase tracking-[0.4em] text-[11px] opacity-60">Therapeutic Segment Neural Mapper • v2.0</p>
          </div>
          <button onClick={() => handleOpenModal('add')} className="bg-text-main hover:bg-black text-white px-12 py-5 rounded-[28px] text-[12px] font-black uppercase tracking-[0.3em] shadow-premium flex items-center gap-4 transition-all active:scale-95 group relative z-10">
             <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Instantiate Category
          </button>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {loading ? (
               <p className="text-text-silver font-black uppercase tracking-[0.5em] col-span-full py-20 text-center animate-pulse">Scanning Neural Nodes...</p>
            ) : categories.length === 0 ? (
               <p className="text-text-silver font-black uppercase tracking-[0.5em] col-span-full py-20 text-center animate-pulse">No segments detected in database.</p>
            ) : categories.map((cat) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={cat._id} 
                className="bg-white/40 backdrop-blur-md p-10 rounded-[48px] border border-white/40 shadow-soft hover:bg-white hover:shadow-premium transition-all duration-500 overflow-hidden relative group"
              >
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-unicorn-cyan/5 rounded-full blur-[50px] group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-16 h-16 bg-white shadow-soft rounded-3xl flex items-center justify-center border border-white group-hover:rotate-6 group-hover:shadow-unicorn transition-all duration-500 overflow-hidden">
                    {cat.imageUrl ? <img loading="lazy" src={cat.imageUrl} alt="" className="w-full h-full object-cover" /> : <Package size={28} className="text-unicorn-cyan" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleOpenModal('edit', cat)} className="p-4 bg-white/60 hover:bg-text-main hover:text-white rounded-2xl text-text-silver shadow-sm transition-all border border-white/40"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(cat._id)} className="p-4 bg-white/60 hover:bg-rose-500 hover:text-white rounded-2xl text-text-silver shadow-sm transition-all border border-white/40"><Trash2 size={18} /></button>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div>
                    <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase italic leading-none group-hover:text-unicorn-cyan transition-colors">{cat.name}</h3>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="px-3 py-1 bg-unicorn-cyan/10 text-unicorn-cyan rounded-lg text-[9px] font-black uppercase tracking-widest">{getProductCount(cat.name)} Products</div>
                      <div className="px-3 py-1 bg-unicorn-magenta/10 text-unicorn-magenta rounded-lg text-[9px] font-black uppercase tracking-widest">{cat.brands?.length || 0} Brands</div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-white/20">
                    <p className="text-[10px] font-black text-text-silver uppercase tracking-widest leading-relaxed line-clamp-2">
                       {cat.brands?.join(' • ') || 'No brands linked to this sector.'}
                    </p>
                  </div>

                  <button 
                    onClick={() => onManageProducts(cat.name)}
                    className="w-full py-4 bg-slate-50 hover:bg-text-main hover:text-white rounded-[24px] border border-slate-100 flex items-center justify-center gap-3 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-sm group/btn"
                  >
                    <Database size={14} className="text-unicorn-cyan group-hover/btn:text-white transition-colors" /> Manage Core Inventory
                    <ExternalLink size={12} className="opacity-40 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
       </div>

       {showModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-2xl animate-in fade-in duration-500">
            <div className="bg-white/80 backdrop-blur-3xl rounded-[64px] w-full max-w-2xl overflow-hidden shadow-unicorn border border-white/40 animate-in zoom-in-95 duration-500">
               <div className="p-12 border-b border-white/20 flex justify-between items-center bg-white/40">
                  <div className="space-y-2">
                     <h2 className="text-3xl font-black text-text-main italic uppercase tracking-tighter leading-none">{modalMode === 'add' ? 'Construct Segment' : 'Modify Topology'}</h2>
                     <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em]">Database Entry Protocol</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-5 bg-white/40 rounded-2xl hover:bg-rose-500 hover:text-white transition-all text-text-silver shadow-soft group">
                     <X size={24} className="group-hover:rotate-90 transition-transform" />
                  </button>
               </div>

               <div className="p-12 space-y-10">
                  <form onSubmit={handleSubmit} className="space-y-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-4">Segment Designation</label>
                        <input required type="text" placeholder="e.g. INFECTIOUS DISEASES" className="w-full bg-white/50 p-6 rounded-3xl font-black text-text-main border border-white focus:bg-white focus:shadow-unicorn focus:border-unicorn-cyan outline-none transition-all uppercase italic text-lg tracking-tighter" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value.toUpperCase() })} />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-4">Asset Image Pointer (URL)</label>
                        <input type="text" placeholder="https://assets.wedome.in/images/segment-01.png" className="w-full bg-white/50 p-6 rounded-3xl font-black text-unicorn-indigo border border-white focus:bg-white focus:shadow-unicorn outline-none transition-all text-sm" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-4">Brand Cluster Mapping (Comma Separated)</label>
                        <textarea rows="4" placeholder="Cipla, Mankind, Sun Pharma..." className="w-full bg-white/50 p-8 rounded-[40px] font-bold text-text-main border border-white focus:bg-white focus:shadow-unicorn outline-none transition-all resize-none text-sm tracking-tight leading-relaxed" value={formData.brandsStr} onChange={e => setFormData({ ...formData, brandsStr: e.target.value })} />
                     </div>

                     <button type="submit" className="w-full bg-text-main py-8 rounded-[32px] font-black uppercase tracking-[0.5em] text-white shadow-premium flex items-center justify-center gap-5 active:scale-95 transition-all text-[11px] group">
                        <Save className="w-5 h-5 group-hover:scale-125 transition-transform" /> Commit Segment to Ledger
                     </button>
                  </form>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default CategoriesCMS;
