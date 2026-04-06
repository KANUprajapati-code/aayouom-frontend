/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Zap, Save, Trash2, Plus, X, Edit, ShieldCheck, TrendingDown } from 'lucide-react';

const SchemesCMS = () => {
  const [schemes, setSchemes] = useState([]);
  const [schemesHeroData, setSchemesHeroData] = useState({ title: '', subtitle: '', description: '', imageUrl: '' });
  const [isUpdatingHero, setIsUpdatingHero] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', category: '', color: 'emerald', icon: 'Zap', status: 'Active' });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [heroRes, schemeRes] = await Promise.all([
        axios.get('https://ayuom-backend.vercel.app/api/content/schemes').catch(() => ({ data: null })),
        axios.get('https://ayuom-backend.vercel.app/api/schemesData')
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
      await axios.put('https://ayuom-backend.vercel.app/api/content/schemes', schemesHeroData, config);
      alert('Schemes Hero section updated successfully!');
    } catch (err) {
      alert('Failed: ' + err.message);
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
        const res = await axios.post('https://ayuom-backend.vercel.app/api/schemesData', formData, config);
        setSchemes([...schemes, res.data]);
      } else {
        const res = await axios.put(`https://ayuom-backend.vercel.app/api/schemesData/${currentId}`, formData, config);
        setSchemes(schemes.map(s => s._id === currentId ? res.data : s));
      }
      setShowModal(false);
    } catch (err) {
      alert('Failed to save scheme: ' + err.message);
    }
  };

  const handleDeleteScheme = async (id) => {
    if (!window.confirm('Erase this scheme completely?')) return;
    try {
      await axios.delete(`https://ayuom-backend.vercel.app/api/schemesData/${id}`, config);
      setSchemes(schemes.filter(s => s._id !== id));
    } catch (err) {
      alert('Failure: ' + err.message);
    }
  };

  const handleToggleStatus = async (sc) => {
    const newStatus = sc.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await axios.put(`https://ayuom-backend.vercel.app/api/schemesData/${sc._id}`, { ...sc, status: newStatus }, config);
      setSchemes(schemes.map(s => s._id === sc._id ? res.data : s));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
       <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Schemes Optimizer</h2>
            <p className="text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Customize Live Bulk Pricing Cards Config</p>
          </div>
          <button onClick={() => handleOpenModal('add')} className="btn-primary px-8 py-4 rounded-2xl text-[10px] shadow-premium flex flex-row items-center gap-2">
             <Plus className="w-4 h-4" /> Create Scheme Card
          </button>
       </div>

       {/* Hero Banner Editor */}
       <div className="bg-white rounded-[40px] border border-surface-border shadow-soft p-10 mb-8 flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/3">
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase leading-none mb-2">Promotion Hero</h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">Modify the main hero banner on the `/schemes` page.</p>
          </div>
          <form onSubmit={handleUpdateHero} className="lg:w-2/3 space-y-4">
             <input type="text" value={schemesHeroData.title || ''} onChange={(e) => setSchemesHeroData({...schemesHeroData, title: e.target.value})} className="w-full bg-surface-light p-4 rounded-xl font-black text-slate-900 border border-transparent outline-none focus:border-primary-500 text-sm" placeholder="Title" />
             <input type="text" value={schemesHeroData.subtitle || ''} onChange={(e) => setSchemesHeroData({...schemesHeroData, subtitle: e.target.value})} className="w-full bg-surface-light p-4 rounded-xl font-medium text-slate-800 border border-transparent outline-none focus:border-primary-500 text-sm" placeholder="Subtitle" />
             <textarea value={schemesHeroData.description || ''} onChange={(e) => setSchemesHeroData({...schemesHeroData, description: e.target.value})} className="w-full bg-surface-light p-4 rounded-xl font-medium text-slate-600 border border-transparent outline-none focus:border-primary-500 text-sm min-h-[80px]" placeholder="Description..." />
            <button type="submit" disabled={isUpdatingHero} className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-black uppercase text-xs flex mt-2 justify-center items-center gap-2">
              <Save size={16} /> Sync Promotion Hero
            </button>
          </form>
       </div>

       <div className="bg-white rounded-[40px] border border-surface-border shadow-premium overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-surface-light border-b border-surface-border">
                <tr>
                   <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Offer Designation</th>
                   <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Segment/Tag</th>
                   <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Color</th>
                   <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                   <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Control</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-surface-border">
                {schemes.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-400">No active scheme cards</td></tr>}
                {schemes.map(scheme => (
                   <tr key={scheme._id} className="hover:bg-primary-50/20 transition-all">
                      <td className="px-10 py-6">
                         <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 bg-${scheme.color}-50 text-${scheme.color}-600 rounded-xl flex items-center justify-center font-black`}>%</div>
                            <div>
                               <p className="font-black text-slate-800 uppercase italic tracking-tighter">{scheme.title}</p>
                               <p className="text-xs text-slate-500 truncate max-w-xs">{scheme.description}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-6">
                         <span className="px-3 py-1 bg-surface-light border shrink-0 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{scheme.category}</span>
                      </td>
                      <td className="px-10 py-6 text-xs uppercase tracking-widest font-black text-slate-400">{scheme.color}</td>
                      <td className="px-10 py-6">
                         <button onClick={() => handleToggleStatus(scheme)} className="flex items-center gap-2 group">
                            <div className={`w-2 h-2 rounded-full ${scheme.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${scheme.status === 'Active' ? 'text-emerald-600 group-hover:text-rose-500' : 'text-slate-400 group-hover:text-emerald-500'}`}>
                               {scheme.status}
                            </span>
                         </button>
                      </td>
                      <td className="px-10 py-6 text-right space-x-2">
                         <button onClick={() => handleOpenModal('edit', scheme)} className="p-2 bg-slate-100 hover:bg-primary-100 text-slate-500 rounded"><Edit size={14}/></button>
                         <button onClick={() => handleDeleteScheme(scheme._id)} className="p-2 bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded"><Trash2 size={14}/></button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-3xl border border-white/20">
             <div className="p-8 border-b border-surface-border flex justify-between items-center bg-surface-light">
                <h2 className="text-xl font-black text-emerald-600 italic uppercase">{modalMode === 'add' ? 'New Scheme Card' : 'Edit Scheme Card'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 bg-white rounded-xl hover:bg-rose-500 hover:text-white transition-all text-slate-300"><X /></button>
             </div>
             <form onSubmit={handleSubmitScheme} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Card Title</label>
                     <input required type="text" className="w-full bg-surface-light p-3 rounded-lg font-black text-slate-900 outline-none focus:border-primary-500 text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="space-y-2 col-span-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Description</label>
                     <textarea required rows="2" className="w-full bg-surface-light p-3 rounded-lg font-medium text-slate-700 outline-none focus:border-primary-500 text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Segment</label>
                     <input required type="text" className="w-full bg-surface-light p-3 rounded-lg font-bold text-slate-900 text-xs" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. All Active Users" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Status</label>
                     <select className="w-full bg-surface-light p-3 rounded-lg font-bold text-slate-900 text-xs" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option>Active</option><option>Inactive</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Theme Color</label>
                     <select className="w-full bg-surface-light p-3 rounded-lg font-bold text-slate-900 text-xs" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}>
                        <option value="emerald">Emerald</option><option value="blue">Blue</option><option value="purple">Purple</option><option value="orange">Orange</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Icon</label>
                     <select className="w-full bg-surface-light p-3 rounded-lg font-bold text-slate-900 text-xs" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})}>
                        <option value="Zap">Lightning / Fast</option>
                        <option value="TrendingDown">Downward Trend / Cheap</option>
                        <option value="ShieldCheck">Verified / Safe</option>
                     </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-emerald-500 py-4 rounded-xl font-black uppercase tracking-widest text-white hover:bg-emerald-600">Save Scheme Card</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemesCMS;
