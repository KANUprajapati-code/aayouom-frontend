import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Layout from './components/layout/Layout';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuickOrder from './pages/QuickOrder';
import OrderHistory from './pages/OrderHistory';
import Schemes from './pages/Schemes';
import Settings from './pages/Settings';
import DynamicPage from './pages/DynamicPage';
import BulkInquiry from './pages/BulkInquiry';
import WalletDashboard from './pages/WalletDashboard';
import ReferAndEarn from './pages/ReferAndEarn';
import Promotions from './pages/Promotions';
import Profile from './pages/Profile';
import Support from './pages/Support';
import Checkout from './pages/Checkout';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Main Application with Layout */}
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/quick-order" element={<QuickOrder />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/schemes" element={<Schemes />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<AdminLogin />} />
                  <Route path="/page/:slug" element={<DynamicPage />} />
                  <Route path="/bulk-inquiry" element={<BulkInquiry />} />
                  <Route path="/wallet" element={<WalletDashboard />} />
                  <Route path="/refer" element={<ReferAndEarn />} />
                  <Route path="/promotions" element={<Promotions />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                } />
              </Routes>
            </Suspense>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
