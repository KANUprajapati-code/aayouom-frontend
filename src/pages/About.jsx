import React from 'react';
import { ShieldCheck, Users, Award, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-secondary-500 font-black uppercase tracking-widest text-[10px] mb-4 block underline decoration-secondary-200 underline-offset-8">Our Mission</span>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-tight">Empowering Health Through Excellence</h1>
          <p className="text-slate-400 font-bold text-lg leading-relaxed">Wedome is a premium healthcare platform dedicated to providing authentic medicines, wellness products, and expert medical consultancies to households across the nation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { icon: ShieldCheck, title: "100% Authentic", desc: "Every product is verified by licensed pharmacists." },
            { icon: Users, title: "Expert Care", desc: "Access to verified doctors for real-time consultancy." },
            { icon: Award, title: "Quality First", desc: "Only the highest grade medical supplies for you." },
            { icon: Heart, title: "User Centric", desc: "Your health and happiness are our top priorities." }
          ].map((item, i) => (
            <div key={i} className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-primary-100 transition-all group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
