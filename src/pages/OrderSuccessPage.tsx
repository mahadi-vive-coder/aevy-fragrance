import React, { useEffect, useState } from 'react';
import { CheckCircle2, Truck, Phone, Clock, Sparkles, FileText, AlertCircle } from 'lucide-react';
import { Order } from '../types.ts';
import { trackOrder } from '../lib/api.ts';
import { useSettings } from '../context/SettingsContext.tsx';
import { Invoice } from '../components/common/Invoice.tsx';
import { resolveImageUrl } from '../lib/images.ts';

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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'invoice'>('summary');
  const { settings } = useSettings();

  useEffect(() => {
    let isMounted = true;

    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setLoadError(null);

      try {
        const data = await trackOrder(orderId);
        if (isMounted) {
          setOrder(data);
        }
      } catch (err: any) {
        console.warn('Notice loading order in OrderSuccessPage:', err);
        if (isMounted) {
          setLoadError(err?.message || 'Unable to retrieve full order particulars.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  // Clean customer-facing reference number (e.g. "001", "002", etc.)
  const displayOrderNumber = order?.orderNumber || (orderId && !orderId.includes('-') ? orderId : '001');
  const contactPhone = settings?.contactPhone || '01629927898';

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4 text-[#F5F1E8]">
        <div className="w-12 h-12 border-2 border-[#C8A96A] border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="font-serif text-2xl text-[#F5F1E8]">Retrieving Order Confirmation...</h2>
        <p className="text-xs text-[#D4CEBF]">Connecting with AEVY studio dispatch registry.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-[#F5F1E8]">
      
      {/* Success Hero Box */}
      <div className="bg-[#111111] border border-[#2A2A2A] p-6 sm:p-10 shadow-2xl text-center space-y-6 print:hidden">
        
        {/* Gold Check Circle */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#161616] border-2 border-[#C8A96A] text-[#C8A96A] flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#C8A96A]" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8A96A] font-semibold block">
            Order Confirmed & Logged
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F5F1E8]">Thank You for Your Patronage</h1>
          <p className="text-xs sm:text-sm text-[#D4CEBF] max-w-md mx-auto leading-relaxed">
            Your fragrance selection has been placed. Our artisanal team is preparing your parcel with utmost care in Narayanganj & Dhaka.
          </p>
        </div>

        {/* Prominent Order Reference Number Card */}
        <div className="bg-[#0B0B0B] border border-[#C8A96A]/40 p-5 max-w-md mx-auto space-y-1 shadow-inner">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#999999] font-semibold">
            ORDER REFERENCE NUMBER
          </p>
          <p className="font-serif text-3xl sm:text-4xl text-[#C8A96A] font-bold tracking-widest">
            {displayOrderNumber}
          </p>
          <p className="text-[11px] text-[#D4CEBF] pt-1 font-light">
            Please quote this reference number for courier handoff and concierge inquiries.
          </p>
        </div>

        {/* View Switcher Tabs (Summary vs Invoice) */}
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer border ${
              activeTab === 'summary'
                ? 'bg-[#F5F1E8] text-[#0B0B0B] border-[#F5F1E8]'
                : 'bg-transparent text-[#D4CEBF] border-[#2A2A2A] hover:text-[#C8A96A] hover:border-[#C8A96A]'
            }`}
          >
            Dispatch Summary
          </button>

          <button
            onClick={() => setActiveTab('invoice')}
            className={`px-5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'invoice'
                ? 'bg-[#C8A96A] text-[#0B0B0B] border-[#C8A96A]'
                : 'bg-transparent text-[#D4CEBF] border-[#2A2A2A] hover:text-[#C8A96A] hover:border-[#C8A96A]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Official Invoice</span>
          </button>
        </div>

        {/* Tab 1: Dispatch Summary */}
        {activeTab === 'summary' && order && (
          <div className="text-left bg-[#0B0B0B] border border-[#2A2A2A] p-6 space-y-4">
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C8A96A] border-b border-[#2A2A2A] pb-2">
              Dispatch Particulars
            </h2>

            <div className="space-y-3 divide-y divide-[#2A2A2A]">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => {
                  const qty = Number(item.quantity || 1);
                  const price = Number(item.unitPrice || 0);
                  return (
                    <div key={idx} className="flex justify-between items-center pt-2 first:pt-0 text-xs sm:text-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveImageUrl(item.image)}
                          alt={item.productName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-12 object-cover border border-[#2A2A2A]"
                        />
                        <div>
                          <p className="font-serif text-sm sm:text-base font-medium text-[#F5F1E8]">
                            {item.productName}
                          </p>
                          <p className="text-xs text-[#999999]">
                            Size: {item.size || '30ml'} • Qty: {qty}
                          </p>
                        </div>
                      </div>
                      <span className="font-serif font-medium text-sm sm:text-base text-[#C8A96A]">
                        ৳ {(price * qty).toLocaleString()}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-[#D4CEBF] py-2">Fragrance selection registered with order.</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#2A2A2A] text-xs sm:text-sm">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#999999] block font-medium">Recipient</span>
                <p className="font-medium text-[#FAFAF8] mt-0.5">{order.customerName}</p>
                <p className="text-[#D4CEBF] font-mono text-xs">{order.phone}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#999999] block font-medium">Delivery Address</span>
                <p className="text-[#FAFAF8] mt-0.5">{order.thana ? `${order.thana}, ` : ''}{order.district}</p>
                <p className="text-[#D4CEBF] text-xs">{order.fullAddress}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#2A2A2A]">
              <span className="text-xs uppercase tracking-wider text-[#D4CEBF]">Payment Method</span>
              <span className="text-xs font-semibold text-[#FAFAF8] bg-[#161616] px-3 py-1.5 border border-[#2A2A2A]">
                Cash on Delivery (৳ {Number(order.total || 0).toLocaleString()})
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Full Dynamic Invoice */}
        {activeTab === 'invoice' && (
          <div className="pt-2 text-left">
            {order ? (
              <Invoice order={order} settings={settings} />
            ) : (
              <div className="p-8 text-center bg-[#0B0B0B] border border-[#2A2A2A] text-xs text-[#D4CEBF]">
                <AlertCircle className="w-6 h-6 text-[#C8A96A] mx-auto mb-2" />
                <p>Invoice is preparing. Please refresh or contact concierge if not shown immediately.</p>
              </div>
            )}
          </div>
        )}

        {/* 3 Step Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs pt-4">
          <div className="p-4 bg-[#0B0B0B] border border-[#2A2A2A] space-y-1">
            <Clock className="w-4 h-4 text-[#C8A96A] mb-1" />
            <h3 className="font-semibold uppercase tracking-wider text-[11px] text-[#FAFAF8]">1. Studio Dispatch</h3>
            <p className="text-[#D4CEBF] leading-relaxed font-light">
              Orders are packaged in cushioned gift boxes within 24 hours of confirmation.
            </p>
          </div>

          <div className="p-4 bg-[#0B0B0B] border border-[#2A2A2A] space-y-1">
            <Truck className="w-4 h-4 text-[#C8A96A] mb-1" />
            <h3 className="font-semibold uppercase tracking-wider text-[11px] text-[#FAFAF8]">2. Doorstep Courier</h3>
            <p className="text-[#D4CEBF] leading-relaxed font-light">
              Our courier will call your phone prior to arrival at your designated address.
            </p>
          </div>

          <div className="p-4 bg-[#0B0B0B] border border-[#2A2A2A] space-y-1">
            <Sparkles className="w-4 h-4 text-[#C8A96A] mb-1" />
            <h3 className="font-semibold uppercase tracking-wider text-[11px] text-[#FAFAF8]">3. Unbox & Enjoy</h3>
            <p className="text-[#D4CEBF] leading-relaxed font-light">
              Inspect your flacon, pay the courier, and experience quiet luxury freshness.
            </p>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={onNavigateHome}
            className="px-8 py-3.5 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C8A96A] transition-all cursor-pointer shadow-xl"
          >
            Back to Home
          </button>

          <button
            onClick={() => setActiveTab('invoice')}
            className="px-6 py-3.5 bg-transparent border border-[#C8A96A] text-[#C8A96A] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C8A96A] hover:text-[#0B0B0B] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>View / Download Invoice</span>
          </button>
          
          <a
            href={`tel:${contactPhone.replace(/\s+/g, '')}`}
            className="px-6 py-3.5 bg-transparent border border-[#2A2A2A] text-[#FAFAF8] text-xs uppercase tracking-[0.2em] font-bold hover:border-[#C8A96A] hover:text-[#C8A96A] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-[#C8A96A]" />
            <span>Concierge: {contactPhone}</span>
          </a>
        </div>

      </div>

      {/* When printing, always show the complete printable invoice directly */}
      <div className="hidden print:block">
        {order && <Invoice order={order} settings={settings} showDownloadButton={false} />}
      </div>

    </div>
  );
};
