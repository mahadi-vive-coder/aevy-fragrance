import { Product, SiteSettings, Coupon, Order } from '../types.ts';

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_SETTINGS: SiteSettings = {
  brandName: 'AEVY',
  tagline: 'ESSENCE OF FRESH ELEGANCE',
  currency: 'BDT (৳)',
  deliveryInsideDhaka: 70,
  deliveryOutsideDhaka: 130,
  freeDeliveryThreshold: 4500,
  contactPhone: '01629927898',
  contactEmail: 'concierge@aevyfragrance.com',
  whatsappNumber: '',
  announcement: 'Complimentary delivery across Bangladesh on orders over ৳4,500 • Small-batch artisanal formulation',
  socialLinks: {
    instagram: 'https://instagram.com/aevy.fragrance',
    facebook: 'https://facebook.com/aevyfragrance',
    tiktok: '',
    pinterest: ''
  },
  storeActive: true,
  acceptOrders: true,
  maintenanceMode: false
};

export const INITIAL_COUPONS: Coupon[] = [];

export const INITIAL_ORDERS: Order[] = [];

