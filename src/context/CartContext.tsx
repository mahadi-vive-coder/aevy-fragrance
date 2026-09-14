import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, DBProduct, DBProductVariant, DBSettings, ComboComponentSelection } from '../types';
import { fetchStoreSettings, DEFAULT_SETTINGS, calculateDeliveryFee } from '../lib/shopData';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode: string | null;
  total: number;
  settings: DBSettings;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  isDrawerOpen: boolean;
  lastAddedItem: CartItem | null;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addToCart: (
    product: DBProduct,
    variant: DBProductVariant | null,
    quantity?: number,
    comboSelections?: ComboComponentSelection[]
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  clearCart: () => void;
  refreshSettings: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'aevy_fragrance_cart_v2';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<DBSettings>(DEFAULT_SETTINGS);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Narayanganj');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const refreshSettings = async () => {
    try {
      const s = await fetchStoreSettings();
      setSettings(s);
    } catch (e) {
      console.warn('Failed to load store settings:', e);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage quota or disabled
    }
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Dynamic delivery fee based on selected district and subtotal
  const deliveryFee = items.length === 0
    ? 0
    : calculateDeliveryFee(selectedDistrict, subtotal, settings);

  const discount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const openCartDrawer = () => setIsDrawerOpen(true);
  const closeCartDrawer = () => {
    setIsDrawerOpen(false);
    setLastAddedItem(null);
  };

  const addToCart = (
    product: DBProduct,
    variant: DBProductVariant | null,
    quantity: number = 1,
    comboSelections?: ComboComponentSelection[]
  ) => {
    const isCombo = product.product_type === 'combo';
    // Generate deterministic local entry id based on product/variant & combo selections
    const comboKey = comboSelections && comboSelections.length > 0
      ? `-${comboSelections.map((c) => c.variantId).sort().join('-')}`
      : '';
    const itemId = isCombo
      ? `item_${product.id}${comboKey}`
      : (variant?.id || product.id);

    const unitPrice = isCombo
      ? Number(product.combo_price ?? product.price ?? 0)
      : Number(variant?.price ?? product.price ?? 0);

    const stock = isCombo
      ? 99
      : Number(variant?.stock ?? 0);

    const initialQty = Math.max(1, Math.min(quantity, stock > 0 ? stock : 1));

    const itemSize = isCombo
      ? (product.size || 'Curated Set')
      : (variant?.size || '30ml');

    const itemSku = isCombo
      ? (product.combo_sku || product.sku || null)
      : (variant?.sku || product.sku || null);

    const comparePrice = isCombo
      ? (product.combo_compare_at_price ? Number(product.combo_compare_at_price) : null)
      : (variant?.compare_at_price ? Number(variant.compare_at_price) : null);

    let addedItem: CartItem;

    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === itemId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, stock);
        addedItem = { ...existing, quantity: nextQty };
        return prevItems.map((i) => (i.id === itemId ? addedItem : i));
      } else {
        addedItem = {
          id: itemId,
          productId: product.id,
          variantId: variant ? variant.id : null,
          productName: product.name,
          productSlug: product.slug,
          size: itemSize,
          sku: itemSku,
          price: unitPrice,
          compareAtPrice: comparePrice,
          quantity: initialQty,
          itemType: isCombo ? 'combo' : 'single',
          bottleShape: null,
          imageUrl: product.image_url || (product.images && product.images[0]) || null,
          comboSelections: comboSelections && comboSelections.length > 0 ? comboSelections : undefined,
          stock,
        };
        return [...prevItems, addedItem];
      }
    });

    setLastAddedItem({
      id: itemId,
      productId: product.id,
      variantId: variant ? variant.id : null,
      productName: product.name,
      productSlug: product.slug,
      size: itemSize,
      sku: itemSku,
      price: unitPrice,
      compareAtPrice: comparePrice,
      quantity,
      itemType: isCombo ? 'combo' : 'single',
      imageUrl: product.image_url || (product.images && product.images[0]) || null,
      comboSelections: comboSelections && comboSelections.length > 0 ? comboSelections : undefined,
      stock,
    });
    setIsDrawerOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const clampedQty = item.stock > 0 ? Math.min(quantity, item.stock) : quantity;
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'AEVY10' || clean === 'FIRST10' || clean === 'AEVYFIRST') {
      setPromoCode(clean);
      setDiscountPercent(10);
      return true;
    }
    if (clean === 'ELEGANCE15') {
      setPromoCode(clean);
      setDiscountPercent(15);
      return true;
    }
    return false;
  };

  const removePromoCode = () => {
    setPromoCode(null);
    setDiscountPercent(0);
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
    setDiscountPercent(0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        deliveryFee,
        discount,
        promoCode,
        total,
        settings,
        selectedDistrict,
        setSelectedDistrict,
        isDrawerOpen,
        lastAddedItem,
        openCartDrawer,
        closeCartDrawer,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyPromoCode,
        removePromoCode,
        clearCart,
        refreshSettings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
