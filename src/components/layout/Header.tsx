import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingBag, Heart, PackageCheck } from 'lucide-react';
import { useRouter, Link } from '../../context/RouterContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenMobileNav }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { path } = useRouter();
  const { itemCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F8F7F3]/95 backdrop-blur-md border-b border-[#E6E3DC] py-3 shadow-xs'
          : 'bg-transparent py-5 sm:py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Trigger & Search */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={onOpenMobileNav}
              aria-label="Open navigation menu"
              id="mobile-menu-trigger"
              className="p-1.5 -ml-1 text-[#111111] hover:text-[#C8A96A] transition-colors"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button
              onClick={onOpenSearch}
              aria-label="Search fragrances"
              className="p-1.5 text-[#111111] hover:text-[#C8A96A] transition-colors"
            >
              <Search className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>

          {/* Desktop Left Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-[0.18em] font-medium text-[#222222]">
            <Link
              to="/shop"
              id="nav-shop"
              className={`hover:text-[#C8A96A] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-[#C8A96A] after:transition-all ${
                path.startsWith('/shop') ? 'text-[#111111] after:w-full font-semibold' : 'after:w-0 hover:after:w-full'
              }`}
            >
              Shop
            </Link>
            <Link
              to="/collections"
              id="nav-collections"
              className={`hover:text-[#C8A96A] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-[#C8A96A] after:transition-all ${
                path.startsWith('/collections') ? 'text-[#111111] after:w-full font-semibold' : 'after:w-0 hover:after:w-full'
              }`}
            >
              Collections
            </Link>
            <Link
              to="/about"
              id="nav-about"
              className={`hover:text-[#C8A96A] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-[#C8A96A] after:transition-all ${
                path.startsWith('/about') ? 'text-[#111111] after:w-full font-semibold' : 'after:w-0 hover:after:w-full'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Centered Brand Mark */}
          <div className="text-center">
            <Link
              to="/"
              id="brand-logo"
              className="inline-block group"
              title="AEVY — Essence of Fresh Elegance"
            >
              <span className="font-serif text-2xl sm:text-3xl lg:text-3xl tracking-[0.22em] font-medium text-[#111111] transition-transform duration-300">
                AEVY
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-[0.24em] text-[#6B6B6B] -mt-0.5">
                Essence of Fresh Elegance
              </span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-[#111111]">
            {/* Desktop Search Button */}
            <button
              onClick={onOpenSearch}
              aria-label="Search"
              id="desktop-search-btn"
              className="hidden lg:flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-medium text-[#222222] hover:text-[#C8A96A] transition-colors py-1"
            >
              <Search className="w-4 h-4 stroke-[1.5]" />
              <span className="hidden xl:inline">Search</span>
            </button>

            {/* Track Order link */}
            <Link
              to="/track-order"
              id="header-track-order-link"
              title="Track Order"
              className="hidden sm:flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] font-medium text-[#222222] hover:text-[#C8A96A] transition-colors py-1"
            >
              <PackageCheck className="w-4 h-4 stroke-[1.5]" />
              <span className="hidden xl:inline">Track</span>
            </Link>

            {/* Wishlist Button */}
            <Link
              to="/shop?filter=wishlist"
              id="header-wishlist-btn"
              aria-label="Wishlist"
              className="relative p-1 text-[#222222] hover:text-[#C8A96A] transition-colors"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C8A96A] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Trigger */}
            <button
              onClick={openCartDrawer}
              aria-label="Shopping bag"
              id="header-bag-btn"
              className="relative p-1 text-[#111111] hover:text-[#C8A96A] transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#111111] text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-medium font-sans">
                  {itemCount}
                </span>
              )}
              <span className="hidden md:inline text-xs uppercase tracking-[0.16em] font-medium ml-1">
                Bag
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
