import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  const [cms, setCms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields.");
      return;
    }

    setFormLoading(true);
    // Simulate API request
    setTimeout(() => {
      setSuccess("Your message has been successfully sent to our support team!");
      setFormData({ name: '', email: '', message: '' });
      setFormLoading(false);
    }, 1200);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('https://ayuom-backend.vercel.app/api/content/homepage');
        setCms(data);
      } catch (err) {
        console.error('Failed to fetch Contact content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div></div>;
  }

  const contactItems = [
    { icon: Phone, title: "Phone Support", info: cms?.contactPhone || "+91 123 456 7890" },
    { icon: Mail, title: "Email Us", info: cms?.contactEmail || "support@wedome.com" },
    { icon: MapPin, title: "Visit Clinic", info: cms?.contactAddress || "Healthcare Hub, Ahmedabad, India" }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 animate-in fade-in slide-in-from-left-4 duration-700">
            <span className="text-primary-600 font-black uppercase tracking-widest text-[10px] mb-4 block underline decoration-primary-200 underline-offset-8 transition-all">Get In Touch</span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-8">How can we<br /><span className="text-secondary-500 italic">help you?</span></h1>
            <p className="text-slate-400 font-bold mb-12 max-w-md leading-relaxed">Our team of licensed medical experts is available {cms?.contactHours || '24/7'} to assist with your orders and consultations.</p>
            
            <div className="space-y-6">
              {contactItems.map((item, i) => (
                <div key={i} className="flex gap-6 items-center bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary-100 transition-all group">
                  <div className="w-14 h-14 bg-slate-50 text-primary-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-all">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.title}</p>
                    <p className="font-black text-slate-900 leading-none">{item.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-[40px] p-12 shadow-2xl shadow-primary-600/10 border border-border-main">
               <h3 className="text-2xl font-black text-slate-900 mb-10">Send a Message</h3>
               <form onSubmit={handleSubmit} className="space-y-6">
                 {error && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm border border-red-100 font-bold">{error}</div>}
                 {success && <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm border border-emerald-100 font-bold">{success}</div>}
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name *</label>
                     <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-50 rounded-2xl py-4 px-6 font-bold outline-none focus:bg-white focus:border-primary-200 transition-all" placeholder="John Doe" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address *</label>
                     <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-50 rounded-2xl py-4 px-6 font-bold outline-none focus:bg-white focus:border-primary-200 transition-all" placeholder="john@example.com" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Message *</label>
                   <textarea name="message" value={formData.message} onChange={handleInputChange} required rows="5" className="w-full bg-slate-50 border border-slate-50 rounded-2xl py-6 px-6 font-bold outline-none focus:bg-white focus:border-primary-200 transition-all resize-none" placeholder="Tell us how we can help..."></textarea>
                 </div>
                 <button type="submit" disabled={formLoading} className="btn-primary w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary-200 flex items-center justify-center gap-3 disabled:opacity-50">
                   {formLoading ? 'Sending...' : <><MessageSquare className="w-5 h-5" /> Send Message</>}
                 </button>
               </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
