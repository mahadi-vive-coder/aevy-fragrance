import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';

interface ShopPageProps {
  products: Product[];
  onNavigateProduct: (slug: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ products, onNavigateProduct }) => {
  const { addToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Fresh' | 'Woody' | 'Clean' | 'Unisex'>('All');
  const [activeSort, setActiveSort] = useState<'Featured' | 'PriceLow' | 'PriceHigh' | 'Newest'>('Featured');

  const filterOptions: ('All' | 'Fresh' | 'Woody' | 'Clean' | 'Unisex')[] = ['All', 'Fresh', 'Woody', 'Clean', 'Unisex'];
  const sortOptions = [
    { label: 'Featured Selection', value: 'Featured' },
    { label: 'Price: Low to High', value: 'PriceLow' },
    { label: 'Price: High to Low', value: 'PriceHigh' },
    { label: 'Newest Additions', value: 'Newest' }
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Filter
    if (activeFilter !== 'All') {
      if (activeFilter === 'Unisex') {
        list = list.filter((p) => p.gender === 'Unisex');
      } else if (activeFilter === 'Clean') {
        list = list.filter(
          (p) =>
            p.tagline.toLowerCase().includes('clean') ||
            p.shortDescription.toLowerCase().includes('clean') ||
            p.notes.heart.some((n) => n.toLowerCase().includes('musk') || n.toLowerCase().includes('clean'))
        );
      } else {
        list = list.filter((p) => p.fragranceFamily.toLowerCase() === activeFilter.toLowerCase());
      }
    }

    // Sort
    if (activeSort === 'PriceLow') {
      list.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'PriceHigh') {
      list.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'Newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // Featured
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [products, activeFilter, activeSort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-[#F5F1E8]">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96A] font-semibold block">
          AEVY Fragrance House
        </span>
        <h1 className="font-display text-3xl sm:text-5xl text-[#F5F1E8] tracking-[0.2em] uppercase">
          SHOP AEVY
        </h1>
        <p className="font-serif text-base sm:text-lg text-[#F5F1E8]/70 italic">
          Quiet luxury fragrances formulated in 30ml flacons with Extrait concentration for everyday elegance.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 mb-10 border-b border-[#2A2A2A]">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-[#F5F1E8]/50 mr-2">Filter:</span>
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-xs uppercase tracking-wider px-4 py-2 transition-all border cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[#C8A96A] text-[#0B0B0B] font-bold border-[#C8A96A]'
                  : 'bg-[#111111] text-[#F5F1E8] border-[#2A2A2A] hover:border-[#C8A96A]/60'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-xs uppercase tracking-widest text-[#F5F1E8]/50 whitespace-nowrap">Sort By:</span>
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value as any)}
            className="text-xs uppercase tracking-wider px-3.5 py-2 bg-[#111111] border border-[#2A2A2A] text-[#F5F1E8] focus:border-[#C8A96A] focus:outline-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#111111] text-[#F5F1E8]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#111111] border border-[#2A2A2A] p-8">
          <Sparkles className="w-8 h-8 text-[#C8A96A] mx-auto mb-3" />
          <h3 className="font-serif text-xl text-[#F5F1E8] mb-2">No fragrances found</h3>
          <p className="text-xs text-[#F5F1E8]/60 mb-6">
            There are currently no products under the “{activeFilter}” category.
          </p>
          <button
            onClick={() => setActiveFilter('All')}
            className="px-6 py-2.5 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-wider font-bold hover:bg-[#C8A96A] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredAndSortedProducts.map((product) => (
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
                {product.stock <= 0 || product.status === 'out_of_stock' ? (
                  <div className="absolute bottom-3 right-3 bg-red-950/90 text-red-300 border border-red-800/80 text-[9px] tracking-wider uppercase font-bold px-2 py-0.5 shadow-sm">
                    Out of Stock
                  </div>
                ) : product.stock <= product.lowStockThreshold ? (
                  <div className="absolute bottom-3 right-3 bg-[#C8A96A] text-[#0B0B0B] text-[9px] tracking-wider uppercase font-bold px-2 py-0.5 shadow-sm">
                    Only {product.stock} Left in Batch
                  </div>
                ) : null}
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

                {/* Fragrance Notes Highlights */}
                <div className="bg-[#0B0B0B] p-2.5 border border-[#2A2A2A] text-[11px] text-[#F5F1E8]/80 space-y-1">
                  <div className="flex gap-1.5">
                    <span className="text-[#C8A96A] uppercase tracking-widest text-[9px]">Notes:</span>
                    <span className="truncate">{product.notes.top.join(', ')} → {product.notes.heart.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#2A2A2A]">
                  <div>
                    <span className="text-[10px] text-[#F5F1E8]/50 uppercase tracking-widest block">Size</span>
                    <span className="text-xs font-medium text-[#F5F1E8]">30ml Flacon</span>
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
                    onClick={() => addToCart(product, '30ml', 1)}
                    disabled={product.stock <= 0 || product.status === 'out_of_stock'}
                    className="flex-1 py-3 bg-[#F5F1E8] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C8A96A] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    {product.stock <= 0 || product.status === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
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
    </div>
  );
};
