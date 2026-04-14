import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  History, 
  Zap, 
  Settings, 
  HelpCircle,
  FileText,
  TrendingDown,
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };
  const menuItems = [
    { icon: Home, label: 'Home', path: '/', requiresAuth: false },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', requiresAuth: true },
    { icon: Package, label: 'Medicines', path: '/products', requiresAuth: false },
    { icon: Zap, label: 'Quick Order', path: '/quick-order', requiresAuth: true },
    { icon: TrendingDown, label: 'Schemes', path: '/schemes', requiresAuth: false },
    { icon: History, label: 'Order History', path: '/orders', requiresAuth: true },
    { icon: ShoppingCart, label: 'My Cart', path: '/cart', requiresAuth: true },
  ];

  const secondaryItems = [
    { icon: FileText, label: 'About Us', path: '/about', requiresAuth: false },
    { icon: ShoppingCart, label: 'Bulk Inquiry', path: '/bulk-inquiry', requiresAuth: false },
    { icon: HelpCircle, label: 'Support', path: '/support', requiresAuth: false },
  ];

  const filteredMenuItems = menuItems.filter(item => !item.requiresAuth || isAuthenticated);
  const filteredSecondaryItems = secondaryItems.filter(item => !item.requiresAuth || isAuthenticated);

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={() => onClose && onClose()}
      className={({ isActive }) => `
        flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 group
        ${isActive 
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 font-bold scale-[1.02]' 
          : 'text-slate-500 hover:bg-surface-light hover:text-primary-600 font-medium'}
      `}
    >
      <item.icon size={22} className={`transition-transform duration-300 group-hover:scale-110`} />
      <span className="text-sm">{item.label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-surface-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-4 overflow-y-auto">

          <div className="space-y-1.5 shrink-0 px-2 lg:px-4">
            <p className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
              General
            </p>
            {filteredMenuItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>

          <div className="mt-8 space-y-1.5 shrink-0 px-2 lg:px-4">
            <p className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Account
            </p>
            {filteredSecondaryItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>

          {isAuthenticated && (
            <div className="mt-auto pt-6 px-4 border-t border-surface-border shrink-0">
              <div className="p-5 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl mb-4 border border-primary-100/50 shadow-inner group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-primary-100 flex items-center justify-center text-primary-600 shadow-sm group-hover:scale-110 transition-transform">
                    <TrendingDown size={20} />
                  </div>
                  <span className="text-xs font-black text-primary-700 uppercase tracking-widest">Total Savings</span>
                </div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">₹12,450.00</p>
                <p className="text-[11px] text-primary-600 font-bold mt-2 flex items-center gap-1 opacity-80">
                  <Zap size={12} /> Updated today
                </p>
              </div>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-3.5 px-4 py-3.5 w-full text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 font-medium group"
              >
                <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
