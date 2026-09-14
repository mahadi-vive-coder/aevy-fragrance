import React from 'react';
import { DBProductVariant } from '../../types';
import { Taka } from '../common/Taka';

interface ProductVariantSelectorProps {
  variants: DBProductVariant[];
  selectedVariant?: DBProductVariant;
  onSelectVariant: (variant: DBProductVariant) => void;
}

const SIZE_LABELS: Record<string, string> = {
  '3ml': 'Discovery Vial (3ml)',
  '10ml': 'Travel Atomizer (10ml)',
  '30ml': 'Signature Flacon (30ml)',
};

export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant
}) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-semibold uppercase tracking-[0.16em] text-[#111111]">
          SELECT SIZE
        </span>
        <span className="text-[#6B6B6B]">
          {selectedVariant ? (SIZE_LABELS[selectedVariant.size] || selectedVariant.size) : 'Choose Size'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isAvailable = variant.is_active && (variant.stock === undefined || variant.stock > 0);

          return (
            <button
              key={variant.id}
              type="button"
              id={`size-select-${variant.size}`}
              disabled={!isAvailable}
              onClick={() => onSelectVariant(variant)}
              className={`py-3 px-2 flex flex-col items-center justify-center border text-center rounded-xs transition-all ${
                isSelected
                  ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                  : isAvailable
                  ? 'border-[#E6E3DC] bg-white text-[#111111] hover:border-[#111111]/60'
                  : 'border-[#E6E3DC]/40 bg-[#F8F7F3] text-[#6B6B6B]/40 cursor-not-allowed line-through'
              }`}
            >
              <span className="font-serif text-base sm:text-lg font-medium leading-none">
                {variant.size}
              </span>
              <span
                className={`text-[11px] font-sans mt-1 ${
                  isSelected ? 'text-[#DFCA9B]' : 'text-[#6B6B6B]'
                }`}
              >
                <Taka />{Number(variant.price).toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
