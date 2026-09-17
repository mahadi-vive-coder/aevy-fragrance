import React, { useEffect, useState } from 'react';
import { fetchActiveProducts } from '../lib/shopData';
import { DBProduct } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { useRouter, Link } from '../context/RouterContext';
import { ArrowRight, Sparkles, Feather, Compass, Loader2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = () => {
    setLoading(true);
    setError(null);
    fetchActiveProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching home products:', err);
        setError(err?.message || 'Failed to load products');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const signatureProducts = products.filter((p) => p.featured).slice(0, 4);
  const displaySignature = signatureProducts.length > 0 ? signatureProducts : products.slice(0, 4);
  const featuredBestSellers = products.slice(0, 3);
  const heroProduct = products[0];

  const heroImage = heroProduct?.image_url || (heroProduct?.images && heroProduct?.images[0]) || '/images/logo_n.jpg';

  return (
    <div className="space-y-20 sm:space-y-28 md:space-y-36 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] sm:min-h-[86vh] flex items-center pt-24 sm:pt-28 overflow-hidden">
        {/* Subtle warm luxury backdrop illumination */}
        <div className="absolute inset-0 bg-radial from-[#FAF8F3] via-[#F8F7F3] to-[#F1EFEA] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="space-y-3">
                <span className="inline-block text-xs uppercase tracking-[0.28em] font-medium text-[#C8A96A]">
                  QUIET LUXURY, BOTTLED.
                </span>
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#111111] leading-[1.08]">
                  FRESHNESS, <br className="hidden sm:inline" />
                  <span className="italic font-light">REFINED.</span>
                </h1>
              </div>

              <p className="text-base sm:text-lg text-[#6B6B6B] font-sans font-light leading-relaxed max-w-md mx-auto lg:mx-0">
                Modern fragrances made for a clean, effortless presence. <br className="hidden sm:inline" />
                Fresh in character. Refined in every detail.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  id="hero-shop-fragrances-btn"
                  onClick={() => navigate('/shop')}
                  className="w-full sm:w-auto px-8 py-4 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#222222] transition-all flex items-center justify-center gap-2 group shadow-sm rounded-xs"
                >
                  <span>SHOP FRAGRANCES</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  id="hero-explore-collection-btn"
                  onClick={() => navigate('/collections')}
                  className="w-full sm:w-auto px-6 py-4 border border-[#E6E3DC] text-[#222222] text-xs uppercase tracking-[0.16em] font-medium hover:border-[#111111] bg-white/40 transition-colors text-center rounded-xs"
                >
                  EXPLORE COLLECTION
                </button>
              </div>

              {/* Sub-features line */}
              <div className="pt-4 border-t border-[#E6E3DC]/60 flex items-center justify-center lg:justify-start gap-6 text-[11px] text-[#6B6B6B] tracking-wider uppercase font-medium">
                <span>Extrait de Parfum</span>
                <span>•</span>
                <span>Clean Accords</span>
                <span>•</span>
                <span>Nationwide Delivery</span>
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-sm overflow-hidden bg-[#FAF9F6] border border-[#E6E3DC] shadow-sm">
                <img
                  src={heroImage}
                  alt={heroProduct ? heroProduct.name : 'AEVY Extrait de Parfum'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center animate-in fade-in duration-700"
                />

                {/* Floating caption card */}
                {heroProduct && (
                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-xs p-4 border border-[#E6E3DC] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#C8A96A] font-semibold">
                        Featured Scent
                      </p>
                      <h3 className="font-serif text-lg text-[#111111] leading-tight">
                        {heroProduct.name}
                      </h3>
                      <p className="text-xs text-[#6B6B6B]">
                        {heroProduct.scent_descriptor || heroProduct.category || 'Extrait de Parfum'}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/products/${heroProduct.slug}`)}
                      className="p-2 text-[#111111] hover:text-[#C8A96A] transition-colors"
                      aria-label={`View ${heroProduct.name}`}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 pb-4 border-b border-[#E6E3DC]">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#C8A96A]">
              THE COLLECTION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1">
              SIGNATURE SCENTS, DISTINCTLY AEVY.
            </h2>
            <p className="text-sm text-[#6B6B6B] mt-1 font-sans">
              A considered collection of modern fragrances, created around freshness, clarity and effortless elegance.
            </p>
          </div>
          <Link
            to="/collections"
            id="view-collection-link"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] font-medium text-[#111111] hover:text-[#C8A96A] transition-colors"
          >
            <span>VIEW COLLECTION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#6B6B6B]" />
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-3 bg-white border border-[#E6E3DC] p-6">
            <p className="text-xs uppercase tracking-widest text-red-600 font-medium">Failed to load products</p>
            <p className="text-xs text-[#6B6B6B]">{error}</p>
            <button
              onClick={loadProducts}
              className="mt-2 px-5 py-2 bg-[#111111] text-white text-[11px] uppercase tracking-wider"
            >
              Retry
            </button>
          </div>
        ) : displaySignature.length === 0 ? (
          <div className="py-16 text-center space-y-2 bg-white border border-[#E6E3DC] p-6">
            <p className="text-xs uppercase tracking-widest text-[#6B6B6B]">No active products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displaySignature.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 3. BRAND STATEMENT */}
      <section className="bg-white border-y border-[#E6E3DC] py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#C8A96A]">
            THE AEVY APPROACH
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#111111] leading-[1.18] font-normal">
            LESS NOISE. MORE CHARACTER.
          </h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-base sm:text-lg text-[#6B6B6B] font-light leading-relaxed font-sans">
              AEVY creates fragrances with a simple idea: <br className="hidden sm:inline" />
              a scent should feel as refined as the person wearing it.
            </p>
            <p className="text-sm sm:text-base text-[#111111] font-medium tracking-wide">
              Clean compositions. Modern character. An effortless finish.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURED / BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 pb-4 border-b border-[#E6E3DC]">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#C8A96A]">
              SIGNATURE FRAGRANCES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1">
              MADE TO BE WORN. REMEMBERED.
            </h2>
            <p className="text-sm text-[#6B6B6B] mt-1 font-sans">
              Distinct expressions of fresh, modern fragrance.
            </p>
          </div>
          <Link
            to="/shop"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] font-medium text-[#111111] hover:text-[#C8A96A] transition-colors"
          >
            <span>EXPLORE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#6B6B6B]" />
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-3 bg-white border border-[#E6E3DC] p-6">
            <p className="text-xs uppercase tracking-widest text-red-600 font-medium">Failed to load products</p>
            <p className="text-xs text-[#6B6B6B]">{error}</p>
            <button
              onClick={loadProducts}
              className="mt-2 px-5 py-2 bg-[#111111] text-white text-[11px] uppercase tracking-wider"
            >
              Retry
            </button>
          </div>
        ) : featuredBestSellers.length === 0 ? (
          <div className="py-16 text-center space-y-2 bg-white border border-[#E6E3DC] p-6">
            <p className="text-xs uppercase tracking-widest text-[#6B6B6B]">No active products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBestSellers.map((product) => (
              <ProductCard key={product.id} product={product} ctaText="VIEW FRAGRANCE" />
            ))}
          </div>
        )}
      </section>

      {/* 5. WHY AEVY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.26em] font-semibold text-[#C8A96A]">
            WHY AEVY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1">
            REFINED BY DESIGN.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white border border-[#E6E3DC] rounded-sm flex flex-col justify-between space-y-4">
            <Sparkles className="w-6 h-6 text-[#C8A96A] stroke-[1.5]" />
            <div>
              <h3 className="font-serif text-xl text-[#111111] mb-2">CLEAN CHARACTER</h3>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                Fresh, balanced fragrances designed for effortless everyday wear.
              </p>
            </div>
          </div>

          <div className="p-8 bg-white border border-[#E6E3DC] rounded-sm flex flex-col justify-between space-y-4">
            <Feather className="w-6 h-6 text-[#C8A96A] stroke-[1.5]" />
            <div>
              <h3 className="font-serif text-xl text-[#111111] mb-2">MADE FOR EVERYONE</h3>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                Modern scents created without unnecessary boundaries.
              </p>
            </div>
          </div>

          <div className="p-8 bg-white border border-[#E6E3DC] rounded-sm flex flex-col justify-between space-y-4">
            <Compass className="w-6 h-6 text-[#C8A96A] stroke-[1.5]" />
            <div>
              <h3 className="font-serif text-xl text-[#111111] mb-2">DETAIL IN EVERY BOTTLE</h3>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                From fragrance to presentation, every detail is considered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-sm overflow-hidden bg-[#111111] text-white border border-[#E6E3DC]">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            {/* Visual Image */}
            <div className="lg:col-span-7 relative h-72 lg:h-auto overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1400&q=85"
                alt="AEVY Fragrance Collection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center opacity-85 hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
            </div>

            {/* Editorial Content */}
            <div className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-[#111111]">
              <div className="space-y-4">
                <span className="text-[11px] font-sans tracking-[0.28em] text-[#C8A96A] uppercase font-semibold">
                  AEVY
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-white leading-tight">
                  THE ART OF WEARING LESS.
                </h2>
                <p className="text-sm text-[#DFCA9B]/90 font-sans font-light leading-relaxed pt-1">
                  A fragrance does not need to be loud to leave an impression.
                </p>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => navigate('/about')}
                  id="editorial-discover-aevy-btn"
                  className="px-8 py-4 bg-white text-[#111111] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#F8F7F3] transition-colors"
                >
                  DISCOVER AEVY
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-6">
        <span className="text-xs uppercase tracking-[0.28em] font-semibold text-[#C8A96A]">
          AEVY
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#111111] font-normal leading-tight">
          FIND YOUR SIGNATURE.
        </h2>
        <p className="text-sm sm:text-base text-[#6B6B6B] max-w-md mx-auto font-light font-sans">
          Explore AEVY&apos;s collection of fresh, modern fragrances.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/shop')}
            id="final-cta-shop-aevy-btn"
            className="px-10 py-4 bg-[#111111] text-white text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#222222] transition-colors shadow-sm"
          >
            SHOP AEVY
          </button>
        </div>
      </section>
    </div>
  );
};
