import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.tsx';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const cleanPhone = settings.whatsappNumber ? settings.whatsappNumber.replace(/\D/g, '') : '8801712345678';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim() || 'Hello AEVY Fragrance Concierge, I would like to inquire about your perfumes.';
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setMessage('');
  };

  const quickInquiries = [
    'How does AEVY OCEANIS smell?',
    'What is the delivery time inside Dhaka?',
    'Is Cash on Delivery available?',
    'Can I order a custom gift presentation?'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-[#0B0B0B] text-[#F5F1E8] border border-[#2A2A2A] shadow-2xl p-5 mb-2 transition-all">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#C8A96A] animate-pulse" />
              <div>
                <h4 className="font-serif text-sm font-semibold tracking-wide text-[#F5F1E8]">AEVY Fragrance Concierge</h4>
                <p className="text-[10px] text-[#F5F1E8]/60 tracking-wider">Dhaka Studio • Live on WhatsApp</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#F5F1E8]/50 hover:text-[#C8A96A] p-1 cursor-pointer"
              aria-label="Close concierge box"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#F5F1E8]/70 mb-3 leading-relaxed">
            Have questions about notes, longevity, or delivery? Chat directly with our fragrance specialists.
          </p>

          <div className="space-y-1.5 mb-4">
            <p className="text-[10px] uppercase tracking-widest text-[#F5F1E8]/50">Quick Inquiries</p>
            {quickInquiries.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setMessage(q)}
                className="w-full text-left text-xs px-2.5 py-1.5 bg-[#111111] border border-[#2A2A2A] hover:border-[#C8A96A] hover:text-[#C8A96A] text-[#F5F1E8]/80 truncate transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="space-y-2">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                rows={2}
                className="w-full p-2.5 text-xs bg-[#111111] border border-[#2A2A2A] text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-wider font-bold hover:bg-[#C8A96A] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Connect on WhatsApp</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 bg-[#0B0B0B] text-[#F5F1E8] border border-[#C8A96A]/60 shadow-2xl hover:bg-[#161616] hover:border-[#C8A96A] transition-all cursor-pointer"
        aria-label="Open fragrance concierge"
      >
        <MessageSquare className="w-4 h-4 text-[#C8A96A] group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline text-xs uppercase tracking-[0.2em] font-medium font-sans">
          AEVY Concierge
        </span>
      </button>
    </div>
  );
};
