import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Users, Award, Heart } from 'lucide-react';

const About = () => {
  const [cms, setCms] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('https://ayuom-backend.vercel.app/api/content/homepage');
        setCms(data);
      } catch (err) {
        console.error('Failed to fetch About content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div></div>;
  }

  const values = [
    { icon: ShieldCheck, title: cms?.aboutValue1Title || "100% Authentic", desc: cms?.aboutValue1Desc || "Every product is verified by licensed pharmacists." },
    { icon: Users, title: cms?.aboutValue2Title || "Expert Care", desc: cms?.aboutValue2Desc || "Access to verified doctors for real-time consultancy." },
    { icon: Award, title: cms?.aboutValue3Title || "Quality First", desc: cms?.aboutValue3Desc || "Only the highest grade medical supplies for you." },
    { icon: Heart, title: cms?.aboutValue4Title || "User Centric", desc: cms?.aboutValue4Desc || "Your health and happiness are our top priorities." }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="text-secondary-500 font-black uppercase tracking-widest text-[10px] mb-4 block underline decoration-secondary-200 underline-offset-8">Our Mission</span>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-tight">{cms?.aboutMissionTitle || "Empowering Health Through Excellence"}</h1>
          <p className="text-slate-400 font-bold text-lg leading-relaxed">{cms?.aboutMissionDesc || "Wedome is a premium healthcare platform dedicated to providing authentic medicines, wellness products, and expert medical consultancies to households across the nation."}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {values.map((item, i) => (
            <div key={i} className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-primary-100 transition-all group animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: `${i * 150}ms` }}>
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
