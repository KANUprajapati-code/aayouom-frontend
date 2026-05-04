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
        flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group
        ${isActive 
          ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20 font-bold scale-[1.02]' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-brand-green font-medium'}
      `}
    >
      <item.icon size={20} className={`transition-transform duration-300 group-hover:scale-110`} />
      <span className="text-[13px]">{item.label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-full lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-4 overflow-y-auto">

          <div className="space-y-1 shrink-0 px-2 lg:px-4">
            <p className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Explore
            </p>
            {filteredMenuItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>

          <div className="mt-6 space-y-1 shrink-0 px-2 lg:px-4">
            <p className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Information
            </p>
            {filteredSecondaryItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>

          {isAuthenticated && (
            <div className="mt-auto pt-6 px-4 border-t border-slate-100 shrink-0">
              <div className="p-4 bg-slate-50 rounded-2xl mb-4 border border-slate-100 group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-brand-green shadow-sm group-hover:scale-110 transition-transform">
                    <TrendingDown size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Savings</span>
                </div>
                <p className="text-xl font-bold text-slate-900 tracking-tight">₹12,450.00</p>
              </div>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-3.5 px-4 py-3 w-full text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all duration-300 font-medium group"
              >
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[13px]">Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>

  );
};

export default Sidebar;
