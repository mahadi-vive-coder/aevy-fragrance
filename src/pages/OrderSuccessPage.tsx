import React from 'react';
import { useOrder } from '../context/OrderContext';
import { useRouter } from '../context/RouterContext';
import { Taka } from '../components/common/Taka';
import { Check, PackageCheck, ShoppingBag, ArrowRight } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { lastCreatedOrder } = useOrder();
  const { navigate } = useRouter();

  if (!lastCreatedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center font-sans">
        <div className="bg-white border border-[#E6E3DC] p-8 sm:p-12 rounded-sm space-y-4">
          <h2 className="font-serif text-3xl text-[#111111]">TRACK YOUR ORDER</h2>
          <p className="text-sm text-[#6B6B6B] max-w-md mx-auto">
            If you recently placed an order, you can view its live fulfillment status using your order number and phone number.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => navigate('/track-order')}
              className="px-6 py-3 bg-[#111111] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#222222] transition-colors"
            >
              Go to Order Tracking
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 border border-[#E6E3DC] text-[#111111] text-xs uppercase tracking-widest font-medium hover:border-[#111111] transition-colors"
            >
              Browse Fragrances
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center font-sans">
      <div className="bg-white border border-[#E6E3DC] p-8 sm:p-14 rounded-sm space-y-6 shadow-xs">
        {/* Checkmark Icon */}
        <div className="w-16 h-16 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto shadow-md">
          <Check className="w-8 h-8 stroke-[2]" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-[11px] font-sans tracking-[0.24em] text-[#C8A96A] uppercase font-semibold">
            AEVY
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#111111] tracking-tight">
            ORDER CONFIRMED.
          </h1>
          <p className="text-sm sm:text-base text-[#222222] font-sans font-light leading-relaxed">
            Thank you for choosing AEVY.
            <br />
            Your order has been placed successfully in our boutique system.
          </p>
          <div className="pt-2">
            <span className="text-xs uppercase tracking-wider text-[#6B6B6B] font-medium mr-2">
              ORDER NUMBER
            </span>
            <span className="text-sm font-mono text-[#111111] font-semibold bg-[#FAF9F6] px-3 py-1 border border-[#E6E3DC] rounded-xs inline-block">
              {lastCreatedOrder.orderNumber}
            </span>
          </div>
        </div>

        <div className="w-12 h-[1px] bg-[#E6E3DC] mx-auto" />

        <p className="text-xs sm:text-sm text-[#6B6B6B] font-light max-w-md mx-auto leading-relaxed">
          Your order has been received with status <strong className="text-[#111111]">New</strong>. Our team will verify and dispatch your bespoke bottle promptly.
        </p>

        {/* Summary card */}
        <div className="bg-[#FAF9F6] border border-[#E6E3DC] p-5 text-xs text-left max-w-md mx-auto space-y-2.5 rounded-sm">
          <div className="flex justify-between text-[#111111] font-medium border-b border-[#E6E3DC] pb-2">
            <span className="uppercase tracking-wider text-[11px] text-[#6B6B6B]">DELIVERING TO</span>
            <span className="font-semibold text-[#111111]">{lastCreatedOrder.customerName}</span>
          </div>
          <div className="flex justify-between text-[#6B6B6B]">
            <span className="uppercase tracking-wider text-[11px]">PHONE</span>
            <span className="text-[#222222] font-mono">{lastCreatedOrder.phone}</span>
          </div>
          <div className="flex justify-between text-[#6B6B6B]">
            <span className="uppercase tracking-wider text-[11px]">DELIVERY ADDRESS</span>
            <span className="text-right text-[#222222] max-w-[220px]">
              {lastCreatedOrder.fullAddress}
            </span>
          </div>
          <div className="flex justify-between text-[#6B6B6B]">
            <span className="uppercase tracking-wider text-[11px]">PAYMENT METHOD</span>
            <span className="uppercase text-[#222222]">
              {lastCreatedOrder.paymentMethod === 'cod' ? 'CASH ON DELIVERY' : lastCreatedOrder.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between text-[#111111] font-medium pt-2 border-t border-[#E6E3DC]">
            <span className="uppercase tracking-wider text-[11px]">TOTAL</span>
            <span className="font-semibold text-sm text-[#111111]">
              <Taka />{lastCreatedOrder.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/track-order')}
            id="order-success-track-btn"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#111111] text-white text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#222222] transition-colors flex items-center justify-center gap-2"
          >
            <PackageCheck className="w-4 h-4" />
            <span>TRACK THIS ORDER</span>
          </button>

          <button
            onClick={() => navigate('/shop')}
            id="order-success-continue-btn"
            className="w-full sm:w-auto px-8 py-3.5 border border-[#E6E3DC] bg-white text-[#111111] text-xs uppercase tracking-[0.18em] font-medium hover:border-[#111111] transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>CONTINUE SHOPPING</span>
          </button>
        </div>
      </div>
    </div>
  );
};
