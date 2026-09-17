import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { useRouter } from '../context/RouterContext';
import { DBOrder, OrderStatus } from '../types';
import { Taka } from '../components/common/Taka';
import { Search, Check, AlertCircle, Loader2 } from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { lookupOrder, lastCreatedOrder } = useOrder();
  const { navigate } = useRouter();

  const [orderNumber, setOrderNumber] = useState(lastCreatedOrder?.orderNumber || '');
  const [phone, setPhone] = useState(lastCreatedOrder?.phone || '');
  const [searchedOrder, setSearchedOrder] = useState<DBOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<'not_found' | 'error' | ''>('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setHasSearched(true);

    if (!orderNumber.trim() || !phone.trim()) {
      setSearchError('not_found');
      setSearchedOrder(null);
      return;
    }

    setIsLoading(true);
    try {
      const found = await lookupOrder(orderNumber.trim(), phone.trim());
      if (!found) {
        setSearchError('not_found');
        setSearchedOrder(null);
      } else {
        setSearchedOrder(found);
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setSearchError('error');
      setSearchedOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatStatusLabel = (status: OrderStatus | string): string => {
    switch (status) {
      case 'New':
        return 'NEW ORDER';
      case 'Confirmed':
        return 'CONFIRMED';
      case 'Processing':
        return 'PROCESSING';
      case 'Shipped':
        return 'SHIPPED';
      case 'Delivered':
        return 'DELIVERED';
      case 'Cancelled':
        return 'CANCELLED';
      default:
        return String(status).toUpperCase();
    }
  };

  const statusSteps: { key: OrderStatus; label: string }[] = [
    { key: 'New', label: 'ORDER PLACED' },
    { key: 'Confirmed', label: 'CONFIRMED' },
    { key: 'Processing', label: 'PROCESSING' },
    { key: 'Shipped', label: 'SHIPPED' },
    { key: 'Delivered', label: 'DELIVERED' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'New':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIndex = searchedOrder ? getStepIndex(searchedOrder.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 font-sans">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[11px] font-sans tracking-[0.24em] text-[#C8A96A] uppercase font-semibold">
          ORDER TRACKING
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#111111] tracking-tight">
          FOLLOW YOUR ORDER.
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6B6B] font-light">
          Enter your order number and billing phone number to check live boutique status.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white border border-[#E6E3DC] p-6 sm:p-8 rounded-sm shadow-xs max-w-2xl mx-auto">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                ORDER NUMBER
              </label>
              <input
                type="text"
                id="track-order-number-input"
                placeholder="e.g. AEVY-12345"
                value={orderNumber}
                onChange={(e) => {
                  setOrderNumber(e.target.value);
                  if (searchError) setSearchError('');
                }}
                required
                className="w-full bg-[#FAF9F6] border border-[#E6E3DC] px-3.5 py-2.5 text-xs uppercase font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                PHONE NUMBER
              </label>
              <input
                type="tel"
                id="track-phone-input"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (searchError) setSearchError('');
                }}
                required
                className="w-full bg-[#FAF9F6] border border-[#E6E3DC] px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            id="track-submit-btn"
            className="w-full py-3.5 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#222222] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{isLoading ? 'SEARCHING...' : 'TRACK ORDER'}</span>
          </button>
        </form>
      </div>

      {/* Empty / Error States */}
      {searchError === 'not_found' && hasSearched && (
        <div className="bg-white border border-[#E6E3DC] p-8 sm:p-12 text-center rounded-sm space-y-4 max-w-xl mx-auto shadow-xs animate-in fade-in">
          <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#E6E3DC] flex items-center justify-center mx-auto text-[#6B6B6B]">
            <AlertCircle className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#111111] tracking-tight uppercase">
            ORDER NOT FOUND.
          </h3>
          <p className="text-xs sm:text-sm text-[#6B6B6B] font-light leading-relaxed">
            We couldn&apos;t find an order matching that order number and phone combination.
            <br />
            Please verify the details on your receipt and try again.
          </p>
        </div>
      )}

      {searchError === 'error' && (
        <div className="bg-white border border-[#E6E3DC] p-8 sm:p-12 text-center rounded-sm space-y-4 max-w-xl mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#E6E3DC] flex items-center justify-center mx-auto text-[#6B6B6B]">
            <AlertCircle className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#111111] tracking-tight uppercase">
            UNABLE TO RETRIEVE ORDER.
          </h3>
          <p className="text-xs sm:text-sm text-[#6B6B6B] font-light leading-relaxed">
            We encountered a problem querying the database. Please try again shortly.
          </p>
        </div>
      )}

      {/* Tracking Result View */}
      {searchedOrder && !searchError && (
        <div className="bg-white border border-[#E6E3DC] p-6 sm:p-10 rounded-sm space-y-8 animate-in fade-in duration-300">
          {/* Delivered Banner State */}
          {searchedOrder.status === 'Delivered' && (
            <div className="p-6 sm:p-8 bg-[#FAF9F6] border border-[#E6E3DC] text-center space-y-3 rounded-sm">
              <div className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#111111] tracking-tight uppercase">
                ORDER DELIVERED.
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] font-light">
                Your AEVY package has reached its destination. Thank you for your trust.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="px-8 py-3.5 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#222222] transition-colors inline-block"
                >
                  SHOP AGAIN
                </button>
              </div>
            </div>
          )}

          {/* Cancelled Banner State */}
          {searchedOrder.status === 'Cancelled' && (
            <div className="p-6 sm:p-8 bg-[#FAF9F6] border border-red-200 text-center space-y-2 rounded-sm">
              <h3 className="font-serif text-2xl sm:text-3xl text-red-600 tracking-tight uppercase">
                ORDER CANCELLED.
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] font-light">
                This order has been cancelled in our boutique system.
              </p>
            </div>
          )}

          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6E3DC] gap-4">
            <div>
              <span className="text-[10px] font-sans tracking-[0.2em] text-[#C8A96A] uppercase font-semibold">
                ORDER NUMBER
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#111111] tracking-tight">
                {searchedOrder.order_number}
              </h2>
              <p className="text-xs text-[#6B6B6B] mt-1 font-mono">
                Placed: {new Date(searchedOrder.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF9F6] border border-[#E6E3DC] text-xs font-semibold uppercase tracking-wider text-[#111111]">
              <span
                className={`w-2 h-2 rounded-full ${
                  searchedOrder.status === 'Delivered'
                    ? 'bg-emerald-600'
                    : searchedOrder.status === 'Cancelled'
                    ? 'bg-red-600'
                    : 'bg-[#C8A96A]'
                }`}
              />
              <span>{formatStatusLabel(searchedOrder.status)}</span>
            </div>
          </div>

          {/* Timeline Progress Bar (for active / non-cancelled orders) */}
          {searchedOrder.status !== 'Cancelled' && (
            <div className="py-4">
              <div className="relative">
                {/* Line connector */}
                <div className="hidden sm:block absolute top-5 left-6 right-6 h-[2px] bg-[#E6E3DC] -z-0" />
                <div
                  className="hidden sm:block absolute top-5 left-6 h-[2px] bg-[#111111] -z-0 transition-all duration-500"
                  style={{
                    width: `${(currentStepIndex / (statusSteps.length - 1)) * 90}%`,
                  }}
                />

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2">
                  {statusSteps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div
                        key={step.key}
                        className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 relative z-10"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                            isCompleted
                              ? 'bg-[#111111] text-white border-[#111111]'
                              : 'bg-white text-[#6B6B6B] border-[#E6E3DC]'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            <span className="text-xs font-mono">{idx + 1}</span>
                          )}
                        </div>

                        <div className="sm:space-y-0.5">
                          <p
                            className={`text-xs font-semibold uppercase tracking-wider ${
                              isCurrent
                                ? 'text-[#111111]'
                                : isCompleted
                                ? 'text-[#222222]'
                                : 'text-[#6B6B6B]'
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Order Details Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#E6E3DC] text-xs">
            {/* Delivery address */}
            <div className="space-y-2 bg-[#FAF9F6] p-5 rounded-sm border border-[#E6E3DC]">
              <h4 className="font-semibold uppercase tracking-wider text-[#111111] text-[11px]">
                DELIVERING TO
              </h4>
              <p className="text-[#222222] font-medium">{searchedOrder.customer_name}</p>
              <p className="text-[#6B6B6B] leading-relaxed">
                {searchedOrder.full_address}, {searchedOrder.thana_upazila}, {searchedOrder.district}
              </p>
              <p className="text-[#6B6B6B]">Phone: {searchedOrder.customer_phone}</p>
              {searchedOrder.customer_email && (
                <p className="text-[#6B6B6B]">Email: {searchedOrder.customer_email}</p>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2 bg-[#FAF9F6] p-5 rounded-sm border border-[#E6E3DC]">
              <h4 className="font-semibold uppercase tracking-wider text-[#111111] text-[11px]">
                ORDERED ITEMS
              </h4>
              <div className="space-y-2.5">
                {searchedOrder.items && searchedOrder.items.length > 0 ? (
                  searchedOrder.items.map((item) => (
                    <div key={item.id} className="text-xs space-y-0.5 border-b border-[#E6E3DC]/60 pb-1.5 last:border-b-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#111111]">
                          {item.product_name} {item.size ? `(${item.size})` : ''} × {item.quantity}
                        </span>
                        <span className="font-semibold text-[#111111]">
                          <Taka />{item.subtotal.toLocaleString()}
                        </span>
                      </div>
                      {item.item_type === 'combo' && item.components && item.components.length > 0 && (
                        <p className="text-[11px] text-[#6B6B6B]">
                          Includes bespoke selections
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#6B6B6B]">Order items loaded.</p>
                )}

                <div className="border-t border-[#E6E3DC] pt-2 space-y-1 text-xs">
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Subtotal:</span>
                    <span><Taka />{searchedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Delivery:</span>
                    <span>
                      {searchedOrder.delivery_charge === 0 ? 'FREE' : <><Taka />{searchedOrder.delivery_charge}</>}
                    </span>
                  </div>
                  {searchedOrder.discount > 0 && (
                    <div className="flex justify-between text-[#C8A96A]">
                      <span>Discount:</span>
                      <span>-<Taka />{searchedOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-sm text-[#111111] pt-1 border-t border-[#E6E3DC]">
                    <span className="uppercase tracking-wider">
                      TOTAL ({searchedOrder.payment_method === 'cod' ? 'CASH ON DELIVERY' : searchedOrder.payment_method.toUpperCase()})
                    </span>
                    <span><Taka />{searchedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
