import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { fetchProductBySlug, fetchActiveProducts } from '../lib/shopData';
import { DBProduct, DBProductVariant, ComboComponentSelection } from '../types';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductVariantSelector } from '../components/product/ProductVariantSelector';
import { FragranceNotes } from '../components/product/FragranceNotes';
import { StickyMobileBar } from '../components/product/StickyMobileBar';
import { ProductCard } from '../components/product/ProductCard';
import { Taka } from '../components/common/Taka';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Minus, Plus, ShoppingBag, Check, ShieldCheck, Truck, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const slug = params.slug || 'oceanis';

  const [product, setProduct] = useState<DBProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Selected single variant
  const [selectedVariant, setSelectedVariant] = useState<DBProductVariant | undefined>(undefined);
  // Combo slot selections
  const [comboSelections, setComboSelections] = useState<Record<string, ComboComponentSelection>>({});

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setValidationError(null);

    fetchProductBySlug(slug)
      .then((p) => {
        if (!mounted) return;
        if (!p) {
          setError('Product not found.');
          setLoading(false);
          return;
        }
        setProduct(p);

        // Set default variant if single
        if (p.product_type !== 'combo' && p.variants && p.variants.length > 0) {
          const defaultVar = p.variants.find((v) => v.size === '30ml') || p.variants[0];
          setSelectedVariant(defaultVar);
        } else if (p.variants && p.variants.length > 0) {
          setSelectedVariant(p.variants[0]);
        }

        // Initialize combo slot selections if combo
        const comboSlotsList = (p as any).comboSlots || (p as any).combo_slots || [];
        if (p.product_type === 'combo' && comboSlotsList.length > 0) {
          const initialSelections: Record<string, ComboComponentSelection> = {};
          comboSlotsList.forEach((slot: any, idx: number) => {
            const allowed = slot.allowedVariants || slot.allowed_variants || [];
            if (allowed.length > 0) {
              const firstAllowed = allowed[0];
              const slotTitle = slot.slot_title || slot.name || `Fragrance ${idx + 1}`;
              const variantId = firstAllowed.variant?.id || firstAllowed.product_variant_id || firstAllowed.variant_id || firstAllowed.id;
              const productName = firstAllowed.product?.name || firstAllowed.product_name || 'Fragrance';
              const size = firstAllowed.variant?.size || firstAllowed.size || '30ml';
              const price = Number(firstAllowed.variant?.price || firstAllowed.price || 0);

              initialSelections[slot.id] = {
                slotId: slot.id,
                slotTitle: slotTitle,
                slotName: slotTitle,
                variantId: variantId,
                variantSize: size,
                productName: productName,
                size: size,
                price: price,
              };
            }
          });
          setComboSelections(initialSelections);
        }

        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((err) => {
        console.error('Error fetching product:', err);
        if (mounted) {
          setError('Failed to load product details.');
          setLoading(false);
        }
      });

    // Fetch related products
    fetchActiveProducts()
      .then((all) => {
        if (mounted) {
          setRelatedProducts(all.filter((item) => item.slug !== slug).slice(0, 3));
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-28 flex flex-col justify-center items-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#111111]" />
        <p className="text-xs uppercase tracking-widest text-[#6B6B6B]">Preparing Fragrance Profile...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="bg-white border border-[#E6E3DC] p-10 rounded-sm space-y-4">
          <AlertCircle className="w-8 h-8 text-[#C8A96A] mx-auto" />
          <h2 className="font-serif text-3xl text-[#111111]">FRAGRANCE NOT FOUND</h2>
          <p className="text-xs text-[#6B6B6B]">
            The fragrance you are seeking may have completed its seasonal batch or is currently resting.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-[#111111] text-white text-xs uppercase tracking-wider font-medium"
          >
            DISCOVER OTHER FRAGRANCES
          </button>
        </div>
      </div>
    );
  }

  const isCombo = product.product_type === 'combo';
  const price = selectedVariant?.price ?? product.base_price ?? product.price ?? 0;
  const isWishlisted = isInWishlist(product.id);
  const comboSlots = (product as any).comboSlots || (product as any).combo_slots || [];

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image_url || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85'];

  const handleComboSlotChange = (slotId: string, slotTitle: string, variantId: string, allowedVariants: any[]) => {
    const chosen = allowedVariants.find((av: any) => {
      const id = av.variant?.id || av.product_variant_id || av.variant_id || av.id;
      return id === variantId;
    });
    if (!chosen) return;
    const size = chosen.variant?.size || chosen.size || '30ml';
    const productName = chosen.product?.name || chosen.product_name || 'Fragrance';
    const variantPrice = Number(chosen.variant?.price || chosen.price || 0);

    setComboSelections((prev) => ({
      ...prev,
      [slotId]: {
        slotId,
        slotTitle,
        slotName: slotTitle,
        variantId,
        variantSize: size,
        productName,
        size,
        price: variantPrice,
      },
    }));
  };

  const handleAddToCart = () => {
    setValidationError(null);

    // Validate combo selection if combo
    if (isCombo) {
      for (const slot of comboSlots) {
        if (!comboSelections[slot.id]) {
          const slotTitle = slot.slot_title || slot.name || 'slot';
          setValidationError(`Please select a fragrance for "${slotTitle}".`);
          return;
        }
      }
      const selectionsArray: ComboComponentSelection[] = Object.values(comboSelections);
      addToCart(product, selectedVariant || null, quantity, selectionsArray);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
      return;
    }

    // Validate single variant
    if (!selectedVariant) {
      setValidationError('Please choose a size.');
      return;
    }

    addToCart(product, selectedVariant, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 font-sans">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
        <button
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-1 hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Fragrances</span>
        </button>
        <div className="hidden sm:flex items-center space-x-2">
          <span>Shop</span>
          <span>/</span>
          <span>{product.category || 'Collection'}</span>
          <span>/</span>
          <span className="text-[#111111] font-medium">{product.name}</span>
        </div>
      </div>

      {/* Main Product Layout: Desktop 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Gallery on Left (7 cols) */}
        <div className="lg:col-span-7">
          <ProductGallery images={images} productName={product.name} />
        </div>

        {/* Purchase Info on Right (5 cols) */}
        <div className="lg:col-span-5 space-y-7">
          {/* Header & Subtitle */}
          <div className="space-y-1.5 border-b border-[#E6E3DC] pb-5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-sans tracking-[0.2em] text-[#C8A96A] uppercase font-semibold">
                {product.category || 'AEVY EXTRAIT'}
              </span>
              {isCombo && (
                <span className="text-[10px] uppercase tracking-wider bg-[#111111] text-white px-2 py-0.5 font-medium">
                  Curated Set
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111111] font-medium">
              {product.name}
            </h1>
            <p className="text-xs text-[#6B6B6B] tracking-wider uppercase font-medium">
              {product.scent_descriptor || product.category || 'Extrait de Parfum'}
            </p>
          </div>

          {/* Price & SKU */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-serif text-3xl sm:text-4xl text-[#111111] font-medium">
                <Taka />{Number(price).toLocaleString()}
              </span>
              <span className="text-xs text-[#6B6B6B] ml-2">BDT incl. taxes</span>
            </div>
            {selectedVariant?.sku && (
              <span className="text-[11px] text-[#6B6B6B] font-mono">
                SKU: {selectedVariant.sku}
              </span>
            )}
          </div>

          {/* Short description */}
          {product.description && (
            <p className="text-xs sm:text-sm text-[#222222] font-light leading-relaxed">
              {product.description}
            </p>
          )}

          {/* If COMBO: Render slot selection */}
          {isCombo && comboSlots.length > 0 && (
            <div className="space-y-4 p-5 bg-[#FAF9F6] border border-[#E6E3DC] rounded-sm">
              <div className="border-b border-[#E6E3DC] pb-2">
                <h3 className="font-serif text-lg text-[#111111]">CUSTOMIZE YOUR SET</h3>
                <p className="text-xs text-[#6B6B6B]">Select each fragrance included in this discovery set.</p>
              </div>

              <div className="space-y-3">
                {comboSlots.map((slot: any, index: number) => {
                  const currentSelection = comboSelections[slot.id];
                  const allowed = slot.allowedVariants || slot.allowed_variants || [];
                  const slotTitle = slot.slot_title || slot.name || `Fragrance Slot ${index + 1}`;

                  return (
                    <div key={slot.id} className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#111111] flex items-center justify-between">
                        <span>{slotTitle}</span>
                        {currentSelection && (
                          <span className="text-[#C8A96A] font-normal lowercase">
                            {currentSelection.variantSize || currentSelection.size}
                          </span>
                        )}
                      </label>
                      <select
                        value={currentSelection?.variantId || ''}
                        onChange={(e) =>
                          handleComboSlotChange(slot.id, slotTitle, e.target.value, allowed)
                        }
                        className="w-full bg-white border border-[#E6E3DC] px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                      >
                        {allowed.map((av: any) => {
                          const avId = av.variant?.id || av.product_variant_id || av.variant_id || av.id;
                          const avName = av.product?.name || av.product_name || 'Fragrance';
                          const avSize = av.variant?.size || av.size || '30ml';
                          return (
                            <option key={avId} value={avId}>
                              {avName} ({avSize})
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* If SINGLE: Size Variant Selector */}
          {!isCombo && product.variants && product.variants.length > 0 && (
            <ProductVariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelectVariant={(variant) => {
                setSelectedVariant(variant);
                if (variant.stock !== undefined && quantity > variant.stock) {
                  setQuantity(Math.max(1, variant.stock));
                }
              }}
            />
          )}

          {/* Stock availability indicator */}
          {!isCombo && selectedVariant && (
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  (selectedVariant.stock ?? 1) > 0 ? 'bg-emerald-600' : 'bg-red-500'
                }`}
              />
              <span className="text-[#6B6B6B]">
                {(selectedVariant.stock ?? 1) > 10
                  ? 'In Stock & Hand-Prepared in Boutique'
                  : (selectedVariant.stock ?? 1) > 0
                  ? `Only ${selectedVariant.stock} flacons remaining in this batch`
                  : 'Currently resting / out of stock'}
              </span>
            </div>
          )}

          {validationError && (
            <p className="text-xs text-red-600 bg-red-50 p-2.5 border border-red-200 rounded-xs">
              {validationError}
            </p>
          )}

          {/* Quantity & Add to Bag Area */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="inline-flex items-center border border-[#E6E3DC] bg-white rounded-sm h-12">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="px-3.5 h-full text-xs text-[#111111] hover:bg-[#F8F7F3] disabled:opacity-40 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium font-sans">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => {
                      const maxStock = selectedVariant?.stock ?? 99;
                      return Math.min(maxStock, q + 1);
                    })
                  }
                  disabled={!isCombo && selectedVariant?.stock !== undefined && quantity >= selectedVariant.stock}
                  aria-label="Increase quantity"
                  className="px-3.5 h-full text-xs text-[#111111] hover:bg-[#F8F7F3] disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                id="main-add-to-bag-btn"
                onClick={handleAddToCart}
                disabled={!isCombo && (!selectedVariant || !selectedVariant.is_active || (selectedVariant.stock !== undefined && selectedVariant.stock <= 0))}
                className="flex-1 h-12 bg-[#111111] text-white text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#222222] disabled:bg-[#E6E3DC] disabled:text-[#6B6B6B] transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-[0.99]"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 text-[#C8A96A]" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {isCombo ? 'Add Curated Set' : 'Add to Bag'} • <Taka />{(Number(price) * quantity).toLocaleString()}
                    </span>
                  </>
                )}
              </button>

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className="w-12 h-12 border border-[#E6E3DC] bg-white rounded-sm flex items-center justify-center text-[#111111] hover:border-[#111111] transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? 'fill-[#C8A96A] text-[#C8A96A]' : 'stroke-[1.5]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Trust assurances */}
          <div className="border-t border-[#E6E3DC] pt-5 grid grid-cols-2 gap-4 text-xs text-[#6B6B6B]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C8A96A] shrink-0" />
              <span>Complimentary shipping threshold available</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C8A96A] shrink-0" />
              <span>Cash on Delivery across Bangladesh</span>
            </div>
          </div>

          {/* Fragrance Notes / Details Component */}
          <FragranceNotes product={product} />
        </div>
      </div>

      {/* Sticky Mobile Purchase Bar when scrolled */}
      <StickyMobileBar
        product={product}
        selectedVariant={selectedVariant}
        comboSelections={isCombo ? Object.values(comboSelections) : undefined}
        triggerElementId="main-add-to-bag-btn"
      />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[#E6E3DC] pt-14 space-y-8">
          <div className="text-center max-w-md mx-auto space-y-1">
            <span className="text-[11px] font-sans tracking-[0.24em] text-[#C8A96A] uppercase font-semibold">
              Olfactory Pairings
            </span>
            <h2 className="font-serif text-3xl text-[#111111]">You May Also Like</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
