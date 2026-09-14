import React, { useState, useEffect } from 'react';
import { DBProduct, DBProductVariant, ComboComponentSelection } from '../../types';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Taka } from '../common/Taka';

interface StickyMobileBarProps {
  product: DBProduct;
  selectedVariant?: DBProductVariant;
  comboSelections?: ComboComponentSelection[];
  triggerElementId: string;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  product,
  selectedVariant,
  comboSelections,
  triggerElementId
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const trigger = document.getElementById(triggerElementId);
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      if (rect.bottom < 80) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [triggerElementId]);

  const isCombo = product.product_type === 'combo';
  const price = isCombo
    ? (product.combo_price ?? product.price ?? 0)
    : (selectedVariant?.price ?? product.base_price ?? product.price ?? 0);

  const handleAdd = () => {
    if (isCombo) {
      addToCart(product, selectedVariant || null, 1, comboSelections);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
      return;
    }
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, 1, comboSelections);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  if (!isVisible || (!selectedVariant && !isCombo)) return null;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E6E3DC] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-serif text-base text-[#111111] truncate leading-tight">
            {product.name}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
            <span className="font-semibold text-[#111111]">
              <Taka />{Number(price).toLocaleString()}
            </span>
            <span>•</span>
            <span>{selectedVariant.size}</span>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="px-5 py-2.5 bg-[#111111] text-white text-xs font-sans uppercase tracking-[0.14em] font-medium shrink-0 flex items-center gap-1.5 rounded-xs shadow-sm active:bg-[#333333] transition-colors"
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
