import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Heart, Zap, Award, Target, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
    const [cms, setCms] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCms = async () => {
            try {
                const { data } = await axios.get('https://ayuom-backend.vercel.app/api/content/homepage');
                setCms(data || {});
            } catch (err) {
                console.error('Failed to fetch About content', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCms();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="bg-white pb-24">
            {/* Hero Section */}
            <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-slate-900 rounded-b-[80px]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-primary-900/60 z-10"></div>
                    <img loading="lazy" src="https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=2000" 
                      className="w-full h-full object-cover grayscale opacity-40" 
                      alt="Healthcare" 
                    />
                </div>
                
                <div className="relative z-20 text-center space-y-6 max-w-4xl px-8">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 rounded-full border border-white/10 backdrop-blur-md"
                    >
                        <ShieldCheck size={18} className="text-primary-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Corporate Identity</span>
                    </motion.div>
                    <motion.h1 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="text-5xl lg:text-7xl font-black text-white tracking-tighter italic uppercase"
                    >
                        Wedome <span className="text-primary-500">Group</span>
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Leading the digital transformation of pharmaceutical procurement and clinical consultations across India.
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="max-w-7xl mx-auto px-8 -mt-24 relative z-30">
                <div className="bg-white rounded-[56px] shadow-3xl p-12 lg:p-24 border border-slate-100 flex flex-col lg:flex-row gap-20 items-center">
                    <div className="lg:w-1/2 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-sm font-black text-primary-600 uppercase tracking-[0.4em] flex items-center gap-2">
                                <div className="w-8 h-px bg-primary-600"></div> Our Purpose
                            </h2>
                            <h3 className="text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                                {cms.aboutMissionTitle}
                            </h3>
                        </div>
                        <p className="text-xl text-text-muted leading-relaxed">
                            {cms.aboutMissionDesc}
                        </p>
                        <div className="flex gap-12 border-t border-slate-50 pt-10">
                            <div>
                                <p className="text-4xl font-black text-slate-900">100%</p>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Authenticity Guaranteed</p>
                            </div>
                            <div>
                                <p className="text-4xl font-black text-slate-900">24/7</p>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Support Available</p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative">
                        <div className="absolute -inset-10 bg-primary-600 opacity-5 blur-[100px] rounded-full"></div>
                        <img loading="lazy" src="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1000" 
                          className="relative rounded-[40px] shadow-2xl border-4 border-white" 
                          alt="Medicine" 
                        />
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="max-w-7xl mx-auto px-8 mt-40">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {[1, 2, 3, 4].map((i) => (
                        <motion.div 
                          key={i} 
                          variants={itemVariants}
                          className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 group hover:bg-white hover:shadow-2xl hover:shadow-primary-600/5 transition-all duration-500"
                        >
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary-600 mb-8 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                                {i === 1 && <ShieldCheck size={32} />}
                                {i === 2 && <Users size={32} />}
                                {i === 3 && <Award size={32} />}
                                {i === 4 && <Target size={32} />}
                            </div>
                            <h4 className="text-xl font-black text-slate-900 mb-4">{cms[`aboutValue${i}Title`]}</h4>
                            <p className="text-slate-500 leading-relaxed text-sm">{cms[`aboutValue${i}Desc`]}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Call to Action */}
            <section className="max-w-7xl mx-auto px-8 mt-40">
                <div className="bg-primary-900 rounded-[56px] p-12 lg:p-24 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600 rounded-full blur-[120px] opacity-20"></div>
                    <div className="relative z-10 space-y-10">
                        <h2 className="text-4xl lg:text-6xl font-black italic tracking-tighter uppercase leading-tight">Ready to join the <br /> Wedome ecosystem?</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button className="bg-white text-primary-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary-50 transition-all">
                                Partner With Us <ArrowRight size={18} />
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                                View Solutions
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
