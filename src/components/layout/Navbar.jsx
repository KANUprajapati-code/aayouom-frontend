import React from 'react';
import { ShoppingCart, Search, Bell, User, Menu, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
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

          <div className="hidden md:flex flex-1 max-w-lg items-center px-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search medicines, brands, or schemes..."
                className="block w-full pl-10 pr-3 py-2 border border-surface-border rounded-xl bg-surface-light focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 text-text-muted hover:text-primary-600 hover:bg-primary-50 rounded-lg relative">
              <ShoppingCart size={22} />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <button className="p-2 text-text-muted hover:text-primary-600 hover:bg-primary-50 rounded-lg">
              <Bell size={22} />
            </button>
            <div className="h-8 w-[1px] bg-surface-border mx-1"></div>
            
            {isAuthenticated ? (
              <Link 
                to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className="flex items-center gap-2 p-1 pl-2 hover:bg-surface-light rounded-lg transition-all border border-transparent hover:border-surface-border"
              >
                <div className="hidden text-right lg:block">
                  <p className="text-xs font-semibold text-slate-900 leading-none">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">{user?.role || 'Member'}</p>
                </div>
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 overflow-hidden">
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
