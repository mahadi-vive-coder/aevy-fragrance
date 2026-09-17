import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 font-sans">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[11px] font-sans tracking-[0.24em] text-[#C8A96A] uppercase font-semibold">
          GET IN TOUCH
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#111111] tracking-tight">
          WE&apos;D LOVE TO HEAR FROM YOU.
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6B6B] font-light">
          Have a question about a fragrance, an order, or AEVY?
          <br className="hidden sm:inline" /> We&apos;re here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-5xl mx-auto">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E6E3DC] p-6 sm:p-8 rounded-sm space-y-6">
          <h2 className="font-serif text-2xl text-[#111111] tracking-tight">DIRECT INQUIRIES</h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#C8A96A] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold uppercase tracking-wider text-[#111111] block">
                  PHONE
                </span>
                <a href="tel:+8801629927898" className="text-[#6B6B6B] hover:text-[#111111]">
                  +880 1629927898
                </a>
                <p className="text-[11px] text-[#6B6B6B]/70">Saturday to Thursday, 10am – 8pm</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#C8A96A] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold uppercase tracking-wider text-[#111111] block">
                  EMAIL
                </span>
                <a href="mailto:hello.aevy@gmail.com" className="text-[#6B6B6B] hover:text-[#111111]">
                  hello.aevy@gmail.com
                </a>
                <p className="text-[11px] text-[#6B6B6B]/70">Replies within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#C8A96A] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold uppercase tracking-wider text-[#111111] block">
                  STUDIO
                </span>
                <p className="text-[#6B6B6B]">
                  Narayanganj, Narayanganj, Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E6E3DC] pt-4 text-xs text-[#6B6B6B]">
            <span className="font-semibold text-[#111111] uppercase tracking-wider block mb-1">SOCIAL</span>
            <p>INSTAGRAM: @aevy.fragrance</p>
            <p>FACEBOOK: /aevyfragrance</p>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E6E3DC] p-6 sm:p-8 rounded-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in">
              <CheckCircle2 className="w-12 h-12 text-[#C8A96A] mx-auto" />
              <h3 className="font-serif text-2xl sm:text-3xl text-[#111111] tracking-tight">
                MESSAGE SENT.
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-sm mx-auto font-light">
                Thank you for reaching out. We&apos;ll get back to you soon.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setMessage('');
                }}
                className="text-xs text-[#111111] underline uppercase tracking-wider font-semibold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-2xl text-[#111111] border-b border-[#E6E3DC] pb-3 tracking-tight">
                SEND A MESSAGE
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                    NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#FAF9F6] border border-[#E6E3DC] px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-[#FAF9F6] border border-[#E6E3DC] px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                    PHONE
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full bg-[#FAF9F6] border border-[#E6E3DC] px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                    MESSAGE *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How may we assist you?"
                    className="w-full bg-[#FAF9F6] border border-[#E6E3DC] px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="contact-send-btn"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#222222] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SEND MESSAGE</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
