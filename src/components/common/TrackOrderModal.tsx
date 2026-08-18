import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Package, ShieldCheck, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../../types.ts';
import { trackOrder } from '../../lib/api.ts';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ isOpen, onClose, initialOrderId = '' }) => {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter your AEVY Order Number (e.g. 001)');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await trackOrder(orderId.trim(), phone.trim() || undefined);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Unable to locate order. Please check the reference number and try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const steps: OrderStatus[] = ['New', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    return steps.indexOf(status);
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0B0B0B] text-[#F5F1E8] border border-[#2A2A2A] shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#F5F1E8]/60 hover:text-[#C8A96A] transition-colors cursor-pointer"
          aria-label="Close track order modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C8A96A] font-semibold block mb-1">
            Real-time Status
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-[#F5F1E8]">Track Your Fragrance Order</h3>
          <p className="text-xs text-[#F5F1E8]/60 mt-1">
            Enter your Order ID from your confirmation SMS or receipt to check current dispatch & delivery status.
          </p>
        </div>

        <form onSubmit={handleTrack} className="space-y-3 mb-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/70 mb-1">
              Order ID <span className="text-[#C8A96A]">*</span>
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. AEVY-20260816-0001"
              className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#2A2A2A] text-sm text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/70 mb-1">
              Phone Number (Optional Verification)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 01712345678"
              className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#2A2A2A] text-sm text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C8A96A] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Tracking Order...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Track Order</span>
              </>
            )}
          </button>
        </form>

        {order && (
          <div className="border-t border-[#2A2A2A] pt-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#111111] p-4 border border-[#2A2A2A]">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#F5F1E8]/60">Order Number</p>
                <p className="font-serif text-lg font-medium text-[#C8A96A]">{order.orderNumber || order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-[#F5F1E8]/60">Status</p>
                <span
                  className={`inline-block px-2.5 py-0.5 text-xs uppercase tracking-wider font-semibold ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : order.status === 'Cancelled'
                      ? 'bg-rose-950 text-rose-300 border border-rose-700'
                      : 'bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/40'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Status Pipeline */}
            {order.status !== 'Cancelled' ? (
              <div className="py-2">
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#2A2A2A] w-full -z-0" />
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#C8A96A] transition-all duration-500 -z-0"
                    style={{ width: `${Math.max(0, (currentStepIdx / (steps.length - 1)) * 100)}%` }}
                  />

                  {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                            isCompleted
                              ? 'bg-[#C8A96A] text-[#0B0B0B] font-bold border-2 border-[#C8A96A]'
                              : 'bg-[#111111] text-[#F5F1E8]/40 border border-[#2A2A2A]'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-[#0B0B0B]" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] uppercase tracking-wider mt-1.5 font-medium ${
                            isCurrent ? 'text-[#C8A96A] font-semibold' : 'text-[#F5F1E8]/50'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs p-3">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>This order has been cancelled. Please contact our concierge for assistance.</span>
              </div>
            )}

            {/* Order Items */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-[#F5F1E8]/60">Items in this Delivery</p>
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-[#2A2A2A]">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-12 object-cover border border-[#2A2A2A]"
                    />
                    <div>
                      <p className="font-serif text-sm font-medium text-[#F5F1E8]">{item.productName}</p>
                      <p className="text-xs text-[#F5F1E8]/60">Size: {item.size} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-xs text-[#C8A96A]">
                    ৳{(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-[#111111] p-4 border border-[#2A2A2A]">
              <div>
                <span className="text-[#F5F1E8]/50 uppercase tracking-widest block text-[10px]">Recipient</span>
                <p className="font-medium text-[#F5F1E8]">{order.customerName}</p>
                <p className="text-[#F5F1E8]/70">{order.phone}</p>
              </div>
              <div>
                <span className="text-[#F5F1E8]/50 uppercase tracking-widest block text-[10px]">Destination</span>
                <p className="text-[#F5F1E8]">{order.thana}, {order.district}</p>
                <p className="text-[#F5F1E8]/70 truncate">{order.fullAddress}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
