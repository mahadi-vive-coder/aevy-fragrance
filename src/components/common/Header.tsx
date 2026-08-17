import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, Compass, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { useSettings } from '../../context/SettingsContext.tsx';

interface HeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onNavigateShop?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  onNavigateHome?: () => void;
  onNavigateTrackOrder?: () => void;
  onOpenSearch?: () => void;
  onOpenTrackOrder?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath = '',
  onNavigate,
  onNavigateShop,
  onNavigateAbout,
  onNavigateContact,
  onNavigateHome,
  onNavigateTrackOrder,
  onOpenSearch,
  onOpenTrackOrder
}) => {
  const { totalItemsCount, openCart } = useCart();
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (target: string) => {
    if (target === 'shop' || target === '/shop') {
      onNavigateShop ? onNavigateShop() : onNavigate?.('/shop');
    } else if (target === 'about' || target === '/about') {
      onNavigateAbout ? onNavigateAbout() : onNavigate?.('/about');
    } else if (target === 'contact' || target === '/contact') {
      onNavigateContact ? onNavigateContact() : onNavigate?.('/contact');
    } else if (target === 'home' || target === '/' || target === '') {
      onNavigateHome ? onNavigateHome() : onNavigate?.('/');
    } else {
      onNavigate?.(target);
    }
  };

  const handleTrack = () => {
    if (onNavigateTrackOrder) {
      onNavigateTrackOrder();
    } else if (onOpenTrackOrder) {
      onOpenTrackOrder();
    }
  };

  const navLinks = [
    { label: 'Shop', target: 'shop', path: '/shop' },
    { label: 'About', target: 'about', path: '/about' },
    { label: 'Contact', target: 'contact', path: '/contact' }
  ];

  const safePath = (currentPath || '').toLowerCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Announcement Bar */}
      {settings.announcement && (
        <div className="bg-[#000000] text-[#F5F1E8] text-[10px] sm:text-[11px] tracking-[0.25em] py-2 px-4 text-center border-b border-[#2A2A2A] uppercase flex items-center justify-center gap-2 font-medium">
          <Sparkles className="w-3 h-3 text-[#C8A96A]" />
          <span>{settings.announcement}</span>
        </div>
      )}

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-[#0B0B0B]/95 backdrop-blur-md border-[#2A2A2A] py-3.5 shadow-2xl'
            : 'bg-[#0B0B0B]/80 backdrop-blur-xs border-[#2A2A2A]/40 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNav('home')}
              className="text-left group flex flex-col cursor-pointer"
            >
              <span className="font-display text-2xl sm:text-3xl tracking-[0.3em] font-semibold text-[#F5F1E8] group-hover:text-[#C8A96A] transition-colors">
                AEVY
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.4em] text-[#C8A96A]/80 -mt-1">
                Fragrance House
              </span>
            </button>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => {
              const isActive = safePath === link.target || safePath === link.path;
              return (
                <button
                  key={link.target}
                  onClick={() => handleNav(link.target)}
                  className={`text-[11px] uppercase tracking-[0.25em] font-medium transition-colors relative py-1 cursor-pointer ${
                    isActive ? 'text-[#C8A96A]' : 'text-[#F5F1E8]/70 hover:text-[#F5F1E8]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C8A96A]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="p-1.5 text-[#F5F1E8]/70 hover:text-[#C8A96A] transition-colors cursor-pointer"
              title="Search Fragrances"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Track Order */}
            <button
              onClick={handleTrack}
              className="hidden sm:flex items-center gap-1.5 text-xs tracking-wider text-[#F5F1E8]/70 hover:text-[#C8A96A] transition-colors cursor-pointer"
              title="Track Order Status"
            >
              <Compass className="w-4 h-4 text-[#C8A96A]" />
              <span className="hidden lg:inline text-[10px] uppercase tracking-[0.2em]">Track Order</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-1.5 text-[#F5F1E8] hover:text-[#C8A96A] transition-colors flex items-center cursor-pointer"
              aria-label={`Shopping Bag with ${totalItemsCount} items`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C8A96A] text-[#0B0B0B] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#F5F1E8] focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0B0B0B] border-b border-[#2A2A2A] px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.target}
                  onClick={() => {
                    handleNav(link.target);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-xs uppercase tracking-[0.25em] font-medium py-2.5 border-b border-[#2A2A2A] text-[#F5F1E8] hover:text-[#C8A96A] transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  handleTrack();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-xs uppercase tracking-[0.25em] font-medium py-2.5 text-[#F5F1E8] flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#C8A96A]" />
                Track My Order
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
