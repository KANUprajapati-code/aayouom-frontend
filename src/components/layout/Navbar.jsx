import React from 'react';
import { ShoppingCart, Search, Bell, User, Menu, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = ({ onMenuClick }) => {
  const { user, isAuthenticated } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-surface-border shadow-sm transition-all">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 sm:h-auto sm:py-3 lg:h-20 gap-4">
          <div className="flex items-center shrink-0">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md lg:hidden text-text-muted hover:text-primary-600 hover:bg-primary-50"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2 ml-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                W
              </div>
              <span className="text-xl font-bold text-slate-800">
                Wedome<span className="text-primary-600">Doctors</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-2xl items-center justify-center px-4 lg:px-8 mx-auto">
            <div className="relative w-full shadow-soft rounded-xl bg-white">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search medicines, brands, or schemes..."
                className="block w-full pl-11 pr-4 py-2.5 border border-surface-border rounded-xl bg-surface-light hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <Link to="/cart" className="flex p-2 sm:p-2.5 text-text-muted hover:text-primary-600 hover:bg-primary-50 rounded-xl relative transition-colors shadow-sm bg-white border border-transparent hover:border-primary-100 cursor-pointer">
              <ShoppingCart size={22} />
              {cart && cart.reduce((total, item) => total + item.quantity, 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm border border-white">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            <button className="hidden sm:flex p-2.5 text-text-muted hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors shadow-sm bg-white border border-transparent hover:border-primary-100">
              <Bell size={22} />
            </button>
            <div className="hidden sm:block h-8 w-[1px] bg-surface-border mx-2"></div>
            
            {isAuthenticated ? (
              <Link 
                to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className="flex items-center gap-3 p-1.5 sm:pl-3 hover:bg-surface-light rounded-xl transition-all border border-transparent hover:border-surface-border shadow-sm hover:shadow-md bg-white group"
              >
                <div className="hidden text-right lg:block">
                  <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-primary-600 transition-colors">{user?.name || 'User'}</p>
                  <p className="text-[10px] font-black text-text-silver mt-1 uppercase tracking-widest">{user?.role || 'Member'}</p>
                </div>
                <div className="w-9 h-9 bg-primary-50 border border-primary-100 rounded-full flex items-center justify-center text-primary-600 overflow-hidden shadow-inner shrink-0">
                  <User size={20} />
                </div>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-all font-bold text-sm"
              >
                <LogIn size={18} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
