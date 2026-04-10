import React, { useState } from 'react';
import { Search, ShoppingCart, User, Heart, Package, Phone, Mail, Menu, X, ChevronDown, Clock, ShieldCheck, Wallet, Gift, Tag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Medicines', path: '/products?category=Medicines' },
    { name: 'Wellness', path: '/products?category=Wellness' },
    { name: 'Offers', path: '/promotions' },
    { name: 'Wallet', path: '/wallet' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const topCategories = ["Antibiotics", "Cardiology", "Oncology", "Pediatrics", "Diabetes Care", "Surgical Supplies", "Vitamins", "Emergency Care"];

  return (
    <header className="w-full z-50">
      {/* 1. Top Utility Bar */}
      <div className="bg-slate-50 border-b border-slate-100 py-2 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
          <div className="flex gap-8">
            <span className="flex items-center gap-2 decoration-primary-300 underline-offset-4 decoration-2">
              <Phone className="w-3 h-3 text-primary-500" /> Clinic Support: +91 123 456 7890
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-primary-500" /> Verified Doctor Portal
            </span>
          </div>
          <div className="flex gap-8 items-center">
            <span className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-primary-500" /> Support: 24/7 Dispatching
            </span>
            <Link to="/admin/login" className="text-secondary-500 hover:text-secondary-600 transition-colors">Admin Quick Access</Link>
          </div>
        </div>
      </div>

      {/* 2. Main Branding & Action Bar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 md:relative">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-12 h-12 bg-primary-600 rounded-[18px] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary-200 group-hover:rotate-12 transition-transform duration-500">
              W
            </div>
            <span className="font-black text-3xl tracking-tighter text-slate-900">
              We<span className="text-secondary-500">dome</span>
            </span>
          </Link>

          {/* Large Search Bar (Amazon Style) */}
          <div className="hidden lg:flex flex-grow relative max-w-2xl h-12">
            <input
              type="text"
              className="block w-full bg-white border-2 border-primary-600 rounded-l-xl pl-4 pr-12 font-bold text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-primary-50 transition-all outline-none text-sm"
              placeholder="Search Wedome healthcare marketplace..."
            />
            <button className="bg-secondary-400 hover:bg-secondary-500 text-slate-900 px-6 rounded-r-xl border-2 border-primary-600 border-l-0 flex items-center justify-center transition-all group active:scale-95">
              <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center border-r border-slate-100 pr-4 gap-1">
              {[
                { icon: User, label: 'Profile', path: '/profile' },
                { icon: Package, label: 'Orders', path: '/orders' },
                { icon: Wallet, label: 'Wallet', path: '/wallet' },
                { icon: Gift, label: 'Refer', path: '/refer' }
              ].map((item) => (
                <Link key={item.label} to={item.path} className="flex flex-col items-center p-2.5 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-primary-600 group">
                  <item.icon className="w-6 h-6 border-slate-200" strokeWidth={1.5} />
                  <span className="text-[9px] font-black uppercase tracking-tighter mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{item.label}</span>
                </Link>
              ))}
              <Link to="/register" className="ml-2 px-6 py-3 bg-slate-900 text-white rounded-[14px] text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-slate-200 active:scale-95">Register</Link>
            </div>

            <Link to="/cart" className="relative p-3.5 bg-primary-50 text-primary-600 rounded-2xl hover:bg-primary-600 hover:text-white transition-all shadow-lg shadow-primary-50 active:scale-95 group">
              <ShoppingCart className="w-6 h-6" strokeWidth={2} />
              {cart.reduce((total, item) => total + item.quantity, 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-3 bg-slate-100 rounded-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* 3. Secondary Navigation Bar (Horizontal Links) */}
      <div className="bg-white border-b border-slate-100 hidden md:block overflow-x-auto no-scrollbar scroll-smooth">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-6 py-5 text-[11px] font-black uppercase tracking-widest transition-all relative group ${location.pathname === link.path ? 'text-primary-600' : 'text-slate-400 hover:text-slate-900'}`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-primary-600 rounded-full" />
                )}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-primary-600 rounded-full group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
          
          <div className="w-px h-6 bg-slate-200 mx-6 lg:block hidden" />
          
          <div className="lg:flex gap-6 hidden">
             <div className="flex gap-4 text-[10px] font-bold text-slate-300">
               {topCategories.slice(0, 4).map(c => (
                 <span key={c} className="hover:text-slate-600 cursor-pointer transition-colors whitespace-nowrap">{c}</span>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-[60] p-6 flex flex-col pt-24 overflow-y-auto">
          <div className="space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl font-black text-slate-900 tracking-tighter uppercase"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="mt-12 pt-12 border-t border-slate-100">
             <div className="flex flex-wrap gap-6 text-primary-600 font-black text-sm mb-8">
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2"><User /> Profile</Link>
                <Link to="/wallet" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2"><Wallet /> Wallet</Link>
                <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2"><ShoppingCart /> Cart</Link>
             </div>
             <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Support Line</p>
             <p className="text-2xl font-black text-slate-900 mt-2">+91 123 456 7890</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
