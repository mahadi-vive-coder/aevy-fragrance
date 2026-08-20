import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, AlertCircle, ShoppingBag, Check } from 'lucide-react';
=======
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
>>>>>>> af95be52be9b46ae1ac7f36af859ae95e0d5ee08
import { useCart } from '../context/CartContext.tsx';
import { useSettings } from '../context/SettingsContext.tsx';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshLocations.ts';
import { createOrder } from '../lib/api.ts';

interface CheckoutPageProps {
  onNavigateSuccess: (orderId: string) => void;
  onNavigateCart: () => void;
  onNavigateShop: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigateSuccess,
  onNavigateCart,
  onNavigateShop
}) => {
<<<<<<< HEAD
  const {
    cart,
    subtotal,
    discount,
    couponCode,
    clearCart,
    applyPromoCode,
    removePromoCode,
    couponError,
    isApplyingCoupon
  } = useCart();
=======
  const { cart, subtotal, discount, couponCode, clearCart } = useCart();
>>>>>>> af95be52be9b46ae1ac7f36af859ae95e0d5ee08
  const { settings } = useSettings();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka');
  const [selectedThana, setSelectedThana] = useState('Gulshan');
  const [customThana, setCustomThana] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [note, setNote] = useState('');
<<<<<<< HEAD
  const [promoInput, setPromoInput] = useState('');
=======
>>>>>>> af95be52be9b46ae1ac7f36af859ae95e0d5ee08

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

<<<<<<< HEAD
  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = await applyPromoCode(promoInput.trim());
    if (ok) setPromoInput('');
  };

