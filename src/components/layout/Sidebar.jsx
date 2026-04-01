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
    { icon: Settings, label: 'Settings', path: '/settings', requiresAuth: true },
    { icon: HelpCircle, label: 'Support', path: '/support', requiresAuth: false },
  ];

  const filteredMenuItems = menuItems.filter(item => !item.requiresAuth || isAuthenticated);
  const filteredSecondaryItems = secondaryItems.filter(item => !item.requiresAuth || isAuthenticated);

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={() => onClose && onClose()}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${isActive 
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 font-medium' 
          : 'text-text-muted hover:bg-primary-50 hover:text-primary-600'}
      `}
    >
      <item.icon size={20} />
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

          <div className="space-y-1 shrink-0">
            <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Gernal
            </p>
            {filteredMenuItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>

          <div className="mt-8 space-y-1 shrink-0">
            <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Account
            </p>
            {filteredSecondaryItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>

          {isAuthenticated && (
            <div className="mt-8 pt-4 border-t border-surface-border shrink-0">
              <div className="p-4 bg-primary-50 rounded-2xl mb-4 border border-primary-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                    <TrendingDown size={16} />
                  </div>
                  <span className="text-xs font-bold text-primary-700">Total Savings</span>
                </div>
                <p className="text-lg font-bold text-slate-900">₹12,450.00</p>
                <p className="text-[10px] text-primary-600 font-medium mt-1">Updated today</p>
              </div>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full text-text-muted hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
