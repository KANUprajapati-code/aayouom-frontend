import React from 'react';
import { ShoppingCart, Star, MessageCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-col relative h-full">
      {/* Image Area */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square mb-4 overflow-hidden p-4 flex items-center justify-center bg-slate-50/30 rounded-lg">
        <img loading="lazy" src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow space-y-2">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-medium text-slate-800 text-sm leading-tight hover:text-secondary-600 transition-colors line-clamp-2 min-h-[2.5rem]">
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
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-bold text-slate-900">₹</span>
          <span className="text-2xl font-black text-slate-900 tabular-nums">{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through font-medium">M.R.P: ₹{product.originalPrice}</span>
          )}
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
            className="w-full bg-secondary-400 hover:bg-secondary-500 text-slate-900 font-black py-2.5 rounded-full shadow-lg shadow-secondary-100 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
