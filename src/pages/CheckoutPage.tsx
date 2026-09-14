import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useRouter } from '../context/RouterContext';
import { Taka } from '../components/common/Taka';
import { ShieldCheck, Truck, ArrowRight, Lock, AlertCircle } from 'lucide-react';

const BANGLADESH_DISTRICTS = [
  'Narayanganj',
  'Dhaka',
  'Chattogram',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Rangpur',
  'Mymensingh',
  'Cumilla',
  'Gazipur',
  'Bagerhat',
  'Bandarban',
  'Barguna',
  'Bhola',
  'Bogra',
  'Brahmanbaria',
  'Chandpur',
  'Chapainawabganj',
  'Chuadanga',
  'Cox\'s Bazar',
  'Dinajpur',
  'Faridpur',
  'Feni',
  'Gaibandha',
  'Gopalganj',
  'Habiganj',
  'Jamalpur',
  'Jashore',
  'Jhalokati',
  'Jhenaidah',
  'Joypurhat',
  'Khagrachhari',
  'Kishoreganj',
  'Kurigram',
  'Kushtia',
  'Lakshmipur',
  'Lalmonirhat',
  'Madaripur',
  'Magura',
  'Manikganj',
  'Meherpur',
  'Moulvibazar',
  'Munshiganj',
  'Naogaon',
  'Narail',
  'Narsingdi',
  'Natore',
  'Netrokona',
  'Nilphamari',
  'Noakhali',
  'Pabna',
  'Panchagarh',
  'Patuakhali',
  'Pirojpur',
  'Rajbari',
  'Satkhira',
  'Shariatpur',
  'Sherpur',
  'Sirajganj',
  'Sunamganj',
  'Tangail',
  'Thakurgaon',
];

