'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      fetch('/api/wishlist', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => { if (data.wishlist) setWishlist(data.wishlist.map(w => w.product_id)); })
        .catch(() => {});
    } else {
      const saved = localStorage.getItem('aura-wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!isAuthenticated) localStorage.setItem('aura-wishlist', JSON.stringify(wishlist));
  }, [wishlist, isAuthenticated]);

  const toggleWishlist = useCallback(async (productId) => {
    const isInWishlist = wishlist.includes(productId);
    if (isAuthenticated && token) {
      await fetch('/api/wishlist', {
        method: isInWishlist ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product_id: productId }),
      });
    }
    setWishlist(prev => isInWishlist ? prev.filter(id => id !== productId) : [...prev, productId]);
  }, [wishlist, isAuthenticated, token]);

  const isWishlisted = useCallback((productId) => wishlist.includes(productId), [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() { return useContext(WishlistContext); }
