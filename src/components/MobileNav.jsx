import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, ShoppingCart, User, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MobileNav = () => {
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 h-20 px-8 flex items-center justify-between z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.06)]">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? 'text-primary-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Home</span>
        </NavLink>
        
        <NavLink 
          to="/products" 
          className={({ isActive }) => `flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? 'text-primary-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Grid className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Store</span>
        </NavLink>

        <NavLink 
          to="/cart" 
          className={({ isActive }) => `flex flex-col items-center gap-1.5 relative transition-all duration-300 ${isActive ? 'text-primary-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Cart</span>
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => `flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? 'text-primary-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Login</span>
        </NavLink>
      </div>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/911234567890" 
        className="md:hidden fixed bottom-24 right-5 w-14 h-14 bg-secondary-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-secondary-200 z-40 animate-pulse-slow cursor-pointer group hover:scale-110 transition-transform"
      >
        <MessageSquare className="w-7 h-7" />
      </a>
    </>
  );
};

export default MobileNav;
