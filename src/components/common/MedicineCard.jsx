import { Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Info, TrendingUp, Tag, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const MedicineCard = ({ medicine, onAddToCart }) => {
  if (!medicine) return null;
  const {
    _id,
    name,
    brand,
    mrp,
    price,
    scheme,
    image,
    stock,
    discount,
    isBestDeal = false
  } = medicine;
  const availableStock = stock !== undefined ? stock : Infinity;

  const handleWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hello Wedome! I'm interested in buying bulk quantities of: *${name}* (Brand: ${brand}). Could you share the best negotiated price and availability?`;
    window.open(`https://wa.me/919999988888?text=${encodeURIComponent(message)}`, '_blank');
  };

  const calculatedDiscount = discount || (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`group flex flex-col relative bg-white rounded-3xl border border-slate-100 p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-600/10 hover:border-primary-200 h-full overflow-hidden ${isBestDeal ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}
    >
      {/* Top Floating Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
        {isBestDeal && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-rose-500 text-white text-[9px] font-black px-3 py-1.5 rounded-xl shadow-lg shadow-rose-500/30 flex items-center gap-1.5 uppercase tracking-widest backdrop-blur-md"
          >
            <TrendingUp size={12} className="animate-pulse" />
            Super Deal
          </motion.div>
        )}
        
        {scheme && (
          <div className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1.5 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 uppercase tracking-widest backdrop-blur-md border border-emerald-400">
            <Tag size={12} />
            {scheme}
          </div>
        )}
      </div>

      {/* Right-corner Discount Badge */}
      {calculatedDiscount > 0 && (
         <div className="absolute top-0 right-0 z-10">
            <div className="bg-rose-600 text-white text-[10px] font-black px-4 py-2 rounded-bl-3xl shadow-lg uppercase tracking-wider italic">
               {calculatedDiscount}% OFF
            </div>
         </div>
      )}

      {/* Image Block */}
      <Link to={`/product/${_id}`} className="block relative h-48 mb-6 bg-slate-50/50 rounded-2xl overflow-hidden group-hover:bg-primary-50/30 transition-colors duration-500 flex items-center justify-center p-6 border border-slate-50">
        <img loading="lazy" src={image || 'https://via.placeholder.com/200'} 
          alt={name} 
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-xl text-slate-400 hover:text-primary-600 border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm">
          <Info size={16} />
        </div>
      </Link>

      {/* Details Area */}
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest leading-none bg-primary-50 px-2.5 py-1.5 rounded-lg border border-primary-100/50">
            {brand || "Generic"}
          </p>
          <div className="flex items-center gap-1 text-slate-400">
             <ShieldCheck size={14} className="text-emerald-500" />
             <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
          </div>
        </div>

        <Link to={`/product/${_id}`} className="block mb-4">
          <h3 className="text-lg font-black text-slate-800 line-clamp-2 group-hover:text-primary-600 transition-colors tracking-tight leading-tight">
            {name}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4 border-t border-slate-100 border-dashed">
            {/* Pricing Matrix */}
            <div className="flex items-end justify-between mb-6">
              <div>
                {mrp && (
                  <p className="text-[11px] text-slate-400 font-bold line-through leading-none mb-1.5 flex items-center gap-2">
                    MRP ₹{mrp}
                    {calculatedDiscount > 0 && <span className="text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider not-italic no-underline font-black">SAVE {calculatedDiscount}%</span>}
                  </p>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-[11px] font-bold text-slate-400">₹</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">{price}</span>
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">/ Unit</span>
                </div>
              </div>
            </div>

            {/* Premium Action Buttons */}
            <div className="flex flex-col gap-3">
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if(onAddToCart) onAddToCart(medicine);
                  
                  // Text Feedback
                  const btn = e.currentTarget;
                  const originalHtml = btn.innerHTML;
                  btn.innerHTML = '<span class="text-[11px] font-black uppercase tracking-widest text-emerald-400">Added to Cart!</span>';
                  btn.classList.add('bg-black');
                  setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.classList.remove('bg-black');
                  }, 1500);
                }}
                className="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-xl shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group/add relative overflow-hidden"
              >
                <ShoppingCart size={18} className="group-hover/add:scale-110 group-hover/add:-translate-y-0.5 transition-transform" />
                <span className="text-[11px] font-black uppercase tracking-widest">Add to Procurement</span>
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsApp}
                className="w-full py-3 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-100 hover:border-emerald-500 rounded-xl transition-all flex items-center justify-center gap-2 group/wa"
              >
                <MessageCircle size={18} className="group-hover/wa:scale-110 transition-transform" />
                <span className="text-[11px] font-black uppercase tracking-widest">WhatsApp Inquiry</span>
              </motion.button>
            </div>
        </div>
      </div>
      
      {/* Out of Stock Overlay */}
      {availableStock <= 0 && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-3xl flex items-center justify-center z-20">
          <div className="bg-slate-900 text-white text-[11px] font-black px-6 py-3 rounded-2xl uppercase tracking-[0.2em] shadow-2xl flex flex-col items-center gap-2">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
            Out of Stock
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MedicineCard;
