import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Truck,
  Sparkles,
  Plus,
  Minus,
  Droplets,
  Wind,
  Feather,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { useSettings } from '../context/SettingsContext.tsx';

interface ProductDetailPageProps {
  product: Product;
  onNavigateCheckout: () => void;
  onNavigateShop: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onNavigateCheckout,
  onNavigateShop
}) => {
  const { addToCart } = useCart();
  const { settings } = useSettings();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.size || '30ml');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('story');

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const currentVariant = product.sizes.find((s) => s.size === selectedSize) || product.sizes[0];
  const unitPrice = currentVariant ? currentVariant.price : product.price;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    onNavigateCheckout();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-[#F5F1E8]">
      
      {/* Breadcrumb */}
      <nav className="text-xs uppercase tracking-widest text-[#F5F1E8]/50 mb-8 flex items-center gap-2">
        <button onClick={onNavigateShop} className="hover:text-[#C8A96A] transition-colors cursor-pointer">
          Catalog
        </button>
        <span>/</span>
        <span>{product.fragranceFamily}</span>
        <span>/</span>
        <span className="text-[#C8A96A] font-medium">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative overflow-hidden bg-[#111111] border border-[#2A2A2A] shadow-2xl">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-[400px] sm:h-[550px] object-cover object-center transition-all duration-500"
            />
            <div className="absolute top-4 left-4 bg-[#0B0B0B]/90 border border-[#2A2A2A] text-[#C8A96A] text-[10px] tracking-widest uppercase px-3 py-1 font-semibold">
              Extrait de Parfum • 30ml Flacon
            </div>
            {product.stock <= 0 || product.status === 'out_of_stock' ? (
              <div className="absolute bottom-4 right-4 bg-red-950/90 text-red-300 border border-red-800/80 text-[10px] uppercase font-bold tracking-wider px-3 py-1 shadow-md">
                Out of Stock
              </div>
            ) : product.stock <= product.lowStockThreshold ? (
              <div className="absolute bottom-4 right-4 bg-[#C8A96A] text-[#0B0B0B] text-[10px] uppercase font-bold tracking-wider px-3 py-1 shadow-md">
                Only {product.stock} Left in Batch
              </div>
            ) : null}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`overflow-hidden border transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[#C8A96A] ring-1 ring-[#C8A96A]'
                      : 'border-[#2A2A2A] hover:border-[#F5F1E8]/40'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-20 sm:h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Header & Title */}
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96A] font-semibold block mb-1">
              AEVY Fragrance House
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F5F1E8] tracking-wide font-normal mb-2">
              {product.name}
            </h1>
            <p className="text-xs font-medium tracking-widest text-[#F5F1E8]/70 uppercase mb-4">
              {product.tagline}
            </p>
            
            {/* Price */}
            <div className="flex items-baseline gap-3 py-3 border-y border-[#2A2A2A]">
              <span className="font-serif text-3xl sm:text-4xl font-light text-[#C8A96A]">
                ৳ {unitPrice.toLocaleString()}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-[#F5F1E8]/40 line-through">
                  ৳ {product.comparePrice.toLocaleString()}
                </span>
              )}
              <span className="text-[10px] text-[#F5F1E8]/60 font-medium tracking-wider uppercase ml-auto">
                30ml Extrait Concentration
              </span>
            </div>
          </div>

          {/* Scent Summary */}
          <p className="text-sm text-[#E8E4DA]/90 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Size Selector */}
          <div>
            <div className="flex justify-between text-xs uppercase tracking-widest text-[#F5F1E8]/70 mb-2">
              <span>Select Flacon Size:</span>
              <span className="font-medium text-[#C8A96A]">{selectedSize} (Standard Extrait)</span>
            </div>
            <div className="flex gap-2.5">
              {product.sizes.map((sizeObj) => (
                <button
                  key={sizeObj.size}
                  type="button"
                  onClick={() => setSelectedSize(sizeObj.size)}
                  className={`flex-1 py-3 px-3 text-xs uppercase tracking-wider transition-all border text-center cursor-pointer ${
                    selectedSize === sizeObj.size
                      ? 'bg-[#C8A96A] text-[#0B0B0B] font-bold border-[#C8A96A] shadow-md'
                      : 'bg-[#111111] text-[#F5F1E8] border-[#2A2A2A] hover:border-[#C8A96A]/60'
                  }`}
                >
                  <span className="block font-medium">{sizeObj.size}</span>
                  <span className="block text-[10px] opacity-80 mt-0.5">৳ {sizeObj.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3">
            {product.stock <= 0 || product.status === 'out_of_stock' ? (
              <div className="p-4 bg-red-950/30 border border-red-800/50 text-center space-y-1">
                <span className="text-xs uppercase tracking-widest text-red-300 font-bold block">
                  Currently Out of Stock
                </span>
                <p className="text-[11px] text-[#F5F1E8]/60">
                  This fragrance flacon is currently undergoing maturation for the next batch.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-[#2A2A2A] bg-[#111111] h-12">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 text-[#F5F1E8]/70 hover:bg-[#1A1A1A] h-full transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-medium text-sm text-[#F5F1E8]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 text-[#F5F1E8]/70 hover:bg-[#1A1A1A] h-full transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 h-12 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C8A96A] transition-all shadow-xl cursor-pointer"
                  >
                    ADD TO CART
                  </button>
                </div>

                {/* Buy Now (Direct Checkout) */}
                <button
                  onClick={handleBuyNow}
                  className="w-full h-12 bg-transparent text-[#F5F1E8] border border-[#2A2A2A] text-xs uppercase tracking-[0.2em] font-bold hover:border-[#C8A96A] hover:text-[#C8A96A] transition-all cursor-pointer"
                >
                  BUY NOW (CASH ON DELIVERY)
                </button>
              </>
            )}
          </div>

          {/* Quick Assurance Badges */}
          <div className="grid grid-cols-2 gap-3 py-4 border-y border-[#2A2A2A] text-xs text-[#F5F1E8]/80">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C8A96A] shrink-0" />
              <span>Dhaka 24-48h • Nationwide 2-4 Days</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C8A96A] shrink-0" />
              <span>100% Authentic Niche Oils</span>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="border-t border-[#2A2A2A] divide-y divide-[#2A2A2A]">
            
            {/* 1. Fragrance Story */}
            <div className="py-4">
              <button
                onClick={() => toggleAccordion('story')}
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.2em] font-medium text-[#F5F1E8] hover:text-[#C8A96A] cursor-pointer"
              >
                <span>Fragrance Story</span>
                {openAccordion === 'story' ? <ChevronUp className="w-4 h-4 text-[#C8A96A]" /> : <ChevronDown className="w-4 h-4 text-[#F5F1E8]/40" />}
              </button>
              {openAccordion === 'story' && (
                <div className="mt-3 text-xs text-[#E8E4DA]/80 leading-relaxed font-light space-y-2">
                  <p>{product.story}</p>
                </div>
              )}
            </div>

            {/* 2. Fragrance Notes Pyramid */}
            <div className="py-4">
              <button
                onClick={() => toggleAccordion('notes')}
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.2em] font-medium text-[#F5F1E8] hover:text-[#C8A96A] cursor-pointer"
              >
                <span>Fragrance Notes Pyramid</span>
                {openAccordion === 'notes' ? <ChevronUp className="w-4 h-4 text-[#C8A96A]" /> : <ChevronDown className="w-4 h-4 text-[#F5F1E8]/40" />}
              </button>
              {openAccordion === 'notes' && (
                <div className="mt-4 space-y-3 bg-[#111111] p-4 border border-[#2A2A2A]">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#C8A96A] font-semibold block">
                      Top Notes (Opening)
                    </span>
                    <p className="font-serif text-base text-[#F5F1E8]">{product.notes.top.join(', ')}</p>
                  </div>
                  <div className="h-[1px] bg-[#2A2A2A]" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#C8A96A] font-semibold block">
                      Heart Notes (Character)
                    </span>
                    <p className="font-serif text-base text-[#F5F1E8]">{product.notes.heart.join(', ')}</p>
                  </div>
                  <div className="h-[1px] bg-[#2A2A2A]" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#C8A96A] font-semibold block">
                      Base Notes (Dry Down & Trail)
                    </span>
                    <p className="font-serif text-base text-[#F5F1E8]">{product.notes.base.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Scent Profile & Performance */}
            <div className="py-4">
              <button
                onClick={() => toggleAccordion('profile')}
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.2em] font-medium text-[#F5F1E8] hover:text-[#C8A96A] cursor-pointer"
              >
                <span>Scent Profile & Longevity</span>
                {openAccordion === 'profile' ? <ChevronUp className="w-4 h-4 text-[#C8A96A]" /> : <ChevronDown className="w-4 h-4 text-[#F5F1E8]/40" />}
              </button>
              {openAccordion === 'profile' && (
                <div className="mt-3 text-xs text-[#E8E4DA]/80 leading-relaxed space-y-2">
                  <div className="flex justify-between py-1 border-b border-[#2A2A2A]">
                    <span className="text-[#F5F1E8]/60 uppercase tracking-wider text-[10px]">Concentration</span>
                    <span className="font-medium text-[#F5F1E8]">{product.details.concentration}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#2A2A2A]">
                    <span className="text-[#F5F1E8]/60 uppercase tracking-wider text-[10px]">Longevity</span>
                    <span className="font-medium text-[#F5F1E8]">{product.details.longevity}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#2A2A2A]">
                    <span className="text-[#F5F1E8]/60 uppercase tracking-wider text-[10px]">Sillage</span>
                    <span className="font-medium text-[#F5F1E8]">{product.details.sillage}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#F5F1E8]/60 uppercase tracking-wider text-[10px]">Ideal Season</span>
                    <span className="font-medium text-[#F5F1E8]">{product.details.season}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4. How It Feels & Application */}
            <div className="py-4">
              <button
                onClick={() => toggleAccordion('application')}
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.2em] font-medium text-[#F5F1E8] hover:text-[#C8A96A] cursor-pointer"
              >
                <span>How It Feels & Application</span>
                {openAccordion === 'application' ? <ChevronUp className="w-4 h-4 text-[#C8A96A]" /> : <ChevronDown className="w-4 h-4 text-[#F5F1E8]/40" />}
              </button>
              {openAccordion === 'application' && (
                <div className="mt-3 text-xs text-[#E8E4DA]/80 leading-relaxed font-light space-y-2">
                  <p>{product.details.applicationGuide}</p>
                  <p className="italic text-[#C8A96A]/80">
                    Pro-tip: For optimal longevity in Bangladesh's humidity, spray over collarbones and pulse points immediately after a warm shower.
                  </p>
                </div>
              )}
            </div>

            {/* 5. Shipping & Delivery in Bangladesh */}
            <div className="py-4">
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.2em] font-medium text-[#F5F1E8] hover:text-[#C8A96A] cursor-pointer"
              >
                <span>Shipping & Delivery in Bangladesh</span>
                {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4 text-[#C8A96A]" /> : <ChevronDown className="w-4 h-4 text-[#F5F1E8]/40" />}
              </button>
              {openAccordion === 'shipping' && (
                <div className="mt-3 text-xs text-[#E8E4DA]/80 leading-relaxed space-y-2">
                  <p>
                    <strong className="text-[#F5F1E8]">Inside Dhaka:</strong> Delivery within 24 to 48 hours (৳ {settings.deliveryInsideDhaka}).
                  </p>
                  <p>
                    <strong className="text-[#F5F1E8]">Outside Dhaka:</strong> Nationwide delivery to all 64 districts within 2 to 4 business days (৳ {settings.deliveryOutsideDhaka}).
                  </p>
                  <p>
                    <strong className="text-[#F5F1E8]">Payment:</strong> Cash on Delivery available at your doorstep. Inspect your parcel before payment.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
