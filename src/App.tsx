import React, { useState, useEffect, Suspense, lazy } from 'react';
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
import { SEO } from './components/SEO';

// Code-split secondary routes for faster mobile performance and smaller initial bundle
const ShopPage = lazy(() => import('./pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage').then((m) => ({ default: m.CollectionsPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage').then((m) => ({ default: m.OrderSuccessPage })));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage').then((m) => ({ default: m.TrackOrderPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then((m) => ({ default: m.FAQPage })));
const PolicyPage = lazy(() => import('./pages/PolicyPage').then((m) => ({ default: m.PolicyPage })));

const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
    <div className="w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
    <span className="text-[11px] font-sans tracking-[0.2em] text-[#C8A96A] uppercase font-semibold">
      AEVY ATELIER
    </span>
  </div>
);

const AppContent: React.FC = () => {
  const { path, navigate } = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [path]);

  // Duplicate product route redirect: /product/:slug -> canonical /products/:slug
  useEffect(() => {
    const cleanPath = path.split('?')[0].replace(/\/$/, '') || '/';
    if (cleanPath.startsWith('/product/')) {
      const canonicalPath = cleanPath.replace(/^\/product\//, '/products/');
      navigate(canonicalPath, { replace: true });
    }
  }, [path, navigate]);

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

    // 4. Product Details (canonical /products/:slug)
    if (cleanPath.startsWith('/products/')) {
      return <ProductDetailPage />;
    }

    // If still transitioning from /product/:slug
    if (cleanPath.startsWith('/product/')) {
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
        <SEO
          title="404 — Fragrance Not Located | AEVY Fragrance Bangladesh"
          description="The flacon or editorial composition you are seeking is currently unavailable or has been archived."
          canonicalPath="/404"
          noindex={true}
        />
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
        <Suspense fallback={<RouteLoadingFallback />}>
          {renderRoute()}
        </Suspense>
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
