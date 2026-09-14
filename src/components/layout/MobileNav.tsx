import React from 'react';
import { X, Search, Heart, PackageCheck, Compass, Sparkles } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useWishlist } from '../../context/WishlistContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onOpenSearch }) => {
  const { navigate, path } = useRouter();
  const { wishlistCount } = useWishlist();

  if (!isOpen) return null;

  const handleLinkClick = (target: string) => {
    onClose();
    navigate(target);
  };

  const navLinks = [
    { label: 'SHOP', to: '/shop' },
    { label: 'COLLECTIONS', to: '/collections' },
    { label: 'ABOUT', to: '/about' },
    { label: 'CONTACT', to: '/contact' },
    { label: 'TRACK ORDER', to: '/track-order' },
    { label: 'FAQ', to: '/faq' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#111111]/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 left-0 max-w-full flex pr-10">
        <aside
          aria-label="Mobile Navigation"
          className="w-screen max-w-xs bg-[#F8F7F3] border-r border-[#E6E3DC] shadow-2xl flex flex-col justify-between p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] animate-in slide-in-from-left duration-300 overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[#E6E3DC]">
            <div>
              <span className="font-serif text-2xl tracking-[0.2em] font-medium text-[#111111]">
                AEVY
              </span>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#6B6B6B]">
                Essence of Fresh Elegance
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              id="close-mobile-menu-btn"
              className="p-2 rounded-full text-[#6B6B6B] hover:text-[#111111] hover:bg-[#E6E3DC]/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-8 space-y-5">
            {navLinks.map((item) => {
              const active = path === item.to;
              return (
                <button
                  key={item.to}
                  onClick={() => handleLinkClick(item.to)}
                  className={`block w-full text-left font-serif text-2xl sm:text-3xl transition-colors ${
                    active ? 'text-[#C8A96A]' : 'text-[#111111] hover:text-[#C8A96A]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Secondary Quick Utilities */}
          <div className="border-t border-[#E6E3DC] pt-6 space-y-3 font-sans text-xs">
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center justify-between py-2 text-[#222222] hover:text-[#111111]"
            >
              <span className="flex items-center gap-2.5 tracking-wider uppercase">
                <Search className="w-4 h-4 text-[#6B6B6B]" />
                Search Fragrances
              </span>
            </button>

            <button
              onClick={() => handleLinkClick('/track-order')}
              className="w-full flex items-center justify-between py-2 text-[#222222] hover:text-[#111111]"
            >
              <span className="flex items-center gap-2.5 tracking-wider uppercase">
                <PackageCheck className="w-4 h-4 text-[#6B6B6B]" />
                Track Your Order
              </span>
            </button>

            <button
              onClick={() => handleLinkClick('/shop?filter=wishlist')}
              className="w-full flex items-center justify-between py-2 text-[#222222] hover:text-[#111111]"
            >
              <span className="flex items-center gap-2.5 tracking-wider uppercase">
                <Heart className="w-4 h-4 text-[#6B6B6B]" />
                Wishlist
              </span>
              {wishlistCount > 0 && (
                <span className="bg-[#C8A96A] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>

          {/* Bottom brand note */}
          <div className="pt-6 border-t border-[#E6E3DC]/60 text-[11px] text-[#6B6B6B]">
            <p className="uppercase tracking-[0.16em] text-[#C8A96A] font-semibold text-[10px]">
              ESSENCE OF FRESH ELEGANCE
            </p>
            <p className="mt-1 font-light">Fresh, modern fragrances with a quiet sense of elegance.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};
