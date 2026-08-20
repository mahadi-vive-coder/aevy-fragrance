import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { useSettings } from '../../context/SettingsContext.tsx';

interface CartDrawerProps {
  onNavigateCheckout: () => void;
  onNavigateShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateCheckout, onNavigateShop }) => {
  const {
    cart,
    isCartOpen,
    closeCart,
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

  if (!isCartOpen) return null;

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
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0B0B0B] text-[#F5F1E8] shadow-2xl flex flex-col justify-between border-l border-[#2A2A2A]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#2A2A2A] flex items-center justify-between bg-[#111111]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#C8A96A]" />
              <h2 className="font-serif text-xl tracking-wide uppercase text-[#F5F1E8]">Shopping Selection</h2>
              <span className="text-[10px] font-bold bg-[#C8A96A] text-[#0B0B0B] px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-[#F5F1E8]/60 hover:text-[#C8A96A] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-[#161616] border border-[#C8A96A]/30 flex items-center justify-center mb-4 text-[#C8A96A]">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl text-[#F5F1E8] mb-2">Your AEVY selection is waiting.</h3>
                <p className="text-xs text-[#F5F1E8]/60 max-w-xs mb-6 leading-relaxed">
                  Explore our quiet luxury fragrances, crafted for effortless everyday elegance in Bangladesh.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    onNavigateShop();
                  }}
                  className="px-6 py-3 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C8A96A] transition-all cursor-pointer"
                >
                  Explore Fragrances
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex gap-4 p-3 bg-[#111111] border border-[#2A2A2A] shadow-xs"
                  >
                    <img
                      src={item.image}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-20 h-24 object-cover border border-[#2A2A2A] shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-base text-[#F5F1E8] leading-tight">{item.productName}</h4>
                          <button
                            onClick={() => removeFromCart(item.productId, item.size)}
                            className="text-[#F5F1E8]/40 hover:text-red-400 transition-colors p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-[#C8A96A] mt-0.5 tracking-wider">Flacon: {item.size}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-[#2A2A2A] bg-[#0B0B0B]">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                            className="px-2 py-1 text-xs text-[#F5F1E8]/70 hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-medium text-[#F5F1E8]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                            className="px-2 py-1 text-xs text-[#F5F1E8]/70 hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-serif text-sm font-semibold text-[#F5F1E8]">
                          ৳{(item.unitPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#111111] border-t border-[#2A2A2A] space-y-4">
              {/* Delivery Estimation Toggle */}
              <div className="bg-[#161616] p-3 border border-[#2A2A2A] text-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="uppercase tracking-widest text-[10px] text-[#F5F1E8]/70 font-semibold">
                    Delivery Destination
                  </span>
                  {isFreeDelivery && (
                    <span className="text-[10px] text-[#C8A96A] font-medium bg-[#0B0B0B] border border-[#C8A96A]/30 px-1.5 py-0.2">
                      Free Delivery Applied
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDistrictType('dhaka')}
                    className={`py-1.5 px-2 text-center text-xs transition-all border cursor-pointer ${
                      districtType === 'dhaka'
                        ? 'bg-[#C8A96A] text-[#0B0B0B] font-bold border-[#C8A96A]'
                        : 'bg-[#0B0B0B] text-[#F5F1E8] border-[#2A2A2A] hover:border-[#C8A96A]/50'
                    }`}
                  >
                    Inside Dhaka (৳{settings.deliveryInsideDhaka})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistrictType('outside')}
                    className={`py-1.5 px-2 text-center text-xs transition-all border cursor-pointer ${
                      districtType === 'outside'
                        ? 'bg-[#C8A96A] text-[#0B0B0B] font-bold border-[#C8A96A]'
                        : 'bg-[#0B0B0B] text-[#F5F1E8] border-[#2A2A2A] hover:border-[#C8A96A]/50'
                    }`}
                  >
                    Outside Dhaka (৳{settings.deliveryOutsideDhaka})
                  </button>
                </div>
              </div>

              {/* Promo Code Field */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between bg-[#161616] px-3 py-2 border border-[#C8A96A]/40 text-xs">
                    <div className="flex items-center gap-1.5 text-[#C8A96A] font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>Code: {couponCode} (-৳{discount})</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-[#F5F1E8]/60 hover:text-red-400 text-xs underline cursor-pointer"
                    >
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

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-[#F5F1E8]/80 pt-2 border-t border-[#2A2A2A]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#F5F1E8]">৳{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#C8A96A]">
                    <span>Promotional Discount</span>
                    <span>-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span>{finalDelivery === 0 ? 'FREE' : `৳${finalDelivery}`}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#F5F1E8] pt-2 border-t border-[#2A2A2A]">
                  <span>Total Payable</span>
                  <span className="text-[#C8A96A]">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  closeCart();
                  onNavigateCheckout();
                }}
                className="w-full py-4 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C8A96A] transition-all flex items-center justify-center gap-2 group shadow-xl cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[10px] text-center text-[#F5F1E8]/50 tracking-wider">
                Cash on Delivery Available Across Bangladesh
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
