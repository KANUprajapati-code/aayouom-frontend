import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X, Search, Database, LayoutGrid, Sparkles } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const ProductsCMS = ({ initialFilter = 'All' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentProductId, setCurrentProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
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
         axios.get(`${API_BASE_URL}/products`),
         axios.get(`${API_BASE_URL}/categories`).catch(() => ({ data: [] }))
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
        brand: product.brand || '',
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
        name: '', brand: '', price: '', originalPrice: '', category: 'Antibiotics', 
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
          const { data } = await axios.post(`${API_BASE_URL}/upload`, 
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
      if (!categories.includes(formData.category)) {
          await axios.post(`${API_BASE_URL}/categories`, { name: formData.category, slug: formData.category.toLowerCase().replace(/\s+/g, '-') }, getAuthConfig()).catch(err => console.log(err));
          setCategories(prev => [...prev, formData.category]);
      }

      if (modalMode === 'add') {
        const res = await axios.post(`${API_BASE_URL}/products`, formData, getAuthConfig());
        setProducts([res.data, ...products]);
        alert('Product added completely!');
      } else {
        const res = await axios.put(`${API_BASE_URL}/products/${currentProductId}`, formData, getAuthConfig());
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
      await axios.delete(`${API_BASE_URL}/products/${id}`, getAuthConfig());
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
      {/* Header section with search and add product */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white/40 backdrop-blur-md p-10 rounded-[40px] border border-white/40 shadow-soft">
         <div>
            <h2 className="text-4xl font-black text-text-main italic tracking-tighter uppercase leading-none flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-unicorn-cyan to-unicorn-magenta rounded-2xl shadow-unicorn">
                 <Database size={24} className="text-white" />
              </div>
              Inventory Control
            </h2>
            <p className="text-text-silver mt-3 font-black uppercase tracking-[0.3em] text-[10px]">Synchronized Multi-Node Medicinal Ledger</p>
         </div>
         <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4 bg-white/50 backdrop-blur border border-white/20 px-6 py-4 rounded-3xl w-80 focus-within:bg-white focus-within:shadow-medium transition-all group">
               <Search size={18} className="text-text-silver group-focus-within:text-unicorn-cyan" />
               <input 
                 type="text" 
                 placeholder="Search clinical archives..." 
                 className="bg-transparent border-none outline-none text-[11px] font-black w-full text-text-main placeholder:text-text-silver uppercase tracking-widest" 
                 value={searchQuery} 
                 onChange={e => setSearchQuery(e.target.value)} 
               />
            </div>
            <button onClick={() => handleOpenModal('add')} className="bg-text-main hover:bg-black text-white px-10 py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-premium flex items-center gap-3 transition-all active:scale-95 group">
               <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Instantiate Product
            </button>
         </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white/40 backdrop-blur-md p-8 rounded-[40px] border border-white/40 shadow-soft flex items-center gap-8 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-unicorn-cyan/5 rounded-full blur-2xl"></div>
            <div className="w-16 h-16 bg-unicorn-cyan/10 text-unicorn-cyan rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border border-unicorn-cyan/20">
               {products.length}
            </div>
            <div>
               <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.2em] mb-1">Total Active SKUs</p>
               <p className="text-sm font-black text-text-main uppercase italic">Global Sync Ready</p>
            </div>
         </div>
         <div className="bg-white/40 backdrop-blur-md p-8 rounded-[40px] border border-white/40 shadow-soft flex items-center gap-8 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-rose-500/5 rounded-full blur-2xl"></div>
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border border-rose-500/20">
               {products.filter(p => !p.stock || p.stock <= 0).length}
            </div>
            <div>
               <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.2em] mb-1">Exhausted Nodes</p>
               <p className="text-sm font-black text-text-main uppercase italic">Re-instantiation Required</p>
            </div>
         </div>
         <div className="bg-white/40 backdrop-blur-md p-8 rounded-[40px] border border-white/40 shadow-soft flex items-center gap-8 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-unicorn-magenta/5 rounded-full blur-2xl"></div>
            <div className="w-16 h-16 bg-unicorn-magenta/10 text-unicorn-magenta rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border border-unicorn-magenta/20">
               {products.filter(p => p.stock > 0 && p.stock < 10).length}
            </div>
            <div>
               <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.2em] mb-1">Critical Levels</p>
               <p className="text-sm font-black text-text-main uppercase italic">Sub-optimal Flux</p>
            </div>
         </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white/40 backdrop-blur-md rounded-[56px] border border-white/40 shadow-soft overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/30 border-b border-white/20">
            <tr>
              <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-text-silver w-1/3">Medicine Designation</th>
              <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-text-silver">Segment</th>
              <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-text-silver">Inventory Status</th>
              <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-text-silver">Placements</th>
              <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-text-silver text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? (
               <tr>
                 <td colSpan="5" className="px-12 py-32 text-center text-text-silver text-xs font-black uppercase tracking-[0.5em] animate-pulse">Querying Quantum Ledger...</td>
               </tr>
            ) : filteredProducts.length === 0 ? (
               <tr>
                 <td colSpan="5" className="px-12 py-32 text-center text-text-silver text-xs font-black uppercase tracking-[0.5em]">No matching records found in active nodes.</td>
               </tr>
            ) : filteredProducts.map(p => (
              <tr key={p._id} className="hover:bg-white/30 transition-all group">
                <td className="px-12 py-8 flex items-center gap-8">
                   <div className="w-16 h-16 bg-white/60 rounded-3xl p-3 border border-white/40 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex items-center justify-center shrink-0 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-unicorn-cyan/10 to-unicorn-magenta/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img loading="lazy" src={p.image} className="max-w-full max-h-full object-contain relative z-10" alt="" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-text-main font-black uppercase text-base italic tracking-tighter truncate leading-tight group-hover:text-unicorn-cyan transition-colors">{p.name}</p>
                      <p className="text-[10px] font-black text-text-silver tracking-[0.2em] mt-2 font-mono">ID: {p._id.slice(-8).toUpperCase()}</p>
                   </div>
                </td>
                <td className="px-12 py-8">
                   <span className="px-5 py-2 bg-text-main/5 border border-white/20 text-text-main rounded-xl text-[10px] font-black uppercase tracking-[0.2em] italic">
                      {p.category}
                   </span>
                </td>
                <td className="px-12 py-8">
                   <div className="flex flex-col gap-2">
                      <p className={`text-base font-black italic ${p.stock <= 0 ? 'text-rose-500' : p.stock < 10 ? 'text-secondary-500' : 'text-unicorn-cyan'}`}>
                         {p.stock} Units
                      </p>
                      <div className="h-2 w-28 bg-white/40 rounded-full overflow-hidden shadow-inner">
                         <div className={`h-full transition-all duration-1000 ${p.stock <= 0 ? 'bg-rose-500' : p.stock < 10 ? 'bg-secondary-500' : 'bg-gradient-to-r from-unicorn-cyan to-unicorn-purple'}`} style={{ width: `${Math.min(100, (p.stock || 0) * 2)}%` }}></div>
                      </div>
                   </div>
                </td>
                <td className="px-12 py-8">
                   <div className="flex items-center gap-3">
                       {p.showOnShop && <div className="w-8 h-8 rounded-xl bg-unicorn-cyan/10 text-unicorn-cyan border border-unicorn-cyan/20 flex items-center justify-center text-xs font-black shadow-sm" title="Shop">S</div>}
                       {p.showOnHome && <div className="w-8 h-8 rounded-xl bg-unicorn-magenta/10 text-unicorn-magenta border border-unicorn-magenta/20 flex items-center justify-center text-xs font-black shadow-sm" title="Home">H</div>}
                       {p.showOnSchemes && <div className="w-8 h-8 rounded-xl bg-unicorn-purple/10 text-unicorn-purple border border-unicorn-purple/20 flex items-center justify-center text-xs font-black shadow-sm" title="Schemes">A</div>}
                   </div>
                </td>
                <td className="px-12 py-8 text-right space-x-3 whitespace-nowrap">
                   <button onClick={() => handleOpenModal('edit', p)} className="p-4 bg-white/40 hover:bg-text-main hover:text-white rounded-2xl text-text-silver transition-all border border-white/20 shadow-sm"><Edit className="w-5 h-5" /></button>
                   <button onClick={() => handleDelete(p._id)} className="p-4 bg-white/40 hover:bg-rose-500 hover:text-white rounded-2xl text-text-silver transition-all border border-white/20 shadow-sm"><Trash2 className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="bg-white/80 backdrop-blur-3xl rounded-[64px] w-full max-w-4xl overflow-hidden shadow-unicorn border border-white/40 animate-in zoom-in-95 duration-500 relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-unicorn-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-unicorn-magenta/5 rounded-full blur-[100px] pointer-events-none"></div>
             
             <div className="p-16 border-b border-white/20 flex justify-between items-center relative z-10">
                <div className="space-y-3">
                   <h2 className="text-4xl font-black text-text-main italic uppercase tracking-tighter leading-none">{modalMode === 'add' ? 'Instantiate Record' : 'Modify Record'}</h2>
                   <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em]">Master Ethereal Editor Alpha</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-6 bg-white/40 rounded-3xl hover:bg-rose-500 hover:text-white transition-all text-text-silver shadow-soft group">
                   <X className="group-hover:rotate-90 transition-transform" size={24} />
                </button>
             </div>
             <form onSubmit={handleSubmit} className="p-16 space-y-12 max-h-[65vh] overflow-y-auto custom-scrollbar relative z-10">
                {/* SECTION 1: Basic Information */}
                <div>
                   <h3 className="text-xs font-black text-text-main uppercase tracking-[0.4em] mb-8 flex items-center gap-4 italic"><Sparkles className="text-unicorn-cyan" size={16}/> Essential Schematics</h3>
                   <div className="space-y-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.3em] ml-2">Medicine Nomenclature</label>
                        <input required type="text" placeholder="e.g. AUGMENTIN 625 DUO" className="w-full bg-white/50 p-6 rounded-3xl font-black text-text-main border border-white/40 outline-none focus:bg-white focus:shadow-unicorn transition-all uppercase text-base tracking-tight placeholder:text-text-silver/40" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.3em] ml-2">Manufacturing Brand</label>
                           <input required type="text" placeholder="e.g. GSK, CIPLA..." className="w-full bg-white/50 p-6 rounded-3xl font-black text-text-main border border-white/40 outline-none focus:bg-white focus:shadow-unicorn transition-all text-base tracking-tight placeholder:text-text-silver/40" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.3em] ml-2">Therapeutic Segment</label>
                           <select required className="w-full bg-white/50 p-6 rounded-3xl font-black text-text-main border border-white/40 outline-none focus:bg-white transition-all appearance-none cursor-pointer" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                             {categories.length === 0 && <option value="General">General</option>}
                             {categories.map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.3em] ml-2">Clinical Brief</label>
                        <textarea rows="3" placeholder="Enter clinical directives, contraindications, and active compounds..." className="w-full bg-white/50 p-6 rounded-3xl font-bold text-text-main border border-white/40 outline-none focus:bg-white focus:shadow-unicorn transition-all text-sm tracking-tight placeholder:text-text-silver/40 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                     </div>
                   </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

                {/* SECTION 2: Commerce & Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div>
                     <h3 className="text-xs font-black text-unicorn-cyan uppercase tracking-[0.4em] mb-8 flex items-center gap-4 italic">Pricing Matrix</h3>
                     <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.3em] ml-2">Sale Terminal Price (₹)</label>
                            <input required type="number" placeholder="0.00" className="w-full bg-unicorn-cyan/5 p-6 rounded-3xl font-black text-unicorn-cyan border border-unicorn-cyan/10 outline-none focus:bg-white focus:shadow-unicorn transition-all text-base tracking-tight placeholder:text-unicorn-cyan/30" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.3em] ml-2">Master MRP (₹)</label>
                            <input type="number" placeholder="0.00" className="w-full bg-white/50 p-6 rounded-3xl font-black text-text-main border border-white/40 outline-none focus:bg-white focus:shadow-unicorn transition-all text-base tracking-tight placeholder:text-text-silver/40" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} />
                         </div>
                     </div>
                   </div>
                   <div>
                     <h3 className="text-xs font-black text-secondary-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-4 italic">Flux Management</h3>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.3em] ml-2">Current Unit Count</label>
                        <input required type="number" placeholder="000" className="w-full bg-white/50 p-6 rounded-3xl font-black text-text-main border border-white/40 outline-none focus:bg-white focus:shadow-unicorn transition-all text-2xl tracking-tighter" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                     </div>
                   </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

                {/* SECTION 4: Media Assets */}
                <div>
                   <h3 className="text-xs font-black text-unicorn-magenta uppercase tracking-[0.4em] mb-8 flex items-center gap-4 italic">Visual Encoding (Max 5)</h3>
                   <div className="bg-white/40 p-8 rounded-[40px] border border-white/40 space-y-6">
                      {formData.images && formData.images.length > 0 && (
                        <div className="flex flex-wrap gap-6">
                          {formData.images.map((imgUrl, idx) => (
                            <div key={idx} className="relative w-28 h-28 bg-white/60 rounded-[28px] border border-white/40 overflow-hidden shadow-soft group">
                              <img src={imgUrl} className="w-full h-full object-contain p-3" alt={`Slot ${idx+1}`} />
                              <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-md text-rose-500 rounded-full border border-rose-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white">
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {(!formData.images || formData.images.length < 5) && (
                        <label className={`flex flex-col items-center justify-center w-full h-32 border-3 border-dashed ${uploadingImage ? 'border-unicorn-cyan/40 bg-unicorn-cyan/5' : 'border-white/60 bg-white/40 hover:bg-white/80 hover:border-unicorn-cyan/60'} rounded-[40px] cursor-pointer transition-all group`}>
                          {uploadingImage ? (
                            <div className="text-unicorn-cyan font-black text-[10px] uppercase tracking-[0.4em] animate-pulse flex flex-col items-center gap-4">
                              <div className="w-6 h-6 border-3 border-unicorn-cyan border-t-transparent rounded-full animate-spin"></div>
                              Encoding Assets...
                            </div>
                          ) : (
                            <>
                              <Plus className="w-8 h-8 text-text-silver group-hover:text-unicorn-cyan group-hover:scale-110 transition-all" />
                              <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] mt-3">Upload Media DNA</p>
                            </>
                          )}
                          <input type="file" className="hidden" accept="image/*" disabled={uploadingImage} onChange={(e) => handleImageUpload(e.target.files[0])} />
                        </label>
                      )}
                   </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

                {/* SECTION 5: Placements */}
                <div>
                   <h3 className="text-xs font-black text-unicorn-purple uppercase tracking-[0.4em] mb-8 flex items-center gap-4 italic">UI Node Deployment</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <label className={`flex items-center gap-6 p-8 rounded-[32px] border transition-all cursor-pointer shadow-soft group ${formData.showOnShop ? 'bg-unicorn-cyan/10 border-unicorn-cyan/40 shadow-unicorn/10' : 'bg-white/40 border-white/40 opacity-70'}`}>
                         <input type="checkbox" className="w-6 h-6 accent-unicorn-cyan cursor-pointer" checked={formData.showOnShop} onChange={e => setFormData({...formData, showOnShop: e.target.checked})} />
                         <div>
                            <p className="font-black text-text-main text-base italic group-hover:translate-x-1 transition-transform">Catalog</p>
                            <p className="text-[9px] text-text-silver font-black uppercase tracking-[0.2em] mt-1">Main Database</p>
                         </div>
                      </label>
                      <label className={`flex items-center gap-6 p-8 rounded-[32px] border transition-all cursor-pointer shadow-soft group ${formData.showOnHome ? 'bg-unicorn-magenta/10 border-unicorn-magenta/40 shadow-unicorn/10' : 'bg-white/40 border-white/40 opacity-70'}`}>
                         <input type="checkbox" className="w-6 h-6 accent-unicorn-magenta cursor-pointer" checked={formData.showOnHome} onChange={e => setFormData({...formData, showOnHome: e.target.checked})} />
                         <div>
                            <p className="font-black text-text-main text-base italic group-hover:translate-x-1 transition-transform">Promoted</p>
                            <p className="text-[9px] text-text-silver font-black uppercase tracking-[0.2em] mt-1">Landing Node</p>
                         </div>
                      </label>
                      <label className={`flex items-center gap-6 p-8 rounded-[32px] border transition-all cursor-pointer shadow-soft group ${formData.showOnSchemes ? 'bg-unicorn-purple/10 border-unicorn-purple/40 shadow-unicorn/10' : 'bg-white/40 border-white/40 opacity-70'}`}>
                         <input type="checkbox" className="w-6 h-6 accent-unicorn-purple cursor-pointer" checked={formData.showOnSchemes} onChange={e => setFormData({...formData, showOnSchemes: e.target.checked})} />
                         <div>
                            <p className="font-black text-text-main text-base italic group-hover:translate-x-1 transition-transform">Active Scheme</p>
                            <p className="text-[9px] text-text-silver font-black uppercase tracking-[0.2em] mt-1">Primary Tier</p>
                         </div>
                      </label>
                   </div>
                </div>

                <button type="submit" className="w-full bg-text-main py-8 rounded-[40px] font-black uppercase tracking-[0.5em] text-white shadow-premium flex items-center justify-center gap-6 active:scale-95 transition-all text-xs hover:bg-black group">
                   <Save className="w-6 h-6 group-hover:scale-125 transition-transform" /> Commit Changes to Hub
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsCMS;
