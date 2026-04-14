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
    images: [],
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
        image: product.image || '',
        images: product.images?.length > 0 ? product.images : (product.image ? [product.image] : []),
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
        image: '', images: [], description: '', stock: 0, showOnShop: true, showOnHome: false, showOnSchemes: false
      });
      setCurrentProductId(null);
    }
    setShowModal(true);
  };

  const [uploadingImage, setUploadingImage] = useState(false);
  const handleImageUpload = (file) => {
    if (!file) return;
    if (formData.images.length >= 5) {
      alert("Maximum 5 images allowed.");
      return;
    }
    setUploadingImage(true);
    
    // We must compress the image heavily to avoid Vercel's strict 4.5MB Serverless Payload Limits!
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = async () => {
        // Compress using Canvas
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Export heavily compressed webp (size will be < 500KB)
        const compressedBase64 = canvas.toDataURL('image/webp', 0.8);
        
        try {
          const token = localStorage.getItem('token');
          const { data } = await axios.post('https://ayuom-backend.vercel.app/api/upload', 
            { base64: compressedBase64 }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          setFormData(prev => {
            const newImages = [...prev.images, data.url];
            return {
              ...prev,
              images: newImages,
              image: newImages[0] || ''
            };
          });
        } catch (error) {
           console.error("Error uploading image:", error);
           alert(error.response?.data?.message || "Failed to upload image. Vercel connection error.");
        } finally {
          setUploadingImage(false);
        }
      };
    };
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: newImages,
        image: newImages[0] || ''
      };
    });
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* Header section with search and add product */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
         <div>
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Products Inventory</h2>
            <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Manage clinical stock and medicinal records</p>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl w-64 focus-within:bg-white focus-within:border-primary-500 transition-all">
               <Search size={16} className="text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search medicines..." 
                 className="bg-transparent border-none outline-none text-xs font-bold w-full text-slate-800 placeholder:text-slate-300" 
                 value={searchQuery} 
                 onChange={e => setSearchQuery(e.target.value)} 
               />
            </div>
            <button onClick={() => handleOpenModal('add')} className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all active:scale-95">
               <Plus className="w-4 h-4" /> Create Product
            </button>
         </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border border-emerald-100">
               {products.length}
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total SKUs</p>
               <p className="text-sm font-black text-slate-800 uppercase italic">Clinical Node Active</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border border-rose-100">
               {products.filter(p => !p.stock || p.stock <= 0).length}
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Exhausted Items</p>
               <p className="text-sm font-black text-slate-800 uppercase italic">Restock Required</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border border-amber-100">
               {products.filter(p => p.stock > 0 && p.stock < 10).length}
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Critical Stock</p>
               <p className="text-sm font-black text-slate-800 uppercase italic">Sub-optimal levels</p>
            </div>
         </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 w-1/3">Medicine Designation</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Segment</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Status</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Placements</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
               <tr>
                 <td colSpan="5" className="px-10 py-20 text-center text-slate-300 text-xs font-bold uppercase tracking-widest animate-pulse">Querying Grid Nodes...</td>
               </tr>
            ) : filteredProducts.length === 0 ? (
               <tr>
                 <td colSpan="5" className="px-10 py-20 text-center text-slate-300 text-xs font-bold uppercase tracking-widest">No records matched your query parameters.</td>
               </tr>
            ) : filteredProducts.map(p => (
              <tr key={p._id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-10 py-6 flex items-center gap-6">
                   <div className="w-14 h-14 bg-white rounded-xl p-2 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                      <img loading="lazy" src={p.image} className="max-w-full max-h-full object-contain" alt="" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-slate-900 font-black uppercase text-sm italic tracking-tighter truncate">{p.name}</p>
                      <p className="text-[10px] font-black text-slate-400 tracking-widest mt-1">ID: {p._id.slice(-6).toUpperCase()}</p>
                   </div>
                </td>
                <td className="px-10 py-6">
                   <span className="px-4 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                      {p.category}
                   </span>
                </td>
                <td className="px-10 py-6">
                   <div className="flex flex-col gap-1.5">
                      <p className={`text-sm font-black ${p.stock <= 0 ? 'text-rose-600' : p.stock < 10 ? 'text-amber-600' : 'text-emerald-700'}`}>
                         {p.stock} Units
                      </p>
                      <div className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
                         <div className={`h-full transition-all duration-1000 ${p.stock <= 0 ? 'bg-rose-500' : p.stock < 10 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (p.stock || 0) * 2)}%` }}></div>
                      </div>
                   </div>
                </td>
                <td className="px-10 py-6">
                   <div className="flex items-center gap-2">
                       {p.showOnShop && <span className="w-5 h-5 rounded-md bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center text-[10px] font-black" title="Shop">S</span>}
                       {p.showOnHome && <span className="w-5 h-5 rounded-md bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center text-[10px] font-black" title="Home Banner">H</span>}
                       {p.showOnSchemes && <span className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-[10px] font-black" title="Active Scheme">A</span>}
                   </div>
                </td>
                <td className="px-10 py-6 text-right space-x-2 whitespace-nowrap">
                   <button onClick={() => handleOpenModal('edit', p)} className="p-2.5 bg-slate-50 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all border border-slate-100"><Edit className="w-4 h-4" /></button>
                   <button onClick={() => handleDelete(p._id)} className="p-2.5 bg-slate-50 hover:bg-rose-500 rounded-xl text-slate-400 hover:text-white transition-all border border-slate-100"><Trash2 className="w-4 h-4" /></button>
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

                {/* SECTION 2: Commerce & Pricing */}
                <div>
                   <h3 className="text-sm font-black text-emerald-800 uppercase tracking-widest mb-6 flex items-center gap-2"><div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div> Commerce & Pricing</h3>
                   <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Procurement Price (₹)</label>
                          <input required type="number" placeholder="0.00" className="w-full bg-emerald-50/50 p-5 rounded-2xl font-black text-emerald-900 border border-emerald-100 outline-none focus:bg-emerald-50 focus:border-emerald-500 transition-all uppercase text-sm tracking-tight placeholder:text-slate-300" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Original MRP (₹)</label>
                          <input type="number" placeholder="0.00" className="w-full bg-surface-light p-5 rounded-2xl font-black text-slate-900 border border-surface-border outline-none focus:bg-white focus:border-primary-500 transition-all uppercase text-sm tracking-tight placeholder:text-slate-300" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} />
                       </div>
                   </div>
                </div>

                <div className="h-px w-full bg-surface-border"></div>

                {/* SECTION 3: Inventory Management */}
                <div>
                   <h3 className="text-sm font-black text-amber-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div> 
                      <Database className="w-4 h-4" /> Inventory Management
                   </h3>
                   <div className="bg-amber-50/30 border border-amber-100 p-8 rounded-[32px] space-y-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Stock Count</label>
                         <input 
                           required 
                           type="number" 
                           placeholder="Enter available units (e.g. 500)" 
                           className="w-full bg-white p-6 rounded-2xl font-black text-slate-900 border border-amber-200 outline-none focus:border-amber-500 transition-all text-lg tracking-tight shadow-sm" 
                           value={formData.stock} 
                           onChange={e => setFormData({...formData, stock: e.target.value})} 
                         />
                      </div>
                      <p className="text-[10px] font-bold text-amber-600/60 uppercase tracking-widest px-2">
                         Setting this to 0 will automatically mark the product as "Out of Stock" on the frontend.
                      </p>
                   </div>
                </div>

                <div className="h-px w-full bg-surface-border"></div>

                {/* SECTION 4: Media Assets */}
                <div>
                   <h3 className="text-sm font-black text-blue-800 uppercase tracking-widest mb-6 flex items-center gap-2"><div className="w-1.5 h-4 bg-blue-500 rounded-full"></div> Media Assets Gallery (Max 5)</h3>
                   <div className="space-y-4 bg-blue-50/50 p-6 rounded-[32px] border border-blue-100">
                      
                      {/* Image Preview Strip */}
                      {formData.images && formData.images.length > 0 && (
                        <div className="flex flex-wrap gap-4 mb-4">
                          {formData.images.map((imgUrl, idx) => (
                            <div key={idx} className="relative w-24 h-24 bg-white rounded-2xl border border-blue-200 overflow-hidden shadow-sm group">
                              <img src={imgUrl} className="w-full h-full object-contain p-2" alt={`Slot ${idx+1}`} />
                              <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 w-6 h-6 bg-white/90 backdrop-blur text-rose-500 rounded-full border border-rose-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white">
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {(!formData.images || formData.images.length < 5) && (
                        <div>
                          <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed ${uploadingImage ? 'border-primary-400 bg-primary-50' : 'border-blue-200 bg-white hover:bg-blue-50 hover:border-blue-400'} rounded-2xl cursor-pointer transition-all group`}>
                             <div className="flex flex-col items-center justify-center pt-5 pb-6">
                               {uploadingImage ? (
                                 <div className="text-primary-600 font-bold text-[10px] uppercase tracking-widest animate-pulse flex flex-col items-center gap-2">
                                   <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                                   Compressing & Uploading...
                                 </div>
                               ) : (
                                 <>
                                   <Plus className="w-6 h-6 text-blue-400 group-hover:text-blue-500 mb-2 transition-colors" />
                                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Select Image File</p>
                                 </>
                               )}
                             </div>
                             <input type="file" className="hidden" accept="image/*" disabled={uploadingImage} onChange={(e) => handleImageUpload(e.target.files[0])} />
                          </label>
                        </div>
                      )}
                      
                      <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">The first image will act as the primary Master UI thumbnail.</p>
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
