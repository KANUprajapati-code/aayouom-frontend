/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Edit, Trash2, Plus, X, Save } from 'lucide-react';

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
      const res = await axios.get('https://ayuom-backend.vercel.app/api/categories');
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
        const res = await axios.post('https://ayuom-backend.vercel.app/api/categories', payload, getAuthConfig());
        setCategories([...categories, res.data]);
      } else {
        const res = await axios.put(`https://ayuom-backend.vercel.app/api/categories/${currentId}`, payload, getAuthConfig());
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
      await axios.delete(`https://ayuom-backend.vercel.app/api/categories/${id}`, getAuthConfig());
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      alert('Error deleting category: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
       <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Category Matrix</h2>
            <p className="text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Manage Therapeutic Segments and Brands Dynamically</p>
          </div>
          <button onClick={() => handleOpenModal('add')} className="btn-primary px-8 py-4 rounded-2xl text-[10px] shadow-premium flex flex-row items-center gap-2">
            <Plus className="w-4 h-4" /> New Main Category
          </button>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.length === 0 && <p className="text-slate-500">No categories found in database.</p>}
          {categories.map((cat) => (
            <div key={cat._id} className="card !p-8 space-y-6">
               <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center border border-primary-100">
                     <Package size={24} />
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => handleOpenModal('edit', cat)} className="p-2 bg-surface-light hover:bg-primary-50 text-slate-400 hover:text-primary-600 rounded-lg transition-all"><Edit size={14}/></button>
                     <button onClick={() => handleDelete(cat._id)} className="p-2 bg-surface-light hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all"><Trash2 size={14}/></button>
                  </div>
               </div>
               <div>
                  <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{cat.name}</h4>
                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1 italic">{(cat.brands || []).length} Brands Synced</p>
               </div>
               <div className="pt-4 border-t border-surface-border">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Associated Brands</p>
                  <div className="flex flex-wrap gap-2">
                     {(cat.brands || []).map(brand => (
                       <span key={brand} className="px-3 py-1.5 bg-surface-light border border-surface-border rounded-lg text-[10px] font-bold text-slate-600">{brand}</span>
                     ))}
                  </div>
               </div>
            </div>
          ))}
       </div>

       {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-3xl border border-white/20">
             <div className="p-8 border-b border-surface-border flex justify-between items-center bg-surface-light">
                <h2 className="text-2xl font-black text-primary-600 italic uppercase">{modalMode === 'add' ? 'New Category' : 'Edit Category'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 bg-white rounded-xl hover:bg-rose-500 hover:text-white transition-all text-slate-300">
                   <X />
                </button>
             </div>
             <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Therapeutic Category Name</label>
                   <input required type="text" className="w-full bg-surface-light p-4 rounded-xl font-black text-slate-900 outline-none focus:bg-white focus:border-primary-500 border border-transparent transition-all uppercase text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category Image URL</label>
                   <input type="text" className="w-full bg-surface-light p-4 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-primary-500 border border-transparent transition-all text-sm" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brands (Comma Separated)</label>
                   <textarea rows="3" className="w-full bg-surface-light p-4 rounded-xl font-bold text-slate-700 outline-none focus:bg-white focus:border-primary-500 border border-transparent transition-all text-sm resize-none" value={formData.brandsStr} onChange={e => setFormData({...formData, brandsStr: e.target.value})} placeholder="Cipla, Sun Pharma, Abbott..."></textarea>
                </div>
                <button type="submit" className="w-full bg-primary-600 py-4 rounded-xl font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 hover:bg-primary-500">
                   <Save size={18} /> Commit Category
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesCMS;
