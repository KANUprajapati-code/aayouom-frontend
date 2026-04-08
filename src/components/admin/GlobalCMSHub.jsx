import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Layout, ShieldCheck, Zap, Mail, Phone, MapPin, Globe, Instagram, PhoneCall } from 'lucide-react';

const GlobalCMSHub = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('home');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get('https://ayuom-backend.vercel.app/api/content/homepage');
      setFormData(data || {});
    } catch (error) {
      console.error('Failed to fetch content', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('https://ayuom-backend.vercel.app/api/content/homepage', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Global CMS updated successfully!');
    } catch (error) {
      console.error('Failed to save content', error);
      alert('Error updating content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center text-center space-y-6">
         <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
         <p className="font-black text-slate-300 uppercase tracking-widest text-xs">Synchronizing Global Master Hub...</p>
      </div>
    );
  }

  const subTabs = [
    { id: 'home', label: 'Home Page', icon: Layout },
    { id: 'about', label: 'About Us', icon: Globe },
    { id: 'contact', label: 'Contact Info', icon: Mail },
    { id: 'settings', label: 'Global Settings', icon: ShieldCheck }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-10">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Global CMS Hub</h2>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Command Center for site-wide content and aesthetics</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-slate-900 hover:bg-black text-white font-black px-12 py-5 rounded-[28px] text-[11px] uppercase tracking-widest shadow-2xl flex items-center gap-3 transition-all active:scale-95">
          {saving ? 'Synchronizing...' : <><Save className="w-5 h-5" /> Commit Changes</>}
        </button>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-4 p-2 bg-white rounded-3xl border border-slate-100 shadow-sm w-fit">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeSubTab === tab.id ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50'}`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {activeSubTab === 'home' && (
          <div className="grid grid-cols-1 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8">
                <h3 className="text-sm font-black text-primary-600 uppercase tracking-widest flex items-center gap-2 leading-none"><div className="w-1.5 h-4 bg-primary-600 rounded-full"></div> Hero Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Badge</label>
                      <input name="heroBadge" value={formData?.heroBadge || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 focus:bg-white focus:border-primary-500 outline-none transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Title Line 1</label>
                      <input name="heroTitleLine1" value={formData?.heroTitleLine1 || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 focus:bg-white focus:border-primary-500 outline-none transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Title Line 2 (Accent Color)</label>
                      <input name="heroTitleLine2" value={formData?.heroTitleLine2 || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 focus:bg-white focus:border-primary-500 outline-none transition-all" />
                   </div>
                   <div className="space-y-2 col-span-full">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Description Text</label>
                      <textarea rows="3" name="heroDescription" value={formData?.heroDescription || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 focus:bg-white focus:border-primary-500 outline-none transition-all resize-none"></textarea>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8">
                <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 leading-none"><div className="w-1.5 h-4 bg-emerald-600 rounded-full"></div> Promotions & Sections</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Schemes Block Title</label>
                      <input name="schemesTitle" value={formData?.schemesTitle || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Schemes Block Subtitle</label>
                      <input name="schemesSubtitle" value={formData?.schemesSubtitle || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all" />
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'about' && (
          <div className="grid grid-cols-1 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8">
                <h3 className="text-sm font-black text-primary-600 uppercase tracking-widest flex items-center gap-2 leading-none"><div className="w-1.5 h-4 bg-primary-600 rounded-full"></div> Our Mission</h3>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission Statement Title</label>
                      <input name="aboutMissionTitle" value={formData?.aboutMissionTitle || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 focus:bg-white outline-none transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission Long-form Description</label>
                      <textarea rows="4" name="aboutMissionDesc" value={formData?.aboutMissionDesc || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-800 border border-slate-100 focus:bg-white outline-none transition-all resize-none"></textarea>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8">
                <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 leading-none"><div className="w-1.5 h-4 bg-blue-600 rounded-full"></div> Core Values</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Value {i} Title</label>
                           <input name={`aboutValue${i}Title`} value={formData?.[`aboutValue${i}Title`] || ''} onChange={handleChange} className="w-full bg-white p-4 rounded-xl font-black text-slate-800 border border-slate-200 text-sm outline-none" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Value {i} Brief</label>
                           <textarea rows="2" name={`aboutValue${i}Desc`} value={formData?.[`aboutValue${i}Desc`] || ''} onChange={handleChange} className="w-full bg-white p-4 rounded-xl font-bold text-slate-600 border border-slate-200 text-xs outline-none resize-none"></textarea>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'contact' && (
          <div className="grid grid-cols-1 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-10">
                <h3 className="text-sm font-black text-primary-600 uppercase tracking-widest flex items-center gap-2 leading-none"><div className="w-1.5 h-4 bg-primary-600 rounded-full"></div> Communication Nodes</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 text-slate-400 mb-2">
                        <Phone size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Primary Contact Terminal</span>
                      </div>
                      <input name="contactPhone" value={formData?.contactPhone || ''} onChange={handleChange} className="w-full bg-slate-50 p-6 rounded-2xl font-black text-xl text-slate-900 border border-slate-100 outline-none" placeholder="+91 XXXX XXXX" />
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 text-slate-400 mb-2">
                        <Mail size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Master Support Email</span>
                      </div>
                      <input name="contactEmail" value={formData?.contactEmail || ''} onChange={handleChange} className="w-full bg-slate-50 p-6 rounded-2xl font-black text-xl text-slate-900 border border-slate-100 outline-none" placeholder="office@domain.com" />
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 text-slate-400 mb-2">
                        <MapPin size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Physical Headquaters</span>
                      </div>
                      <textarea rows="2" name="contactAddress" value={formData?.contactAddress || ''} onChange={handleChange} className="w-full bg-slate-50 p-6 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none resize-none"></textarea>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 text-slate-400 mb-2">
                        <PhoneCall size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Operational Hours</span>
                      </div>
                      <input name="contactHours" value={formData?.contactHours || ''} onChange={handleChange} className="w-full bg-slate-50 p-6 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none" />
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'settings' && (
          <div className="grid grid-cols-1 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-10">
                <h3 className="text-sm font-black text-rose-600 uppercase tracking-widest flex items-center gap-2 leading-none"><div className="w-1.5 h-4 bg-rose-600 rounded-full"></div> Global Identity & Socials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Globe size={14} /> Brand Logo URI</label>
                      <input name="siteLogoUrl" value={formData?.siteLogoUrl || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold border border-slate-100 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Instagram size={14} /> Instagram Profile Link</label>
                      <input name="instagramLink" value={formData?.instagramLink || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold border border-slate-100 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><PhoneCall size={14} /> Primary WhatsApp Number</label>
                      <input name="whatsappLink" value={formData?.whatsappLink || ''} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold border border-slate-100 outline-none" placeholder="e.g. 919999988888" />
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalCMSHub;
