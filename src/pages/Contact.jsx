import React from 'react';
import { MessageSquare, Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <span className="text-primary-600 font-black uppercase tracking-widest text-[10px] mb-4 block">Get In Touch</span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-8">How can we<br /><span className="text-secondary-500">help you?</span></h1>
            <p className="text-slate-400 font-bold mb-12 max-w-md">Our team of licensed medical experts is available 24/7 to assist with your orders and consultations.</p>
            
            <div className="space-y-8">
              {[
                { icon: Phone, title: "Phone Support", info: "+91 123 456 7890" },
                { icon: Mail, title: "Email Us", info: "support@wedome.com" },
                { icon: MapPin, title: "Visit Clinic", info: "Healthcare Hub, 402, Mumbai, India" }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.title}</p>
                    <p className="font-black text-slate-900">{item.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-[40px] p-12 shadow-2xl shadow-primary-600/10 border border-border-main">
               <h3 className="text-2xl font-black text-slate-900 mb-10">Send a Message</h3>
               <form className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                     <input type="text" className="w-full bg-slate-50 border border-slate-50 rounded-2xl py-4 px-6 font-bold outline-none focus:bg-white focus:border-primary-200 transition-all" placeholder="John Doe" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                     <input type="email" className="w-full bg-slate-50 border border-slate-50 rounded-2xl py-4 px-6 font-bold outline-none focus:bg-white focus:border-primary-200 transition-all" placeholder="john@example.com" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Message</label>
                   <textarea rows="5" className="w-full bg-slate-50 border border-slate-50 rounded-2xl py-6 px-6 font-bold outline-none focus:bg-white focus:border-primary-200 transition-all resize-none" placeholder="Tell us how we can help..."></textarea>
                 </div>
                 <button className="btn-primary w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary-200 flex items-center justify-center gap-3">
                   <MessageSquare className="w-5 h-5" /> Send Message
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
