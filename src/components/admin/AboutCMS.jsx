import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Info, Save, Upload, Trash2, Plus, 
  ImageIcon, ShieldCheck, Heart, User, 
  Target, Globe, Activity, Layout
} from 'lucide-react';
import API_BASE_URL from '../../config/api';

const AboutCMS = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/content/homepage`);
      setFormData(data || {});
    } catch (error) {
      console.error('Failed to fetch content', error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/content/homepage`, formData, getAuthConfig());
      alert('Content updated successfully!');
    } catch (error) {
      alert('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs font-sans">Accessing Organizational Hub...</div>;

  return (
    <div className="space-y-8 pb-20 font-sans animate-in fade-in duration-500">
       <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
               <Info className="text-blue-600" /> Corporate Identity Hub
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage mission statements, core values, and organizational history.</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all disabled:opacity-50">
             <Save size={18} /> {saving ? 'Saving...' : 'Deploy Content'}
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Core Mission & Vision</h3>
                <div className="space-y-4">
                   <label className="text-xs font-bold text-slate-500">Mission Statement Title</label>
                   <input value={formData?.aboutMissionTitle || ''} onChange={e => setFormData({ ...formData, aboutMissionTitle: e.target.value })} className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 font-bold" />
                </div>
                <div className="space-y-4">
                   <label className="text-xs font-bold text-slate-500">Exposition / Description</label>
                   <textarea rows="8" value={formData?.aboutMissionDesc || ''} onChange={e => setFormData({ ...formData, aboutMissionDesc: e.target.value })} className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 resize-none" />
                </div>
             </div>

             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Organizational Values</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Value Node 0{i}</label>
                        <input placeholder="Title" value={formData?.[`value${i}Title`] || ''} onChange={e => setFormData({ ...formData, [`value${i}Title`]: e.target.value })} className="w-full bg-white p-3 rounded-lg border border-slate-100 font-bold text-xs" />
                        <textarea placeholder="Exposition" value={formData?.[`value${i}Desc`] || ''} onChange={e => setFormData({ ...formData, [`value${i}Desc`]: e.target.value })} className="w-full bg-white p-3 rounded-lg border border-slate-100 text-[10px] h-20 resize-none" />
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2"><Target className="text-blue-600" /> Tactical Stats</h3>
                <div className="space-y-6">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Metric 0{i}</label>
                        <div className="flex gap-2">
                           <input placeholder="Label" value={formData?.[`stat${i}Label`] || ''} onChange={e => setFormData({ ...formData, [`stat${i}Label`]: e.target.value })} className="w-full bg-slate-50 p-3 rounded-lg border border-slate-100 text-[10px] font-bold" />
                           <input placeholder="Value" value={formData?.[`stat${i}Value`] || ''} onChange={e => setFormData({ ...formData, [`stat${i}Value`]: e.target.value })} className="w-full bg-slate-50 p-3 rounded-lg border border-slate-100 text-[10px] font-bold text-blue-600 w-24 text-center" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-800 flex flex-col items-center text-center gap-4">
                <Layout size={32} className="text-blue-400" />
                <div>
                   <h4 className="text-sm font-bold text-white uppercase tracking-wider">Live Preview Sync</h4>
                   <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Master Content Registry State: ONLINE</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default AboutCMS;
