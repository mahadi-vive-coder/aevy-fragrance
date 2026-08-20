import React from 'react';
import { Instagram, Facebook, Phone, Sparkles, Mail, MapPin } from 'lucide-react';
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

  const contactPhone = settings?.contactPhone || '01629927898';
  const instagramUrl = settings?.socialLinks?.instagram || 'https://instagram.com/aevy.fragrance';
  const hasFacebook = settings?.socialLinks?.facebook && settings.socialLinks.facebook !== '#' && settings.socialLinks.facebook.trim() !== '';

  return (
    <footer className="bg-[#0B0B0B] text-[#FAFAF8] border-t border-[#222222] pt-16 pb-12 mt-20">
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
            
            <p className="text-xs sm:text-sm text-[#D4CEBF] max-w-sm leading-relaxed font-normal">
              A modern niche fragrance house founded in Bangladesh. Quiet luxury, minimalist craft, and small-batch formulations engineered for effortless everyday elegance.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-[#D4CEBF]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#161616] border border-[#2A2A2A] text-[10px] uppercase tracking-wider text-[#C8A96A] font-medium">
                <Sparkles className="w-3 h-3" /> Small-Batch Bottled
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#161616] border border-[#2A2A2A] text-[10px] uppercase tracking-wider text-[#FAFAF8] font-medium">
                <MapPin className="w-3 h-3 text-[#C8A96A]" /> Narayanganj, Dhaka, Bangladesh
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
                  className="text-left text-xs sm:text-[13px] text-[#D4CEBF] hover:text-[#FAFAF8] hover:translate-x-0.5 transition-all flex items-center gap-1 group cursor-pointer py-0.5"
                >
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Concierge & Socials */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#C8A96A] font-semibold mb-4">
              Fragrance Concierge
            </h4>
            <div className="space-y-2 text-xs sm:text-[13px] text-[#D4CEBF]">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#999999] mb-0.5">Telephone Support:</p>
                <a
                  href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                  className="text-[#FAFAF8] hover:text-[#C8A96A] transition-colors font-mono text-sm inline-flex items-center gap-2 font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>{contactPhone}</span>
                </a>
              </div>

              <div className="pt-1">
                <p className="text-[11px] uppercase tracking-wider text-[#999999] mb-0.5">Direct Email:</p>
                <a
                  href={`mailto:${settings?.contactEmail || 'concierge@aevyfragrance.com'}`}
                  className="text-[#FAFAF8] hover:text-[#C8A96A] transition-colors block font-mono text-xs inline-flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>{settings?.contactEmail || 'concierge@aevyfragrance.com'}</span>
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-3">
              <p className="text-[10px] uppercase tracking-widest text-[#999999] mb-2.5 font-semibold">Follow On Instagram</p>
              <div className="flex items-center space-x-3">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm border border-[#333333] bg-[#141414] text-xs text-[#FAFAF8] hover:text-[#C8A96A] hover:border-[#C8A96A] transition-colors"
                  aria-label="Instagram @aevy.fragrance"
                >
                  <Instagram className="w-4 h-4 text-[#C8A96A]" />
                  <span className="font-mono text-xs">@aevy.fragrance</span>
                </a>

                {hasFacebook && (
                  <a
                    href={settings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-sm border border-[#333333] bg-[#141414] flex items-center justify-center text-[#D4CEBF] hover:text-[#C8A96A] hover:border-[#C8A96A] transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#999999] space-y-3 sm:space-y-0">
          <p>© {new Date().getFullYear()} AEVY Fragrance. All rights reserved. Narayanganj, Dhaka, Bangladesh.</p>
          <div className="flex items-center space-x-4 sm:space-x-6 text-[10px] sm:text-[11px] tracking-wider uppercase text-[#D4CEBF]">
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
