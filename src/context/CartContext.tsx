import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types.ts';
import { validateCoupon } from '../lib/api.ts';
<<<<<<< HEAD
import { resolveImageUrl } from '../lib/images.ts';
=======
>>>>>>> af95be52be9b46ae1ac7f36af859ae95e0d5ee08

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  couponCode: string;
  discount: number;
  couponError: string | null;
  isApplyingCoupon: boolean;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'aevy_cart_v1';
const COUPON_STORAGE_KEY = 'aevy_coupon_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string>(() => {
    try {
      return localStorage.getItem(COUPON_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [discount, setDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart:', err);
    }
  }, [cart]);

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Revalidate coupon on subtotal changes
  useEffect(() => {
    if (!couponCode || subtotal === 0) {
      setDiscount(0);
      return;
    }

    validateCoupon(couponCode, subtotal)
      .then(res => {
        setDiscount(res.discount);
        setCouponError(null);
      })
      .catch(() => {
        setDiscount(0);
      });
  }, [subtotal, couponCode]);

  const addToCart = (product: Product, size: string = '30ml', quantity: number = 1) => {
    const sizeVariant = product.sizes.find(s => s.size === size) || product.sizes[0];
    const unitPrice = sizeVariant ? sizeVariant.price : product.price;
<<<<<<< HEAD
    const itemImage = resolveImageUrl(product.images[0]);
=======
    const itemImage = product.images[0] || '/src/assets/images/aevy_oceanis_bottle_1786864368427.jpg';
>>>>>>> af95be52be9b46ae1ac7f36af859ae95e0d5ee08

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.productId === product.id && item.size === size);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          slug: product.slug,
          size,
          quantity,
          unitPrice,
          image: itemImage
        }
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.size === size)));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.productId === productId && item.size === size) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscount(0);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const applyPromoCode = async (code: string): Promise<boolean> => {
    if (!code.trim()) return false;
    setIsApplyingCoupon(true);
    setCouponError(null);
    try {
      const res = await validateCoupon(code, subtotal);
      setCouponCode(res.code);
      setDiscount(res.discount);
      localStorage.setItem(COUPON_STORAGE_KEY, res.code);
      return true;
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
      setDiscount(0);
      return false;
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removePromoCode = () => {
    setCouponCode('');
    setDiscount(0);
    setCouponError(null);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        totalItemsCount,
        subtotal,
        couponCode,
        discount,
        couponError,
        isApplyingCoupon,
        applyPromoCode,
        removePromoCode
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
