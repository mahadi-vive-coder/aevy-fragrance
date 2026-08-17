import React, { useEffect, useState } from 'react';
import { CheckCircle2, Package, Truck, ArrowRight, MessageSquare, Clock, MapPin, Sparkles } from 'lucide-react';
import { Order } from '../types.ts';
import { trackOrder } from '../lib/api.ts';
import { useSettings } from '../context/SettingsContext.tsx';

interface OrderSuccessPageProps {
  orderId: string;
  onNavigateHome: () => void;
  onNavigateShop: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  orderId,
  onNavigateHome,
  onNavigateShop
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await trackOrder(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const cleanPhone = settings.whatsappNumber ? settings.whatsappNumber.replace(/\D/g, '') : '8801712345678';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello AEVY Fragrance Concierge, I just placed order ${orderId} and would like to confirm dispatch.`
  )}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-[#F5F1E8]">
      <div className="bg-[#111111] border border-[#2A2A2A] p-6 sm:p-12 shadow-2xl text-center space-y-8">
        
        {/* Animated Check Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#161616] border-2 border-[#C8A96A] text-[#C8A96A] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#C8A96A]" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96A] font-semibold block">
            Order Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F5F1E8]">Thank You for Your Patronage</h1>
          <p className="text-xs sm:text-sm text-[#F5F1E8]/70 max-w-md mx-auto leading-relaxed">
            Your fragrance selection has been placed. Our artisanal team is preparing your parcel with utmost care.
          </p>
        </div>

        {/* Order Identifier Box */}
        <div className="bg-[#0B0B0B] border border-[#2A2A2A] p-4 max-w-md mx-auto space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-[#F5F1E8]/50">Order Reference Number</p>
          <p className="font-serif text-xl sm:text-2xl text-[#C8A96A] font-medium tracking-wider">{orderId}</p>
          <p className="text-[11px] text-[#F5F1E8]/60">
            A confirmation SMS & tracking details have been logged for your delivery.
          </p>
        </div>

        {/* Order Details Preview */}
        {order && (
          <div className="text-left bg-[#0B0B0B] border border-[#2A2A2A] p-6 space-y-4">
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C8A96A] border-b border-[#2A2A2A] pb-2">
              Dispatch Summary
            </h2>

            <div className="space-y-3 divide-y divide-[#2A2A2A]">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pt-2 first:pt-0 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-12 object-cover border border-[#2A2A2A]"
                    />
                    <div>
                      <p className="font-serif text-sm font-medium text-[#F5F1E8]">{item.productName}</p>
                      <p className="text-[#F5F1E8]/60">Size: {item.size} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-serif font-medium text-sm text-[#C8A96A]">
                    ৳ {(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#2A2A2A] text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#F5F1E8]/50 block">Recipient</span>
                <p className="font-medium text-[#F5F1E8]">{order.customerName}</p>
                <p className="text-[#F5F1E8]/70">{order.phone}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#F5F1E8]/50 block">Delivery Address</span>
                <p className="text-[#F5F1E8]">{order.thana}, {order.district}</p>
                <p className="text-[#F5F1E8]/70">{order.fullAddress}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#2A2A2A]">
              <span className="text-xs uppercase tracking-wider text-[#F5F1E8]/70">Payment Method</span>
              <span className="text-xs font-semibold text-[#F5F1E8] bg-[#161616] px-2.5 py-1 border border-[#2A2A2A]">
                Cash on Delivery (৳ {order.totalAmount.toLocaleString()})
              </span>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs pt-2">
          <div className="p-4 bg-[#0B0B0B] border border-[#2A2A2A] space-y-1">
            <Clock className="w-4 h-4 text-[#C8A96A] mb-1" />
            <h3 className="font-semibold uppercase tracking-wider text-[11px] text-[#F5F1E8]">1. Studio Dispatch</h3>
            <p className="text-[#F5F1E8]/60 leading-relaxed font-light">
              Orders are packaged in cushioned gift boxes within 24 hours of confirmation.
            </p>
          </div>

          <div className="p-4 bg-[#0B0B0B] border border-[#2A2A2A] space-y-1">
            <Truck className="w-4 h-4 text-[#C8A96A] mb-1" />
            <h3 className="font-semibold uppercase tracking-wider text-[11px] text-[#F5F1E8]">2. Doorstep Courier</h3>
            <p className="text-[#F5F1E8]/60 leading-relaxed font-light">
              Our courier will call your phone prior to arrival at your designated address.
            </p>
          </div>

          <div className="p-4 bg-[#0B0B0B] border border-[#2A2A2A] space-y-1">
            <Sparkles className="w-4 h-4 text-[#C8A96A] mb-1" />
            <h3 className="font-semibold uppercase tracking-wider text-[11px] text-[#F5F1E8]">3. Unbox & Enjoy</h3>
            <p className="text-[#F5F1E8]/60 leading-relaxed font-light">
              Inspect your flacon, pay the courier, and experience quiet luxury freshness.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={onNavigateHome}
            className="px-8 py-3.5 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C8A96A] transition-all cursor-pointer shadow-xl"
          >
            Back to Home
          </button>
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-transparent border border-[#2A2A2A] text-[#F5F1E8] text-xs uppercase tracking-[0.2em] font-bold hover:border-[#C8A96A] hover:text-[#C8A96A] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#C8A96A]" />
            <span>WhatsApp Concierge</span>
          </a>
        </div>

      </div>
    </div>
  );
};
