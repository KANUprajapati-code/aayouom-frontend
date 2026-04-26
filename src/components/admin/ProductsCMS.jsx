import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X, Search, Database, LayoutGrid, Package, Check, Tag } from 'lucide-react';
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
    name: '', brand: '', price: '', originalPrice: '', category: 'Medicines',
    image: '', images: [], description: '', stock: 0, showOnShop: true, showOnHome: false, showOnSchemes: false
  });

  const [categories, setCategories] = useState([]);
  const [brandList, setBrandList] = useState([]);

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
      const [prodRes, catRes, brandRes] = await Promise.all([
         axios.get(`${API_BASE_URL}/products`),
         axios.get(`${API_BASE_URL}/categories`).catch(() => ({ data: [] })),
         axios.get(`${API_BASE_URL}/brands`).catch(() => ({ data: [] }))
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data?.map(c => c.name) || ['Medicines', 'Wellness']);
      setBrandList(brandRes.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, product = null) => {
    setModalMode(mode);
    if (mode === 'edit' && product) {
      setFormData({ ...product });
      setCurrentProductId(product._id);
    } else {
      setFormData({ name: '', brand: '', price: '', originalPrice: '', category: 'Medicines', image: '', images: [], description: '', stock: 0, showOnShop: true, showOnHome: false, showOnSchemes: false });
      setCurrentProductId(null);
    }
    setShowModal(true);
  };

  const [uploadingImage, setUploadingImage] = useState(false);
  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedBase64 = canvas.toDataURL('image/webp', 0.8);
          
          try {
            const { data } = await axios.post(`${API_BASE_URL}/upload`, { base64: compressedBase64 }, getAuthConfig());
            setFormData(prev => ({ ...prev, image: data.url, images: [...prev.images, data.url] }));
          } catch (err) {
            console.error('Upload error:', err);
            alert("Upload failed. Image might be too large.");
          } finally {
            setUploadingImage(false);
          }
        };
      };
    } catch (err) {
      console.error('File reading error:', err);
      alert("Error processing file.");
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await axios.post(`${API_BASE_URL}/products`, formData, getAuthConfig());
      } else {
        await axios.put(`${API_BASE_URL}/products/${currentProductId}`, formData, getAuthConfig());
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Save error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Error saving product.';
      alert(`Commit Failed: ${errorMsg}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`, getAuthConfig());
      fetchData();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === 'All' || p.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Inventory...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Database className="text-blue-600" /> Catalog Management
           </h2>
           <p className="text-slate-500 text-sm mt-1">Manage {products.length} active SKUs across {categories.length} segments.</p>
        </div>
        <button onClick={() => handleOpenModal('add')} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all">
           <Plus size={18} /> Add New Entry
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
         <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search by name or brand..." className="w-full bg-slate-50 pl-12 pr-4 py-3 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-blue-600 transition-all text-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
         </div>
         <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {['All', ...categories].map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-5 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeFilter === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{cat}</button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filteredProducts.map(p => (
           <div key={p._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden">
              <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-6 relative">
                 {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <Package className="m-auto mt-12 text-slate-100" size={48} />}
                 <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-[9px] font-bold border border-slate-200 uppercase tracking-tighter">{p.category}</div>
              </div>
              <div className="space-y-1 mb-6">
                 <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{p.brand}</p>
                 <h3 className="font-bold text-slate-900 truncate text-sm">{p.name}</h3>
                 <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900">₹{p.price}</span>
                    {p.originalPrice && <span className="text-xs text-slate-400 line-through">₹{p.originalPrice}</span>}
                 </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                 <p className={`text-[10px] font-bold uppercase tracking-widest ${p.stock <= 10 ? 'text-rose-500' : 'text-emerald-600'}`}>STOCK: {p.stock}</p>
                 <div className="flex gap-2">
                    <button onClick={() => handleOpenModal('edit', p)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all border border-slate-200"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-2 bg-slate-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all border border-slate-200"><Trash2 size={14} /></button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-end animate-in fade-in duration-300">
           <div className="w-full max-w-2xl h-screen bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <div>
                    <h2 className="text-xl font-bold text-slate-900">{modalMode === 'add' ? 'Construct Product Entry' : 'Update Core SKU'}</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Database Access Required</p>
                 </div>
                 <button onClick={() => setShowModal(false)} className="p-3 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"><X size={24} /></button>
              </div>
              <div className="flex-grow overflow-y-auto p-12 space-y-8 scrollbar-hide">
                 <form id="productForm" onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">Product Name</label>
                          <input required className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-blue-600 transition-all font-bold" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">Brand</label>
                          <select 
                            required 
                            className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-blue-600 transition-all font-bold" 
                            value={formData.brand} 
                            onChange={e => setFormData({ ...formData, brand: e.target.value })}
                          >
                             <option value="">Select Brand</option>
                             {brandList.map(b => (
                               <option key={b._id} value={b.name}>{b.name}</option>
                             ))}
                          </select>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">Regular Price (₹)</label>
                          <input required type="number" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-blue-600 transition-all font-bold" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">Original Price (₹) - For Discount</label>
                          <input type="number" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-blue-600 transition-all font-bold" value={formData.originalPrice} onChange={e => setFormData({ ...formData, originalPrice: e.target.value })} />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">Category</label>
                          <select required className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-blue-600 transition-all font-bold" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                             {categories.map(cat => (
                               <option key={cat} value={cat}>{cat}</option>
                             ))}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">Stock Quantity</label>
                          <input required type="number" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-blue-600 transition-all font-bold" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500">Product Description</label>
                       <textarea required rows="4" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-blue-600 transition-all font-medium text-sm resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>

                    <div className="space-y-4">
                       <label className="text-xs font-bold text-slate-500">Product Visuals</label>
                       <div className="grid grid-cols-4 gap-4">
                          <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-blue-400 transition-all group">
                             {uploadingImage ? (
                               <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                             ) : (
                               <>
                                 <Plus className="text-slate-400 group-hover:text-blue-600" size={24} />
                                 <span className="text-[10px] font-bold text-slate-400 mt-2">UPLOAD</span>
                               </>
                             )}
                             <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e.target.files[0])} disabled={uploadingImage} />
                          </label>
                          {formData.images?.map((img, idx) => (
                            <div key={idx} className="aspect-square bg-slate-50 rounded-2xl overflow-hidden relative group border border-slate-100">
                               <img src={img} className="w-full h-full object-cover" />
                               <button 
                                 type="button"
                                 onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx), image: prev.images[0] === img ? prev.images[1] || '' : prev.image }))} 
                                 className="absolute top-1 right-1 p-1 bg-white/80 backdrop-blur-sm text-rose-500 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                               >
                                  <X size={14} />
                               </button>
                               {formData.image === img && (
                                 <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">PRIMARY</div>
                               )}
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Configuration</h4>
                       <div className="flex flex-wrap gap-6">
                          <label className="flex items-center gap-3 cursor-pointer group">
                             <div 
                               onClick={() => setFormData({ ...formData, showOnShop: !formData.showOnShop })}
                               className={`w-10 h-6 rounded-full p-1 transition-all ${formData.showOnShop ? 'bg-blue-600' : 'bg-slate-300'}`}
                             >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${formData.showOnShop ? 'translate-x-4' : 'translate-x-0'}`} />
                             </div>
                             <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Show on Shop</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group">
                             <div 
                               onClick={() => setFormData({ ...formData, showOnHome: !formData.showOnHome })}
                               className={`w-10 h-6 rounded-full p-1 transition-all ${formData.showOnHome ? 'bg-emerald-600' : 'bg-slate-300'}`}
                             >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${formData.showOnHome ? 'translate-x-4' : 'translate-x-0'}`} />
                             </div>
                             <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Show on Homepage</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group">
                             <div 
                               onClick={() => setFormData({ ...formData, showOnSchemes: !formData.showOnSchemes })}
                               className={`w-10 h-6 rounded-full p-1 transition-all ${formData.showOnSchemes ? 'bg-amber-600' : 'bg-slate-300'}`}
                             >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${formData.showOnSchemes ? 'translate-x-4' : 'translate-x-0'}`} />
                             </div>
                             <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Apply Schemes</span>
                          </label>
                       </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button type="button" onClick={() => setShowModal(false)} className="flex-grow py-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest border border-slate-200 hover:bg-slate-200 transition-all">Abort Action</button>
                       <button type="submit" className="flex-grow py-4 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-blue-700 active:scale-95 transition-all">Commit Entry</button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProductsCMS;
