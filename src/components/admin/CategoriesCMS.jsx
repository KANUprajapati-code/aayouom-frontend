import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Edit, Trash2, Plus, X, Save, Database, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/api';

const CategoriesCMS = ({ onManageProducts }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [allBrands, setAllBrands] = useState([]); // Fetch all brands for selection
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: '', imageUrl: '', brands: [] });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
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
      const [catRes, prodRes, brandRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/categories`),
        axios.get(`${API_BASE_URL}/products`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/brands`).catch(() => ({ data: [] }))
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
      setAllBrands(brandRes.data);
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
        brands: cat.brands || []
      });
      setCurrentId(cat._id);
    } else {
      setFormData({ name: '', imageUrl: '', brands: [] });
      setCurrentId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name: formData.name, imageUrl: formData.imageUrl, brands: formData.brands };
      
      if (modalMode === 'add') {
        const res = await axios.post(`${API_BASE_URL}/categories`, payload, getAuthConfig());
        setCategories([...categories, res.data]);
      } else {
        const res = await axios.put(`${API_BASE_URL}/categories/${currentId}`, payload, getAuthConfig());
        setCategories(categories.map(c => c._id === currentId ? res.data : c));
      }
      setShowModal(false);
    } catch (err) {
      alert('Error saving category.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/categories/${id}`, getAuthConfig());
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      alert('Error deleting category.');
    }
  };

  const getProductCount = (categoryName) => {
    return products.filter(p => p.category === categoryName).length;
  };

  if (loading) return <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Scanning Segments...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
               <Package className="text-blue-600" /> Therapy Matrix
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage therapeutic clinical segments and brand associations.</p>
          </div>
          <button onClick={() => handleOpenModal('add')} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all">
             <Plus size={18} /> Add Segment
          </button>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                  {cat.imageUrl ? <img src={cat.imageUrl} className="w-full h-full object-cover" /> : <Package size={24} className="text-slate-300" />}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal('edit', cat)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(cat._id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase tracking-tight">{cat.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{getProductCount(cat.name)} Items</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{cat.brands?.length || 0} Brands</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2 uppercase font-semibold">
                   {cat.brands?.join(' • ') || 'No brands linked.'}
                </p>
                <button onClick={() => onManageProducts(cat.name)} className="w-full py-2.5 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-lg border border-slate-100 text-[10px] font-bold uppercase tracking-widest transition-all">
                   Manage Inventory
                </button>
              </div>
            </div>
          ))}
       </div>

       {showModal && (
         <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h2 className="font-bold text-slate-900">{modalMode === 'add' ? 'New Segment' : 'Edit Segment'}</h2>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
               </div>
               <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500">Segment Name</label>
                     <input required type="text" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 font-bold outline-none focus:bg-white focus:border-blue-600 transition-all uppercase" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value.toUpperCase() })} />
                  </div>
                   <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-500">Segment Identity (Icon)</label>
                      <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                         <div className="w-16 h-16 bg-white rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                            {uploading ? <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div> : formData.imageUrl ? <img src={formData.imageUrl} className="w-full h-full object-cover" /> : <Package className="text-slate-200" />}
                         </div>
                         <div className="flex-grow space-y-2">
                            <input type="text" className="w-full bg-white p-2 rounded-lg border border-slate-200 text-xs outline-none" placeholder="Icon URL..." value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                            <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-blue-700 transition-all">
                               {uploading ? 'Processing...' : 'Upload Icon'}
                               <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                  const file = e.target.files[0]; if (!file) return;
                                  setUploading(true);
                                  const reader = new FileReader(); reader.readAsDataURL(file);
                                  reader.onload = (ev) => {
                                     const img = new Image(); img.src = ev.target.result;
                                     img.onload = async () => {
                                        const canvas = document.createElement('canvas'); canvas.width = 400; canvas.height = 400;
                                        canvas.getContext('2d').drawImage(img, 0, 0, 400, 400);
                                        const res = await axios.post(`${API_BASE_URL}/upload`, { base64: canvas.toDataURL('image/webp', 0.8) }, getAuthConfig());
                                        setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
                                        setUploading(false);
                                     };
                                  };
                               }} />
                            </label>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-500">Associated Brands ({formData.brands?.length || 0})</label>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200 no-scrollbar">
                         {allBrands.map(brand => (
                           <label key={brand._id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${formData.brands?.includes(brand.name) ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                              <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={formData.brands?.includes(brand.name)}
                                onChange={() => {
                                  if (formData.brands?.includes(brand.name)) {
                                    setFormData(prev => ({ ...prev, brands: prev.brands.filter(b => b !== brand.name) }));
                                  } else {
                                    setFormData(prev => ({ ...prev, brands: [...(prev.brands || []), brand.name] }));
                                  }
                                }}
                              />
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${formData.brands?.includes(brand.name) ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                                 {formData.brands?.includes(brand.name) && <Plus size={10} className="text-white" />}
                              </div>
                              <span className="text-xs font-bold text-slate-700">{brand.name}</span>
                           </label>
                         ))}
                      </div>
                   </div>
                   <button type="submit" disabled={uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-50">Save Segment</button>
               </form>
            </div>
         </div>
       )}
    </div>
  );
};

export default CategoriesCMS;
