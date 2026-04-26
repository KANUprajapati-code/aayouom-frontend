import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  TrendingDown, 
  Package, 
  Truck, 
  History, 
  ChevronRight,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Info,
  ShoppingCart,
  MessageCircle,
  Zap,
  Tag
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SchemeBadge from '../components/common/SchemeBadge';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`https://ayuom-backend.vercel.app/api/products/${id}`);
        setMedicine(data);
        if (data) {
           setMainImage(data.images?.length > 0 ? data.images[0] : (data.image || 'https://via.placeholder.com/400'));
           // Pre-select first variant if exists
           if (data.variants && data.variants.length > 0) {
              setSelectedVariant(data.variants[0]);
           }
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleInquiry = () => {
    if (!medicine) return;
    const whatsappNumber = "917990411390"; 
    const variantStr = selectedVariant ? ` (Variant: ${selectedVariant.name})` : '';
    const message = `Hi, I am interested in *${medicine.name}*${variantStr} (Price: ₹${selectedVariant ? selectedVariant.price : medicine.price}). Can you provide more details? 
Link: ${window.location.origin}/product/${medicine._id}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const displayPrice = selectedVariant ? selectedVariant.price : medicine?.price;
  const displayOriginal = selectedVariant ? selectedVariant.originalPrice : medicine?.originalPrice;
  const displayStock = selectedVariant ? selectedVariant.stock : medicine?.stock;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-black text-slate-800 mb-4">Product Node Not Found</h2>
        <button onClick={() => navigate('/products')} className="btn-primary">Back to Marketplace</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto px-4 font-sans">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-primary-600 font-bold transition-all group"
      >
        <div className="w-8 h-8 rounded-full border border-surface-border flex items-center justify-center group-hover:border-primary-200">
          <ArrowLeft size={18} />
        </div>
        Back to Marketplace
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="bg-white p-8 aspect-square flex items-center justify-center relative rounded-[48px] border border-slate-100 shadow-premium group overflow-hidden">
             <div className="absolute top-8 left-8 z-10">
               {(medicine.scheme || medicine.schemeRules?.length > 0) && (
                 <div className="bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
                    <Zap size={14} className="fill-white" /> BULK SCHEME ACTIVE
                 </div>
               )}
             </div>
             <img loading="lazy" src={mainImage} 
               alt={medicine.name} 
               className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out" 
             />
          </div>
          
          {medicine.images && medicine.images.length > 1 && (
             <div className="flex items-center gap-4 overflow-x-auto pb-4 custom-scrollbar justify-center">
                {medicine.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setMainImage(img)}
                    className={`shrink-0 w-24 h-24 bg-white rounded-3xl border-2 p-3 flex items-center justify-center transition-all ${
                       mainImage === img 
                         ? 'border-primary-500 shadow-xl shadow-primary-500/10' 
                         : 'border-slate-50 opacity-60 hover:opacity-100 hover:border-slate-200'
                    }`}
                  >
                     <img src={img} alt="" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
             </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-8">
           <div className="space-y-3">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full border border-primary-100">{medicine.brand || "Institutional Node"}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{medicine.category}</span>
             </div>
             <h1 className="text-4xl lg:text-5xl font-black text-slate-950 leading-[1.1] tracking-tighter italic uppercase">{medicine.name}</h1>
           </div>

           {/* Variant Selection (Amazon Style) */}
           {medicine.variants && medicine.variants.length > 0 && (
             <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select potency / capacity:</p>
                <div className="flex flex-wrap gap-3">
                   {medicine.variants.map((v, idx) => (
                     <button 
                       key={idx}
                       onClick={() => setSelectedVariant(v)}
                       className={`px-6 py-4 rounded-2xl font-black text-sm transition-all border-2 flex flex-col items-center gap-1 min-w-[100px] ${
                         selectedVariant?.name === v.name 
                           ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-105' 
                           : 'bg-white border-slate-100 text-slate-500 hover:border-primary-200'
                       }`}
                     >
                        <span>{v.name}</span>
                        <span className={`text-[10px] ${selectedVariant?.name === v.name ? 'text-blue-400' : 'text-slate-400'}`}>₹{v.price}</span>
                     </button>
                   ))}
                </div>
             </div>
           )}

           <div className="p-8 bg-slate-50 rounded-[48px] border border-slate-100 space-y-8 shadow-inner">
              <div className="flex items-end justify-between px-2">
                <div>
                   {displayOriginal && <p className="text-xs text-slate-400 line-through mb-1 font-bold">MRP ₹{displayOriginal}</p>}
                   <div className="flex items-baseline gap-3">
                     <span className="text-5xl font-black text-slate-950 tracking-tighter">₹{displayPrice}</span>
                     {displayOriginal && (
                        <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {Math.round(((displayOriginal - displayPrice) / displayOriginal) * 100)}% OFF
                        </span>
                     )}
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Institutional Stock</p>
                   {displayStock > 0 ? (
                     <div className="flex flex-col items-end">
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-tight flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                           Operational ({displayStock} units)
                        </span>
                     </div>
                   ) : (
                     <span className="text-xs font-black text-rose-500 uppercase tracking-tight flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Depleted
                     </span>
                   )}
                </div>
              </div>

              {(medicine.scheme || (medicine.freeUnitsScheme && medicine.freeUnitsScheme.buy)) && (
                <div className="p-6 bg-gradient-to-br from-orange-500 to-rose-600 rounded-[32px] text-white flex items-center justify-between shadow-xl shadow-orange-500/20 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                   <div className="flex items-center gap-5 relative z-10">
                     <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0">
                        <Zap size={28} className="fill-white" />
                     </div>
                     <div>
                       <p className="text-sm font-black uppercase tracking-widest text-orange-100 leading-none mb-1">Active Batch Protocol</p>
                       <p className="text-2xl font-black italic tracking-tighter uppercase">
                         {medicine.freeUnitsScheme?.buy 
                           ? `BUY ${medicine.freeUnitsScheme.buy} GET ${medicine.freeUnitsScheme.free} FREE` 
                           : medicine.scheme}
                       </p>
                       <p className="text-[10px] text-white/60 font-medium uppercase tracking-[0.2em] mt-1 italic">Verified Institutional Scheme</p>
                     </div>
                   </div>
                   <div className="hidden sm:block">
                      <ChevronRight size={24} className="text-white/40" />
                   </div>
                </div>
              )}

              {/* Selection & Cart Controls */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <div className="flex items-center gap-6 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-slate-400 hover:text-black p-1 transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-2xl font-black w-10 text-center text-slate-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-slate-400 hover:text-black p-1 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                 </div>
                 <button 
                   onClick={() => addToCart(medicine, quantity, selectedVariant)}
                   className="flex-grow py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all active:scale-95"
                 >
                    DEPLOY TO CART
                    <ShoppingCart size={20} />
                 </button>
              </div>

              <button 
                onClick={handleInquiry}
                className="w-full py-5 bg-white text-emerald-600 rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-emerald-600 hover:text-white border border-emerald-100 transition-all shadow-sm"
              >
                 <MessageCircle size={18} /> Professional Inquiry (WhatsApp)
              </button>
           </div>
        </div>
      </div>

      {/* Schemes / Bulk Discounts Table */}
      {medicine.schemeRules && medicine.schemeRules.length > 0 && (
        <section className="bg-emerald-950 rounded-[48px] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500 opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
           <div className="relative z-10 space-y-10">
              <div className="space-y-2">
                 <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
                    <Zap size={16} className="fill-emerald-400" /> Yield Maximization
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">Bulk Institutional Schemes</h2>
                 <p className="text-emerald-500/60 text-sm font-semibold max-w-xl">Scale your clinic inventory with our specialized quantity-based yield protocols. Savings applied at checkout matrix.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {medicine.schemeRules.sort((a,b) => a.minUnits - b.minUnits).map((rule, idx) => (
                   <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-[32px] text-center space-y-4 backdrop-blur-md hover:bg-white/10 transition-all group">
                      <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">MINIMUM ORDER</div>
                      <div className="text-4xl font-black italic">{rule.minUnits} UNITS</div>
                      <div className="h-1 w-10 bg-emerald-500 mx-auto rounded-full group-hover:w-full transition-all duration-500"></div>
                      <div className="text-sm font-bold text-slate-400">Yield Discount</div>
                      <div className="text-2xl font-black text-emerald-400">{rule.discountPercentage}% OFF</div>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      )}

      {/* Product Description */}
      <section className="bg-white rounded-[48px] border border-slate-100 p-10 md:p-20 shadow-premium grid md:grid-cols-3 gap-16">
         <div className="md:col-span-2 space-y-10">
            <div className="space-y-4">
               <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-950 flex items-center gap-4">
                  <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                  Clinical Narrative
               </h2>
               <div className="text-slate-500 text-base leading-relaxed font-semibold italic p-8 bg-slate-50 rounded-[32px] border border-slate-100 shadow-inner">
                  "{medicine.description || "Detailed clinical specifications and professional guidance nodes are provided upon institutional procurement."}"
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                     <Tag size={12} className="text-blue-500" /> Logistics Node
                  </div>
                  <div className="p-6 bg-white border border-slate-100 rounded-3xl space-y-1 shadow-sm">
                     <p className="font-black text-slate-900 text-sm">Institutional Sealed</p>
                     <p className="text-xs text-slate-400 font-medium">Original pharmaceutical pack.</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                     <History size={12} className="text-blue-500" /> Batch Tracking
                  </div>
                  <div className="p-6 bg-white border border-slate-100 rounded-3xl space-y-1 shadow-sm">
                     <p className="font-black text-slate-900 text-sm">Node Freshness</p>
                     <p className="text-xs text-slate-400 font-medium">Long shelf-life authenticated.</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="p-8 bg-slate-950 rounded-[40px] text-white space-y-6 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 opacity-20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10">
                  <ShieldCheck size={28} />
               </div>
               <div className="space-y-2">
                  <h4 className="text-xl font-black italic uppercase italic">Clinic Verified</h4>
                  <p className="text-slate-400 text-xs font-semibold leading-relaxed">This product node is part of the established AYUOM clinical supply network. Authentic pharmaceutical grade guaranteed.</p>
               </div>
            </div>

            <div className="p-8 bg-blue-600 rounded-[40px] text-white flex gap-5 shadow-2xl items-start shadow-blue-600/20">
               <Truck size={32} />
               <div>
                  <h4 className="text-xl font-black italic uppercase">Matrix Express</h4>
                  <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider mt-2">24-48 HR CLINIC DELIVERY</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default ProductDetail;