=======
>>>>>>> af95be52be9b46ae1ac7f36af859ae95e0d5ee08
  // Available thanas for current district
  const districtObj = BANGLADESH_DISTRICTS.find((d) => d.name === selectedDistrict);
  const availableThanas = districtObj ? districtObj.thanas : [];

  // Update thana when district changes
  useEffect(() => {
    if (availableThanas.length > 0) {
      setSelectedThana(availableThanas[0]);
    } else {
      setSelectedThana('Other');
    }
  }, [selectedDistrict]);

  const isDhaka = selectedDistrict.toLowerCase().includes('dhaka');
  const baseDelivery = isDhaka ? settings.deliveryInsideDhaka : settings.deliveryOutsideDhaka;
  const isFreeDelivery = settings.freeDeliveryThreshold > 0 && subtotal >= settings.freeDeliveryThreshold;
  const deliveryCharge = isFreeDelivery ? 0 : baseDelivery;
  const grandTotal = Math.max(0, subtotal + deliveryCharge - discount);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 text-[#F5F1E8]">
        <h2 className="font-serif text-2xl text-[#F5F1E8]">Your shopping bag is empty.</h2>
        <p className="text-xs text-[#F5F1E8]/60">Please add a fragrance before proceeding to checkout.</p>
        <button
          onClick={onNavigateShop}
          className="px-6 py-3 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-wider font-bold hover:bg-[#C8A96A] cursor-pointer"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate phone number
    const cleanPhone = phone.trim();
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 11-digit Bangladesh mobile number (e.g. 017XXXXXXXX).');
      return;
    }

    if (!customerName.trim() || !fullAddress.trim()) {
      setErrorMessage('Please fill in your full name and complete street address.');
      return;
    }

    const finalThana = selectedThana === 'Other' && customThana.trim() ? customThana.trim() : selectedThana;

    setIsSubmitting(true);
    try {
      const order = await createOrder({
        customerName: customerName.trim(),
        phone: cleanPhone,
        email: email.trim() || undefined,
        district: selectedDistrict,
        thana: finalThana,
        fullAddress: fullAddress.trim(),
        note: note.trim() || undefined,
        couponCode: couponCode || undefined,
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          slug: item.slug,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          image: item.image
        }))
      });

      clearCart();
      onNavigateSuccess(order.orderNumber || order.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-[#F5F1E8]">
      
      {/* Back to cart link */}
      <button
        onClick={onNavigateCart}
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#F5F1E8]/60 hover:text-[#C8A96A] transition-colors mb-8 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Shopping Bag</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left: Checkout Form */}
        <div className="lg:col-span-7 bg-[#111111] border border-[#2A2A2A] p-6 sm:p-10 shadow-2xl">
          
          <div className="mb-8 pb-4 border-b border-[#2A2A2A]">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96A] font-semibold block mb-1">
              Guest Checkout
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8]">Delivery & Contact Information</h1>
            <p className="text-xs text-[#F5F1E8]/60 mt-1">
              No account required. Your fragrance parcel will be dispatched directly to your doorstep.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Customer Information */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C8A96A]">
                1. Customer Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/70 mb-1">
                    Full Name <span className="text-[#C8A96A]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tanvir Hossain"
                    className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-xs text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/70 mb-1">
                    Mobile Number <span className="text-[#C8A96A]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-xs text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/70 mb-1">
                  Email Address <span className="text-[10px] text-[#F5F1E8]/40 lowercase">(optional for e-receipt)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. tanvir@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-xs text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="space-y-4 pt-4 border-t border-[#2A2A2A]">
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C8A96A]">
                2. Delivery Address (Bangladesh)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* District */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/70 mb-1">
                    District <span className="text-[#C8A96A]">*</span>
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-xs text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none cursor-pointer"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name} className="bg-[#0B0B0B] text-[#F5F1E8]">
                        {d.name} {d.isDhaka ? '(Inside Dhaka)' : '(Outside Dhaka)'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Thana */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/70 mb-1">
                    Thana / Upazila <span className="text-[#C8A96A]">*</span>
                  </label>
                  {availableThanas.length > 0 ? (
                    <select
                      value={selectedThana}
                      onChange={(e) => setSelectedThana(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-xs text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none cursor-pointer"
                    >
                      {availableThanas.map((t) => (
                        <option key={t} value={t} className="bg-[#0B0B0B] text-[#F5F1E8]">
                          {t}
                        </option>
                      ))}
                      <option value="Other" className="bg-[#0B0B0B] text-[#F5F1E8]">Other / Custom Area</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={customThana}
                      onChange={(e) => setCustomThana(e.target.value)}
                      placeholder="Enter Thana / Upazila"
                      className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-xs text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none"
                    />
                  )}
                </div>
              </div>

              {selectedThana === 'Other' && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/70 mb-1">
                    Specific Thana / Area Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customThana}
                    onChange={(e) => setCustomThana(e.target.value)}
                    placeholder="Specify your area/thana"
                    className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-xs text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
              )}

              {/* Full Street Address */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/70 mb-1">
                  Full Street Address <span className="text-[#C8A96A]">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="House number, Road number, Sector/Block, Apartment name or nearby landmark"
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-xs text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none resize-none"
                />
              </div>

              {/* Delivery Note */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/70 mb-1">
                  Special Delivery Instructions <span className="text-[10px] text-[#F5F1E8]/40 lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Call before delivery, deliver after 3 PM"
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-xs text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none"
                />
              </div>
            </div>

            {/* 3. Delivery Method */}
            <div className="space-y-3 pt-4 border-t border-[#2A2A2A]">
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C8A96A]">
                3. Payment & Delivery Method
              </h2>

              <div className="p-4 bg-[#161616] border border-[#C8A96A]/60 flex items-start gap-3">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  checked
                  readOnly
                  className="mt-1 accent-[#C8A96A]"
                />
                <div>
                  <label htmlFor="cod" className="text-xs font-semibold uppercase tracking-wider text-[#F5F1E8] block">
                    Cash on Delivery (COD)
                  </label>
                  <p className="text-xs text-[#F5F1E8]/70 mt-0.5 leading-relaxed font-light">
                    Pay securely in cash when the delivery courier delivers your parcel. You may inspect the sealed package before handing over payment.
                  </p>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Place Order Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#C8A96A] transition-all disabled:opacity-50 shadow-2xl flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>CONFIRMING ORDER...</span>
                ) : (
                  <span>PLACE ORDER (৳ {grandTotal.toLocaleString()})</span>
                )}
              </button>
              <p className="text-[10px] text-center text-[#F5F1E8]/50 tracking-wider mt-2.5">
                By placing your order, you agree to AEVY's Terms of Service and Return Policy.
              </p>
            </div>

          </form>
        </div>

        {/* Right: Order Summary Sticky Card */}
        <div className="lg:col-span-5 bg-[#111111] border border-[#2A2A2A] p-6 sm:p-8 space-y-6 lg:sticky lg:top-28 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
            <h2 className="font-serif text-xl text-[#F5F1E8] uppercase tracking-wide">Order Summary</h2>
            <span className="text-xs text-[#F5F1E8]/60">{cart.reduce((s, i) => s + i.quantity, 0)} Items</span>
          </div>

          {/* Items */}
          <div className="space-y-3 divide-y divide-[#2A2A2A] max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-3 pt-3 first:pt-0">
                <img
                  src={item.image}
                  alt={item.productName}
                  referrerPolicy="no-referrer"
                  className="w-14 h-16 object-cover border border-[#2A2A2A] shrink-0"
                />
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-sm font-medium text-[#F5F1E8]">{item.productName}</h3>
                    <p className="text-xs text-[#C8A96A]">Flacon: {item.size} • Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-serif font-semibold text-[#F5F1E8]">
                    ৳ {(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Destination Notice */}
          <div className="p-3 bg-[#0B0B0B] border border-[#2A2A2A] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-[#F5F1E8]/60">Destination:</span>
              <span className="font-medium text-[#F5F1E8]">{selectedDistrict} ({isDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#F5F1E8]/60">Estimated Delivery:</span>
              <span className="text-[#C8A96A]">{isDhaka ? '24 – 48 Hours' : '2 – 4 Days'}</span>
            </div>
          </div>

<<<<<<< HEAD
          {/* Promo Code Input */}
          <div className="space-y-1.5">
            {couponCode ? (
              <div className="flex items-center justify-between bg-[#161616] px-3 py-2 border border-[#C8A96A]/40 text-xs">
                <div className="flex items-center gap-1.5 text-[#C8A96A] font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Coupon: {couponCode} (-৳ {discount.toLocaleString()})</span>
                </div>
                <button
                  type="button"
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
                  placeholder="Promo Coupon Code"
                  className="flex-1 px-3 py-2 text-xs bg-[#0B0B0B] border border-[#2A2A2A] text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none uppercase"
                />
                <button
                  type="submit"
                  disabled={isApplyingCoupon || !promoInput.trim()}
                  className="px-4 py-2 bg-[#2A2A2A] text-[#F5F1E8] text-xs uppercase tracking-wider font-medium hover:bg-[#C8A96A] hover:text-[#0B0B0B] transition-all disabled:opacity-50 cursor-pointer"
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

=======
>>>>>>> af95be52be9b46ae1ac7f36af859ae95e0d5ee08
          {/* Breakdown */}
          <div className="space-y-2 text-xs text-[#F5F1E8]/80 border-t border-[#2A2A2A] pt-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-[#F5F1E8]">৳ {subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#C8A96A]">
                <span>Promotional Discount ({couponCode})</span>
                <span>-৳ {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>{deliveryCharge === 0 ? 'FREE' : `৳ ${deliveryCharge}`}</span>
            </div>
            <div className="flex justify-between text-xl font-serif font-light text-[#F5F1E8] pt-3 border-t border-[#2A2A2A]">
              <span>Total Payable</span>
              <span className="text-[#C8A96A]">৳ {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 text-center text-[10px] text-[#F5F1E8]/60 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>Guaranteed Authentic & Small-Batch Freshness</span>
          </div>

        </div>

      </div>

    </div>
  );
};
