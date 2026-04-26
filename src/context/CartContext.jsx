import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    let items = savedCart ? JSON.parse(savedCart) : [];
    // Migration: ensure every item has a _cartId
    return items.map(item => ({
       ...item,
       _cartId: item._cartId || item._id,
       quantity: Number(item.quantity) || 1
    }));
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const [isCartSliderOpen, setIsCartSliderOpen] = useState(false);

  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    const cartItemId = selectedVariant ? `${product._id}-${selectedVariant.name}` : product._id;
    
    // Create a normalized cart item
    const cartItem = {
      ...product,
      _cartId: cartItemId,
      selectedVariant: selectedVariant,
      price: selectedVariant ? selectedVariant.price : product.price,
      name: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
      stock: selectedVariant ? selectedVariant.stock : product.stock
    };

    const existing = cart.find(item => item._cartId === cartItemId);
    const currentQty = existing ? existing.quantity : 0;
    const totalRequested = currentQty + quantity;

    const availableStock = cartItem.stock !== undefined ? cartItem.stock : Infinity;
    if (totalRequested > availableStock) {
      alert(`Cannot add more. Only ${availableStock} units available in stock.`);
      return;
    }

    setCart(prev => {
      const existingPrev = prev.find(item => item._cartId === cartItemId);
      if (existingPrev) {
        return prev.map(item => item._cartId === cartItemId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...cartItem, quantity }];
    });
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item._cartId !== cartId));
  };

  const updateQuantity = (cartId, quantity, availableStock) => {
    if (quantity < 1) return removeFromCart(cartId);
    
    if (availableStock !== undefined && quantity > availableStock) {
      alert(`Only ${availableStock} units available in stock.`);
      return;
    }

    setCart(prev => prev.map(item => item._cartId === cartId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((total, item) => {
    let itemPrice = Number(item.price) || 0;
    
    // Apply scheme rules if they exist
    if (item.schemeRules && item.schemeRules.length > 0) {
      // Find the best rule (highest minUnits that is <= quantity)
      const applicableRule = item.schemeRules
        .filter(r => (Number(item.quantity) || 0) >= r.minUnits)
        .sort((a,b) => b.minUnits - a.minUnits)[0];
        
      if (applicableRule) {
        const discountAmount = (itemPrice * applicableRule.discountPercentage) / 100;
        itemPrice = itemPrice - discountAmount;
      }
    }
    
    return total + (itemPrice * (Number(item.quantity) || 0));
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, isCartSliderOpen, setIsCartSliderOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
