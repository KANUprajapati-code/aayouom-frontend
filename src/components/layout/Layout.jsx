import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../Footer';
import MobileNav from '../MobileNav';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-surface-light">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      
      <div className="flex flex-1 max-w-[1600px] mx-auto w-full relative">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        <main className="flex-1 w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 min-w-0 pb-24 md:pb-10">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
      <MobileNav />
    </div>
  );
};

export default Layout;
