import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data/faqData.ts';

export const FaqPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openItem, setOpenItem] = useState<string | null>(FAQ_ITEMS[0]?.id || null);

  const categories = ['All', 'Product & Scent', 'Ordering & Delivery', 'Usage & Longevity', 'Returns & Authenticity'];

  const filteredItems = activeCategory === 'All'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-[#F5F1E8]">
      
      {/* Header */}
      <div className="text-center mb-12 space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96A] font-semibold block">
          Client Information
        </span>
        <h1 className="font-display text-3xl sm:text-5xl text-[#F5F1E8] tracking-[0.15em] uppercase">
          FREQUENTLY ASKED
        </h1>
        <p className="font-serif text-base sm:text-lg text-[#F5F1E8]/70 italic">
          Everything you need to know about our formulations, nationwide delivery in Bangladesh, and proper care.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs uppercase tracking-wider px-4 py-2 transition-all border cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#C8A96A] text-[#0B0B0B] font-bold border-[#C8A96A]'
                : 'bg-[#111111] text-[#F5F1E8] border-[#2A2A2A] hover:border-[#C8A96A]/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isOpen = openItem === item.id;
          return (
            <div
              key={item.id}
              className="bg-[#111111] border border-[#2A2A2A] overflow-hidden transition-all shadow-lg"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-[#161616] transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#C8A96A] font-semibold block">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl text-[#F5F1E8] leading-snug">
                    {item.question}
                  </h3>
                </div>
                <div className="p-1.5 bg-[#0B0B0B] border border-[#2A2A2A] text-[#C8A96A] shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-2 text-xs sm:text-sm text-[#E8E4DA]/80 leading-relaxed font-light border-t border-[#2A2A2A] bg-[#0B0B0B]">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Help Footer */}
      <div className="mt-14 p-6 bg-[#111111] border border-[#2A2A2A] text-center space-y-2">
        <h4 className="font-serif text-lg text-[#F5F1E8]">Still have questions?</h4>
        <p className="text-xs text-[#F5F1E8]/60 max-w-sm mx-auto">
          Our fragrance concierge is available 7 days a week on WhatsApp for personalized consultations.
        </p>
      </div>

    </div>
  );
};
