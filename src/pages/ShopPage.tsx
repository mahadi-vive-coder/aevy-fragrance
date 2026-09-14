import React, { useState, useMemo, useEffect } from 'react';
import { fetchActiveProducts } from '../lib/shopData';
import { DBProduct } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { useRouter } from '../context/RouterContext';
import { useWishlist } from '../context/WishlistContext';
import { SlidersHorizontal, X, Heart, Loader2 } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { searchParams } = useRouter();
  const { isInWishlist } = useWishlist();

  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

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
        console.error('Error fetching shop products:', err);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Sync query params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const filterParam = searchParams.get('filter');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (filterParam === 'bestseller') {
      setSortBy('bestseller');
    }
    if (filterParam === 'wishlist') {
      setShowWishlistOnly(true);
    }
  }, [searchParams]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Wishlist filter
      if (showWishlistOnly && !isInWishlist(p.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'combos' && p.product_type !== 'combo') return false;
        if (selectedCategory !== 'combos' && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Size filter
      if (selectedSize !== 'all') {
        const hasSize = (p.variants || []).some(
          (v) => v.size === selectedSize && v.is_active && (v.stock === undefined || v.stock > 0)
        );
        if (!hasSize) return false;
      }

      return true;
    }).sort((a, b) => {
      const minA = a.variants && a.variants.length > 0
        ? Math.min(...a.variants.map((v) => Number(v.price)))
        : Number(a.base_price || 0);
      const minB = b.variants && b.variants.length > 0
        ? Math.min(...b.variants.map((v) => Number(v.price)))
        : Number(b.base_price || 0);

      if (sortBy === 'price-low') {
        return minA - minB;
      }
      if (sortBy === 'price-high') {
        return minB - minA;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'bestseller') {
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      }
      // default: featured
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });
  }, [products, showWishlistOnly, isInWishlist, selectedCategory, selectedSize, sortBy]);

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedSize !== 'all' ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setShowWishlistOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
        <span className="text-xs uppercase tracking-[0.28em] font-medium text-[#C8A96A]">
          THE COLLECTION
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#111111] font-normal tracking-tight">
          FIND YOUR SIGNATURE.
        </h1>
        <p className="text-sm sm:text-base text-[#6B6B6B] font-light">
          Explore AEVY&apos;s collection of fresh, modern fragrances.
          <br className="hidden sm:inline" /> Distinct in character. Effortless to wear.
        </p>
      </div>

      {/* Primary Category Quick Tabs */}
      <div className="flex items-center justify-center border-b border-[#E6E3DC] pb-4">
        <div className="inline-flex gap-2 sm:gap-4 overflow-x-auto py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.16em] transition-all whitespace-nowrap rounded-xs ${
              selectedCategory === 'all'
                ? 'bg-[#111111] text-white font-medium shadow-xs'
                : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#FAF9F6]'
            }`}
          >
            ALL
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.16em] transition-all whitespace-nowrap rounded-xs ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#111111] text-white font-medium shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#FAF9F6]'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
          <button
            onClick={() => setSelectedCategory('combos')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.16em] transition-all whitespace-nowrap rounded-xs ${
              selectedCategory === 'combos'
                ? 'bg-[#111111] text-white font-medium shadow-xs'
                : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#FAF9F6]'
            }`}
          >
            CURATED SETS
          </button>
        </div>
      </div>

      {/* Control Bar (Filters button & Sort dropdown) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-2">
        {/* Left: Filter Toggle & Active tags */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#E6E3DC] bg-white text-xs uppercase tracking-[0.16em] font-medium text-[#111111] hover:border-[#111111] transition-colors rounded-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>FILTER</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#111111] text-white text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#6B6B6B] hover:text-[#111111] underline underline-offset-4"
            >
              Reset Filters
            </button>
          )}

          {showWishlistOnly && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8A96A]/15 text-[#8F7234] border border-[#C8A96A]/30 text-xs font-medium rounded-xs">
              <Heart className="w-3.5 h-3.5 fill-[#C8A96A] text-[#C8A96A]" />
              <span>Saved Wishlist</span>
              <button
                onClick={() => setShowWishlistOnly(false)}
                className="ml-1 hover:text-[#111111]"
                aria-label="Remove wishlist filter"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <span className="text-xs text-[#6B6B6B] hidden md:inline ml-2">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'fragrance' : 'fragrances'}
          </span>
        </div>

        {/* Right: Sort By */}
        <div className="flex items-center justify-end gap-2 text-xs">
          <span className="text-[#6B6B6B] uppercase tracking-wider text-[11px]">SORT BY:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-[#E6E3DC] px-3 py-2 text-xs font-sans text-[#111111] uppercase tracking-wider focus:outline-hidden focus:border-[#111111] rounded-xs"
          >
            <option value="featured">FEATURED</option>
            <option value="price-low">PRICE: LOW TO HIGH</option>
            <option value="price-high">PRICE: HIGH TO LOW</option>
            <option value="bestseller">SIGNATURE</option>
            <option value="name">ALPHABETICAL</option>
          </select>
        </div>
      </div>

      {/* Expandable Refine Filter Panel */}
      {isFilterOpen && (
        <div className="p-6 bg-white border border-[#E6E3DC] rounded-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E3DC]">
            <h3 className="font-serif text-lg text-[#111111]">FILTER</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="p-1 text-[#6B6B6B] hover:text-[#111111]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Category */}
            <div className="space-y-2">
              <label className="font-semibold uppercase tracking-[0.14em] text-[#111111] block">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#E6E3DC] p-2.5 text-xs text-[#111111]"
              >
                <option value="all">All Fragrances</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="combos">Curated Sets / Combos</option>
              </select>
            </div>

            {/* Size Preference */}
            <div className="space-y-2">
              <label className="font-semibold uppercase tracking-[0.14em] text-[#111111] block">
                Size
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#E6E3DC] p-2.5 text-xs text-[#111111]"
              >
                <option value="all">All Sizes</option>
                <option value="3ml">3ml (Discovery Vial)</option>
                <option value="10ml">10ml (Travel Atomizer)</option>
                <option value="30ml">30ml (Signature Flacon)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="py-24 flex flex-col justify-center items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#111111]" />
          <p className="text-xs uppercase tracking-widest text-[#6B6B6B]">Loading Fragrances...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 bg-white border border-[#E6E3DC] p-8">
          <p className="font-serif text-2xl text-[#111111]">NOTHING FOUND.</p>
          <p className="text-xs text-[#6B6B6B] max-w-sm mx-auto">
            Try resetting your filters to explore the available collection.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2.5 bg-[#111111] text-white text-xs uppercase tracking-wider font-medium"
          >
            VIEW ALL FRAGRANCES
          </button>
        </div>
      )}
    </div>
  );
};
