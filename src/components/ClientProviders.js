'use client';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import CouturePreloader from './CouturePreloader';
import AmbientGradients from './AmbientGradients';
import ScrollDial from './ScrollDial';

import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function ClientProviders({ children }) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <CouturePreloader />
            <AmbientGradients />
            <Navbar />
            <CartDrawer />
            <ScrollDial />
            <main style={{ position: 'relative', zIndex: 1 }}>
              <AnimatePresence mode="wait">
                <div key={pathname}>
                  {children}
                </div>
              </AnimatePresence>
            </main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}



