import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const FAQPage: React.FC = () => {
  const { navigate } = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What payment method do you accept?',
      a: 'We currently offer Cash on Delivery across Bangladesh. We also accept bKash, Nagad, and major cards online during checkout.'
    },
    {
      q: 'Where do you deliver?',
      a: 'We deliver across Bangladesh.'
    },
    {
      q: 'How can I track my order?',
      a: 'Use your order number on the Track Order page to check the latest status of your order.'
    },
    {
      q: 'Can I change or cancel my order?',
      a: "Please contact us as soon as possible after placing your order. We'll assist you based on the current status of the order."
    },
    {
      q: 'How long does delivery take?',
      a: 'Orders within Dhaka are delivered within 24 to 48 hours. Nationwide delivery outside Dhaka takes 48 to 72 hours via courier.'
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a 7-day return window from the date of delivery. Because fragrance is an intimate personal item, returns are accepted exclusively on unopened products in their original sealed packaging. If a bottle arrives damaged, please contact us within 24 hours for an immediate replacement.'
    },
    {
      q: 'What sizes are available?',
      a: 'We offer 3ml Pocket Discovery Vials, 10ml Travel Atomizers, 30ml Signature Flacons, and 50ml Master Flacons.'
    },
    {
      q: 'How long do AEVY fragrances last?',
      a: 'Our fragrances are formulated as Extrait de Parfum with high concentration perfume oils, delivering 8 to 12 hours of intimate, skin-close wear.'
    },
    {
      q: 'How should I store my fragrance?',
      a: 'Keep your fragrance away from direct sunlight, excessive heat, and strong temperature changes. Store it in a cool, dry place.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 font-sans">
      <div className="text-center space-y-2">
        <span className="text-[11px] font-sans tracking-[0.24em] text-[#C8A96A] uppercase font-semibold">
          AEVY
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#111111] tracking-tight">
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6B6B] font-light">
          Everything you need to know about our fragrances, ordering, and delivery.
        </p>
      </div>

      <div className="bg-white border border-[#E6E3DC] divide-y divide-[#E6E3DC] rounded-sm">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="p-5 sm:p-6">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left group"
              >
                <span className="font-serif text-lg sm:text-xl text-[#111111] group-hover:text-[#C8A96A] transition-colors pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-[#111111]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="pt-3 text-xs sm:text-sm text-[#6B6B6B] leading-relaxed font-light animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-[#6B6B6B] mb-3">Have another question? We&apos;re here to help.</p>
        <button
          onClick={() => navigate('/contact')}
          className="px-8 py-3 bg-[#111111] text-white text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#222222] transition-colors"
        >
          CONTACT US
        </button>
      </div>
    </div>
  );
};
