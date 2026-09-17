import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto pb-2 lg:pb-0 shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`View ${productName} image ${idx + 1}`}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xs border overflow-hidden transition-all shrink-0 ${
                selectedIndex === idx
                  ? 'border-[#111111] ring-1 ring-[#111111]'
                  : 'border-[#E6E3DC] opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center bg-[#FAF9F6]"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Feature Image */}
      <div className="flex-1 relative aspect-[4/5] bg-[#FAF9F6] border border-[#E6E3DC] rounded-xs overflow-hidden">
        <img
          src={images[selectedIndex]}
          alt={productName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-all duration-300"
        />

        {/* Subtle image counter pill for mobile */}
        {images.length > 1 && (
          <div className="lg:hidden absolute bottom-3 right-3 bg-[#111111]/70 backdrop-blur-xs text-white text-[10px] font-sans px-2.5 py-1 rounded-full">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};
