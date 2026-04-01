import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingDown, Zap, ShieldCheck, ArrowRight, Package, ShoppingCart } from 'lucide-react';

const Schemes = () => {
  const [content, setContent] = useState({
    title: 'Professional Medical Schemes',
    subtitle: 'Exclusive discounts and bulk offers for registered clinics.',
    description: 'Save up to 30% on essential medicines with our verified healthcare provider status. New schemes updated weekly.',
    imageUrl: ''
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, productsRes] = await Promise.all([
          axios.get('https://ayuom-backend.vercel.app/api/content/schemes').catch(() => ({ data: null })),
          axios.get('https://ayuom-backend.vercel.app/api/products?placement=schemes').catch(() => ({ data: [] }))
        ]);
        
        if (contentRes.data) {
          setContent(contentRes.data);
        }
        if (productsRes.data && productsRes.data.length > 0) {
          setProducts(productsRes.data);
        }
      } catch (err) {
        console.error('Error fetching schemes data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const schemesData = [
    {
      id: 1,
      title: "Quarterly Bulk Bonus",
      description: "Order over ₹50,000 this quarter and get an extra 5% cashback in your clinic wallet.",
      icon: TrendingDown,
      color: "emerald"
    },
    {
      id: 2,
      title: "New Clinic Kit",
      description: "First order special: Buy 10 units each of top 12 essential medicines and get 2 units free on each.",
      icon: Zap,
      color: "blue"
    },
    {
      id: 3,
      title: "Verified Pro Status",
      description: "Verified doctors get an additional 2% flat discount on all premium brands automatically.",
      icon: ShieldCheck,
      color: "purple"
    }
  ];

  if (loading) {
     return (
       <div className="flex items-center justify-center min-h-[400px]">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
       </div>
     );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative min-h-[400px] rounded-[2rem] overflow-hidden bg-slate-900 flex items-center p-8 md:p-16">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/20 to-transparent"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={14} /> Registered Doctor Exclusive
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
            {content.title}
          </h1>
          <p className="text-xl text-emerald-100 font-medium opacity-90">
            {content.subtitle}
          </p>
          <p className="text-slate-400 max-w-xl">
            {content.description}
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 group shadow-lg shadow-emerald-500/20">
              View All Products <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Schemes Grid */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Available Schemes</h2>
            <p className="text-slate-500 mt-2">Active benefits for your medical practice.</p>
          </div>
          <div className="bg-slate-100 p-1 rounded-xl flex">
            <button className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-bold shadow-sm">Active</button>
            <button className="px-4 py-2 text-slate-500 text-sm font-bold">Upcoming</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {schemesData.map((scheme) => (
            <div key={scheme.id} className="group relative bg-white rounded-[2rem] p-8 border border-slate-100 hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500">
              <div className={`w-14 h-14 rounded-2xl bg-${scheme.color}-50 text-${scheme.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <scheme.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{scheme.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                {scheme.description}
              </p>
              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Active Now</span>
                <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scheme Products */}
      {products.length > 0 && (
        <section className="space-y-8 mt-16 pt-8 border-t border-slate-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Products with active schemes</h2>
              <p className="text-slate-500 mt-2">Special volume discounts applied on these selected medicines.</p>
            </div>
            <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline">View completely catalog &rarr;</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <div key={product._id} className="bg-white rounded-[24px] p-5 border border-surface-border hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group flex flex-col h-full relative cursor-pointer">
                {/* Simulated schemes discount tags */}
                <div className="absolute top-4 left-4 z-10 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/30">
                  {idx % 2 === 0 ? 'Buy 10 Get 2' : '10% Cashback'}
                </div>
                <div className="relative aspect-square rounded-[16px] overflow-hidden bg-slate-50 mb-4 p-4 mt-8">
                  <img src={product.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5e4b2dcd9?w=300&q=80'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg" />
                </div>
                <div className="flex-grow flex flex-col justify-end space-y-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-tight mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">{product.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{product.manufacturer || 'General Pharma'}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400 line-through font-medium">₹{product.price ? Math.round(product.price * 1.25) : 320}</span>
                      <div className="text-lg font-black text-slate-900">₹{product.price || 250}</div>
                    </div>
                    <button className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trust Banner */}
      <section className="bg-emerald-50 rounded-[2rem] p-12 text-center space-y-4">
         <h3 className="text-2xl font-bold text-emerald-900">Need specific bulk pricing?</h3>
         <p className="text-emerald-700 max-w-2xl mx-auto">Our sales team works directly with large hospitals and medical institutions for custom quote requirements.</p>
         <button className="text-emerald-600 font-bold hover:underline">Contact Institutional Sales &rarr;</button>
      </section>
    </div>
  );
};

export default Schemes;
