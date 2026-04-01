import React from 'react';
import ProductCard from './ProductCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductRow = ({ title, products, category }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="py-12 border-b border-slate-50 last:border-0 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8 px-2">
          <div>
            <span className="text-secondary-500 font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">Featured</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h2>
          </div>
          <Link 
            to={`/products?category=${category}`}
            className="group flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors"
          >
            <span className="text-sm uppercase tracking-widest font-black">View Collection</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-8 overflow-x-auto no-scrollbar pb-8 px-2 snap-x snap-mandatory">
          {products.map((product) => (
            <div key={product._id} className="min-w-[280px] md:min-w-[340px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
          
          {/* View More Card at the end */}
          <Link 
            to={`/products?category=${category}`}
            className="min-w-[200px] bg-slate-50 rounded-[40px] flex flex-col items-center justify-center gap-4 group hover:bg-primary-50 transition-all border-2 border-dashed border-slate-200 hover:border-primary-200 snap-start"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-xl group-hover:scale-110 transition-transform">
              <ChevronRight className="w-8 h-8" />
            </div>
            <span className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary-600">Explore More</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductRow;
