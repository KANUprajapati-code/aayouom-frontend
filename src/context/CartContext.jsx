import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const [isCartSliderOpen, setIsCartSliderOpen] = useState(false);

  const addToCart = (product, quantity = 1) => {
    const existing = cart.find(item => item._id === product._id);
    const currentQty = existing ? existing.quantity : 0;
    const totalRequested = currentQty + quantity;

    // Validate against stock BEFORE state mutating
    const availableStock = product.stock !== undefined ? product.stock : Infinity;
    if (totalRequested > availableStock) {
      alert(`Cannot add more. Only ${availableStock} units available in stock.`);
      return;
    }

    setCart(prev => {
      const existingPrev = prev.find(item => item._id === product._id);
      if (existingPrev) {
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const updateQuantity = (id, quantity, availableStock) => {
    if (quantity < 1) return removeFromCart(id);
    
    if (availableStock !== undefined && quantity > availableStock) {
      alert(`Only ${availableStock} units available in stock.`);
      return;
    }

    setCart(prev => prev.map(item => item._id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, isCartSliderOpen, setIsCartSliderOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
