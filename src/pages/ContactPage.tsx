import React, { useState } from 'react';
import { Mail, MapPin, MessageSquare, Send, CheckCircle2, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-[#F5F1E8]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96A] font-semibold block">
          Client Services & Atelier
        </span>
        <h1 className="font-display text-3xl sm:text-5xl text-[#F5F1E8] tracking-[0.15em] uppercase">
          CONTACT CONCIERGE
        </h1>
        <p className="font-serif text-base sm:text-lg text-[#F5F1E8]/70 italic">
          We are at your service for bespoke fragrance inquiries, order status updates, and corporate gifting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#111111] border border-[#2A2A2A] p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="font-serif text-2xl text-[#F5F1E8] border-b border-[#2A2A2A] pb-3">
              Dhaka Atelier & Studio
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C8A96A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#F5F1E8] uppercase tracking-wider block text-[11px]">Location</span>
                  <p className="text-[#F5F1E8]/70 mt-0.5 leading-relaxed font-light">
                    Gulshan 2, Dhaka 1212, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-[#C8A96A] shrink-0 mt-0.5" />
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C8A96A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#F5F1E8] uppercase tracking-wider block text-[11px]">Email Inquiries</span>
                  <p className="text-[#F5F1E8]/70 mt-0.5 font-light">
                    {settings.contactEmail || 'hello.aevy@gmail.com'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C8A96A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#F5F1E8] uppercase tracking-wider block text-[11px]">Operating Hours</span>
                  <p className="text-[#F5F1E8]/70 mt-0.5 font-light">
                    Online Orders: 24/7 Nationwide Delivery
                  </p>
                  <p className="text-[#F5F1E8]/70 font-light">
                    Customer Support: Monday – Saturday, 10:00 AM – 9:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-[#111111] border border-[#2A2A2A] p-6 sm:p-10 shadow-xl">
          <h2 className="font-serif text-2xl text-[#F5F1E8] mb-2">Send an Editorial Inquiry</h2>
          <p className="text-xs text-[#F5F1E8]/60 mb-6">
            Leave us a note and our fragrance concierge will respond within 4 hours.
          </p>

          {submitted ? (
            <div className="py-12 text-center space-y-4 bg-[#0B0B0B] border border-[#2A2A2A] p-6">
              <CheckCircle2 className="w-10 h-10 text-[#C8A96A] mx-auto" />
              <h3 className="font-serif text-2xl text-[#F5F1E8]">Message Transmitted</h3>
              <p className="text-xs text-[#F5F1E8]/70 max-w-sm mx-auto leading-relaxed">
                Thank you for connecting with AEVY. A representative will contact you via email or WhatsApp shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-wider font-bold hover:bg-[#C8A96A] cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/70 mb-1">
                    Your Name <span className="text-[#C8A96A]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Abrar Fahim"
                    className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-xs text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/70 mb-1">
                    Mobile Number <span className="text-[#C8A96A]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-xs text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/70 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. abrar@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-xs text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/70 mb-1">
                  Your Inquiry / Message <span className="text-[#C8A96A]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you with our fragrance collection or custom orders?"
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-xs text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C8A96A] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
