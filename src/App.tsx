import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';
import { CartDrawer } from './components/common/CartDrawer.tsx';
import { SearchModal } from './components/common/SearchModal.tsx';
import { TrackOrderModal } from './components/common/TrackOrderModal.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { OrderSuccessPage } from './pages/OrderSuccessPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { FaqPage } from './pages/FaqPage.tsx';
import { PolicyPage } from './pages/PolicyPage.tsx';

import { CartProvider } from './context/CartContext.tsx';
import { SettingsProvider } from './context/SettingsContext.tsx';
import { Product } from './types.ts';
import { fetchProducts } from './lib/api.ts';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentProductSlug, setCurrentProductSlug] = useState<string>('aevy-oceanis');
  const [completedOrderId, setCompletedOrderId] = useState<string>('');
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
      if (data.length > 0) {
        setCurrentProductSlug(data[0].slug);
      }
    } catch (err: any) {
      console.error('Failed to load fragrances from Supabase:', err);
      setLoadError(err?.message || 'Unable to connect to fragrance catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const navigateTo = (page: string, param?: string) => {
    const cleanPage = page.replace(/^\//, '');
    if (cleanPage === 'product' && param) {
      setCurrentProductSlug(param);
    } else if (cleanPage === 'order-success' && param) {
      setCompletedOrderId(param);
    }
    setCurrentPage(cleanPage || 'home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProduct = products.find((p) => p.slug === currentProductSlug) || products[0];

  return (
    <SettingsProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-[#0B0B0B] text-[#F5F1E8] font-sans selection:bg-[#C8A96A] selection:text-[#0B0B0B]">
          
          {/* Header & Global Navigation */}
          <Header
            currentPath={currentPage}
            onNavigate={(path) => navigateTo(path)}
            onNavigateShop={() => navigateTo('shop')}
            onNavigateAbout={() => navigateTo('about')}
            onNavigateContact={() => navigateTo('contact')}
            onNavigateHome={() => navigateTo('home')}
            onNavigateTrackOrder={() => setIsTrackOrderOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
          />

          {/* Main Content Router */}
          <main className="flex-1">
            {currentPage === 'home' && (
              <HomePage
                products={products}
                onNavigateProduct={(slug) => navigateTo('product', slug)}
                onNavigateShop={() => navigateTo('shop')}
                onNavigateAbout={() => navigateTo('about')}
              />
            )}

            {currentPage === 'shop' && (
              <ShopPage
                products={products}
                onNavigateProduct={(slug) => navigateTo('product', slug)}
              />
            )}

            {currentPage === 'product' && selectedProduct && (
              <ProductDetailPage
                product={selectedProduct}
                onNavigateCheckout={() => navigateTo('checkout')}
                onNavigateShop={() => navigateTo('shop')}
              />
            )}

            {currentPage === 'cart' && (
              <CartPage
                onNavigateCheckout={() => navigateTo('checkout')}
                onNavigateShop={() => navigateTo('shop')}
              />
            )}

            {currentPage === 'checkout' && (
              <CheckoutPage
                onNavigateSuccess={(orderId) => navigateTo('order-success', orderId)}
                onNavigateCart={() => navigateTo('cart')}
                onNavigateShop={() => navigateTo('shop')}
              />
            )}

            {currentPage === 'order-success' && (
              <OrderSuccessPage
                orderId={completedOrderId}
                onNavigateHome={() => navigateTo('home')}
                onNavigateShop={() => navigateTo('shop')}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage onNavigateShop={() => navigateTo('shop')} />
            )}

            {currentPage === 'contact' && <ContactPage />}

            {currentPage === 'faq' && <FaqPage />}

            {currentPage === 'shipping-delivery' && (
              <PolicyPage policyType="shipping" onNavigateContact={() => navigateTo('contact')} />
            )}

            {currentPage === 'return-refund' && (
              <PolicyPage policyType="refund" onNavigateContact={() => navigateTo('contact')} />
            )}

            {currentPage === 'privacy-policy' && (
              <PolicyPage policyType="privacy" onNavigateContact={() => navigateTo('contact')} />
            )}

            {currentPage === 'terms-conditions' && (
              <PolicyPage policyType="terms" onNavigateContact={() => navigateTo('contact')} />
            )}
          </main>

          {/* Footer */}
          <Footer
            onNavigate={(path) => navigateTo(path)}
            onNavigateShop={() => navigateTo('shop')}
            onNavigateAbout={() => navigateTo('about')}
            onNavigateContact={() => navigateTo('contact')}
            onNavigateFaq={() => navigateTo('faq')}
            onNavigateTrackOrder={() => setIsTrackOrderOpen(true)}
            onNavigatePolicy={(type) => {
              if (type === 'shipping') navigateTo('shipping-delivery');
              if (type === 'refund') navigateTo('return-refund');
              if (type === 'privacy') navigateTo('privacy-policy');
              if (type === 'terms') navigateTo('terms-conditions');
            }}
          />

          {/* Modals and Overlays */}
          <CartDrawer
            onNavigateCheckout={() => navigateTo('checkout')}
            onNavigateShop={() => navigateTo('shop')}
          />

          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectProduct={(slug) => navigateTo('product', slug)}
          />

          <TrackOrderModal
            isOpen={isTrackOrderOpen}
            onClose={() => setIsTrackOrderOpen(false)}
          />

        </div>
      </CartProvider>
    </SettingsProvider>
  );
}
