export type BottleShape = 'Round' | 'Square';

export interface ProductSize {
  size: string;
  price: number;
  sku: string;
  stock: number;
  inStock: boolean;
}

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface ProductDetails {
  concentration: string;
  sillage: string;
  longevity: string;
  season: string;
  occasion: string;
  applicationGuide: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  brandTagline: string;
  shortDescription: string;
  description: string;
  price: number;
  comparePrice?: number;
  size?: string;
  bottleShape: BottleShape;
  category: string;
  fragranceFamily: 'Fresh' | 'Woody' | 'Clean' | 'Unisex' | 'Floral' | 'Amber';
  gender: 'Unisex' | 'Men' | 'Women';
  sizes: ProductSize[];
  images: string[];
  notes: FragranceNotes;
  story: string;
  details: ProductDetails;
  sku?: string;
  stock: number;
  lowStockThreshold: number;
  status: 'active' | 'inactive' | 'out_of_stock' | 'draft';
  featured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  slug: string;
  size: string;
  bottleShape?: BottleShape;
  quantity: number;
  unitPrice: number;
  image: string;
}

export type OrderStatus = 'New' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  slug: string;
  size: string;
  bottleShape?: BottleShape;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  customerName: string;
  phone: string;
  email?: string;
  district: string;
  thana: string;
  fullAddress: string;
  note?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad';
  status: OrderStatus;
  internalNotes?: { text: string; date: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  currency: string;
  deliveryInsideDhaka: number;
  deliveryOutsideDhaka: number;
  freeDeliveryThreshold: number;
  contactPhone: string;
  contactEmail: string;
  announcement: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    tiktok: string;
    pinterest: string;
  };
  storeActive: boolean;
  acceptOrders: boolean;
  maintenanceMode: boolean;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderAmount?: number;
  isActive: boolean;
  expiresAt?: string;
}

export interface CustomerSummary {
  phone: string;
  name: string;
  email?: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  address: string;
  district: string;
  thana?: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  newOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  productsSold: number;
  lowStockCount: number;
  recentOrders: Order[];
}
