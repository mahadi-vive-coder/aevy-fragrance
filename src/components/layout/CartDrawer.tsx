import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRouter } from '../../context/RouterContext';
import { Taka } from '../common/Taka';

export const CartDrawer: React.FC = () => {
  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    discount,
    promoCode,
    total,
    settings,
    isDrawerOpen,
    lastAddedItem,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const { navigate } = useRouter();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyPromoCode(promoInput);
    if (!ok) {
      setPromoError('Invalid code. Try "AEVY10"');
    } else {
      setPromoError('');
      setPromoInput('');
    }
  };

  const handleCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  const handleViewBag = () => {
    closeCartDrawer();
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    closeCartDrawer();
    navigate('/shop');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#111111]/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCartDrawer}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          aria-label="Shopping Bag"
          className="w-screen max-w-md bg-[#F8F7F3] border-l border-[#E6E3DC] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E6E3DC] flex items-center justify-between bg-white/50">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl text-[#111111] uppercase tracking-wide">YOUR BAG</span>
              <span className="text-xs font-sans text-[#6B6B6B] bg-[#E6E3DC]/60 px-2 py-0.5 rounded-full font-medium">
                {itemCount}
              </span>
            </div>
            <button
              onClick={closeCartDrawer}
              aria-label="Close"
              id="close-cart-drawer-btn"
              className="p-1.5 rounded-full text-[#6B6B6B] hover:text-[#111111] hover:bg-[#E6E3DC]/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick confirmation notification banner if an item was just added */}
          {lastAddedItem && (
            <div className="px-6 py-2.5 bg-[#C8A96A]/15 border-b border-[#C8A96A]/30 flex items-center justify-between text-xs text-[#111111]">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#111111]" />
                <span>
                  Added <strong>{lastAddedItem.productName}</strong> ({lastAddedItem.size})
                </span>
              </div>
              <span className="text-[11px] text-[#6B6B6B]">Updated</span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#E6E3DC]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-14 h-14 rounded-full bg-white border border-[#E6E3DC] flex items-center justify-center text-[#6B6B6B] mb-4">
                  <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-2xl text-[#111111] mb-2 tracking-tight">YOUR BAG IS EMPTY.</h3>
                <p className="text-sm text-[#6B6B6B] max-w-xs mb-6 font-sans">
                  Your next signature scent is waiting.
                </p>
                <button
                  onClick={handleContinueShopping}
                  id="empty-cart-explore-btn"
                  className="px-6 py-3 bg-[#111111] text-white text-xs font-sans uppercase tracking-[0.15em] font-medium hover:bg-[#222222] transition-colors"
                >
                  EXPLORE FRAGRANCES
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-start group">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=300&q=80'}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-16 h-20 sm:w-18 sm:h-22 object-cover rounded-xs bg-[#FAF9F6] border border-[#E6E3DC] shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif text-lg text-[#111111] leading-tight">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label="REMOVE"
                          title="REMOVE"
                          className="text-[#6B6B6B] hover:text-[#111111] p-1 transition-colors text-[10px] uppercase tracking-wider flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                          <span className="hidden sm:inline">REMOVE</span>
                        </button>
                      </div>
                      <p className="text-xs text-[#6B6B6B] font-sans mt-0.5">
                        {item.size} • Extrait de Parfum
                      </p>
                      {item.comboSelections && item.comboSelections.length > 0 && (
                        <div className="mt-1 text-[11px] text-[#6B6B6B] space-y-0.5">
                          {item.comboSelections.map((sel) => (
                            <p key={sel.slotId}>• {sel.slotTitle || sel.slotName}: {sel.productName} ({sel.variantSize || sel.size})</p>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity buttons */}
                      <div className="inline-flex items-center border border-[#E6E3DC] bg-white rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="px-2 py-1 text-xs text-[#111111] hover:bg-[#F8F7F3] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium font-sans min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.stock > 0 && item.quantity >= item.stock}
                          aria-label="Increase quantity"
                          className="px-2 py-1 text-xs text-[#111111] hover:bg-[#F8F7F3] disabled:opacity-30 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-semibold text-[#111111]">
                        <Taka />{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer calculation & checkout */}
          {items.length > 0 && (
            <div className="border-t border-[#E6E3DC] bg-white/70 p-6 space-y-4">
              {/* Promo code toggle */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between bg-[#C8A96A]/10 border border-[#C8A96A]/30 px-3 py-2 rounded text-xs">
                    <span className="text-[#111111] font-medium">
                      Code applied: <strong>{promoCode}</strong>
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-[#6B6B6B] hover:text-[#111111] underline text-[11px] uppercase tracking-wider"
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
                      className="flex-1 bg-[#F8F7F3] border border-[#E6E3DC] px-3 py-1.5 text-xs rounded uppercase font-sans placeholder:normal-case focus:outline-none focus:border-[#111111]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 border border-[#111111] text-xs uppercase tracking-wider font-medium hover:bg-[#111111] hover:text-white transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && <p className="text-[11px] text-red-600 mt-1">{promoError}</p>}
              </div>

              {/* Cost breakdown */}
              <div className="space-y-1.5 text-xs text-[#6B6B6B] font-sans">
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
                  <span className="uppercase tracking-wider">DELIVERY</span>
                  <span className="text-[#111111] font-medium">
                    {deliveryFee === 0 ? 'FREE DELIVERY' : <><Taka />{deliveryFee}</>}
                  </span>
                </div>
                {settings.free_delivery_threshold > 0 && subtotal < settings.free_delivery_threshold && (
                  <p className="text-[11px] text-[#6B6B6B]/80 pt-0.5">
                    Add <Taka />{(settings.free_delivery_threshold - subtotal).toLocaleString()} more for free delivery.
                  </p>
                )}
                <div className="pt-2 border-t border-[#E6E3DC] flex justify-between text-sm font-semibold text-[#111111]">
                  <span className="uppercase tracking-wider">TOTAL</span>
                  <span className="font-sans text-base"><Taka />{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  id="cart-drawer-checkout-btn"
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-[#111111] text-white text-xs font-sans uppercase tracking-[0.18em] font-medium hover:bg-[#222222] transition-colors flex items-center justify-center gap-2"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleViewBag}
                    id="cart-drawer-view-bag-btn"
                    className="flex-1 py-2.5 border border-[#E6E3DC] bg-white text-[#111111] text-xs uppercase tracking-wider font-medium hover:border-[#111111] transition-colors text-center"
                  >
                    YOUR BAG
                  </button>
                  <button
                    onClick={closeCartDrawer}
                    className="flex-1 py-2.5 text-[#6B6B6B] hover:text-[#111111] text-xs uppercase tracking-wider transition-colors text-center"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
