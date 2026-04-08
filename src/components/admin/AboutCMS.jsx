import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Info, Heart, Target, Star, Users } from 'lucide-react';

const AboutCMS = () => {
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
      console.error('Failed to fetch about content', error);
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
      alert('About page content updated!');
    } catch (error) {
      alert('Error updating content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse font-black uppercase text-slate-300 tracking-widest">Loading About Node...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex justify-between items-end mb-12 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">About Us CMS</h2>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Customize your brand story and mission statement</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-slate-900 hover:bg-black text-white font-black px-10 py-5 rounded-3xl text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 transition-all active:scale-95">
          {saving ? 'Saving...' : <><Save size={18} /> Sync Brand Identity</>}
        </button>
      </div>

      <div className="space-y-12">
        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-8">
           <h3 className="text-xl font-black text-primary-600 uppercase tracking-widest flex items-center gap-3"><Info size={20} /> Mission & Vision</h3>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Heading</label>
                 <input name="aboutMissionTitle" value={formData.aboutMissionTitle} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none focus:bg-white focus:border-primary-500 transition-all" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Description</label>
                 <textarea rows="4" name="aboutMissionDesc" value={formData.aboutMissionDesc} onChange={handleChange} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-slate-600 border border-slate-100 outline-none focus:bg-white focus:border-primary-500 transition-all resize-none"></textarea>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-8">
           <h3 className="text-xl font-black text-emerald-600 uppercase tracking-widest flex items-center gap-3"><Heart size={20} /> Core Values</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                 <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Value {i}</p>
                    <input name={`aboutValue${i}Title`} value={formData[`aboutValue${i}Title`]} onChange={handleChange} placeholder="Title" className="w-full bg-white p-4 rounded-xl font-bold text-slate-900 border border-slate-100 outline-none text-sm" />
                    <textarea rows="2" name={`aboutValue${i}Desc`} value={formData[`aboutValue${i}Desc`]} onChange={handleChange} placeholder="Description" className="w-full bg-white p-4 rounded-xl font-bold text-slate-600 border border-slate-100 outline-none text-sm resize-none"></textarea>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCMS;
