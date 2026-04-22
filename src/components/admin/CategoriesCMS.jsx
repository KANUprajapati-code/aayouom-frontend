import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Edit, Trash2, Plus, X, Save, Sparkles, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/api';

const CategoriesCMS = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: '', imageUrl: '', brandsStr: '' });
  
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
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
            {categories.length === 0 && <p className="text-text-silver font-black uppercase tracking-[0.5em] col-span-full py-20 text-center animate-pulse">No segments detected in database.</p>}
            {categories.map((cat) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={cat._id} 
                className="bg-white/40 backdrop-blur-md rounded-[48px] p-10 border border-white/40 shadow-soft hover:bg-white hover:shadow-premium transition-all duration-500 group relative overflow-hidden"
              >
                 <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-unicorn-cyan/5 rounded-full blur-[50px] group-hover:scale-150 transition-transform duration-700"></div>
                 <div className="flex justify-between items-start relative z-10">
                    <div className="w-16 h-16 bg-white shadow-soft rounded-3xl flex items-center justify-center border border-white/60 group-hover:shadow-unicorn group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                       <Package size={28} className="text-unicorn-cyan" />
                    </div>
                    <div className="flex gap-3">
                       <button onClick={() => handleOpenModal('edit', cat)} className="p-4 bg-white/60 hover:bg-text-main hover:text-white text-text-silver rounded-2xl transition-all border border-white/40 shadow-sm"><Edit size={16}/></button>
                       <button onClick={() => handleDelete(cat._id)} className="p-4 bg-white/60 hover:bg-rose-500 hover:text-white text-text-silver rounded-2xl transition-all border border-white/40 shadow-sm"><Trash2 size={16}/></button>
                    </div>
                 </div>
                 <div className="mt-8 relative z-10">
                    <h4 className="text-2xl font-black text-text-main uppercase italic tracking-tighter leading-none group-hover:text-unicorn-cyan transition-colors">{cat.name}</h4>
                    <p className="text-[10px] font-black text-unicorn-magenta uppercase tracking-[0.3em] mt-3 italic">{(cat.brands || []).length} Brands Decoded</p>
                 </div>
                 <div className="pt-8 mt-8 border-t border-white/20 relative z-10">
                    <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] mb-5 ml-2">Associated Brands</p>
                    <div className="flex flex-wrap gap-3">
                       {(cat.brands || []).map(brand => (
                         <span key={brand} className="px-4 py-2 bg-text-main/5 border border-white/60 rounded-xl text-[10px] font-black text-text-main uppercase tracking-tighter group-hover:bg-white group-hover:border-unicorn-cyan/20 transition-all">{brand}</span>
                       ))}
                    </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
       </div>

       {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="bg-white/80 backdrop-blur-3xl rounded-[64px] w-full max-w-xl overflow-hidden shadow-unicorn border border-white/40 animate-in zoom-in-95 duration-500 relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-unicorn-magenta/5 rounded-full blur-[100px] pointer-events-none"></div>
             
             <div className="p-16 border-b border-white/20 flex justify-between items-center relative z-10">
                <div className="space-y-3">
                   <h2 className="text-4xl font-black text-text-main italic uppercase tracking-tighter leading-none">{modalMode === 'add' ? 'New Segment' : 'Modify Segment'}</h2>
                   <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em]">Category Mapper Alpha</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-6 bg-white/40 rounded-3xl hover:bg-rose-500 hover:text-white transition-all text-text-silver shadow-soft group">
                   <X className="group-hover:rotate-90 transition-transform" />
                </button>
             </div>
             <form onSubmit={handleSubmit} className="p-16 space-y-10 relative z-10">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-4">Therapeutic Designation</label>
                   <input required type="text" className="w-full bg-white/50 p-7 rounded-[32px] font-black text-text-main border border-white/40 outline-none focus:bg-white focus:shadow-unicorn transition-all uppercase text-lg tracking-tighter placeholder:text-text-silver/20 italic" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. CARDIOLOGY" />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-4">Visual Core URI</label>
                   <input type="text" className="w-full bg-white/50 p-6 rounded-3xl font-bold text-text-main border border-white/40 outline-none focus:bg-white focus:shadow-unicorn transition-all text-sm" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-4">Authorized Brands (Comma Stream)</label>
                   <textarea rows="3" className="w-full bg-white/50 p-8 rounded-[32px] font-bold text-text-main border border-white/40 outline-none focus:bg-white focus:shadow-unicorn transition-all text-sm resize-none leading-relaxed" value={formData.brandsStr} onChange={e => setFormData({...formData, brandsStr: e.target.value})} placeholder="Cipla, Sun Pharma, Abbott..."></textarea>
                </div>
                <button type="submit" className="w-full bg-text-main py-8 rounded-[40px] font-black uppercase tracking-[0.5em] text-white shadow-premium flex items-center justify-center gap-6 active:scale-95 transition-all text-xs hover:bg-black group">
                   <Save size={20} className="group-hover:scale-125 transition-transform" /> Commit Node
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesCMS;
