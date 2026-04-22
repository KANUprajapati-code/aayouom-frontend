import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Save, Info, Heart, Target, Star, 
  Users, Sparkles, Wand2, ShieldCheck, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
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
      console.error('Failed to fetch about content', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/content/homepage`, formData, getAuthConfig());
      alert('Brand Identity Synchronized Successfully!');
    } catch (error) {
      console.error('Failed to save brand content', error);
      alert('Error updating identity node.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center space-y-8 animate-pulse text-center">
        <div className="w-24 h-24 border-[6px] border-unicorn-cyan/10 border-t-unicorn-cyan rounded-full animate-spin shadow-unicorn"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-text-silver">Decrypting Mission Data...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-12 pb-24 font-sans">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 bg-white/40 backdrop-blur-md p-12 rounded-[56px] border border-white/40 shadow-soft relative overflow-hidden group">
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-unicorn-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-text-main italic tracking-tighter uppercase leading-none flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-unicorn-indigo via-unicorn-purple to-unicorn-magenta rounded-3xl shadow-unicorn">
               <Info size={32} className="text-white" />
            </div>
            Mission Hub
          </h2>
          <p className="text-text-silver mt-4 font-black uppercase tracking-[0.4em] text-[11px] opacity-60">Brand Narrative & Core Value Sync Node</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="bg-text-main hover:bg-black text-white font-black px-12 py-5 rounded-[28px] text-[12px] font-black uppercase tracking-[0.3em] shadow-premium flex items-center gap-4 transition-all active:scale-95 group relative z-10"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <><Save size={20} className="group-hover:scale-110 transition-transform" /> Commit Narrative</>
          )}
        </button>
      </div>

      <div className="space-y-16">
        <div className="bg-white/40 backdrop-blur-md rounded-[56px] p-12 border border-white/40 shadow-soft space-y-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-80 h-80 bg-unicorn-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>
           <h3 className="text-2xl font-black text-text-main uppercase italic tracking-tighter flex items-center gap-5 leading-none relative z-10">
              <div className="w-12 h-12 bg-unicorn-cyan/10 rounded-2xl flex items-center justify-center text-unicorn-cyan shadow-inner">
                 <Target size={24} />
              </div> 
              Strategic Directives
           </h3>
           <div className="space-y-10 relative z-10">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-6">Universal Declaration Label</label>
                 <input name="aboutMissionTitle" value={formData.aboutMissionTitle || ''} onChange={handleChange} className="w-full bg-white/60 p-7 rounded-[32px] font-black text-text-main border border-white outline-none focus:bg-white focus:shadow-unicorn text-xl tracking-tighter uppercase italic" />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-text-silver uppercase tracking-[0.4em] ml-6">Extended Core Narrative</label>
                 <textarea rows="6" name="aboutMissionDesc" value={formData.aboutMissionDesc || ''} onChange={handleChange} className="w-full bg-white/60 p-10 rounded-[48px] font-bold text-text-main border border-white outline-none focus:bg-white focus:shadow-unicorn text-base resize-none leading-relaxed tracking-tight"></textarea>
              </div>
           </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-[56px] p-12 border border-white/40 shadow-soft space-y-12 relative overflow-hidden">
           <div className="absolute bottom-0 left-0 w-80 h-80 bg-unicorn-magenta/5 rounded-full blur-[120px] pointer-events-none"></div>
           <h3 className="text-2xl font-black text-text-main uppercase italic tracking-tighter flex items-center gap-5 leading-none relative z-10">
              <div className="w-12 h-12 bg-unicorn-magenta/10 rounded-2xl flex items-center justify-center text-unicorn-magenta shadow-inner">
                 <Heart size={24} />
              </div> 
              Cultural Value Nodes
           </h3>
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 relative z-10">
              {[1, 2, 3, 4].map(i => (
                 <motion.div 
                   whileHover={{ y: -5 }}
                   key={i} 
                   className="p-10 bg-white/50 backdrop-blur-sm rounded-[48px] border border-white space-y-8 group hover:bg-white transition-all duration-500 shadow-sm hover:shadow-premium"
                 >
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black text-text-silver uppercase tracking-[0.5em] group-hover:text-unicorn-magenta transition-colors">NODE 0{i} ENCODING</p>
                       <Zap className="text-unicorn-magenta/20 group-hover:text-unicorn-magenta transition-colors" size={20} />
                    </div>
                    <div className="space-y-6">
                       <input name={`aboutValue${i}Title`} value={formData[`aboutValue${i}Title`] || ''} onChange={handleChange} placeholder="LABEL..." className="w-full bg-slate-50 p-6 rounded-[28px] font-black text-text-main border border-slate-100 outline-none focus:bg-white focus:shadow-unicorn text-lg tracking-tighter uppercase italic" />
                       <textarea rows="3" name={`aboutValue${i}Desc`} value={formData[`aboutValue${i}Desc`] || ''} onChange={handleChange} placeholder="NARRATIVE..." className="w-full bg-slate-50 p-6 rounded-[28px] font-bold text-text-main border border-slate-100 outline-none focus:bg-white focus:shadow-unicorn text-sm resize-none tracking-tight leading-relaxed"></textarea>
                    </div>
                 </motion.div>
              ))}
           </div>
        </div>
      </div>

      {/* Identity Summary Card */}
      <div className="p-12 bg-text-main text-white rounded-[56px] flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group shadow-premium">
         <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-unicorn-cyan to-unicorn-magenta opacity-10 blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
         <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center shrink-0 border border-white/10 backdrop-blur-md">
            <Star size={40} className="text-secondary-500 animate-spin-slow" />
         </div>
         <div className="space-y-4 relative z-10">
            <h4 className="text-2xl font-black uppercase italic tracking-tighter">Brand Identity Integrity</h4>
            <p className="text-text-silver font-bold text-base leading-relaxed max-w-3xl opacity-80">This module synchronizes your public narrative across the entire ecosystem. Ensure the tonality adheres to the Global Branding Manual v9.0.</p>
         </div>
         <div className="ml-auto flex items-center gap-4 relative z-10">
            <div className="flex -space-x-4">
               {[1,2,3].map(i => (
                 <div key={i} className="w-12 h-12 rounded-full border-4 border-text-main bg-slate-800 flex items-center justify-center text-[10px] font-black">{i}</div>
               ))}
            </div>
            <Users className="text-white/20" size={40} />
         </div>
      </div>
    </div>
  );
};

export default AboutCMS;
