import React from 'react';
import { Sparkles, Droplets, ShieldCheck, HeartHandshake, Feather, ArrowRight } from 'lucide-react';
<<<<<<< HEAD
import { EDITORIAL_LIFESTYLE_IMAGE } from '../lib/images.ts';
=======
>>>>>>> af95be52be9b46ae1ac7f36af859ae95e0d5ee08

interface AboutPageProps {
  onNavigateShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateShop }) => {
  return (
    <div className="text-[#F5F1E8] space-y-24 py-12 sm:py-16">
      
      {/* 1. Header & Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96A] font-semibold block">
          The Story of AEVY
        </span>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-[#F5F1E8] tracking-[0.15em] uppercase">
          ESSENCE OF FRESH ELEGANCE
        </h1>
        <p className="font-serif text-lg sm:text-2xl text-[#E8E4DA]/90 italic max-w-2xl mx-auto font-light leading-relaxed">
          Born in Dhaka, AEVY was founded on a singular conviction: luxury should be quiet, effortless, and intimate.
        </p>
      </section>

      {/* 2. Visual Story Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#111111] border border-[#2A2A2A] p-6 sm:p-12 lg:p-16">
          <div className="lg:col-span-6 relative overflow-hidden bg-[#0B0B0B] border border-[#2A2A2A] shadow-2xl">
            <img
<<<<<<< HEAD
              src={EDITORIAL_LIFESTYLE_IMAGE}
=======
              src="/src/assets/images/aevy_editorial_lifestyle_1786864397734.jpg"
>>>>>>> af95be52be9b46ae1ac7f36af859ae95e0d5ee08
              alt="AEVY Fragrance Philosophy"
              referrerPolicy="no-referrer"
              className="w-full h-[400px] sm:h-[500px] object-cover object-center"
            />
            <div className="absolute bottom-4 left-4 bg-[#0B0B0B]/90 border border-[#2A2A2A] text-[#C8A96A] text-[10px] tracking-widest uppercase px-3 py-1 font-semibold">
<<<<<<< HEAD
              Narayanganj & Dhaka Atelier • Est. 2026
=======
              Dhaka Atelier • Est. 2026
>>>>>>> af95be52be9b46ae1ac7f36af859ae95e0d5ee08
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C8A96A] font-semibold block">
              Philosophy & Origins
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F1E8]">
              A Departure from Loud, Heavy Scents
            </h2>
            <div className="h-[1px] w-12 bg-[#C8A96A]" />

            <div className="space-y-4 text-sm text-[#E8E4DA]/80 font-light leading-relaxed">
              <p>
                In a world crowded with overpowering, synthetic colognes that announce their presence before you enter a room, AEVY takes the opposite path. We believe in <em>quiet luxury</em>—fragrances that draw people in rather than push them away.
              </p>
              <p>
                Crafted specifically with the warm, humid climate of Bangladesh in mind, our formulations utilize high-grade, naturally vibrant notes like Italian Bergamot and French Lavender paired with lingering bases of Mysore Sandalwood and White Musk.
              </p>
              <p>
                The result is a clean, crisp, and velvety presence that remains fresh on your skin from morning meetings to evening dinners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 3 Brand Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96A] font-semibold block">
            Our Standards
          </span>
          <h2 className="font-display text-2xl sm:text-4xl text-[#F5F1E8] tracking-[0.2em] uppercase">
            THE THREE PILLARS OF AEVY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 bg-[#111111] border border-[#2A2A2A] text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-[#161616] border border-[#C8A96A]/40 flex items-center justify-center mx-auto text-[#C8A96A]">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-[#F5F1E8]">Extrait Concentration</h3>
            <p className="text-xs text-[#F5F1E8]/70 leading-relaxed font-light">
              Every AEVY flacon is formulated with a concentrated perfume oil ratio (25–30%), guaranteeing remarkable 8–12 hour persistence without harsh alcohol harshness.
            </p>
          </div>

          <div className="p-8 bg-[#111111] border border-[#2A2A2A] text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-[#161616] border border-[#C8A96A]/40 flex items-center justify-center mx-auto text-[#C8A96A]">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-[#F5F1E8]">Unisex Simplicity</h3>
            <p className="text-xs text-[#F5F1E8]/70 leading-relaxed font-light">
              Fragrance is an intimate mood, not a gender category. Our compositions balance bright zest with soft woody undertones, making them universally flattering on everyone.
            </p>
          </div>

          <div className="p-8 bg-[#111111] border border-[#2A2A2A] text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-[#161616] border border-[#C8A96A]/40 flex items-center justify-center mx-auto text-[#C8A96A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-[#F5F1E8]">Small Batch Curation</h3>
            <p className="text-xs text-[#F5F1E8]/70 leading-relaxed font-light">
              We bottle in limited numbered batches to ensure every single bottle meets rigorous olfactory standards before leaving our Dhaka studio.
            </p>
          </div>
<<<<<<< HEAD

=======
>>>>>>> af95be52be9b46ae1ac7f36af859ae95e0d5ee08
        </div>
      </section>

      {/* 4. Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#111111] border border-[#2A2A2A] p-10 sm:p-16 space-y-6 shadow-2xl">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F1E8]">Experience the Essence of AEVY</h2>
          <p className="text-xs sm:text-sm text-[#F5F1E8]/70 max-w-lg mx-auto font-light leading-relaxed">
            Begin your personal fragrance journey with our signature debut release, OCEANIS.
          </p>
          <button
            onClick={onNavigateShop}
            className="px-8 py-3.5 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C8A96A] transition-all cursor-pointer shadow-xl"
          >
            Explore The Catalog
          </button>
        </div>
      </section>

    </div>
  );
};
