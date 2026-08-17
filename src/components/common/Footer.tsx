import React from 'react';
import { Instagram, Facebook, Share2, Sparkles, ArrowUpRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.tsx';

interface FooterProps {
  onNavigate?: (path: string) => void;
  onNavigateShop?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  onNavigateFaq?: () => void;
  onNavigateTrackOrder?: () => void;
  onNavigatePolicy?: (policyType: 'shipping' | 'refund' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onNavigateShop,
  onNavigateAbout,
  onNavigateContact,
  onNavigateFaq,
  onNavigateTrackOrder,
  onNavigatePolicy
}) => {
  const { settings } = useSettings();

  const handleLinkClick = (path: string) => {
    if (path === '/shop' || path === 'shop') {
      onNavigateShop ? onNavigateShop() : onNavigate?.('/shop');
    } else if (path === '/about' || path === 'about') {
      onNavigateAbout ? onNavigateAbout() : onNavigate?.('/about');
    } else if (path === '/contact' || path === 'contact') {
      onNavigateContact ? onNavigateContact() : onNavigate?.('/contact');
    } else if (path === '/faq' || path === 'faq') {
      onNavigateFaq ? onNavigateFaq() : onNavigate?.('/faq');
    } else if (path === '/shipping-delivery' || path === 'shipping') {
      onNavigatePolicy ? onNavigatePolicy('shipping') : onNavigate?.('/shipping-delivery');
    } else if (path === '/return-refund' || path === 'refund') {
      onNavigatePolicy ? onNavigatePolicy('refund') : onNavigate?.('/return-refund');
    } else if (path === '/privacy-policy' || path === 'privacy') {
      onNavigatePolicy ? onNavigatePolicy('privacy') : onNavigate?.('/privacy-policy');
    } else if (path === '/terms-conditions' || path === 'terms') {
      onNavigatePolicy ? onNavigatePolicy('terms') : onNavigate?.('/terms-conditions');
    } else {
      onNavigate?.(path);
    }
  };

  const links = [
    { label: 'Shop Fragrances', path: '/shop' },
    { label: 'Brand Story & Ethos', path: '/about' },
    { label: 'Concierge & Contact', path: '/contact' },
    { label: 'Fragrance FAQ', path: '/faq' },
    { label: 'Shipping & Delivery', path: '/shipping-delivery' },
    { label: 'Return & Refund Policy', path: '/return-refund' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms & Conditions', path: '/terms-conditions' }
  ];

  const cleanWhatsappNumber = (settings?.whatsappNumber || '01700000000').replace(/\D/g, '');

  return (
    <footer className="bg-[#0B0B0B] text-[#FAFAF8] border-t border-[#111111] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#2A2A2A]">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <button
              onClick={() => handleLinkClick('/')}
              className="text-left group cursor-pointer"
            >
              <span className="font-display text-3xl sm:text-4xl tracking-[0.25em] text-[#FAFAF8] group-hover:text-[#C8A96A] transition-colors">
                AEVY
              </span>
              <span className="block text-[10px] tracking-[0.35em] text-[#C8A96A] font-semibold mt-1">
                {settings?.tagline || 'ESSENCE OF FRESH ELEGANCE'}
              </span>
            </button>
            
            <p className="text-xs text-[#B8B8B8] max-w-sm leading-relaxed">
              A modern niche fragrance house founded in Bangladesh. Quiet luxury, minimalist craft, and small-batch formulations engineered for effortless everyday elegance.
            </p>

            <div className="pt-2 flex items-center space-x-3 text-xs text-[#B8B8B8]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1A1A] border border-[#2A2A2A] text-[10px] uppercase tracking-wider text-[#C8A96A]">
                <Sparkles className="w-3 h-3" /> Small-Batch Bottled
              </span>
              <span className="inline-flex items-center px-2.5 py-1 bg-[#1A1A1A] border border-[#2A2A2A] text-[10px] uppercase tracking-wider text-[#FAFAF8]">
                Dhaka, Bangladesh
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#C8A96A] font-semibold mb-4">
              Explore AEVY
            </h4>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
              {links.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className="text-left text-xs text-[#B8B8B8] hover:text-[#FAFAF8] transition-colors flex items-center gap-1 group cursor-pointer"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">{link.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Concierge & Socials */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#C8A96A] font-semibold mb-4">
              Fragrance Concierge
            </h4>
            <div className="space-y-1.5 text-xs text-[#B8B8B8]">
              <p>Direct Inquiries:</p>
              <a
                href={`mailto:${settings?.contactEmail || 'concierge@aevyfragrance.com'}`}
                className="text-[#FAFAF8] hover:text-[#C8A96A] transition-colors block underline font-mono text-[11px]"
              >
                {settings?.contactEmail || 'concierge@aevyfragrance.com'}
              </a>
              <p className="pt-1">WhatsApp Concierge:</p>
              <a
                href={`https://wa.me/${cleanWhatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C8A96A] hover:underline font-mono text-[11px] inline-flex items-center gap-1"
              >
                {settings?.contactPhone || '+880 1700-000000'} <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <p className="text-[10px] uppercase tracking-widest text-[#B8B8B8] mb-2.5">Follow Our Journey</p>
              <div className="flex items-center space-x-3">
                {settings?.socialLinks?.instagram && (
                  <a
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#B8B8B8] hover:text-[#C8A96A] hover:border-[#C8A96A] transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings?.socialLinks?.facebook && (
                  <a
                    href={settings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#B8B8B8] hover:text-[#C8A96A] hover:border-[#C8A96A] transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={settings?.socialLinks?.tiktok || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#B8B8B8] hover:text-[#C8A96A] hover:border-[#C8A96A] transition-colors"
                  aria-label="TikTok"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#B8B8B8]/60 space-y-3 sm:space-y-0">
          <p>© {new Date().getFullYear()} AEVY Fragrance. All rights reserved. Dhaka, Bangladesh.</p>
          <div className="flex items-center space-x-6 text-[10px] tracking-wider uppercase">
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>30ml Extrait Concentration</span>
            <span>•</span>
            <span>Unisex Formula</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
