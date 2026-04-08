import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Layout from './components/layout/Layout';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const QuickOrder = lazy(() => import('./pages/QuickOrder'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Schemes = lazy(() => import('./pages/Schemes'));
const Settings = lazy(() => import('./pages/Settings'));
const DynamicPage = lazy(() => import('./pages/DynamicPage'));
const BulkInquiry = lazy(() => import('./pages/BulkInquiry'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
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
                  <Route path="/quick-order" element={<QuickOrder />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/schemes" element={<Schemes />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<AdminLogin />} />
                  <Route path="/page/:slug" element={<DynamicPage />} />
                  <Route path="/bulk-inquiry" element={<BulkInquiry />} />
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
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
