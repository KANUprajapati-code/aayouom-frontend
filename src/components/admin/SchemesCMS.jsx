import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Zap, Save, Trash2, Plus, X, Edit, 
  ShieldCheck, TrendingDown, Sparkles, Wand2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../../config/api';

const SchemesCMS = () => {
  const [schemes, setSchemes] = useState([]);
  const [schemesHeroData, setSchemesHeroData] = useState({ title: '', subtitle: '', description: '', imageUrl: '' });
  const [isUpdatingHero, setIsUpdatingHero] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', category: '', color: 'emerald', icon: 'Zap', status: 'Active' });

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
      if (heroRes.data) setSchemesHeroData(heroRes.data);
      setSchemes(schemeRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateHero = async (e) => {
    e.preventDefault();
    setIsUpdatingHero(true);
    try {
      await axios.put(`${API_BASE_URL}/content/schemes`, schemesHeroData, getAuthConfig());
      alert('Schemes Hero section updated successfully!');
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdatingHero(false);
    }
  };

  const handleOpenModal = (mode, sc = null) => {
    setModalMode(mode);
    if (mode === 'edit' && sc) {
      setFormData({ title: sc.title, description: sc.description, category: sc.category, color: sc.color, icon: sc.icon, status: sc.status });
      setCurrentId(sc._id);
    } else {
      setFormData({ title: '', description: '', category: 'All Products', color: 'emerald', icon: 'Zap', status: 'Active' });
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
      alert('Failed to save scheme: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteScheme = async (id) => {
    if (!window.confirm('Erase this scheme completely?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/schemesData/${id}`, getAuthConfig());
      setSchemes(schemes.filter(s => s._id !== id));
    } catch (err) {
      alert('Failure: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleStatus = async (sc) => {
    const newStatus = sc.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await axios.put(`${API_BASE_URL}/schemesData/${sc._id}`, { ...sc, status: newStatus }, getAuthConfig());
      setSchemes(schemes.map(s => s._id === sc._id ? res.data : s));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-12 pb-24">
       <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white/40 backdrop-blur-md p-12 rounded-[56px] border border-white/40 shadow-soft relative overflow-hidden group">
          <div className="absolute -left-10 -top-10 w-48 h-48 bg-unicorn-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-text-main italic tracking-tighter uppercase leading-none flex items-center gap-5">
               <div className="p-4 bg-gradient-to-br from-unicorn-indigo via-unicorn-purple to-unicorn-magenta rounded-3xl shadow-unicorn">
                  <Zap size={32} className="text-white" />
               </div>
               Schemes Matrix
            </h2>
            <p className="text-text-silver mt-4 font-black uppercase tracking-[0.4em] text-[11px] opacity-60">High-Impact Bulk Offering Control Node</p>
          </div>
          <button onClick={() => handleOpenModal('add')} className="bg-text-main hover:bg-black text-white px-12 py-5 rounded-[28px] text-[12px] font-black uppercase tracking-[0.3em] shadow-premium flex items-center gap-4 transition-all active:scale-95 group relative z-10">
             <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Instantiate Scheme
          </button>
       </div>

       {/* Hero Banner Editor */}
       <div className="bg-white/40 backdrop-blur-md rounded-[56px] border border-white/40 shadow-soft p-12 flex flex-col lg:flex-row gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-unicorn-magenta/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="lg:w-1/3 space-y-4">
            <h3 className="text-2xl font-black text-text-main italic tracking-tighter uppercase leading-none flex items-center gap-4">
               <Sparkles className="text-unicorn-magenta" size={24} /> Promotion Hero
            </h3>
            <p className="text-text-silver text-xs font-black uppercase tracking-widest leading-loose opacity-60">Architectural override for the primary schemes interface.</p>
          </div>
          <form onSubmit={handleUpdateHero} className="lg:w-2/3 space-y-6 relative z-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" value={schemesHeroData.title || ''} onChange={(e) => setSchemesHeroData({...schemesHeroData, title: e.target.value})} className="w-full bg-white/60 p-6 rounded-[28px] font-black text-text-main border border-white outline-none focus:bg-white focus:shadow-unicorn text-base tracking-tighter uppercase italic" placeholder="TITLE..." />
                <input type="text" value={schemesHeroData.subtitle || ''} onChange={(e) => setSchemesHeroData({...schemesHeroData, subtitle: e.target.value})} className="w-full bg-white/60 p-6 rounded-[28px] font-black text-text-main border border-white outline-none focus:bg-white focus:shadow-unicorn text-xs tracking-[0.4em] uppercase" placeholder="SUBTITLE..." />
             </div>
             <textarea value={schemesHeroData.description || ''} onChange={(e) => setSchemesHeroData({...schemesHeroData, description: e.target.value})} className="w-full bg-white/60 p-8 rounded-[32px] font-bold text-text-main border border-white outline-none focus:bg-white focus:shadow-unicorn text-sm resize-none min-h-[120px] leading-relaxed" placeholder="ENTER CORE DESCRIPTIVE STREAM..." />
             <button type="submit" disabled={isUpdatingHero} className="w-full bg-text-main py-6 rounded-[32px] font-black uppercase text-[11px] tracking-[0.4em] text-white shadow-premium flex justify-center items-center gap-4 hover:bg-black transition-all active:scale-95 group">
                {isUpdatingHero ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save size={20} className="group-hover:scale-125 transition-transform" /> Commit Hero Config</>}
             </button>
          </form>
       </div>

       <div className="bg-white/40 backdrop-blur-md rounded-[56px] border border-white/40 shadow-soft overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-white/30 border-b border-white/20">
                <tr>
                   <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-text-silver">Offer Designation</th>
                   <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-text-silver">Segment/Tag</th>
                   <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-text-silver">Chroma</th>
                   <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-text-silver">Flux State</th>
                   <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-text-silver text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/10">
                {schemes.length === 0 && <tr><td colSpan="5" className="p-20 text-center text-text-silver font-black uppercase tracking-[0.5em]">No active scheme nodes detected</td></tr>}
                {schemes.map(scheme => (
                   <tr key={scheme._id} className="hover:bg-white/40 transition-all group">
                      <td className="px-12 py-8">
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center font-black text-xl shadow-soft group-hover:shadow-unicorn group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                               <Zap size={24} className={`text-unicorn-${scheme.color === 'emerald' ? 'cyan' : scheme.color}`} />
                            </div>
                            <div className="min-w-0">
                               <p className="font-black text-text-main uppercase italic tracking-tighter text-lg leading-none group-hover:text-unicorn-cyan transition-colors">{scheme.title}</p>
                               <p className="text-[10px] font-black text-text-silver uppercase tracking-widest mt-2 truncate max-w-[200px]">{scheme.description}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-12 py-8">
                         <span className="px-5 py-2 bg-text-main/5 border border-white/40 text-text-main rounded-xl text-[10px] font-black uppercase tracking-widest italic">{scheme.category}</span>
                      </td>
                      <td className="px-12 py-8">
                         <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full shadow-inner bg-unicorn-${scheme.color === 'emerald' ? 'cyan' : scheme.color}`}></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-silver font-mono">{scheme.color}</span>
                         </div>
                      </td>
                      <td className="px-12 py-8">
                         <button onClick={() => handleToggleStatus(scheme)} className="flex items-center gap-4 group/status">
                            <div className={`w-3 h-3 rounded-full relative ${scheme.status === 'Active' ? 'bg-unicorn-cyan shadow-[0_0_10px_rgba(0,210,255,0.8)] animate-pulse' : 'bg-slate-300 shadow-inner'}`}></div>
                            <span className={`text-[11px] font-black uppercase tracking-widest transition-all ${scheme.status === 'Active' ? 'text-unicorn-cyan group-hover/status:text-rose-500' : 'text-text-silver group-hover/status:text-unicorn-cyan'}`}>
                               {scheme.status}
                            </span>
                         </button>
                      </td>
                      <td className="px-12 py-8 text-right space-x-3 whitespace-nowrap">
                         <button onClick={() => handleOpenModal('edit', scheme)} className="p-4 bg-white/40 hover:bg-text-main hover:text-white rounded-2xl text-text-silver transition-all border border-white/20 shadow-sm"><Edit size={18}/></button>
                         <button onClick={() => handleDeleteScheme(scheme._id)} className="p-4 bg-white/40 hover:bg-rose-500 hover:text-white rounded-2xl text-text-silver transition-all border border-white/20 shadow-sm"><Trash2 size={18}/></button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-2xl animate-in fade-in duration-500 font-sans">
          <div className="bg-white/80 backdrop-blur-3xl rounded-[64px] w-full max-w-2xl overflow-hidden shadow-unicorn border border-white/40 animate-in zoom-in-95 duration-500 relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-unicorn-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
             
             <div className="p-16 border-b border-white/20 flex justify-between items-center relative z-10">
                <div className="space-y-3">
                   <h2 className="text-4xl font-black text-text-main italic uppercase tracking-tighter leading-none">{modalMode === 'add' ? 'Instantiate Node' : 'Modify Node'}</h2>
                   <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em]">Scheme Registry Alpha</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-6 bg-white/40 rounded-3xl hover:bg-rose-500 hover:text-white transition-all text-text-silver shadow-soft group">
                   <X className="group-hover:rotate-90 transition-transform" />
                </button>
             </div>
             <form onSubmit={handleSubmitScheme} className="p-16 space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 col-span-full">
                     <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-4">Scheme Identification</label>
                     <input required type="text" className="w-full bg-white/50 p-6 rounded-3xl font-black text-text-main border border-white/40 outline-none focus:bg-white focus:shadow-unicorn transition-all uppercase text-lg tracking-tighter placeholder:text-text-silver/20 italic" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. FLASH SALE 50" />
                  </div>
                  <div className="space-y-4 col-span-full">
                     <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-4">Descriptive Pulse</label>
                     <textarea required rows="2" className="w-full bg-white/50 p-6 rounded-3xl font-bold text-text-main border border-white/40 outline-none focus:bg-white focus:shadow-unicorn transition-all text-sm resize-none leading-relaxed" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Enter promotion details..."></textarea>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-4">Target Sector</label>
                     <input required type="text" className="w-full bg-white/50 p-6 rounded-3xl font-black text-text-main border border-white/40 outline-none focus:bg-white transition-all text-xs tracking-widest uppercase" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. ALL PRODUCTS" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-4">Chroma Profile</label>
                     <select className="w-full bg-white/50 p-6 rounded-3xl font-black text-text-main border border-white/40 outline-none focus:bg-white transition-all appearance-none cursor-pointer text-xs tracking-widest uppercase" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}>
                        <option value="emerald">Cyan / Crystal</option>
                        <option value="purple">Purple / Ethereal</option>
                        <option value="magenta">Magenta / Pulse</option>
                        <option value="indigo">Indigo / Nexus</option>
                     </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-text-main py-8 rounded-[40px] font-black uppercase tracking-[0.5em] text-white shadow-premium flex items-center justify-center gap-6 active:scale-95 transition-all text-xs hover:bg-black group">
                   <Save className="w-6 h-6 group-hover:scale-125 transition-transform" /> Commit Node to Master
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemesCMS;
