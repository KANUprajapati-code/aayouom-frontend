import React from 'react';
import { ShoppingCart, Search, Bell, User, Menu, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = ({ onMenuClick }) => {
  const { user, isAuthenticated } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="sticky top-0 z-40 bg-brand-green text-white shadow-lg transition-all">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 lg:h-20 gap-4">
          <div className="flex items-center shrink-0">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-xl lg:hidden text-white/70 hover:text-white hover:bg-white/10"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2 ml-2">
              <img src="/logo.png" alt="Logo" className="h-12 md:h-16 object-contain brightness-0 invert" />
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl items-center justify-center px-4 mx-auto">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search for medicines or brands..."
                className="block w-full pl-11 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-2xl focus:outline-none focus:border-white/30 focus:ring-4 focus:ring-white/5 transition-all text-sm font-medium text-white placeholder:text-white/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link to="/cart" className="flex p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-2xl relative transition-colors border border-transparent hover:border-white/10">
              <ShoppingCart size={22} />
              {cart && cart.reduce((total, item) => total + item.quantity, 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-brand-green text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-brand-green">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            
            <div className="hidden sm:block h-6 w-[1px] bg-white/10 mx-2"></div>
            
            {isAuthenticated ? (
              <Link 
                to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className="flex items-center gap-3 p-1 pl-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 group"
              >
                <div className="hidden text-right lg:block">
                  <p className="text-sm font-bold text-white group-hover:text-white/90 transition-colors leading-none">{user?.name?.split(' ')[0] || 'User'}</p>
                </div>
                <div className="w-9 h-9 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  <User size={20} />
                </div>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-5 py-2 bg-white text-brand-green rounded-xl hover:bg-white/90 transition-all font-bold text-sm shadow-lg"
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
