import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useSettings } from '../context/SettingsContext.tsx';

interface CartPageProps {
  onNavigateCheckout: () => void;
  onNavigateShop: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigateCheckout, onNavigateShop }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    couponCode,
    discount,
    couponError,
    isApplyingCoupon,
    applyPromoCode,
    removePromoCode
  } = useCart();

  const { settings } = useSettings();
  const [promoInput, setPromoInput] = useState('');
  const [districtType, setDistrictType] = useState<'dhaka' | 'outside'>('dhaka');

  const estimatedDelivery = districtType === 'dhaka' ? settings.deliveryInsideDhaka : settings.deliveryOutsideDhaka;
  const isFreeDelivery = settings.freeDeliveryThreshold > 0 && subtotal >= settings.freeDeliveryThreshold;
  const finalDelivery = isFreeDelivery ? 0 : estimatedDelivery;
  const grandTotal = Math.max(0, subtotal + finalDelivery - discount);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = await applyPromoCode(promoInput.trim());
    if (ok) setPromoInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-[#F5F1E8]">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96A] font-semibold block">
          Your Selection
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-[#F5F1E8] tracking-[0.2em] uppercase">
          SHOPPING BAG
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="max-w-xl mx-auto text-center py-16 px-6 bg-[#111111] border border-[#2A2A2A] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#161616] border border-[#C8A96A]/30 flex items-center justify-center mx-auto text-[#C8A96A]">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl text-[#F5F1E8]">Your AEVY selection is waiting.</h2>
          <p className="text-xs text-[#F5F1E8]/60 leading-relaxed max-w-sm mx-auto">
            Discover our quiet luxury fragrances, handcrafted in small batches for everyday fresh elegance in Bangladesh.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateShop}
              className="px-8 py-3.5 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C8A96A] transition-all cursor-pointer"
            >
              Explore Catalog
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left: Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="hidden sm:grid grid-cols-12 text-[10px] uppercase tracking-widest text-[#F5F1E8]/50 pb-3 border-b border-[#2A2A2A]">
              <div className="col-span-6">Fragrance Item</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center p-4 bg-[#111111] border border-[#2A2A2A] shadow-lg"
              >
                {/* Product details */}
                <div className="w-full sm:col-span-6 flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-16 h-20 sm:w-20 sm:h-24 object-cover border border-[#2A2A2A] shrink-0"
                  />
                  <div>
                    <h3 className="font-serif text-lg text-[#F5F1E8] leading-tight">{item.productName}</h3>
                    <p className="text-xs text-[#C8A96A] mt-0.5 tracking-wider">Flacon: {item.size}</p>
                    <button
                      onClick={() => removeFromCart(item.productId, item.size)}
                      className="text-[11px] text-[#F5F1E8]/40 hover:text-red-400 underline mt-2 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>

                {/* Unit Price */}
                <div className="hidden sm:block sm:col-span-2 text-center text-xs text-[#F5F1E8]/80">
                  ৳ {item.unitPrice.toLocaleString()}
                </div>

                {/* Quantity */}
                <div className="w-full sm:w-auto sm:col-span-2 flex justify-between sm:justify-center items-center">
                  <span className="sm:hidden text-xs text-[#F5F1E8]/60">Quantity:</span>
                  <div className="flex items-center border border-[#2A2A2A] bg-[#0B0B0B]">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                      className="px-2.5 py-1 text-xs text-[#F5F1E8]/70 hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-medium text-[#F5F1E8]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                      className="px-2.5 py-1 text-xs text-[#F5F1E8]/70 hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="w-full sm:w-auto sm:col-span-2 flex justify-between sm:justify-end items-center">
                  <span className="sm:hidden text-xs text-[#F5F1E8]/60">Total:</span>
                  <span className="font-serif text-base font-light text-[#C8A96A]">
                    ৳ {(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}

            <div className="pt-4 flex justify-between items-center text-xs">
              <button
                onClick={onNavigateShop}
                className="text-[#F5F1E8]/70 hover:text-[#C8A96A] underline uppercase tracking-wider cursor-pointer"
              >
                ← Continue Browsing
              </button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4 bg-[#111111] border border-[#2A2A2A] p-6 sm:p-8 space-y-6 shadow-2xl">
            <h2 className="font-serif text-xl text-[#F5F1E8] uppercase tracking-wide border-b border-[#2A2A2A] pb-3">
              Order Summary
            </h2>

            {/* Delivery Estimation */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#F5F1E8]/60 font-semibold block">
                Select Destination:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDistrictType('dhaka')}
                  className={`py-2 px-2 text-center text-xs transition-all border cursor-pointer ${
                    districtType === 'dhaka'
                      ? 'bg-[#C8A96A] text-[#0B0B0B] font-bold border-[#C8A96A]'
                      : 'bg-[#0B0B0B] text-[#F5F1E8] border-[#2A2A2A] hover:border-[#C8A96A]/50'
                  }`}
                >
                  Inside Dhaka (৳ {settings.deliveryInsideDhaka})
                </button>
                <button
                  type="button"
                  onClick={() => setDistrictType('outside')}
                  className={`py-2 px-2 text-center text-xs transition-all border cursor-pointer ${
                    districtType === 'outside'
                      ? 'bg-[#C8A96A] text-[#0B0B0B] font-bold border-[#C8A96A]'
                      : 'bg-[#0B0B0B] text-[#F5F1E8] border-[#2A2A2A] hover:border-[#C8A96A]/50'
                  }`}
                >
                  Outside Dhaka (৳ {settings.deliveryOutsideDhaka})
                </button>
              </div>
            </div>

            {/* Promo Code */}
            <div>
              {couponCode ? (
                <div className="flex items-center justify-between bg-[#161616] px-3 py-2 border border-[#C8A96A]/40 text-xs">
                  <div className="flex items-center gap-1.5 text-[#C8A96A] font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Code: {couponCode} (-৳ {discount})</span>
                  </div>
                  <button onClick={removePromoCode} className="text-[#F5F1E8]/60 hover:text-red-400 text-xs underline cursor-pointer">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Coupon (e.g. FIRSTAEVY)"
                    className="flex-1 px-3 py-2 text-xs bg-[#0B0B0B] border border-[#2A2A2A] text-[#F5F1E8] focus:border-[#C8A96A] uppercase"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !promoInput.trim()}
                    className="px-3 py-2 bg-[#2A2A2A] text-[#F5F1E8] text-xs uppercase tracking-wider font-medium hover:bg-[#C8A96A] hover:text-[#0B0B0B] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isApplyingCoupon ? '...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {couponError}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-[#F5F1E8]/80 pt-2 border-t border-[#2A2A2A]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#F5F1E8]">৳ {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#C8A96A]">
                  <span>Promotional Discount</span>
                  <span>-৳ {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{finalDelivery === 0 ? 'FREE' : `৳ ${finalDelivery}`}</span>
              </div>
              <div className="flex justify-between text-xl font-serif font-light text-[#F5F1E8] pt-3 border-t border-[#2A2A2A]">
                <span>Grand Total</span>
                <span className="text-[#C8A96A]">৳ {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Proceed CTA */}
            <button
              onClick={onNavigateCheckout}
              className="w-full py-4 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C8A96A] transition-all flex items-center justify-center gap-2 group shadow-xl cursor-pointer"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-[10px] text-center text-[#F5F1E8]/50 tracking-wider">
              Cash on Delivery Available Across All 64 Districts
            </p>
          </div>

        </div>
      )}
    </div>
  );
};
