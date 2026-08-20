import React from 'react';
import { ArrowRight, Sparkles, Droplets, Wind, Feather } from 'lucide-react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { HERO_CAMPAIGN_IMAGE } from '../lib/images.ts';

interface HomePageProps {
  products: Product[];
  onNavigateProduct: (slug: string) => void;
  onNavigateShop: () => void;
  onNavigateAbout: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onNavigateProduct,
  onNavigateShop,
  onNavigateAbout
}) => {
  const { addToCart } = useCart();
  const oceanis = products.find((p) => p.slug === 'aevy-oceanis') || products[0];

  return (
    <div className="bg-[#0B0B0B] text-[#F5F1E8] space-y-24 md:space-y-36">
      
      {/* 1. HERO SECTION (Matching Design Layout with Deep Dark Elegance) */}
      <section className="relative min-h-[88vh] md:min-h-[92vh] flex items-center justify-center bg-[#0B0B0B] text-[#F5F1E8] overflow-hidden border-b border-[#2A2A2A]">
        {/* Cinematic Atmospheric Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_CAMPAIGN_IMAGE}
            alt="AEVY Fragrance Campaign"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/70 to-[#0B0B0B]/40" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#0B0B0B]/40 to-[#0B0B0B]/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#111111]/90 border border-[#C8A96A]/40 text-[#C8A96A] text-[10px] sm:text-xs uppercase tracking-[0.35em] font-semibold mb-8 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-[#C8A96A]" />
            Now Available • Extrait de Parfum
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-normal tracking-[0.12em] sm:tracking-[0.16em] text-[#F5F1E8] uppercase leading-[0.95] mb-8">
            ESSENCE OF<br />
            <span className="text-[#F5F1E8]">FRESH</span><br />
            <span className="text-[#C8A96A]">ELEGANCE</span>
          </h1>

          <p className="font-serif text-lg sm:text-2xl text-[#E8E4DA]/90 italic max-w-2xl mx-auto mb-10 tracking-wide leading-relaxed font-light">
            Modern fragrances, created for effortless everyday elegance. A quiet expression of luxury from Bangladesh.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={onNavigateShop}
              className="w-full sm:w-auto px-10 py-4 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.25em] font-bold border border-[#F5F1E8] hover:bg-transparent hover:text-[#F5F1E8] transition-all cursor-pointer shadow-2xl"
            >
              Shop Collection
            </button>
            <button
              onClick={() => onNavigateProduct(oceanis?.slug || 'aevy-oceanis')}
              className="w-full sm:w-auto px-10 py-4 bg-transparent text-[#F5F1E8] border border-[#2A2A2A] text-xs uppercase tracking-[0.25em] font-bold hover:border-[#C8A96A] hover:text-[#C8A96A] transition-all backdrop-blur-xs cursor-pointer"
            >
              The Story
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-[#F5F1E8]/40 text-[10px] tracking-[0.3em] uppercase flex flex-col items-center gap-2">
          <span>Explore Scent</span>
          <div className="w-[1px] h-6 bg-[#C8A96A]/60 animate-pulse" />
        </div>
      </section>

      {/* 2. FEATURED PRODUCT ("THE FIRST ESSENCE - OCEANIS") */}
      {oceanis && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96A] font-semibold block mb-2">
              The First Essence
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-[#F5F1E8] tracking-[0.2em] uppercase">
              OCEANIS
            </h2>
            <p className="text-xs text-[#F5F1E8]/60 uppercase tracking-[0.2em] mt-1 italic">
              Soft • Fresh • Clean
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center bg-[#111111] p-6 sm:p-10 lg:p-14 border border-[#2A2A2A]">
            {/* Left: Studio Flacon Image */}
            <div className="lg:col-span-7 relative group cursor-pointer" onClick={() => onNavigateProduct(oceanis.slug)}>
              <div className="overflow-hidden bg-[#0B0B0B] border border-[#2A2A2A] shadow-2xl">
                <img
                  src={oceanis.images[0]}
                  alt={oceanis.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-[380px] sm:h-[500px] object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />
              </div>
              <span className="absolute top-4 left-4 bg-[#0B0B0B]/90 border border-[#2A2A2A] text-[#C8A96A] text-[10px] tracking-[0.25em] uppercase px-3 py-1 font-semibold">
                Extrait de Parfum • 30ml
              </span>
            </div>

            {/* Right: Editorial Information */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A96A] font-medium block mb-1">
                  AEVY Signature Debut
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#F5F1E8] font-normal tracking-wide mb-2">
                  {oceanis.name}
                </h3>
                <p className="text-xs font-medium tracking-widest text-[#E8E4DA]/80 uppercase mb-4">
                  {oceanis.tagline}
                </p>
                <div className="h-[1px] w-12 bg-[#C8A96A] mb-4" />
              </div>

              <p className="font-serif text-base sm:text-lg text-[#E8E4DA]/90 italic leading-relaxed">
                “{oceanis.story}”
              </p>

              <div className="space-y-2.5 text-xs text-[#F5F1E8]/80 pt-2 border-t border-[#2A2A2A]">
                <div className="flex justify-between">
                  <span className="text-[#F5F1E8]/50 uppercase tracking-widest text-[10px]">Fragrance Family</span>
                  <span className="font-medium text-[#F5F1E8]">{oceanis.fragranceFamily} / Clean Citrus Amber</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F5F1E8]/50 uppercase tracking-widest text-[10px]">Gender Profile</span>
                  <span className="font-medium text-[#F5F1E8]">{oceanis.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F5F1E8]/50 uppercase tracking-widest text-[10px]">Longevity</span>
                  <span className="font-medium text-[#F5F1E8]">8 – 12 Hours (Tropical Resilient)</span>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-[#F5F1E8]/50 uppercase tracking-widest text-[10px]">Bottle Price (30ml)</span>
                  <span className="font-serif text-3xl font-light text-[#C8A96A]">
                    ৳ {oceanis.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => addToCart(oceanis, '30ml', 1)}
                  className="flex-1 py-4 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C8A96A] transition-all cursor-pointer shadow-xl"
                >
                  ADD TO CART
                </button>
                <button
                  onClick={() => onNavigateProduct(oceanis.slug)}
                  className="px-6 py-4 border border-[#2A2A2A] text-[#F5F1E8] text-xs uppercase tracking-[0.2em] font-bold hover:border-[#C8A96A] hover:text-[#C8A96A] transition-all cursor-pointer"
                >
                  DISCOVER OCEANIS
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. PRODUCT COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96A] font-semibold block mb-2">
            Curated Artisanal Editions
          </span>
          <h2 className="font-display text-2xl sm:text-4xl text-[#F5F1E8] tracking-[0.2em] uppercase">
            THE AEVY COLLECTION
          </h2>
          <p className="font-serif text-base text-[#F5F1E8]/70 italic mt-2">
            A curated collection of modern fragrances.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-[#111111] border border-[#2A2A2A] p-8 max-w-2xl mx-auto">
            <Sparkles className="w-8 h-8 text-[#C8A96A] mx-auto mb-3" />
            <h3 className="font-serif text-xl text-[#F5F1E8] mb-2">No fragrances currently listed</h3>
            <p className="text-xs text-[#F5F1E8]/60 mb-6">
              Our atelier is preparing the next small-batch release. Please check back soon for our next release.
            </p>
            <button
              onClick={onNavigateShop}
              className="px-6 py-2.5 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-wider font-bold hover:bg-[#C8A96A] cursor-pointer"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-[#111111] border border-[#2A2A2A] flex flex-col justify-between hover:border-[#C8A96A]/70 transition-all duration-300 shadow-xl"
              >
                <div
                  className="relative overflow-hidden cursor-pointer bg-[#0B0B0B]"
                  onClick={() => onNavigateProduct(product.slug)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-80 sm:h-96 object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B0B0B]/90 border border-[#2A2A2A] text-[#C8A96A] text-[9px] tracking-widest uppercase px-2.5 py-1">
                    {product.fragranceFamily} • {product.gender}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3
                      onClick={() => onNavigateProduct(product.slug)}
                      className="font-serif text-2xl text-[#F5F1E8] group-hover:text-[#C8A96A] cursor-pointer transition-colors"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs tracking-wider text-[#F5F1E8]/60 uppercase mt-0.5">{product.tagline}</p>
                  </div>

                  <p className="text-xs text-[#E8E4DA]/80 line-clamp-2 leading-relaxed font-light">
                    {product.shortDescription}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#2A2A2A]">
                    <div>
                      <span className="text-[10px] text-[#F5F1E8]/50 uppercase tracking-widest block">Flacon Size</span>
                      <span className="text-xs font-medium text-[#F5F1E8]">{product.size || '30ml Flacon'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#F5F1E8]/50 uppercase tracking-widest block">Price</span>
                      <span className="font-serif text-xl font-light text-[#C8A96A]">
                        ৳ {product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => addToCart(product, product.size || '30ml', 1)}
                      className="flex-1 py-3 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C8A96A] transition-all cursor-pointer"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => onNavigateProduct(product.slug)}
                      className="px-4 py-3 border border-[#2A2A2A] text-[#F5F1E8] hover:border-[#C8A96A] hover:text-[#C8A96A] transition-all cursor-pointer"
                      title="View Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. FRAGRANCE STORY & NOTES PYRAMID (A QUIET MOMENT OF FRESHNESS) */}
      {oceanis && (
        <section className="bg-[#111111] text-[#F5F1E8] py-20 md:py-28 border-y border-[#2A2A2A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Editorial Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
              <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96A] font-semibold block">
                Olfactory Architecture
              </span>
              <h2 className="font-display text-2xl sm:text-4xl md:text-5xl tracking-[0.2em] uppercase">
                {oceanis.name} SCENT ARCHITECTURE
              </h2>
              <p className="font-serif text-lg sm:text-xl text-[#E8E4DA]/90 italic">
                “{oceanis.tagline || 'A quiet blend of freshness and softness, created for an effortless sense of clean elegance.'}”
              </p>
            </div>

            {/* Notes Structure Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Top Notes */}
              <div className="bg-[#0B0B0B] p-8 border border-[#2A2A2A] text-center space-y-4 relative group hover:border-[#C8A96A]/60 transition-colors">
                <div className="w-10 h-10 mx-auto rounded-full bg-[#161616] border border-[#C8A96A]/40 flex items-center justify-center text-[#C8A96A]">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A96A] font-medium block mb-1">
                    01 • Initial Impression
                  </span>
                  <h3 className="font-display text-lg tracking-widest uppercase text-[#F5F1E8]">TOP NOTES</h3>
                </div>
                <div className="h-[1px] w-8 bg-[#C8A96A] mx-auto" />
                <div className="space-y-1.5 pt-2">
                  {oceanis.notes?.top?.map((n, i) => (
                    <p key={i} className="font-serif text-xl text-[#F5F1E8]">{n}</p>
                  ))}
                </div>
                <p className="text-xs text-[#F5F1E8]/60 leading-relaxed font-light pt-2">
                  Sparkling, zesty, and crisp morning light opening that immediately awakens the senses.
                </p>
              </div>

              {/* Heart Notes */}
              <div className="bg-[#0B0B0B] p-8 border border-[#C8A96A]/50 text-center space-y-4 relative group shadow-2xl">
                <div className="w-10 h-10 mx-auto rounded-full bg-[#161616] border border-[#C8A96A] flex items-center justify-center text-[#C8A96A]">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A96A] font-medium block mb-1">
                    02 • Scent Character
                  </span>
                  <h3 className="font-display text-lg tracking-widest uppercase text-[#F5F1E8]">HEART NOTES</h3>
                </div>
                <div className="h-[1px] w-8 bg-[#C8A96A] mx-auto" />
                <div className="space-y-1.5 pt-2">
                  {oceanis.notes?.heart?.map((n, i) => (
                    <p key={i} className="font-serif text-xl text-[#F5F1E8]">{n}</p>
                  ))}
                </div>
                <p className="text-xs text-[#F5F1E8]/60 leading-relaxed font-light pt-2">
                  A comforting, velvety softness reminiscent of clean linen warmed by sunlit air.
                </p>
              </div>

              {/* Base Notes */}
              <div className="bg-[#0B0B0B] p-8 border border-[#2A2A2A] text-center space-y-4 relative group hover:border-[#C8A96A]/60 transition-colors">
                <div className="w-10 h-10 mx-auto rounded-full bg-[#161616] border border-[#C8A96A]/40 flex items-center justify-center text-[#C8A96A]">
                  <Feather className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A96A] font-medium block mb-1">
                    03 • Enduring Trail
                  </span>
                  <h3 className="font-display text-lg tracking-widest uppercase text-[#F5F1E8]">BASE NOTES</h3>
                </div>
                <div className="h-[1px] w-8 bg-[#C8A96A] mx-auto" />
                <div className="space-y-1.5 pt-2">
                  {oceanis.notes?.base?.map((n, i) => (
                    <p key={i} className="font-serif text-base text-[#F5F1E8]">{n}</p>
                  ))}
                </div>
                <p className="text-xs text-[#F5F1E8]/60 leading-relaxed font-light pt-2">
                  A warm, intimate skin scent that endures for hours with refined quiet composure.
                </p>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 5. WHY AEVY (4 MINIMALIST PILLARS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96A] font-semibold block mb-2">
            The Philosophy
          </span>
          <h2 className="font-display text-2xl sm:text-4xl text-[#F5F1E8] tracking-[0.2em] uppercase">
            WHY AEVY
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Pillar 1 */}
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] text-center space-y-3 hover:border-[#C8A96A]/60 transition-colors shadow-lg">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C8A96A] font-semibold block">
              Pillar 01
            </span>
            <h3 className="font-serif text-xl text-[#F5F1E8]">MODERN SCENT</h3>
            <p className="text-xs text-[#F5F1E8]/70 leading-relaxed font-light">
              Contemporary fragrances designed for everyday elegance, leaving an effortless impression without shouting.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] text-center space-y-3 hover:border-[#C8A96A]/60 transition-colors shadow-lg">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C8A96A] font-semibold block">
              Pillar 02
            </span>
            <h3 className="font-serif text-xl text-[#F5F1E8]">UNISEX</h3>
            <p className="text-xs text-[#F5F1E8]/70 leading-relaxed font-light">
              Created to be worn beyond traditional fragrance boundaries, adapting naturally to the unique chemistry of your skin.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] text-center space-y-3 hover:border-[#C8A96A]/60 transition-colors shadow-lg">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C8A96A] font-semibold block">
              Pillar 03
            </span>
            <h3 className="font-serif text-xl text-[#F5F1E8]">SMALL BATCH</h3>
            <p className="text-xs text-[#F5F1E8]/70 leading-relaxed font-light">
              Carefully prepared in controlled small batches with aged perfume oils to preserve utmost clarity and purity.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] text-center space-y-3 hover:border-[#C8A96A]/60 transition-colors shadow-lg">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C8A96A] font-semibold block">
              Pillar 04
            </span>
            <h3 className="font-serif text-xl text-[#F5F1E8]">MADE FOR BANGLADESH</h3>
            <p className="text-xs text-[#F5F1E8]/70 leading-relaxed font-light">
              Designed with the local climate and everyday lifestyle in mind, preventing heavy cloying scents in high humidity.
            </p>
          </div>

        </div>
      </section>

      {/* 6. BRAND STORY (FRAGRANCE, REFINED.) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-[#111111] border border-[#2A2A2A] p-8 sm:p-14 lg:p-20 text-center space-y-6 shadow-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96A] font-semibold block">
            Brand Story
          </span>
          <h2 className="font-display text-3xl sm:text-5xl text-[#F5F1E8] tracking-[0.2em] uppercase">
            FRAGRANCE, REFINED.
          </h2>
          <p className="font-serif text-lg sm:text-2xl text-[#E8E4DA]/90 max-w-3xl mx-auto leading-relaxed font-light">
            AEVY is a modern fragrance house built around quiet luxury, refined simplicity and effortless elegance.
          </p>
          <div className="pt-4">
            <button
              onClick={onNavigateAbout}
              className="px-8 py-3.5 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C8A96A] transition-all cursor-pointer"
            >
              Read Our Story
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
