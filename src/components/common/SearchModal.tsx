import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types.ts';
import { fetchProducts } from '../../lib/api.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await fetchProducts({ search: query });
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const popularSearches = ['Oceanis', 'Bergamot', 'Sandalwood', 'Unisex', 'Fresh', 'Clean', 'Lavender'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/85 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-2xl bg-[#0B0B0B] text-[#F5F1E8] rounded-none border border-[#2A2A2A] shadow-2xl p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#F5F1E8]/60 hover:text-[#C8A96A] transition-colors cursor-pointer"
          aria-label="Close search"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="text-xs uppercase tracking-[0.25em] text-[#C8A96A] font-semibold mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Discover AEVY Fragrance
          </div>
          <div className="relative flex items-center border-b border-[#2A2A2A] pb-3">
            <Search className="w-5 h-5 text-[#C8A96A] mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search perfume, notes (bergamot, amber, musk)..."
              className="w-full bg-transparent text-lg md:text-xl font-serif text-[#F5F1E8] placeholder:text-[#F5F1E8]/30 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-xs text-[#F5F1E8]/50 hover:text-[#F5F1E8] cursor-pointer">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Popular Tags */}
        {!query && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-widest text-[#F5F1E8]/50 mb-3">Popular Inquiries</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="text-xs uppercase tracking-wider px-3 py-1.5 border border-[#2A2A2A] bg-[#111111] text-[#F5F1E8] hover:border-[#C8A96A] hover:text-[#C8A96A] transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading && (
          <div className="py-8 text-center text-sm text-[#F5F1E8]/60 font-serif italic">
            Searching fragrance catalog...
          </div>
        )}

        {!isLoading && query && results.length === 0 && (
          <div className="py-8 text-center text-sm text-[#F5F1E8]/70">
            No fragrances found matching “{query}”. Try searching for “Oceanis”, “Fresh”, or “Bergamot”.
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="mt-6 space-y-3 max-h-80 overflow-y-auto pr-1">
            <p className="text-xs uppercase tracking-widest text-[#F5F1E8]/50 mb-2">
              {results.length} Fragrance{results.length > 1 ? 's' : ''} Found
            </p>
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product.slug);
                  onClose();
                }}
                className="group flex items-center justify-between p-3 border border-[#2A2A2A] bg-[#111111] hover:border-[#C8A96A] cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-16 object-cover border border-[#2A2A2A]"
                  />
                  <div>
                    <h4 className="font-serif text-base text-[#F5F1E8] group-hover:text-[#C8A96A] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-[#F5F1E8]/60 tracking-wider mb-1">{product.tagline}</p>
                    <p className="text-xs text-[#C8A96A] font-medium">৳{product.price.toLocaleString()} • 30ml</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#F5F1E8]/40 group-hover:text-[#C8A96A] group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
