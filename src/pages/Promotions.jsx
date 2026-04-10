import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, 
  Zap, 
  TrendingDown, 
  ShieldCheck, 
  Clock, 
  Copy, 
  CheckCircle2, 
  ArrowRight,
  Gift,
  Ticket,
  ChevronRight,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const Promotions = () => {
  const [activeTab, setActiveTab] = useState('coupons');
  const [coupons, setCoupons] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [couponRes, offerRes] = await Promise.all([
        axios.get('http://localhost:5000/api/promos/coupons'),
        axios.get('http://localhost:5000/api/promos/offers')
      ]);
      setCoupons(couponRes.data);
      setOffers(offerRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100"
          >
            <Zap size={14} /> Flash Deals & Offers
          </motion.div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
            Unlock <span className="text-emerald-600">Premium Savings</span>
          </h1>
          <p className="text-slate-500 font-bold leading-relaxed">
            Discover exclusive discounts and seasonal offers curated specifically for healthcare professionals and clinics.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="bg-white p-1.5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex gap-1">
            <button 
              onClick={() => setActiveTab('coupons')}
              className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'coupons' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              Promo Coupons
            </button>
            <button 
              onClick={() => setActiveTab('offers')}
              className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'offers' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              Active Schemes
            </button>
          </div>
        </div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {activeTab === 'coupons' ? (
            <motion.div 
              key="coupons-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {coupons.length > 0 ? coupons.map((coupon, i) => (
                <div key={coupon._id} className="relative group">
                  <div className="absolute inset-0 bg-emerald-600 rounded-[32px] translate-y-2 group-hover:translate-y-3 transition-transform opacity-10" />
                  <div className="bg-white border border-slate-100 rounded-[32px] p-8 space-y-6 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                    {/* Ticket Design Hole Left */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-12 bg-slate-50 rounded-r-3xl border-r border-slate-100 -ml-4" />
                    {/* Ticket Design Hole Right */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-12 bg-slate-50 rounded-l-3xl border-l border-slate-100 -mr-4" />
                    
                    <div className="flex justify-between items-start">
                       <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                          <Ticket size={24} />
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full">
                            Expires in {Math.ceil((new Date(coupon.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))}d
                          </span>
                       </div>
                    </div>

                    <div>
                       <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                         {coupon.value}{coupon.discountType === 'Percentage' ? '%' : ' OFF'}
                       </h3>
                       <p className="text-slate-500 font-bold text-xs mt-1">
                         Min. Order: ₹{coupon.minOrderAmount}
                       </p>
                    </div>

                    <div className="pt-6 border-t border-dashed border-slate-200">
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="font-black text-lg tracking-widest text-slate-900">{coupon.code}</span>
                          <button 
                            onClick={() => handleCopy(coupon.code)}
                            className="text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:text-emerald-700 transition-colors flex items-center gap-2"
                          >
                             {copiedCode === coupon.code ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                             {copiedCode === coupon.code ? 'Copied' : 'Copy'}
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                   No promo coupons available currently.
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="offers-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-6"
            >
              {offers.length > 0 ? offers.map((offer, i) => (
                <div key={offer._id} className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-12 shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row gap-12 items-center hover:scale-[1.01] transition-transform">
                   <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 shadow-inner">
                      <Zap size={48} strokeWidth={2.5} className="group-hover:animate-pulse" />
                   </div>
                   <div className="space-y-4 flex-grow text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-4">
                        <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Hot Offer</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12} /> Ends in 3 Days</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">{offer.title}</h3>
                      <p className="text-slate-500 font-bold leading-relaxed max-w-2xl">{offer.description}</p>
                   </div>
                   <div className="shrink-0 space-y-4 w-full md:w-auto">
                      <button className="w-full md:px-10 py-5 bg-emerald-600 text-white rounded-[24px] font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">
                         Apply Offer <ArrowRight size={18} />
                      </button>
                      <p className="text-[9px] font-black text-slate-400 text-center uppercase tracking-widest">Selected categories only</p>
                   </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                   No active schemes found.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Banner */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="bg-slate-900 rounded-[50px] p-12 text-center space-y-8 relative overflow-hidden"
        >
           <div className="relative z-10 space-y-4">
              <h2 className="text-4xl font-black text-white tracking-tighter">Never miss a <span className="text-emerald-500 italic">deal.</span></h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Join 10,000+ medical professionals already saving on Wedome</p>
              <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
                 <input 
                  type="email" 
                  placeholder="enter your clinic email" 
                  className="bg-white/10 border-2 border-white/10 rounded-2xl px-8 py-5 text-white font-bold outline-none focus:border-emerald-500 transition-all w-full md:w-96" 
                 />
                 <button className="bg-emerald-500 text-slate-900 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20">
                   Get Deal Alerts
                 </button>
              </div>
           </div>
           
           {/* Decorative background shapes */}
           <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -ml-32 -mt-32" />
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] -mr-32 -mb-32" />
        </motion.div>

      </div>
    </div>
  );
};

export default Promotions;
