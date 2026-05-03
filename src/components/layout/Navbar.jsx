import React from 'react';
import { ShoppingCart, Search, Bell, User, Menu, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = ({ onMenuClick }) => {
  const { user, isAuthenticated } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 lg:h-20 gap-4">
          <div className="flex items-center shrink-0">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-xl lg:hidden text-slate-400 hover:text-brand-green hover:bg-brand-green/5"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2 ml-2">
              <img src="/logo.png" alt="Logo" className="h-10 md:h-12 object-contain" />
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl items-center justify-center px-4 mx-auto">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search for medicines or brands..."
                className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-green/30 focus:ring-4 focus:ring-brand-green/5 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link to="/cart" className="flex p-2.5 text-slate-500 hover:text-brand-green hover:bg-brand-green/5 rounded-2xl relative transition-colors border border-transparent hover:border-brand-green/10">
              <ShoppingCart size={22} />
              {cart && cart.reduce((total, item) => total + item.quantity, 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-green text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            
            <div className="hidden sm:block h-6 w-[1px] bg-slate-100 mx-2"></div>
            
            {isAuthenticated ? (
              <Link 
                to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className="flex items-center gap-3 p-1 pl-3 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group"
              >
                <div className="hidden text-right lg:block">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-brand-green transition-colors leading-none">{user?.name?.split(' ')[0] || 'User'}</p>
                </div>
                <div className="w-9 h-9 bg-brand-green/10 border border-brand-green/10 rounded-full flex items-center justify-center text-brand-green overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  <User size={20} />
                </div>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-5 py-2 bg-brand-green text-white rounded-xl hover:bg-brand-green/90 transition-all font-bold text-sm shadow-lg shadow-brand-green/20"
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>

  );
};

export default Navbar;