export const CheckoutPage: React.FC = () => {
  const {
    items,
    subtotal,
    deliveryFee,
    discount,
    promoCode,
    total,
    settings,
    selectedDistrict,
    setSelectedDistrict,
    clearCart,
  } = useCart();

  const { placeOrder } = useOrder();
  const { navigate } = useRouter();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [thana, setThana] = useState('');
  const [notes, setNotes] = useState('');
  const paymentMethod = 'COD';

  // Inline errors & submission states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, show empty notice
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center font-sans">
        <div className="bg-white border border-[#E6E3DC] p-10 rounded-sm space-y-4">
          <h2 className="font-serif text-3xl text-[#111111] tracking-tight">YOUR BAG IS EMPTY.</h2>
          <p className="text-xs text-[#6B6B6B]">Your next signature scent is waiting.</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-[#111111] text-white text-xs uppercase tracking-wider font-medium"
          >
            EXPLORE FRAGRANCES
          </button>
        </div>
      </div>
    );
  }

  // Check maintenance / store order acceptance
  if (settings.maintenance_mode || !settings.accept_orders) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center font-sans">
        <div className="bg-white border border-[#E6E3DC] p-10 rounded-sm space-y-4">
          <AlertCircle className="w-8 h-8 text-[#C8A96A] mx-auto" />
          <h2 className="font-serif text-3xl text-[#111111] tracking-tight">ORDERS CURRENTLY PAUSED</h2>
          <p className="text-xs text-[#6B6B6B]">
            Our boutique is currently not accepting new orders online. Please check back shortly or explore our fragrance collection.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-[#111111] text-white text-xs uppercase tracking-wider font-medium"
          >
            BROWSE CATALOG
          </button>
        </div>
      </div>
    );
  }

  const validate = () => {
    const err: Record<string, string> = {};
    if (!fullName.trim()) err.fullName = 'Please enter your full name.';
    if (!phone.trim()) {
      err.phone = 'Please enter your contact phone number.';
    } else if (!/^01[3-9]\d{8}$/.test(phone.trim().replace(/[- ]/g, ''))) {
      err.phone = 'Please enter a valid 11-digit Bangladeshi phone number (e.g. 01712345678).';
    }
    if (!address.trim()) err.address = 'Please enter your street / house address.';
    if (!thana.trim()) err.thana = 'Please enter your Thana / Upazila.';
    if (!selectedDistrict.trim()) err.district = 'Please select your District.';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const cleanPhone = phone.trim().replace(/[- ]/g, '');
      const orderPayload = {
        customerName: fullName.trim(),
        customerPhone: cleanPhone,
        customerEmail: email.trim() || undefined,
        district: selectedDistrict.trim(),
        thanaUpazila: thana.trim(),
        fullAddress: address.trim(),
        paymentMethod,
        customerNote: notes.trim() || undefined,
        couponCode: promoCode || undefined,
        items,
      };

      const result = await placeOrder(orderPayload);
      if (result.success) {
        clearCart();
        navigate('/order-success');
      } else {
        setSubmitError(result.error || 'Failed to place order. Please verify stock availability and try again.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error('Order creation exception:', err);
      setSubmitError(err?.message || 'An unexpected error occurred while placing your order.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 font-sans">
      <div className="border-b border-[#E6E3DC] pb-4">
        <span className="text-[11px] font-sans tracking-[0.24em] text-[#C8A96A] uppercase font-semibold">
          AEVY
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1 tracking-tight">CHECKOUT</h1>
        <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1 font-light">
          Complete your order with a few details.
        </p>
      </div>

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-sm flex items-start gap-3 text-xs text-red-700">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold uppercase tracking-wider">Order could not be placed</p>
            <p className="mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form Details on Left (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Contact Details */}
          <div className="bg-white border border-[#E6E3DC] p-6 sm:p-8 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E3DC] pb-3">
              <h2 className="font-serif text-2xl text-[#111111] uppercase tracking-wide">CONTACT DETAILS</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  id="checkout-name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  placeholder="e.g. Ayman Sadiq"
                  required
                  className={`w-full bg-[#FAF9F6] border px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111] ${
                    errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-[#E6E3DC]'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-red-600">{errors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  PHONE NUMBER *
                </label>
                <input
                  type="tel"
                  id="checkout-phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  placeholder="01XXXXXXXXX"
                  required
                  className={`w-full bg-[#FAF9F6] border px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111] ${
                    errors.phone ? 'border-red-500 bg-red-50/20' : 'border-[#E6E3DC]'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-red-600">{errors.phone}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  EMAIL ADDRESS <span className="text-[#6B6B6B] font-normal">(OPTIONAL)</span>
                </label>
                <input
                  type="email"
                  id="checkout-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full bg-[#FAF9F6] border border-[#E6E3DC] px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          </div>

          {/* 2. Delivery Address */}
          <div className="bg-white border border-[#E6E3DC] p-6 sm:p-8 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E3DC] pb-3">
              <h2 className="font-serif text-2xl text-[#111111] uppercase tracking-wide">DELIVERY ADDRESS</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  DISTRICT *
                </label>
                <select
                  id="checkout-district"
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    if (errors.district) setErrors((prev) => ({ ...prev, district: '' }));
                  }}
                  className="w-full bg-[#FAF9F6] border border-[#E6E3DC] px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d} {d.toLowerCase() === 'narayanganj' ? '(Inside Narayanganj — ৳' + settings.delivery_charge_inside_narayanganj + ')' : '(Outside Narayanganj — ৳' + settings.delivery_charge_outside_narayanganj + ')'}
                    </option>
                  ))}
                </select>
                {errors.district && <p className="text-[11px] text-red-600">{errors.district}</p>}
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  FULL ADDRESS *
                </label>
                <input
                  type="text"
                  id="checkout-address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                  }}
                  placeholder="House, road, flat or village details"
                  required
                  className={`w-full bg-[#FAF9F6] border px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111] ${
                    errors.address ? 'border-red-500 bg-red-50/20' : 'border-[#E6E3DC]'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-red-600">{errors.address}</p>}
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  THANA / UPAZILA *
                </label>
                <input
                  type="text"
                  id="checkout-thana"
                  value={thana}
                  onChange={(e) => {
                    setThana(e.target.value);
                    if (errors.thana) setErrors((prev) => ({ ...prev, thana: '' }));
                  }}
                  placeholder="e.g. Narayanganj Sadar / Dhanmondi"
                  required
                  className={`w-full bg-[#FAF9F6] border px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111] ${
                    errors.thana ? 'border-red-500 bg-red-50/20' : 'border-[#E6E3DC]'
                  }`}
                />
                {errors.thana && <p className="text-[11px] text-red-600">{errors.thana}</p>}
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  DELIVERY INSTRUCTIONS <span className="text-[#6B6B6B] font-normal">(OPTIONAL)</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions for the delivery team."
                  className="w-full bg-[#FAF9F6] border border-[#E6E3DC] px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          </div>

          {/* 3. Delivery Method */}
          <div className="bg-white border border-[#E6E3DC] p-6 sm:p-8 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E3DC] pb-3">
              <h2 className="font-serif text-2xl text-[#111111] uppercase tracking-wide">DELIVERY</h2>
            </div>

            <div className="p-4 border border-[#111111] bg-[#FAF9F6] rounded-xs flex items-center justify-between">
              <div>
                <span className="font-serif text-lg text-[#111111] block">
                  STANDARD COURIER DELIVERY
                </span>
                <p className="text-xs text-[#6B6B6B] mt-0.5">
                  {selectedDistrict.toLowerCase() === 'narayanganj'
                    ? 'Delivering within Narayanganj'
                    : `Delivering to ${selectedDistrict}`}
                  {' • '}{deliveryFee === 0 ? 'Free Delivery Applied' : 'Doorstep Courier'}
                </p>
              </div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#111111]">
                {deliveryFee === 0 ? 'FREE DELIVERY' : <><Taka />{deliveryFee}</>}
              </span>
            </div>
          </div>

          {/* 4. Payment */}
          <div className="bg-white border border-[#E6E3DC] p-6 sm:p-8 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E3DC] pb-3">
              <h2 className="font-serif text-2xl text-[#111111] uppercase tracking-wide">PAYMENT METHOD</h2>
              <span className="text-xs uppercase tracking-wider text-[#6B6B6B] flex items-center gap-1.5 font-medium">
                <Lock className="w-3 h-3 text-[#C8A96A]" /> SECURE CHECKOUT
              </span>
            </div>

            <div className="p-4 border border-[#111111] bg-[#FAF9F6] rounded-xs">
              <span className="font-serif text-lg text-[#111111] block uppercase tracking-wide">
                CASH ON DELIVERY (COD)
              </span>
              <p className="text-xs text-[#6B6B6B] mt-1">
                Pay in cash when your fragrance order is delivered to your doorstep. No advance payment required.
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary & Place Order on Right (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E6E3DC] p-6 sm:p-8 rounded-sm space-y-6 sticky top-24">
          <h2 className="font-serif text-2xl text-[#111111] pb-3 border-b border-[#E6E3DC] uppercase tracking-wide">
            ORDER SUMMARY
          </h2>

          {/* Items Preview */}
          <div className="space-y-4 max-h-72 overflow-y-auto divide-y divide-[#E6E3DC]/60 pr-1">
            {items.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=300&q=80'}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-14 object-cover rounded bg-[#FAF9F6] border border-[#E6E3DC] shrink-0"
                  />
                  <div>
                    <h4 className="font-serif text-base text-[#111111] leading-tight">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-[#6B6B6B]">
                      {item.size} × {item.quantity}
                    </p>
                    {item.comboSelections && item.comboSelections.length > 0 && (
                      <div className="text-[10px] text-[#6B6B6B] mt-0.5 space-y-0.5">
                        {item.comboSelections.map((c) => (
                          <p key={c.slotId}>• {c.productName} ({c.variantSize || c.size})</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#111111]">
                  <Taka />{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Calculation */}
          <div className="space-y-2.5 text-xs text-[#6B6B6B] border-t border-[#E6E3DC] pt-4">
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
              <span className="uppercase tracking-wider">DELIVERY ({selectedDistrict})</span>
              <span className="text-[#111111] font-medium">
                {deliveryFee === 0 ? 'FREE DELIVERY' : <><Taka />{deliveryFee}</>}
              </span>
            </div>
            <div className="border-t border-[#E6E3DC] pt-3 flex justify-between text-base font-semibold text-[#111111]">
              <span className="uppercase tracking-wider">TOTAL</span>
              <span className="font-serif text-2xl text-[#111111]"><Taka />{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            id="place-order-submit-btn"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#222222] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <span>PLACING ORDER...</span>
            ) : (
              <>
                <span>PLACE ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Reassurance */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-[10px] uppercase tracking-wider text-[#6B6B6B]">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>CASH ON DELIVERY</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>NATIONWIDE DELIVERY</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>SECURE CHECKOUT</span>
            </div>
          </div>

          <p className="text-[11px] text-[#6B6B6B] text-center leading-relaxed">
            By placing your order, you agree to AEVY&apos;s Terms of Service and delivery policy.
          </p>
        </div>
      </form>
    </div>
  );
};
