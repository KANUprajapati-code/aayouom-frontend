import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Package, 
  TrendingDown, 
  History, 
  ShoppingCart,
  FileText,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SubNavbar = () => {
  const { isAuthenticated } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', requiresAuth: true },
    { icon: Package, label: 'Medicines', path: '/products' },
    { icon: TrendingDown, label: 'Schemes', path: '/schemes' },
    { icon: History, label: 'Order History', path: '/orders', requiresAuth: true },
    { icon: ShoppingCart, label: 'My Cart', path: '/cart', requiresAuth: true },
    { icon: FileText, label: 'About', path: '/about' },
    { icon: HelpCircle, label: 'Support', path: '/support' },
  ];

  const filteredItems = menuItems.filter(item => !item.requiresAuth || isAuthenticated);

  return (
    <div className="bg-white border-b border-slate-100 sticky top-20 z-40 hidden lg:block overflow-x-auto no-scrollbar">
      <div className="max-w-[1600px] mx-auto px-8">
        <div className="flex items-center justify-center gap-10 py-4">
          {filteredItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 py-2
                ${isActive 
                  ? 'text-brand-green' 
                  : 'text-slate-400 hover:text-brand-green'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={16} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-4 left-0 h-0.5 bg-brand-green animate-in fade-in slide-in-from-bottom-1 duration-300 w-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubNavbar;
