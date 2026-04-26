import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, X, Check, Upload, Building2, Search, XCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BrandsCMS = () => {
  const [brands, setBrands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentBrand, setCurrentBrand] = useState({
    name: '',
    logoUrl: '',
    description: '',
    status: 'Active'
  });

  const API_BASE_URL = 'https://ayuom-backend.vercel.app/api';

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/brands/admin`, getAuthConfig());
      setBrands(res.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Logos can be smaller
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedBase64 = canvas.toDataURL('image/webp', 0.8);
          
          try {
            const res = await axios.post(`${API_BASE_URL}/upload`, { base64: compressedBase64 }, getAuthConfig());
            setCurrentBrand({ ...currentBrand, logoUrl: res.data.url });
          } catch (err) {
            console.error('Upload failed:', err);
            alert('Upload failed. Image might be too large.');
          } finally {
            setUploading(false);
          }
        };
      };
    } catch (error) {
      console.error('File reading error:', error);
      alert('Error processing file.');
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentBrand.name) return;

    setSaving(true);
    try {
      if (currentBrand._id) {
        await axios.put(`${API_BASE_URL}/brands/${currentBrand._id}`, currentBrand, getAuthConfig());
      } else {
        await axios.post(`${API_BASE_URL}/brands`, currentBrand, getAuthConfig());
      }
      setIsModalOpen(false);
      fetchBrands();
      setCurrentBrand({ name: '', logoUrl: '', description: '', status: 'Active' });
    } catch (error) {
      console.error('Error saving brand:', error);
      alert('Error saving brand. Name might already exist.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/brands/${id}`, getAuthConfig());
      fetchBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">
            <Building2 size={16} /> Portfolio Management
          </div>
          <h2 className="text-3xl font-black text-slate-950 italic tracking-tighter">BRAND REGISTRY</h2>
          <p className="text-slate-500 text-sm font-semibold mt-1">Manage pharmaceutical partners, logos, and ecosystem visibility.</p>
        </div>
        <button 
          onClick={() => {
            setCurrentBrand({ name: '', logoUrl: '', description: '', status: 'Active' });
            setIsModalOpen(true);
          }}
          className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <Plus size={18} /> Register New Brand
        </button>
      </div>

      {/* Filter & List Area */}
      <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
          <Search size={20} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search brands by name..." 
            className="bg-transparent border-none focus:ring-0 w-full font-bold text-slate-700 placeholder:text-slate-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Description</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan="4" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-300">
                         <Loader2 className="animate-spin" size={32} />
                         <span className="font-black text-[10px] uppercase tracking-widest">Syncing Registry...</span>
                      </div>
                   </td>
                </tr>
              ) : filteredBrands.length === 0 ? (
                <tr>
                   <td colSpan="4" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-300">
                         <XCircle size={32} />
                         <span className="font-black text-[10px] uppercase tracking-widest">No matching brands found</span>
                      </div>
                   </td>
                </tr>
              ) : filteredBrands.map((brand) => (
                <tr key={brand._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                        {brand.logoUrl ? (
                          <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain p-2" />
                        ) : (
                          <span className="text-xl font-black text-slate-300 uppercase italic">{brand.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 italic tracking-tight">{brand.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID: {brand._id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 max-w-xs">
                    <p className="text-slate-500 font-semibold text-sm line-clamp-2 leading-relaxed">
                      {brand.description || 'No specialized description provided.'}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${brand.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${brand.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                      {brand.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button 
                       onClick={() => {
                         setCurrentBrand(brand);
                         setIsModalOpen(true);
                       }}
                       className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 rounded-xl transition-all shadow-sm active:scale-90"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                       onClick={() => handleDelete(brand._id)}
                       className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100 rounded-xl transition-all shadow-sm active:scale-90"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Management Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
                      <Building2 size={24} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-slate-950 italic tracking-tighter uppercase">{currentBrand._id ? 'Edit Brand Identity' : 'Initialize New Partner'}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentBrand._id ? 'Update existing therapeutic provider' : 'Add a new member to the ecosystem'}</p>
                   </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 p-2"><X size={24} /></button>
              </div>

              <form onSubmit={handleSave} className="p-10 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Brand Name</label>
                       <input 
                         required
                         type="text" 
                         value={currentBrand.name}
                         onChange={(e) => setCurrentBrand({ ...currentBrand, name: e.target.value })}
                         className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-5 py-4 font-bold text-slate-900 transition-all outline-none"
                         placeholder="Enter brand name..."
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Operational Status</label>
                       <select 
                         value={currentBrand.status}
                         onChange={(e) => setCurrentBrand({ ...currentBrand, status: e.target.value })}
                         className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-5 py-4 font-bold text-slate-900 transition-all outline-none"
                       >
                          <option value="Active">Operational (Active)</option>
                          <option value="Inactive">Deferred (Inactive)</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity Asset (Logo)</label>
                    <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 group hover:border-blue-600/30 transition-all">
                       <div className="w-24 h-24 bg-white rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                          {uploading ? (
                             <Loader2 size={32} className="text-blue-600 animate-spin" />
                          ) : currentBrand.logoUrl ? (
                             <img src={currentBrand.logoUrl} alt="" className="w-full h-full object-contain p-2" />
                          ) : (
                             <ImageIcon size={32} className="text-slate-200" />
                          )}
                       </div>
                       <div className="space-y-3 flex-grow">
                          <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">Recommend PNG/WebP with transparent background. Max 2MB.</p>
                          <label className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all active:scale-95">
                             <Upload size={14} /> {uploading ? 'Processing...' : 'Upload Asset'}
                             <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                          </label>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Brand Narrative / Details</label>
                    <textarea 
                       rows="3"
                       value={currentBrand.description}
                       onChange={(e) => setCurrentBrand({ ...currentBrand, description: e.target.value })}
                       className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-5 py-4 font-bold text-slate-900 transition-all outline-none resize-none"
                       placeholder="Enter partner overview..."
                    ></textarea>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                       type="button" 
                       onClick={() => setIsModalOpen(false)}
                       className="flex-1 py-5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
                    >
                       Discard
                    </button>
                    <button 
                       type="submit" 
                       disabled={saving || uploading}
                       className="flex-2 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                       {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                       {saving ? 'Syncing...' : (currentBrand._id ? 'Synchronize Identity' : 'Commit New Partner')}
                    </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandsCMS;
