import React from 'react';
import { useRouter } from '../context/RouterContext';
import { Taka } from '../components/common/Taka';

export const PolicyPage: React.FC = () => {
  const { path, navigate } = useRouter();

  const getPolicyType = () => {
    if (path.includes('returns')) return 'returns';
    if (path.includes('privacy')) return 'privacy';
    if (path.includes('terms')) return 'terms';
    return 'shipping';
  };

  const currentType = getPolicyType();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 font-sans">
      {/* Navigation tabs between policies */}
      <div className="flex items-center justify-center overflow-x-auto pb-2 border-b border-[#E6E3DC] gap-6 text-xs uppercase tracking-wider font-medium">
        <button
          onClick={() => navigate('/shipping')}
          className={`py-2 transition-colors ${
            currentType === 'shipping'
              ? 'text-[#111111] font-semibold border-b-2 border-[#111111]'
              : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          SHIPPING
        </button>
        <button
          onClick={() => navigate('/returns')}
          className={`py-2 transition-colors ${
            currentType === 'returns'
              ? 'text-[#111111] font-semibold border-b-2 border-[#111111]'
              : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          RETURNS
        </button>
        <button
          onClick={() => navigate('/privacy')}
          className={`py-2 transition-colors ${
            currentType === 'privacy'
              ? 'text-[#111111] font-semibold border-b-2 border-[#111111]'
              : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          PRIVACY
        </button>
        <button
          onClick={() => navigate('/terms')}
          className={`py-2 transition-colors ${
            currentType === 'terms'
              ? 'text-[#111111] font-semibold border-b-2 border-[#111111]'
              : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          TERMS
        </button>
      </div>

      {/* Content based on selected policy */}
      <div className="bg-white border border-[#E6E3DC] p-8 sm:p-12 rounded-sm space-y-6 text-xs sm:text-sm text-[#6B6B6B] leading-relaxed font-light">
        {currentType === 'shipping' && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight font-normal">
              SHIPPING & DELIVERY
            </h1>
            <p>
              We deliver nationwide across Bangladesh. Every fragrance is carefully packaged to ensure it arrives in pristine condition.
            </p>

            <h2 className="font-serif text-xl sm:text-2xl text-[#111111] tracking-tight">DELIVERY TIMELINES</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-[#222222]">
              <li><strong>Within Dhaka:</strong> 24 to 48 hours.</li>
              <li><strong>Outside Dhaka:</strong> 48 to 72 hours nationwide via courier.</li>
            </ul>

            <h2 className="font-serif text-xl sm:text-2xl text-[#111111] tracking-tight">DELIVERY CHARGES</h2>
            <p>
              Free delivery on orders of <strong><Taka />2,500 or more</strong>. For orders below <Taka />2,500, delivery is <strong><Taka />70</strong> within Dhaka and <strong><Taka />120</strong> outside Dhaka.
            </p>

            <h2 className="font-serif text-xl sm:text-2xl text-[#111111] tracking-tight">PAYMENT OPTIONS</h2>
            <p>
              Cash on Delivery (COD) is available across Bangladesh. We also accept bKash, Nagad, and major cards during checkout.
            </p>
          </div>
        )}

        {currentType === 'returns' && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight font-normal">
              RETURNS & EXCHANGES
            </h1>
            <p>
              We offer a <strong>7-day return window</strong> from the date of delivery.
            </p>
            <p>
              Because fragrance is an intimate personal item, returns are accepted exclusively on unopened products in their original sealed packaging.
            </p>

            <h2 className="font-serif text-xl sm:text-2xl text-[#111111] tracking-tight">DAMAGED OR DEFECTIVE ITEMS</h2>
            <p>
              If a bottle arrives damaged or defective, please contact us within 24 hours of delivery. We will arrange an immediate replacement or full refund.
            </p>
          </div>
        )}

        {currentType === 'privacy' && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight font-normal">
              PRIVACY POLICY
            </h1>
            <p>
              AEVY values your privacy. We collect customer contact details and delivery addresses solely to fulfill your orders and provide order support.
            </p>
            <p>
              We do not sell, rent, or share personal information with third-party marketing services.
            </p>
          </div>
        )}

        {currentType === 'terms' && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight font-normal">
              TERMS OF SERVICE
            </h1>
            <p>
              By placing an order with AEVY, you agree to our standard terms of sale, accurate product pricing, and delivery timelines. All fragrance formulations, brand names, and editorial content belong to AEVY.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
