import React, { useEffect, useState } from 'react';
import { fetchActiveProducts } from '../lib/shopData';
import { DBProduct } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { useRouter } from '../context/RouterContext';
import { Loader2 } from 'lucide-react';

export const CollectionsPage: React.FC = () => {
  const { navigate } = useRouter();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchActiveProducts()
      .then((data) => {
        if (mounted) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching collections:', err);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const signatureScents = products.filter((p) => p.is_featured || p.product_type === 'single');
  const comboScents = products.filter((p) => p.product_type === 'combo');

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* Editorial Header */}
      <section className="pt-12 sm:pt-16 pb-8 text-center max-w-3xl mx-auto px-4 space-y-4">
        <span className="text-xs uppercase tracking-[0.28em] font-medium text-[#C8A96A]">
          AEVY
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#111111] font-normal leading-tight">
          Collections
        </h1>
        <p className="text-base text-[#6B6B6B] font-light max-w-xl mx-auto font-sans">
          A curated study in olfactory atmosphere. Fragrances formulated in quiet series for a clean, enduring presence.
        </p>
      </section>

      {loading ? (
        <div className="py-24 flex flex-col justify-center items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#111111]" />
          <p className="text-xs uppercase tracking-widest text-[#6B6B6B]">Curating Collections...</p>
        </div>
      ) : (
        <>
          {/* Series 1: Extrait de Parfum Signatures */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-[#E6E3DC] pb-4 flex flex-col sm:flex-row sm:items-end justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C8A96A]">
                  Series 01
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1">
                  Signature Extraits
                </h2>
                <p className="text-xs sm:text-sm text-[#6B6B6B] font-light">
                  Handcrafted extraits formulated with high oil concentrations for nuanced longevity.
                </p>
              </div>
              <button
                onClick={() => navigate('/shop')}
                className="mt-2 sm:mt-0 text-xs uppercase tracking-[0.16em] text-[#111111] hover:text-[#C8A96A] font-medium"
              >
                Explore All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {signatureScents.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Series 2: Curated Discovery Sets / Combos */}
          {comboScents.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="border-b border-[#E6E3DC] pb-4 flex flex-col sm:flex-row sm:items-end justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C8A96A]">
                    Series 02
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1">
                    Curated Sets & Pairings
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6B6B6B] font-light">
                    Customizable fragrance pairings and multi-flacon discovery editions.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/shop?category=combos')}
                  className="mt-2 sm:mt-0 text-xs uppercase tracking-[0.16em] text-[#111111] hover:text-[#C8A96A] font-medium"
                >
                  Explore Sets
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {comboScents.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};
