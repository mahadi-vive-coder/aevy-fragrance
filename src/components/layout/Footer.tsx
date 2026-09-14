import React from 'react';
import { Link } from '../../context/RouterContext';
import { Instagram, Facebook, ShieldCheck, Truck, Sparkles, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E6E3DC] text-[#222222] font-sans">
      {/* Brand values banner */}
      <div className="border-b border-[#E6E3DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Sparkles className="w-5 h-5 text-[#C8A96A] mb-2 stroke-[1.5]" />
            <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#111111]">
              Extrait de Parfum
            </span>
            <span className="text-[12px] text-[#6B6B6B] mt-0.5">High oil concentration</span>
          </div>

          <div className="flex flex-col items-center">
            <Truck className="w-5 h-5 text-[#C8A96A] mb-2 stroke-[1.5]" />
            <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#111111]">
              Nationwide Delivery
            </span>
            <span className="text-[12px] text-[#6B6B6B] mt-0.5">24–48h Dhaka • 48–72h outside</span>
          </div>

          <div className="flex flex-col items-center">
            <ShieldCheck className="w-5 h-5 text-[#C8A96A] mb-2 stroke-[1.5]" />
            <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#111111]">
              Cash on Delivery
            </span>
            <span className="text-[12px] text-[#6B6B6B] mt-0.5">Available across all districts</span>
          </div>

          <div className="flex flex-col items-center">
            <RefreshCw className="w-5 h-5 text-[#C8A96A] mb-2 stroke-[1.5]" />
            <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#111111]">
              7-Day Returns
            </span>
            <span className="text-[12px] text-[#6B6B6B] mt-0.5">On unopened, sealed bottles</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Intro Column */}
          <div className="md:col-span-2 space-y-4 pr-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.24em] font-medium text-[#111111]">
                AEVY
              </span>
            </Link>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C8A96A] font-semibold">
              ESSENCE OF FRESH ELEGANCE
            </p>
            <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-sm font-light">
              Fresh, modern fragrances with a quiet sense of elegance.
            </p>
            <div className="pt-2 flex items-center space-x-6 text-xs text-[#6B6B6B] uppercase tracking-wider font-medium">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-[#111111] transition-colors inline-flex items-center gap-1.5"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>INSTAGRAM</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="hover:text-[#111111] transition-colors inline-flex items-center gap-1.5"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>FACEBOOK</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#111111]">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6B6B6B]">
              <li>
                <Link to="/shop" className="hover:text-[#111111] transition-colors">
                  SHOP
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#111111] transition-colors">
                  ABOUT
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#111111] transition-colors">
                  CONTACT
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-[#111111] transition-colors">
                  TRACK ORDER
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#111111] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#111111]">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6B6B6B]">
              <li>
                <Link to="/shipping" className="hover:text-[#111111] transition-colors">
                  SHIPPING POLICY
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-[#111111] transition-colors">
                  RETURN & EXCHANGE
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#111111] transition-colors">
                  PRIVACY POLICY
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#111111] transition-colors">
                  TERMS & CONDITIONS
                </Link>
              </li>
            </ul>
          </div>

          {/* Scent Atelier Note */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#111111]">
              ATELIER
            </h4>
            <p className="text-xs text-[#6B6B6B] leading-relaxed font-light">
              Formulated in small batches with fine perfume oils. Made for everyday wear.
            </p>
            <p className="text-[11px] text-[#6B6B6B]/80 pt-1">
              Dhaka, Bangladesh
            </p>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="border-t border-[#E6E3DC] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B6B6B] gap-4">
          <p>© 2026 AEVY. All rights reserved.</p>
          <div className="flex items-center space-x-4 sm:space-x-6 text-[11px]">
            <span>Dhaka, Bangladesh</span>
            <span>•</span>
            <span className="text-[#111111] uppercase tracking-wider font-medium">ESSENCE OF FRESH ELEGANCE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
