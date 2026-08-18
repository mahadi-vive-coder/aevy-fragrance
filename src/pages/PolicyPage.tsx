import React from 'react';
import { ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';

interface PolicyPageProps {
  policyType: 'shipping' | 'refund' | 'privacy' | 'terms';
  onNavigateContact?: () => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ policyType, onNavigateContact }) => {
  const content = {
    shipping: {
      icon: <Truck className="w-8 h-8 text-[#C8A96A]" />,
      title: 'SHIPPING & NATIONWIDE DELIVERY',
      subtitle: 'Seamless express delivery across all 64 districts of Bangladesh.',
      sections: [
        {
          heading: '1. Delivery Timelines',
          body: 'Orders placed inside Dhaka are dispatched via priority city couriers and delivered within 24 to 48 hours. Orders across other districts throughout Bangladesh are securely packaged and delivered within 2 to 4 business days.'
        },
        {
          heading: '2. Shipping Rates & Free Delivery',
          body: 'We provide a flat delivery rate of ৳60 for deliveries inside Dhaka and ৳120 for deliveries outside Dhaka. All orders exceeding ৳7,000 automatically qualify for complimentary nationwide shipping.'
        },
        {
          heading: '3. Cash on Delivery (COD)',
          body: 'Cash on Delivery is available for all addresses across Bangladesh. Please ensure the exact cash amount is ready upon courier arrival. You may inspect the tamper-proof outer luxury seal prior to completing payment.'
        },
        {
          heading: '4. Order Tracking',
          body: 'Upon dispatch, you will receive a tracking link via SMS. You can also monitor your live fulfillment status directly through our website by entering your Order ID and phone number in the Track Order portal.'
        }
      ]
    },
    refund: {
      icon: <RotateCcw className="w-8 h-8 text-[#C8A96A]" />,
      title: 'RETURN & REPLACEMENT POLICY',
      subtitle: 'Our guarantee of pristine quality and authentic artisan craftsmanship.',
      sections: [
        {
          heading: '1. Damaged or Compromised Shipments',
          body: 'Every AEVY flacon is carefully inspected and packaged in protective collector boxes. If your bottle arrives broken, leaking, or damaged during courier transit, please notify our WhatsApp Concierge within 24 hours of delivery with photographic evidence.'
        },
        {
          heading: '2. Complimentary Replacement',
          body: 'For verified damaged shipments or incorrect items sent, AEVY will immediately dispatch a brand-new replacement bottle at zero additional shipping cost.'
        },
        {
          heading: '3. Hygiene & Fragrance Integrity',
          body: 'Due to the intimate, small-batch nature of Extrait de Parfum formulations, bottles that have been unsealed and sprayed cannot be returned for a change of mind. We recommend consulting our WhatsApp fragrance concierge for olfactory guidance prior to purchasing.'
        }
      ]
    },
    privacy: {
      icon: <ShieldCheck className="w-8 h-8 text-[#C8A96A]" />,
      title: 'PRIVACY & DATA PROTECTION',
      subtitle: 'Committed to safeguarding your personal client data with absolute discretion.',
      sections: [
        {
          heading: '1. Information We Collect',
          body: 'We collect only the essential details required to process and dispatch your fragrance orders: your name, contact phone number, delivery address, and email for dispatch notifications.'
        },
        {
          heading: '2. Data Confidentiality',
          body: 'AEVY will never sell, rent, or trade your personal information to third-party advertisers. Your contact details are shared strictly with our contracted courier partners solely for physical package fulfillment.'
        },
        {
          heading: '3. Communications',
          body: 'We will only contact you regarding active order confirmations, delivery schedules, or if you have opted in to receive private invitations to new batch releases.'
        }
      ]
    },
    terms: {
      icon: <FileText className="w-8 h-8 text-[#C8A96A]" />,
      title: 'TERMS & CONDITIONS',
      subtitle: 'Terms governing purchases and client services at AEVY Fragrance Atelier.',
      sections: [
        {
          heading: '1. Ordering & Acceptance',
          body: 'All orders submitted through aevyfragrance.com represent an offer to purchase. AEVY reserves the right to verify order details and telephone contact information before processing and dispatching packages.'
        },
        {
          heading: '2. Pricing & Currency',
          body: 'All prices are listed in Bangladeshi Taka (BDT ৳) and are inclusive of standard applicable taxes. Courier shipping charges are calculated transparently during the checkout process.'
        },
        {
          heading: '3. Intellectual Property',
          body: 'All trademarks, fragrance naming, imagery, copywriting, bottle design aesthetics, and formulations are the exclusive intellectual property of AEVY Fragrance House.'
        }
      ]
    }
  };

  const current = content[policyType] || content.shipping;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-[#F5F1E8]">
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex p-3 rounded-full bg-[#111111] border border-[#2A2A2A] text-[#C8A96A] mx-auto">
          {current.icon}
        </div>
        <h1 className="font-display text-2xl sm:text-4xl text-[#F5F1E8] tracking-[0.15em] uppercase">
          {current.title}
        </h1>
        <p className="font-serif text-base sm:text-lg text-[#F5F1E8]/70 italic max-w-xl mx-auto">
          {current.subtitle}
        </p>
      </div>

      <div className="bg-[#111111] border border-[#2A2A2A] p-6 sm:p-10 space-y-8 shadow-2xl">
        {current.sections.map((sec, idx) => (
          <div key={idx} className="space-y-2 border-b border-[#2A2A2A]/60 pb-6 last:border-b-0 last:pb-0">
            <h2 className="font-serif text-lg sm:text-xl text-[#C8A96A] font-medium">
              {sec.heading}
            </h2>
            <p className="text-xs sm:text-sm text-[#E8E4DA]/80 leading-relaxed font-light">
              {sec.body}
            </p>
          </div>
        ))}
      </div>

      {onNavigateContact && (
        <div className="mt-10 text-center">
          <button
            onClick={onNavigateContact}
            className="text-xs uppercase tracking-widest text-[#C8A96A] hover:underline cursor-pointer"
          >
            Have additional questions? Contact our Atelier Concierge →
          </button>
        </div>
      )}
    </div>
  );
};
