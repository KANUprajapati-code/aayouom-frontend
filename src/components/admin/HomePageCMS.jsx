import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Layout, ShieldCheck, Zap } from 'lucide-react';

const HomePageCMS = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get('https://ayuom-backend.vercel.app/api/content/homepage');
      setFormData(data || {});
    } catch (error) {
      console.error('Failed to fetch home page content', error);
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
      alert('Home page content updated successfully!');
    } catch (error) {
      console.error('Failed to save home page content', error);
      alert('Error updating content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-slate-400 font-bold uppercase tracking-widest text-sm flex items-center gap-4"><div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div> Loading CMS...</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Home Page CMS</h2>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Manage the complete textual content of the landing page</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-slate-900 hover:bg-black text-white font-black px-10 py-5 rounded-3xl text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-900/30 flex items-center gap-3 active:scale-95 transition-all outline-none">
          {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Commit to Database</>}
        </button>
      </div>

      <div className="space-y-12">
        {/* Hero Section settings */}
        <div className="bg-white rounded-[40px] border border-surface-border shadow-soft p-10">
          <h3 className="text-xl font-black text-primary-600 mb-6 uppercase tracking-widest flex items-center gap-3"><Layout size={20} /> Hero Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Badge Text</label>
                <input name="heroBadge" value={formData?.heroBadge || ''} onChange={handleChange} className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-900 border border-surface-border outline-none focus:border-primary-500 text-sm" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Title (Line 1)</label>
                <input name="heroTitleLine1" value={formData?.heroTitleLine1 || ''} onChange={handleChange} className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-900 border border-surface-border outline-none focus:border-primary-500 text-sm" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Title (Line 2/Accent)</label>
                <input name="heroTitleLine2" value={formData?.heroTitleLine2 || ''} onChange={handleChange} className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-900 border border-surface-border outline-none focus:border-primary-500 text-sm" />
             </div>
             <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Description</label>
                <textarea rows="3" name="heroDescription" value={formData?.heroDescription || ''} onChange={handleChange} className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-600 border border-surface-border outline-none focus:border-primary-500 text-sm resize-none"></textarea>
             </div>
          </div>
        </div>

        {/* Schemes settings */}
        <div className="bg-white rounded-[40px] border border-surface-border shadow-soft p-10">
          <h3 className="text-xl font-black text-emerald-600 mb-6 uppercase tracking-widest flex items-center gap-3"><Zap size={20} /> Schemes Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Schemes Title</label>
                <input name="schemesTitle" value={formData?.schemesTitle || ''} onChange={handleChange} className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-900 border border-surface-border outline-none focus:border-emerald-500 text-sm" />
             </div>
             <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Schemes Subtitle</label>
                <textarea rows="2" name="schemesSubtitle" value={formData?.schemesSubtitle || ''} onChange={handleChange} className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-600 border border-surface-border outline-none focus:border-emerald-500 text-sm resize-none"></textarea>
             </div>
          </div>
        </div>

        {/* Trust settings */}
        <div className="bg-white rounded-[40px] border border-surface-border shadow-soft p-10">
          <h3 className="text-xl font-black text-blue-600 mb-6 uppercase tracking-widest flex items-center gap-3"><ShieldCheck size={20} /> Trust & Quality Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Trust Title</label>
                <input name="trustTitle" value={formData?.trustTitle || ''} onChange={handleChange} className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-900 border border-surface-border outline-none focus:border-blue-500 text-sm" />
             </div>
             <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trust Subtitle</label>
                <textarea rows="2" name="trustSubtitle" value={formData?.trustSubtitle || ''} onChange={handleChange} className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-600 border border-surface-border outline-none focus:border-blue-500 text-sm resize-none"></textarea>
             </div>

             <div className="space-y-2 mt-4 border-t border-surface-border pt-4">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Item 1 Title - e.g. Quality Assured</label>
                <input name="trustItem1Title" value={formData?.trustItem1Title || ''} onChange={handleChange} className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-900 border border-surface-border outline-none focus:border-blue-500 text-sm mb-2" />
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item 1 Description</label>
                <textarea rows="2" name="trustItem1Desc" value={formData?.trustItem1Desc || ''} onChange={handleChange} className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-600 border border-surface-border outline-none focus:border-blue-500 text-sm resize-none"></textarea>
             </div>
             <div className="space-y-2 mt-4 border-t border-surface-border pt-4">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Item 2 Title - e.g. Express Delivery</label>
                <input name="trustItem2Title" value={formData?.trustItem2Title || ''} onChange={handleChange} className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-900 border border-surface-border outline-none focus:border-blue-500 text-sm mb-2" />
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item 2 Description</label>
                <textarea rows="2" name="trustItem2Desc" value={formData?.trustItem2Desc || ''} onChange={handleChange} className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-600 border border-surface-border outline-none focus:border-blue-500 text-sm resize-none"></textarea>
             </div>
             <div className="space-y-2 border-t border-surface-border pt-4">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Item 3 Title - e.g. B2B Compliance</label>
                <input name="trustItem3Title" value={formData?.trustItem3Title || ''} onChange={handleChange} className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-900 border border-surface-border outline-none focus:border-blue-500 text-sm mb-2" />
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item 3 Description</label>
                <textarea rows="2" name="trustItem3Desc" value={formData?.trustItem3Desc || ''} onChange={handleChange} className="w-full bg-surface-light p-4 rounded-2xl font-bold text-slate-600 border border-surface-border outline-none focus:border-blue-500 text-sm resize-none"></textarea>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePageCMS;
