import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, ArrowRight } from 'lucide-react';
import { fetchActiveProducts } from '../../lib/shopData';
import { useRouter } from '../../context/RouterContext';
import { DBProduct } from '../../types';
import { Taka } from '../common/Taka';

const POPULAR_SEARCH_TERMS = [
  'Oceanis',
  'Aura',
  'Noir',
  'Velvet',
  '30ml',
  'Extrait',
  'Curated Set',
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<DBProduct[]>([]);
  const [results, setResults] = useState<DBProduct[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { navigate } = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
      // Load products if not loaded
      fetchActiveProducts()
        .then((data) => setAllProducts(data))
        .catch((err) => console.error('Error fetching search products:', err));
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const filtered = allProducts.filter((p) => {
        const topNotes = p.notes?.top || [];
        const heartNotes = p.notes?.heart || [];
        const baseNotes = p.notes?.base || [];
        return (
          p.name.toLowerCase().includes(trimmed) ||
          (p.scent_descriptor && p.scent_descriptor.toLowerCase().includes(trimmed)) ||
          (p.category && p.category.toLowerCase().includes(trimmed)) ||
          (p.description && p.description.toLowerCase().includes(trimmed)) ||
          topNotes.some((n) => n.toLowerCase().includes(trimmed)) ||
          heartNotes.some((n) => n.toLowerCase().includes(trimmed)) ||
          baseNotes.some((n) => n.toLowerCase().includes(trimmed))
        );
      });
      setResults(filtered);
    }, 180);

    return () => clearTimeout(timer);
  }, [query, allProducts]);

  if (!isOpen) return null;

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate(`/products/${slug}`);
  };

  const handleSelectTerm = (term: string) => {
    setQuery(term);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111111]/40 backdrop-blur-sm flex flex-col items-center justify-start pt-16 sm:pt-24 px-4 sm:px-6 animate-in fade-in duration-200">
      {/* Background dismiss */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="w-full max-w-2xl bg-[#F8F7F3] border border-[#E6E3DC] rounded-sm shadow-xl p-6 sm:p-8 flex flex-col gap-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close search"
          id="close-search-btn"
          className="absolute top-5 right-5 text-[#6B6B6B] hover:text-[#111111] p-2 rounded-xs hover:bg-[#E6E3DC]/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="text-center">
          <span className="text-[11px] font-sans tracking-[0.2em] text-[#C8A96A] uppercase font-semibold">
            Search AEVY
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#111111] mt-1">
            Discover Your Signature Note
          </h2>
        </div>

        {/* Search Input Box */}
        <div className="relative flex items-center border-b border-[#111111] pb-2">
          <SearchIcon className="w-5 h-5 text-[#6B6B6B] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            id="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fragrances, notes, collections"
            className="w-full bg-transparent text-base sm:text-lg text-[#111111] placeholder:text-[#6B6B6B]/60 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#6B6B6B] hover:text-[#111111] uppercase tracking-wider font-medium mr-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Suggestions or Results */}
        {query.trim() === '' ? (
          <div>
            <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider mb-3">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCH_TERMS.map((term) => (
                <button
                  key={term}
                  id={`popular-search-${term.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleSelectTerm(term)}
                  className="px-3 py-1.5 rounded-xs text-xs sm:text-sm bg-white border border-[#E6E3DC] text-[#222222] hover:border-[#111111] hover:text-[#111111] transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
            {results.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider mb-2">
                  {results.length} {results.length === 1 ? 'Fragrance Found' : 'Fragrances Found'}
                </p>
                {results.map((product) => {
                  const prices = (product.variants || []).map((v) => Number(v.price)).filter((p) => p > 0);
                  const minPrice = prices.length > 0 ? Math.min(...prices) : Number(product.base_price || 0);
                  const image = product.image_url || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=300&q=80';

                  return (
                    <div
                      key={product.id}
                      id={`search-result-${product.slug}`}
                      onClick={() => handleSelectProduct(product.slug)}
                      className="group flex items-center gap-4 p-2.5 rounded-xs hover:bg-white border border-transparent hover:border-[#E6E3DC] cursor-pointer transition-all"
                    >
                      <img
                        src={image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-cover rounded-xs bg-[#FAF9F6] border border-[#E6E3DC]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-serif text-lg text-[#111111] group-hover:text-[#C8A96A] transition-colors truncate">
                            {product.name}
                          </h4>
                          <span className="text-xs font-medium text-[#111111]">
                            From <Taka />{minPrice.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B6B6B] truncate">
                          {product.scent_descriptor || product.category || 'Extrait de Parfum'}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#6B6B6B] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="font-serif text-lg text-[#111111]">No fragrances found.</p>
                <p className="text-xs text-[#6B6B6B] mt-1">
                  Try another search query or explore the collection.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
