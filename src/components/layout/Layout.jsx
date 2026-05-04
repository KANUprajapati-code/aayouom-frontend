import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import SubNavbar from './SubNavbar';
import { useAuth } from '../../context/AuthContext';
import Footer from '../Footer';
import MobileNav from '../MobileNav';

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-surface-light font-sans text-text-main">
      <Navbar />
      <SubNavbar />
      
      <div className="flex-1 w-full relative">
        <main className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 min-w-0 pb-10">
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
