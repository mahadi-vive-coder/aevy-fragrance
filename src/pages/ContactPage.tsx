import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, Clock, Instagram } from 'lucide-react';
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

  const contactPhone = settings?.contactPhone || '01629927898';
  const instagramUrl = settings?.socialLinks?.instagram || 'https://instagram.com/aevy.fragrance';

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
        <p className="font-serif text-base sm:text-lg text-[#D4CEBF] italic leading-relaxed">
          We are at your service for bespoke fragrance inquiries, order status updates, and gifting consultations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#111111] border border-[#2A2A2A] p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="font-serif text-2xl text-[#F5F1E8] border-b border-[#2A2A2A] pb-3">
              AEVY Atelier & Studio
            </h2>

            <div className="space-y-5 text-xs sm:text-sm">
              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-[#161616] border border-[#2A2A2A] text-[#C8A96A] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#FAFAF8] uppercase tracking-wider block text-[11px]">Location</span>
                  <p className="text-[#D4CEBF] mt-0.5 leading-relaxed font-normal">
                    Narayanganj, Dhaka, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-[#161616] border border-[#2A2A2A] text-[#C8A96A] shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#FAFAF8] uppercase tracking-wider block text-[11px]">Direct Phone Concierge</span>
                  <p className="text-[#D4CEBF] mt-0.5 font-normal">
                    Daily 10:00 AM – 10:00 PM
                  </p>
                  <a
                    href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                    className="inline-block mt-1 text-[#C8A96A] hover:underline font-mono text-sm font-semibold tracking-wider"
                  >
                    {contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-[#161616] border border-[#2A2A2A] text-[#C8A96A] shrink-0 mt-0.5">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#FAFAF8] uppercase tracking-wider block text-[11px]">Instagram Official</span>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-0.5 text-[#C8A96A] hover:underline font-mono text-xs font-medium"
                  >
                    @aevy.fragrance
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-[#161616] border border-[#2A2A2A] text-[#C8A96A] shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#FAFAF8] uppercase tracking-wider block text-[11px]">Email Inquiries</span>
                  <a
                    href={`mailto:${settings.contactEmail || 'concierge@aevyfragrance.com'}`}
                    className="text-[#D4CEBF] hover:text-[#C8A96A] transition-colors mt-0.5 font-mono text-xs block"
                  >
                    {settings.contactEmail || 'concierge@aevyfragrance.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-[#161616] border border-[#2A2A2A] text-[#C8A96A] shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#FAFAF8] uppercase tracking-wider block text-[11px]">Operating Hours</span>
                  <p className="text-[#D4CEBF] mt-0.5 font-normal">
                    Online Orders: 24/7 Nationwide Delivery
                  </p>
                  <p className="text-[#999999] text-xs font-normal">
                    Customer Support: Monday – Saturday, 10:00 AM – 9:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-[#111111] border border-[#2A2A2A] p-6 sm:p-10 shadow-xl">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] mb-2">Send an Editorial Inquiry</h2>
          <p className="text-xs sm:text-sm text-[#D4CEBF] mb-6">
            Leave us a note and our fragrance concierge will respond within 4 hours.
          </p>

          {submitted ? (
            <div className="py-12 text-center space-y-4 bg-[#0B0B0B] border border-[#2A2A2A] p-6">
              <CheckCircle2 className="w-10 h-10 text-[#C8A96A] mx-auto" />
              <h3 className="font-serif text-2xl text-[#F5F1E8]">Message Transmitted</h3>
              <p className="text-xs sm:text-sm text-[#D4CEBF] max-w-sm mx-auto leading-relaxed">
                Thank you for connecting with AEVY. A representative will contact you shortly.
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
                  <label className="block text-xs uppercase tracking-wider text-[#D4CEBF] mb-1 font-medium">
                    Your Name <span className="text-[#C8A96A]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Abrar Fahim"
                    className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-sm text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D4CEBF] mb-1 font-medium">
                    Mobile Number <span className="text-[#C8A96A]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01629927898"
                    className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-sm text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D4CEBF] mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. abrar@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-sm text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D4CEBF] mb-1 font-medium">
                  Your Inquiry / Message <span className="text-[#C8A96A]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you with our fragrance collection or custom orders?"
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-sm text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none resize-none leading-relaxed"
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
