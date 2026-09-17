import React, { useState, useEffect } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { SearchOverlay } from './components/layout/SearchOverlay';
import { MobileNav } from './components/layout/MobileNav';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { PolicyPage } from './pages/PolicyPage';

const AppContent: React.FC = () => {
  const { path, navigate } = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [path]);

  // Route matching logic
  const renderRoute = () => {
    const cleanPath = path.split('?')[0].replace(/\/$/, '') || '/';

    // 1. Home
    if (cleanPath === '/' || cleanPath === '') {
      return <HomePage />;
    }

    // 2. Shop
    if (cleanPath === '/shop' || cleanPath.startsWith('/shop/')) {
      return <ShopPage />;
    }

    // 3. Collections
    if (cleanPath === '/collections' || cleanPath.startsWith('/collections/')) {
      return <CollectionsPage />;
    }

    // 4. Product Details (/products/:slug or /product/:slug)
    if (cleanPath.startsWith('/products/') || cleanPath.startsWith('/product/')) {
      return <ProductDetailPage />;
    }

    // 5. Cart
    if (cleanPath === '/cart') {
      return <CartPage />;
    }

    // 6. Checkout
    if (cleanPath === '/checkout') {
      return <CheckoutPage />;
    }

    // 7. Order Success
    if (cleanPath === '/order-success') {
      return <OrderSuccessPage />;
    }

    // 8. Track Order
    if (cleanPath === '/track' || cleanPath === '/track-order') {
      return <TrackOrderPage />;
    }

    // 9. About
    if (cleanPath === '/about') {
      return <AboutPage />;
    }

    // 10. Contact
    if (cleanPath === '/contact') {
      return <ContactPage />;
    }

    // 11. FAQ
    if (cleanPath === '/faq') {
      return <FAQPage />;
    }

    // 12. Policies
    if (cleanPath === '/shipping' || cleanPath === '/returns' || cleanPath === '/privacy' || cleanPath === '/terms') {
      return <PolicyPage />;
    }

    // Fallback: 404
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 sm:py-32 text-center space-y-6 font-sans">
        <span className="text-[11px] font-sans tracking-[0.24em] text-[#C8A96A] uppercase font-semibold">
          404 Atelier Archive
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#111111] font-normal">
          Fragrance Path Not Located
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6B6B] font-light max-w-md mx-auto leading-relaxed">
          The flacon or editorial composition you are seeking is currently unavailable or has been archived.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <button
            onClick={() => navigate('/shop')}
            className="px-7 py-3 bg-[#111111] text-white text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#222222] transition-colors shadow-xs"
          >
            Explore Collection
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-7 py-3 bg-white border border-[#E6E3DC] text-[#111111] text-xs uppercase tracking-[0.18em] font-medium hover:border-[#111111] transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  };

  const isHome = path === '/' || path === '';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F3] text-[#111111] font-sans antialiased selection:bg-[#C8A96A]/20 selection:text-[#111111]">
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
      />

      <main className={`flex-1 ${isHome ? '' : 'pt-20 sm:pt-24'}`}>
        {renderRoute()}
      </main>

      <Footer />

      {/* Global Overlays */}
      <CartDrawer />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            <AppContent />
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </RouterProvider>
  );
}
