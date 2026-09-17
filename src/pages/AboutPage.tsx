import React from 'react';
import { useRouter } from '../context/RouterContext';
import { ArrowRight, Sparkles, Feather, ShieldCheck, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-20 sm:space-y-28 font-sans">
      {/* Editorial Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] font-sans tracking-[0.24em] text-[#C8A96A] uppercase font-semibold">
          ABOUT AEVY
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#111111] leading-tight font-medium tracking-tight">
          ESSENCE OF FRESH ELEGANCE.
        </h1>
        <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.24em] text-[#C8A96A] font-semibold">
          ESSENCE OF FRESH ELEGANCE
        </p>
      </div>

      {/* Philosophy Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-6 relative aspect-4/5 rounded-sm overflow-hidden border border-[#E6E3DC] shadow-sm">
          <img
            src="/images/aevy-formulation.jpg"
            alt="AEVY Atelier formulation"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <span className="text-[11px] font-sans tracking-[0.24em] text-[#C8A96A] uppercase font-semibold">
            OUR APPROACH
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal leading-snug tracking-tight">
            Great fragrance does not need to be loud.
          </h2>
          <div className="w-10 h-[1px] bg-[#C8A96A]" />
          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed font-light">
            AEVY is a modern fragrance house built around one simple idea: great fragrance does not need to be loud.
          </p>
          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed font-light">
            We create fresh, refined scents with a clean and contemporary character — made to become part of everyday life.
          </p>
          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed font-light">
            From the fragrance itself to the way it is presented, every detail is considered.
          </p>
        </div>
      </section>

      {/* The Idea Behind AEVY */}
      <section className="bg-white border border-[#E6E3DC] p-8 sm:p-14 lg:p-16 rounded-sm">
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <span className="text-[11px] font-sans tracking-[0.24em] text-[#C8A96A] uppercase font-semibold">
            VALUES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#111111] tracking-tight">
            ESSENCE OF FRESH ELEGANCE
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed font-light">
            Modern fragrances created for a clean, effortless presence throughout everyday life.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 text-left border-t border-[#E6E3DC]">
            <div className="space-y-1.5">
              <span className="font-serif text-xl text-[#111111] block">Fresh Character</span>
              <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">
                Clean, balanced accords designed for effortless daily wear.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-serif text-xl text-[#111111] block">Refined Presence</span>
              <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">
                Subtle compositions that stay close and evolve naturally on your skin.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-serif text-xl text-[#111111] block">Considered Detail</span>
              <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">
                From the fragrance formulation to the final presentation, every element is intentional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The AEVY Experience & Call to Action */}
      <section className="text-center space-y-6 max-w-xl mx-auto pb-10">
        <span className="text-[11px] font-sans tracking-[0.24em] text-[#C8A96A] uppercase font-semibold">
          COLLECTION
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight">
          FIND YOUR SIGNATURE.
        </h2>
        <p className="text-xs sm:text-sm text-[#6B6B6B] font-light leading-relaxed">
          Explore our collection of fresh, modern fragrances.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-3.5 bg-[#111111] text-white text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#222222] transition-colors inline-flex items-center gap-2"
        >
          <span>EXPLORE THE COLLECTION</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
