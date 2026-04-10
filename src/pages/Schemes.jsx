import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingDown, Zap, ShieldCheck, ArrowRight, Package, ShoppingCart, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Schemes = () => {
  const [content, setContent] = useState({
    title: 'Professional Medical Schemes',
    subtitle: 'Exclusive discounts and bulk offers for registered clinics.',
    description: 'Save up to 30% on essential medicines with our verified healthcare provider status. New schemes updated weekly.',
    imageUrl: ''
  });
  const [schemesData, setSchemesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const IconMap = {
    TrendingDown,
    Zap,
    ShieldCheck
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, productsRes, schemesRes] = await Promise.all([
          axios.get('https://ayuom-backend.vercel.app/api/content/schemes').catch(() => ({ data: null })),
          axios.get('https://ayuom-backend.vercel.app/api/products?placement=schemes').catch(() => ({ data: [] })),
          axios.get('https://ayuom-backend.vercel.app/api/schemesData').catch(() => ({ data: [] }))
        ]);
        
        if (contentRes.data) setContent(contentRes.data);
        if (productsRes.data && productsRes.data.length > 0) setProducts(productsRes.data);
        if (schemesRes.data && schemesRes.data.length > 0) setSchemesData(schemesRes.data.filter(s => s.status === 'Active'));

      } catch (err) {
        console.error('Error fetching schemes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Scheme Nodes...</p>
    </div>
  );

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="space-y-16 pb-24"
    >
      {/* Advanced Hero Section */}
      <section className="relative min-h-[500px] rounded-[3rem] overflow-hidden bg-slate-900 flex items-center p-8 md:p-20 group">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000" alt="" className="w-full h-full object-cover opacity-20 transition-transform duration-1000 group-hover:scale-110" />
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-3xl space-y-8">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/10">
            <Sparkles size={14} className="animate-pulse" /> Registered Partner Exclusive
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-white italic leading-none tracking-tighter">
            {content.title}
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-2xl text-emerald-100/80 font-medium tracking-tight max-w-2xl leading-relaxed">
            {content.subtitle}
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-6 pt-6">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-3 group shadow-2xl shadow-emerald-500/40 active:scale-95">
              Explore Active Matrix <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="flex -space-x-3 items-center">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                 </div>
               ))}
               <span className="pl-6 text-[10px] font-black text-white uppercase tracking-widest opacity-60">+1.2k Partners</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Schemes Matrix Grid */}
      <section className="space-y-12 px-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
             <div className="w-12 h-1 bg-emerald-500 rounded-full"></div>
            <h2 className="text-4xl font-black text-slate-950 italic tracking-tighter">AVAILABLE SCHEMES</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Real-time high-margin opportunities</p>
          </div>
          <div className="bg-slate-50 p-1.5 rounded-2xl flex border border-slate-200 shadow-sm">
            <button className="px-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-premium">Active</button>
            <button className="px-6 py-3 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors">Upcoming</button>
          </div>
        </div>

        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {schemesData.map((scheme, idx) => {
            const Icon = IconMap[scheme.icon] || Zap;
            return (
              <motion.div 
                key={scheme._id} 
                variants={itemVariants}
                className="group relative bg-white rounded-[40px] p-10 border border-slate-100 hover:border-emerald-500/20 hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.1)] transition-all duration-700"
              >
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
                   <ChevronRight size={32} className="text-emerald-50/50" />
                </div>
                
                <div className={`w-16 h-16 rounded-[24px] bg-emerald-50 text-emerald-600 flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm`}>
                  <Icon size={32} />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight italic leading-tight">{scheme.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {scheme.description}
                </p>
                
                <div className="mt-10 pt-10 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest opacity-40">Segment</span>
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{scheme.category}</span>
                  </div>
                  <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-sm">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Scheme Products */}
      <AnimatePresence>
        {products.length > 0 && (
          <section className="space-y-12 mt-24 pt-20 border-t border-slate-100 px-2">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-950 italic tracking-tighter">SCHEME PRODUCTS</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Instant bulk benefits applied at checkout</p>
              </div>
              <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all">View Full Catalogue &rarr;</button>
            </div>
            
            <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-8 lg:gap-10">
              {products.map((product, idx) => (
                <motion.div 
                  key={product._id} 
                  variants={itemVariants}
                  className="bg-white rounded-[40px] p-6 border border-slate-100 hover:border-emerald-500/30 hover:shadow-3xl transition-all duration-500 group flex flex-col h-full relative"
                >
                  <div className="absolute top-6 left-6 z-20 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-xl shadow-emerald-500/20 transform -rotate-3 group-hover:rotate-0 transition-transform">
                    {idx % 2 === 0 ? 'Buy 10 Get 2' : '15% Extra OFF'}
                  </div>
                  
                  <div className="relative aspect-square rounded-[32px] overflow-hidden bg-slate-50 mb-6 p-6 group-hover:bg-emerald-50 transition-all duration-700">
                    <img src={product.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5e4b2dcd9?w=300&q=80'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-end space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-900 leading-[1.1] mb-1 group-hover:text-emerald-600 transition-colors uppercase italic tracking-tighter min-h-[40px]">{product.name}</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-60 italic">{product.manufacturer || 'General Pharma'}</p>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-300 line-through font-black italic tracking-widest leading-none">₹{product.price ? Math.round(product.price * 1.2) : 320}</span>
                        <div className="text-2xl font-black text-slate-900 italic tracking-tighter">₹{product.price || 250}</div>
                      </div>
                      <button className="w-14 h-14 rounded-[20px] bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-premium active:scale-95 group/btn">
                        <ShoppingCart size={22} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}
      </AnimatePresence>

      <section className="relative bg-slate-900 rounded-[4rem] p-16 lg:p-24 overflow-hidden text-center group">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500 opacity-10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600 opacity-10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
         
         <div className="relative z-10 max-w-4xl mx-auto space-y-10">
            <motion.h3 variants={itemVariants} className="text-4xl lg:text-6xl font-black text-white italic tracking-tighter leading-tight">Need Institutional <br /> <span className="text-emerald-500">Bulk Pricing?</span></motion.h3>
            <motion.p variants={itemVariants} className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">Our advanced procurement matrix works directly with large hospitals and medical institutions for specialized quote requirements.</motion.p>
            <motion.button variants={itemVariants} className="bg-white text-slate-950 px-12 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-emerald-50 transition-all active:scale-95">
               Contact Institutional Sales
            </motion.button>
         </div>
      </section>
    </motion.div>
  );
};

export default Schemes;
