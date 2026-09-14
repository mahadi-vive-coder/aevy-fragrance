import React, { useState } from 'react';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { DBProduct } from '../../types';
import { useRouter } from '../../context/RouterContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Taka } from '../common/Taka';

interface ProductCardProps {
  product: DBProduct;
  ctaText?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, ctaText }) => {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const variants = product.variants || [];
  const defaultVariant = variants.find((v) => v.size === '30ml') || variants[0];
  const prices = variants.map((v) => Number(v.price)).filter((p) => !isNaN(p) && p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : Number(product.base_price || 0);

  const isWishlisted = isInWishlist(product.id);
  const [justAdded, setJustAdded] = useState(false);

  const primaryImage = product.image_url || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80';

  const handleCardClick = () => {
    navigate(`/products/${product.slug}`);
  };

  const handleQuickAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If combo or requires custom selection or custom CTA, go to PDP
    if (product.product_type === 'combo' || ctaText || !defaultVariant) {
      navigate(`/products/${product.slug}`);
      return;
    }
    addToCart(product, defaultVariant, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const isCombo = product.product_type === 'combo';

  return (
    <div
      id={`product-card-${product.slug}`}
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col bg-white border border-[#E6E3DC] hover:border-[#111111]/30 transition-all duration-300 rounded-sm overflow-hidden"
    >
      {/* Image container */}
      <div className="relative w-full aspect-[4/5] bg-[#FAF9F6] overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {isCombo && (
            <span className="text-[10px] font-sans tracking-[0.14em] uppercase bg-[#111111] text-white px-2 py-0.5 font-medium">
              CURATED SET
            </span>
          )}
          {product.is_featured && !isCombo && (
            <span className="text-[10px] font-sans tracking-[0.14em] uppercase bg-white/95 backdrop-blur-xs text-[#C8A96A] px-2 py-0.5 border border-[#E6E3DC] font-medium">
              SIGNATURE
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#111111] hover:text-[#C8A96A] border border-[#E6E3DC] hover:border-[#C8A96A]/50 transition-colors shadow-xs"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isWishlisted ? 'fill-[#C8A96A] text-[#C8A96A]' : 'stroke-[1.5]'
            }`}
          />
        </button>

        {/* Desktop Quick Add / Action Bar */}
        <div className="hidden sm:flex absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-10">
          <button
            onClick={handleQuickAction}
            className="w-full py-2.5 bg-[#111111] text-white text-[11px] font-sans uppercase tracking-[0.16em] font-medium hover:bg-[#222222] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            {isCombo ? (
              <span>CUSTOMIZE SET</span>
            ) : ctaText ? (
              <span>{ctaText}</span>
            ) : justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>ADDED TO BAG</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>ADD TO BAG</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content details */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white border-t border-[#E6E3DC]/60">
        <div>
          <div className="flex items-baseline justify-between gap-1 mb-1">
            <h3 className="font-serif text-xl sm:text-2xl text-[#111111] tracking-wide group-hover:text-[#C8A96A] transition-colors">
              {product.name}
            </h3>
            <span className="text-xs font-semibold text-[#111111] font-sans whitespace-nowrap">
              {variants.length > 1 ? `From ` : ''}<Taka />{minPrice.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-[#6B6B6B] font-sans mb-3">
            <span className="truncate pr-2">{product.scent_descriptor || product.category || 'Extrait de Parfum'}</span>
            <span className="text-[11px] text-[#8C8C8C] font-sans whitespace-nowrap">
              {variants.length > 0 ? variants.map((v) => v.size).join(' / ') : 'Extrait'}
            </span>
          </div>
        </div>

        {/* Mobile Action button */}
        <div className="sm:hidden pt-2 border-t border-[#E6E3DC]/50 mt-1">
          <button
            onClick={handleQuickAction}
            className="w-full py-2 bg-[#111111] text-white text-[11px] font-sans uppercase tracking-[0.14em] font-medium flex items-center justify-center gap-1.5 active:bg-[#333333]"
          >
            {isCombo ? (
              <span>CUSTOMIZE SET</span>
            ) : ctaText ? (
              <span>{ctaText}</span>
            ) : justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>ADDED TO BAG</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>ADD TO BAG</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
