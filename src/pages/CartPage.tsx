import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import { Taka } from '../components/common/Taka';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    discount,
    promoCode,
    total,
    settings,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const { navigate } = useRouter();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyPromoCode(promoInput);
    if (!ok) {
      setPromoError('Invalid promo code. Try "AEVY10" for 10% off.');
    } else {
      setPromoError('');
      setPromoInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center font-sans">
        <div className="max-w-md mx-auto space-y-5 bg-white border border-[#E6E3DC] p-10 sm:p-14 rounded-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#E6E3DC] flex items-center justify-center text-[#6B6B6B] mx-auto">
            <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight">YOUR BAG IS EMPTY.</h1>
          <p className="text-xs sm:text-sm text-[#6B6B6B] font-light">
            Your next signature scent is waiting.
          </p>
          <button
            onClick={() => navigate('/shop')}
            id="cart-page-explore-btn"
            className="px-8 py-3.5 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#222222] transition-colors"
          >
            EXPLORE FRAGRANCES
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 font-sans">
      {/* Page Header */}
      <div className="border-b border-[#E6E3DC] pb-4 flex items-baseline justify-between">
        <div>
          <span className="text-[11px] font-sans tracking-[0.24em] text-[#C8A96A] uppercase font-semibold">
            AEVY
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1 tracking-tight">YOUR BAG</h1>
        </div>
        <button
          onClick={() => navigate('/shop')}
          className="text-xs text-[#6B6B6B] hover:text-[#111111] flex items-center gap-1.5 uppercase tracking-wider font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>CONTINUE SHOPPING</span>
        </button>
      </div>

      {/* Grid: Left products, Right summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Products List (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E6E3DC] rounded-sm divide-y divide-[#E6E3DC]">
          <div className="px-6 py-4 bg-[#FAF9F6] border-b border-[#E6E3DC] flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
            <span>FRAGRANCE</span>
            <span>QUANTITY & TOTAL</span>
          </div>

          {items.map((item) => (
            <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=300&q=80'}
                  alt={item.productName}
                  referrerPolicy="no-referrer"
                  className="w-20 h-24 object-cover rounded bg-[#FAF9F6] border border-[#E6E3DC] shrink-0 cursor-pointer"
                  onClick={() => navigate(`/products/${item.productSlug || item.productId}`)}
                />
                <div className="space-y-1">
                  <h3
                    onClick={() => navigate(`/products/${item.productSlug || item.productId}`)}
                    className="font-serif text-xl sm:text-2xl text-[#111111] hover:text-[#C8A96A] cursor-pointer transition-colors"
                  >
                    {item.productName}
                  </h3>
                  <p className="text-xs text-[#6B6B6B]">
                    {item.size || 'Extrait'} • Extrait de Parfum
                  </p>
                  {item.comboSelections && item.comboSelections.length > 0 && (
                    <div className="text-[11px] text-[#6B6B6B] space-y-0.5">
                      {item.comboSelections.map((sel) => (
                        <p key={sel.slotId}>• {sel.slotTitle || sel.slotName}: {sel.productName} ({sel.variantSize || (sel as any)?.size || '3ml'})</p>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-[#111111] font-medium">
                    <Taka />{item.price.toLocaleString()} each
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Price */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E6E3DC]/60">
                <div className="inline-flex items-center border border-[#E6E3DC] bg-white rounded">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease"
                    className="px-2.5 py-1 text-xs text-[#111111] hover:bg-[#F8F7F3]"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-3 text-xs font-medium font-sans">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.stock > 0 && item.quantity >= item.stock}
                    aria-label="Increase"
                    className="px-2.5 py-1 text-xs text-[#111111] hover:bg-[#F8F7F3] disabled:opacity-30"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-serif text-lg sm:text-xl font-medium text-[#111111] block">
                    <Taka />{(item.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label="REMOVE"
                    className="text-[11px] text-[#6B6B6B] hover:text-[#111111] uppercase tracking-wider transition-colors"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E6E3DC] p-6 sm:p-8 rounded-sm space-y-6">
          <h2 className="font-serif text-2xl text-[#111111] pb-3 border-b border-[#E6E3DC] tracking-tight uppercase">
            ORDER SUMMARY
          </h2>

          {/* Promo code */}
          <div>
            {promoCode ? (
              <div className="flex items-center justify-between bg-[#C8A96A]/10 border border-[#C8A96A]/30 p-2.5 rounded text-xs">
                <span className="text-[#111111] font-medium">
                  Applied promo: <strong>{promoCode}</strong>
                </span>
                <button
                  onClick={removePromoCode}
                  className="text-xs text-[#6B6B6B] hover:text-[#111111] underline uppercase tracking-wider"
                >
                  REMOVE
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. AEVY10)"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoError('');
                  }}
                  className="flex-1 bg-[#F8F7F3] border border-[#E6E3DC] px-3.5 py-2 text-xs rounded uppercase font-sans focus:outline-none focus:border-[#111111]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111111] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#222222]"
                >
                  Apply
                </button>
              </form>
            )}
            {promoError && <p className="text-[11px] text-red-600 mt-1">{promoError}</p>}
          </div>

          {/* Breakdown */}
          <div className="space-y-3 text-xs text-[#6B6B6B]">
            <div className="flex justify-between">
              <span className="uppercase tracking-wider">SUBTOTAL</span>
              <span className="text-[#111111] font-medium"><Taka />{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#C8A96A] font-medium">
                <span className="uppercase tracking-wider">DISCOUNT</span>
                <span>-<Taka />{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="uppercase tracking-wider">DELIVERY (ESTIMATED)</span>
              <span className="text-[#111111] font-medium">
                {deliveryFee === 0 ? 'FREE DELIVERY' : <><Taka />{deliveryFee}</>}
              </span>
            </div>

            {settings.free_delivery_threshold > 0 && subtotal < settings.free_delivery_threshold && (
              <div className="p-2.5 bg-[#FAF9F6] border border-[#E6E3DC] text-[11px] text-[#6B6B6B]">
                Free delivery on orders over <Taka />{settings.free_delivery_threshold.toLocaleString()}.
              </div>
            )}

            <div className="border-t border-[#E6E3DC] pt-3 flex justify-between text-base sm:text-lg font-semibold text-[#111111]">
              <span className="uppercase tracking-wider">TOTAL</span>
              <span className="font-serif text-xl sm:text-2xl text-[#111111]">
                <Taka />{total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            id="cart-page-checkout-btn"
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#222222] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>PROCEED TO CHECKOUT</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] uppercase tracking-wider text-[#6B6B6B]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>CASH ON DELIVERY</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>NATIONWIDE DELIVERY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
