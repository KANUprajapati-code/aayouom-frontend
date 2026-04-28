import React from 'react';
import { ShoppingCart, Star, MessageCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const numPrice = Number(product.price) || 0;
  const numOriginalPrice = Number(product.originalPrice) || Number(product.mrp) || 0;

  return (
    <div className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-col relative h-full">
      {/* Image Area */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square mb-3 overflow-hidden p-2 flex items-center justify-center bg-slate-50/30 rounded-lg">
        <img loading="lazy" src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow space-y-2">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-medium text-slate-800 text-xs leading-tight hover:text-secondary-600 transition-colors line-clamp-2 min-h-[2rem]">
            {product.name}
          </h3>
        </Link>

        {/* Ratings */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className={`w-3 h-3 ${s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
            ))}
          </div>
          <span className="text-xs font-medium text-primary-600 ml-1">{product.rating || '4.2'}</span>
        </div>

        {/* Pricing */}
        <div className="flex flex-col gap-1.5 mt-2">
          {numOriginalPrice > 0 && numOriginalPrice > numPrice && (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-400 font-bold uppercase tracking-widest">M.R.P:</span>
                <span className="text-slate-400 font-bold line-through">₹{numOriginalPrice}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] uppercase font-black tracking-wider">
                  {Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100)}% OFF
                </span>
                <span className="text-rose-500 text-[10px] font-bold">
                  (Save ₹{numOriginalPrice - numPrice})
                </span>
              </div>
            </div>
          )}
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mr-1">Offer:</span>
            <span className="text-xs font-bold text-slate-900">₹</span>
            <span className="text-xl font-black text-slate-900 tabular-nums">{numPrice}</span>
          </div>
        </div>

        {/* Delivery Info (Amazon Style) */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-secondary-600 bg-secondary-50 w-fit px-1.5 py-0.5 rounded uppercase tracking-wider">Fastest Delivery</p>
          <p className="text-[11px] text-slate-500 font-medium">Get it by <span className="font-bold text-slate-800">Tomorrow, 10 AM</span></p>
        </div>

        {/* Action Button */}
        <div className="pt-4 mt-auto">
          <button 
            onClick={() => addToCart(product)}
            className="w-full bg-secondary-400 hover:bg-secondary-500 text-slate-900 font-black py-2 rounded-full shadow-lg shadow-secondary-100 transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest active:scale-95"
          >
            <ShoppingCart className="w-3 h-3" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
