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
import SEO from '../components/common/SEO';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

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

  const handleWhatsAppBuyNow = () => {
    if (!medicine) return;
    const whatsappNumber = "919265401508"; 
    const variantStr = selectedVariant ? ` (Variant: ${selectedVariant.name})` : '';
    const message = `*📦 New Buy Request*\n` +
                   `--------------------------\n` +
                   `*Product:* ${medicine.name}${variantStr}\n` +
                   `*Quantity:* ${quantity}\n` +
                   `*Price per unit:* ₹${displayPrice}\n` +
                   `*Total Amount:* ₹${(displayPrice * quantity).toLocaleString()}\n` +
                   `--------------------------\n` +
                   `Link: ${window.location.origin}/product/${medicine._id}\n` +
                   `_Sent from Ayuone Marketplace_`;
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
      <SEO 
        title={medicine.name} 
        description={`Buy ${medicine.name} online at Ayuone. ${medicine.description?.substring(0, 150)}... High-quality healthcare supplies.`}
        keywords={`${medicine.name}, ${medicine.category}, Buy ${medicine.name} Bulk`}
        image={mainImage}
      />
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-green font-bold transition-all group"
      >
        <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-brand-green/20">
          <ArrowLeft size={18} />
        </div>
        Back to Products
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="aspect-square rounded-[32px] md:rounded-[48px] bg-white border border-slate-100 p-6 md:p-12 flex items-center justify-center relative overflow-hidden shadow-sm group">
              {/* Scheme Badge Top-Left */}
              <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 pointer-events-none">
                 {(medicine.scheme || (medicine.schemeRules && medicine.schemeRules.length > 0)) && (
                   <div className="bg-brand-green text-white text-[8px] md:text-[10px] font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl shadow-lg flex items-center gap-2 uppercase tracking-widest border border-white/20">
                      <Zap size={12} className="md:w-3.5 md:h-3.5 fill-white" /> BULK SAVINGS
                   </div>
                 )}
              </div>

              {/* Discount Badge Top-Right */}
              {displayOriginal && displayPrice < displayOriginal && (
                 <div className="absolute top-0 right-0 z-10">
                    <div className="bg-rose-500 text-white text-xs font-bold px-6 py-3 rounded-bl-3xl shadow-lg uppercase tracking-wider">
                       Save {Math.round(((displayOriginal - displayPrice) / displayOriginal) * 100)}%
                    </div>
                 </div>
              )}
              <motion.img 
                key={mainImage}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={mainImage} 
                alt={medicine.name} 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
          </div>
          
          {medicine.images && medicine.images.length > 1 && (
             <div className="flex items-center gap-4 overflow-x-auto pb-4 custom-scrollbar justify-center">
                {medicine.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setMainImage(img)}
                    className={`shrink-0 w-20 h-20 bg-white rounded-2xl border-2 p-2 flex items-center justify-center transition-all ${
                       mainImage === img 
                         ? 'border-brand-green shadow-md shadow-brand-green/10' 
                         : 'border-slate-50 opacity-60 hover:opacity-100 hover:border-slate-200'
                    }`}
                  >
                     <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                  </button>
                ))}
             </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-8">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-2">
                 <span className="text-[9px] md:text-[10px] font-bold text-brand-green uppercase tracking-widest bg-brand-green/5 px-2 md:px-3 py-0.5 md:py-1 rounded-lg border border-brand-green/10">{medicine.brand || "Ayuone Premium"}</span>
                 <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{medicine.category}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-slate-900 leading-[1.2] tracking-tight">{medicine.name}</h1>
           </div>

           {/* Variant Selection */}
           {medicine.variants && medicine.variants.length > 0 && (
             <div className="space-y-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Choose Variant:</p>
                <div className="flex flex-wrap gap-3">
                   {medicine.variants.map((v, idx) => (
                     <button 
                       key={idx}
                       onClick={() => setSelectedVariant(v)}
                       className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all border-2 flex flex-col items-center gap-1 min-w-[110px] ${
                         selectedVariant?.name === v.name 
                           ? 'bg-brand-green border-brand-green text-white shadow-lg' 
                           : 'bg-white border-slate-100 text-slate-500 hover:border-brand-green/20'
                       }`}
                     >
                        <span>{v.name}</span>
                        <span className={`text-[10px] ${selectedVariant?.name === v.name ? 'text-white/70' : 'text-slate-400'}`}>₹{v.price}</span>
                     </button>
                   ))}
                </div>
             </div>
           )}

            <div className="p-6 md:p-8 bg-slate-50 rounded-[32px] md:rounded-[40px] border border-slate-100 space-y-6 md:space-y-8">
              <div className="flex items-end justify-between px-1 md:px-2">
                <div className="space-y-1">
                   {displayOriginal && <p className="text-[10px] md:text-xs text-slate-400 line-through font-bold">MRP ₹{displayOriginal}</p>}
                   <div className="flex items-baseline gap-2 md:gap-3">
                     <span className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">₹{displayPrice}</span>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Availability</p>
                   {displayStock > 0 ? (
                     <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-tight flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                           In Stock ({displayStock})
                        </span>
                     </div>
                   ) : (
                     <span className="text-xs font-bold text-rose-500 uppercase tracking-tight flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Out of Stock
                     </span>
                   )}
                </div>
              </div>

               {(medicine.scheme || medicine.freeUnitsScheme?.buy) && (
                <div className="p-4 md:p-6 bg-brand-green rounded-2xl md:rounded-3xl text-white flex items-center justify-between shadow-xl shadow-brand-green/20 relative overflow-hidden group">
                   <div className="flex items-center gap-3 md:gap-4 relative z-10">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0">
                        <Zap size={20} className="md:w-6 md:h-6 fill-white" />
                     </div>
                     <div>
                       <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/70 leading-none mb-1 md:mb-1.5">Special Offer</p>
                       <p className="text-lg md:text-xl font-bold tracking-tight">
                         {medicine.freeUnitsScheme?.buy 
                           ? `Buy ${medicine.freeUnitsScheme.buy} Get ${medicine.freeUnitsScheme.free} Free` 
                           : medicine.scheme}
                       </p>
                     </div>
                   </div>
                </div>
               )}

              {/* Selection & Action Buttons */}
              <div className="space-y-4 pt-4">
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl px-6 py-4 sm:w-40">
                       <button 
                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
                         className="text-slate-400 hover:text-brand-green transition-colors"
                       >
                         <Minus size={18} />
                       </button>
                       <span className="text-xl font-bold text-slate-900">{quantity}</span>
                       <button 
                         onClick={() => setQuantity(quantity + 1)}
                         className="text-slate-400 hover:text-brand-green transition-colors"
                       >
                         <Plus size={18} />
                       </button>
                    </div>
                    <button 
                      onClick={() => addToCart(medicine, quantity, selectedVariant)}
                      className="flex-grow py-4 bg-white border-2 border-brand-green text-brand-green hover:bg-brand-green/5 rounded-2xl font-bold text-sm tracking-widest shadow-sm flex items-center justify-center gap-3 transition-all active:scale-95"
                    >
                       ADD TO CART
                       <ShoppingCart size={18} />
                    </button>
                 </div>
                 
                 <button 
                   onClick={handleWhatsAppBuyNow}
                   className="w-full py-4 bg-brand-green hover:bg-brand-green/90 text-white rounded-2xl font-bold text-sm tracking-widest shadow-lg shadow-brand-green/20 flex items-center justify-center gap-3 transition-all active:scale-95"
                 >
                    <MessageCircle size={20} className="fill-white/20" />
                    BUY NOW ON WHATSAPP
                 </button>
              </div>
           </div>
        </div>
      </div>

       {/* Schemes / Bulk Discounts Table */}
      {medicine.schemeRules && medicine.schemeRules.length > 0 && (
        <section className="bg-slate-900 rounded-[32px] md:rounded-[48px] p-6 md:p-16 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-80 h-80 bg-brand-green/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
           <div className="relative z-10 space-y-8 md:space-y-10">
              <div className="space-y-2">
                 <div className="flex items-center gap-2 md:gap-3 text-brand-green font-bold text-[10px] md:text-[11px] uppercase tracking-widest">
                    <Zap size={14} className="md:w-4 md:h-4 fill-brand-green" /> Yield Maximization
                 </div>
                 <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Bulk Purchase Benefits</h2>
                 <p className="text-slate-400 text-xs md:text-sm font-medium max-w-xl">Save more when you stock up. These discounts are automatically applied to your cart based on quantity.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                 {medicine.schemeRules.sort((a,b) => a.minUnits - b.minUnits).map((rule, idx) => (
                   <div key={idx} className="bg-white/5 border border-white/10 p-4 md:p-8 rounded-2xl md:rounded-3xl text-center space-y-2 md:space-y-4 backdrop-blur-md hover:bg-white/10 transition-all group">
                      <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Min. Qty</p>
                      <p className="text-xl md:text-3xl font-bold">{rule.minUnits} Units</p>
                      <div className="h-0.5 w-6 md:w-8 bg-brand-green mx-auto rounded-full group-hover:w-16 transition-all duration-500"></div>
                      <p className="text-lg md:text-2xl font-bold text-brand-green">{rule.discountPercentage}% OFF</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      )}

      {/* Product Description */}
      <section className="bg-white rounded-[32px] md:rounded-[48px] border border-slate-100 p-6 md:p-16 shadow-sm grid md:grid-cols-3 gap-8 md:gap-12">
         <div className="md:col-span-2 space-y-6 md:space-y-8">
            <div className="space-y-4">
               <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-brand-green rounded-full"></div>
                  Clinical Information
               </h2>
               <div className="text-slate-500 text-sm md:text-base leading-relaxed font-medium p-6 md:p-8 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-50">
                  {medicine.description || "Detailed clinical specifications and professional guidance are provided upon procurement."}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="p-6 bg-white border border-slate-100 rounded-3xl space-y-1">
                  <p className="font-bold text-slate-900 text-sm">Quality Guaranteed</p>
                  <p className="text-xs text-slate-400 font-medium">100% authentic medical supplies.</p>
               </div>
               <div className="p-6 bg-white border border-slate-100 rounded-3xl space-y-1">
                  <p className="font-bold text-slate-900 text-sm">Safe Packaging</p>
                  <p className="text-xs text-slate-400 font-medium">Clinically approved storage.</p>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="p-8 bg-slate-900 rounded-[32px] text-white space-y-6 relative overflow-hidden group">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-green border border-white/10">
                  <ShieldCheck size={24} />
               </div>
               <div className="space-y-2">
                  <h4 className="text-lg font-bold">Ayuone Verified</h4>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed">This product is part of our established clinical supply network. Authentic pharmaceutical grade guaranteed.</p>
               </div>
            </div>

            <div className="p-8 bg-brand-green rounded-[32px] text-white flex gap-4 shadow-lg items-center shadow-brand-green/10">
               <Truck size={28} />
               <div>
                  <h4 className="text-lg font-bold">Fast Delivery</h4>
                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">24-48 HR CLINIC DISPATCH</p>
               </div>
            </div>
         </div>
      </section>
    </div>

  );
};

export default ProductDetail;

