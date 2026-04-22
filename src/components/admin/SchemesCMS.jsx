import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Zap, Save, Trash2, Plus, X, Edit, 
  ShieldCheck, TrendingDown, LayoutGrid, Image as ImageIcon,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/api';

const SchemesCMS = () => {
  const [schemes, setSchemes] = useState([]);
  const [schemesHeroData, setSchemesHeroData] = useState({ 
    title: '', subtitle: '', description: '', imageUrl: '', 
    heroBanners: [] 
  });
  const [isUpdatingHero, setIsUpdatingHero] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'All Products', color: 'blue', icon: 'Zap', status: 'Active' });

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [heroRes, schemeRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/content/schemes`).catch(() => ({ data: null })),
        axios.get(`${API_BASE_URL}/schemesData`)
      ]);
      if (heroRes.data) {
        setSchemesHeroData({
          ...heroRes.data,
          heroBanners: heroRes.data.heroBanners || (heroRes.data.title ? [{
            title: heroRes.data.title,
            subtitle: heroRes.data.subtitle,
            description: heroRes.data.description,
            imageUrl: heroRes.data.imageUrl
          }] : [])
        });
      }
      setSchemes(schemeRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateHero = async (e) => {
    if (e) e.preventDefault();
    setIsUpdatingHero(true);
    try {
      await axios.put(`${API_BASE_URL}/content/schemes`, schemesHeroData, getAuthConfig());
      alert('Schemes headers updated successfully!');
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdatingHero(false);
    }
  };

  const handleAddBanner = () => {
    const newBanner = { 
      title: 'New Dynamic Scheme', 
      subtitle: 'Limited Time Institutional Offer', 
      description: 'Exclusive bulk discounts for verified practitioners.', 
      imageUrl: '',
      btnText: 'Explore Schemes',
      btnLink: '/schemes'
    };
    setSchemesHeroData(prev => ({ 
      ...prev, 
      heroBanners: [...(prev.heroBanners || []), newBanner] 
    }));
  };

  const handleRemoveBanner = (index) => {
    const updated = schemesHeroData.heroBanners.filter((_, i) => i !== index);
    setSchemesHeroData(prev => ({ ...prev, heroBanners: updated }));
  };

  const handleBannerChange = (index, field, value) => {
    const updated = [...schemesHeroData.heroBanners];
    updated[index][field] = value;
    setSchemesHeroData(prev => ({ ...prev, heroBanners: updated }));
  };

  const handleImageUpload = (index, file) => {
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
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
          handleBannerChange(index, 'imageUrl', data.url);
        } catch (error) {
           console.error("Error uploading image:", error);
           alert("Failed to upload image.");
        } finally {
           setUploading(false);
        }
      };
    };
  };

  const handleOpenModal = (mode, sc = null) => {
    setModalMode(mode);
    if (mode === 'edit' && sc) {
      setFormData({ ...sc });
      setCurrentId(sc._id);
    } else {
      setFormData({ title: '', description: '', category: 'All Products', color: 'blue', icon: 'Zap', status: 'Active' });
      setCurrentId(null);
    }
    setShowModal(true);
  };

  const handleSubmitScheme = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        const res = await axios.post(`${API_BASE_URL}/schemesData`, formData, getAuthConfig());
        setSchemes([...schemes, res.data]);
      } else {
        const res = await axios.put(`${API_BASE_URL}/schemesData/${currentId}`, formData, getAuthConfig());
        setSchemes(schemes.map(s => s._id === currentId ? res.data : s));
      }
      setShowModal(false);
    } catch (err) {
      alert('Error saving scheme.');
    }
  };

  const handleDeleteScheme = async (id) => {
    if (!window.confirm('Erase this scheme?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/schemesData/${id}`, getAuthConfig());
      setSchemes(schemes.filter(s => s._id !== id));
    } catch (err) {
      alert('Error deleting.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 font-sans">
       <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between gap-8">
          <div>
             <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3"><Zap className="text-blue-600" /> Promotion Matrix</h2>
             <p className="text-slate-500 text-sm mt-1">Configure active schemes and multi-banner slider content.</p>
          </div>
          <div className="flex gap-4">
             <button onClick={handleUpdateHero} disabled={isUpdatingHero} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50">
                <Save size={18} /> {isUpdatingHero ? 'Saving...' : 'Save All Changes'}
             </button>
             <button onClick={() => handleOpenModal('add')} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-black transition-all">
                <Plus size={18} /> New Campaign
             </button>
          </div>
       </div>

       {/* HERO BANNERS MANAGEMENT */}
       <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
          <div className="flex justify-between items-center pb-6 border-b border-slate-100">
             <div>
                <h3 className="text-lg font-bold text-slate-900">Schemes Page Banners</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Multi-Slide Hero Configuration</p>
             </div>
             <button onClick={handleAddBanner} className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                <Plus size={16} /> Add New Slide
             </button>
          </div>

          <div className="space-y-8">
             {(schemesHeroData.heroBanners || []).map((banner, index) => (
                <div key={index} className="p-8 bg-slate-50 rounded-2xl border border-slate-200 relative group">
                   <button onClick={() => handleRemoveBanner(index)} className="absolute -top-3 -right-3 p-2 bg-white text-rose-600 rounded-full border border-rose-100 shadow-lg hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                   
                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Banner Image</label>
                            <div className="flex items-center gap-6">
                               <div className="w-24 h-24 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center shrink-0">
                                  {banner.imageUrl ? <img src={banner.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-slate-100" />}
                               </div>
                               <div className="flex-grow space-y-3">
                                  <input value={banner.imageUrl} onChange={e => handleBannerChange(index, 'imageUrl', e.target.value)} className="w-full bg-white p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:border-blue-600 outline-none transition-all" placeholder="Enter remote image URL..." />
                                  <label className="block text-center p-3 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-bold cursor-pointer hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest border border-blue-100">
                                     {uploading ? 'Processing File...' : 'Upload Asset'}
                                     <input type="file" className="hidden" onChange={e => e.target.files[0] && handleImageUpload(index, e.target.files[0])} />
                                  </label>
                               </div>
                            </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Button Text</label>
                               <input value={banner.btnText} onChange={e => handleBannerChange(index, 'btnText', e.target.value)} className="w-full bg-white p-3 rounded-xl border border-slate-200 text-xs font-semibold" placeholder="e.g. Explore Schemes" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action Link</label>
                               <input value={banner.btnLink} onChange={e => handleBannerChange(index, 'btnLink', e.target.value)} className="w-full bg-white p-3 rounded-xl border border-slate-200 text-xs font-semibold" placeholder="e.g. /schemes" />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Title</label>
                            <input value={banner.title} onChange={e => handleBannerChange(index, 'title', e.target.value)} className="w-full bg-white p-4 rounded-xl border border-slate-200 text-sm font-black italic tracking-tight" placeholder="Scheme Title" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secondary Tagline</label>
                            <input value={banner.subtitle} onChange={e => handleBannerChange(index, 'subtitle', e.target.value)} className="w-full bg-white p-3 rounded-xl border border-slate-200 text-xs font-bold text-emerald-600" placeholder="Limited Time Offer..." />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                            <textarea value={banner.description} onChange={e => handleBannerChange(index, 'description', e.target.value)} className="w-full bg-white p-4 rounded-xl border border-slate-200 text-xs font-medium h-24 resize-none" placeholder="Detailed benefits..." />
                         </div>
                      </div>
                   </div>
                </div>
             ))}
             {(!schemesHeroData.heroBanners || schemesHeroData.heroBanners.length === 0) && (
               <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No banners configured for Schemes page.</p>
                  <button onClick={handleAddBanner} className="mt-4 text-blue-600 font-bold text-xs">Initialize First Banner</button>
               </div>
             )}
          </div>
       </div>

       {/* SCHEMES CARDS MANAGEMENT */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {schemes.map(sc => (
            <div key={sc._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex gap-6 hover:border-blue-600 transition-all group">
               <div className={`w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0`}>
                  <Zap size={28} className="text-blue-600" />
               </div>
               <div className="flex-grow space-y-2">
                  <div className="flex justify-between items-start">
                     <div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${sc.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{sc.status}</span>
                        <h4 className="font-bold text-slate-900 mt-1">{sc.title}</h4>
                     </div>
                     <div className="flex gap-1">
                        <button onClick={() => handleOpenModal('edit', sc)} className="p-2 text-slate-400 hover:text-blue-600"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteScheme(sc._id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                     </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{sc.description}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sc.category}</p>
               </div>
            </div>
          ))}
       </div>
       
       {showModal && (
         <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
               <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">{modalMode === 'add' ? 'Initiate Scheme' : 'Edit Campaign'}</h3>
                  <button onClick={() => setShowModal(false)}><X size={20} /></button>
               </div>
               <form onSubmit={handleSubmitScheme} className="p-8 space-y-6">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500 italic">Campaign Title</label>
                     <input required className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-blue-600 transition-all font-bold" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500">Category Qualifier</label>
                     <input required className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500">System Description</label>
                     <textarea className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm h-24" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                  <div className="flex gap-4">
                     <div className="flex-grow space-y-1">
                        <label className="text-xs font-bold text-slate-500">Status Node</label>
                        <select className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-bold" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                           <option>Active</option>
                           <option>Inactive</option>
                        </select>
                     </div>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all uppercase tracking-widest text-[10px]">Commit Protocol</button>
               </form>
            </div>
         </div>
       )}
    </div>
  );
};

export default SchemesCMS;
