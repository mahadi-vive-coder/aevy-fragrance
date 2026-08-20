import { Product, Order, SiteSettings } from '../types.ts';
import { INITIAL_SETTINGS } from '../data/initialData.ts';
import {
  supabase,
  getSupabaseProducts,
  getSupabaseProductBySlug,
  createSupabaseOrder,
  getSupabaseOrderByIdentifier,
  validateSupabaseCoupon
} from './supabase.ts';

/**
 * Fetch active products directly from Supabase public.products table
 */
export async function fetchProducts(params?: {
  category?: string;
  family?: string;
  search?: string;
  status?: string;
}): Promise<Product[]> {
  try {
    const products = await getSupabaseProducts(false);
    let list = [...products];

    if (params?.category && params.category !== 'All') {
      const cat = String(params.category).toLowerCase();
      list = list.filter(p => p.category.toLowerCase().includes(cat) || p.fragranceFamily.toLowerCase() === cat);
    }
    if (params?.family && params.family !== 'All') {
      const fam = String(params.family).toLowerCase();
      list = list.filter(p =>
        p.fragranceFamily.toLowerCase() === fam ||
        (fam === 'unisex' && p.gender === 'Unisex')
      );
    }
    if (params?.search && String(params.search).trim()) {
      const q = String(params.search).toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    return list;
  } catch (err) {
    console.error('AEVY fetchProducts failed:', err);
    throw err;
  }
}

/**
 * Fetch a single product by slug directly from Supabase
 */
export async function fetchProductBySlug(slug: string): Promise<Product> {
  try {
    const product = await getSupabaseProductBySlug(slug);
    if (product) {
      return product;
    }
    throw new Error('Fragrance not found');
  } catch (err) {
    console.error('AEVY fetchProductBySlug failed:', err);
    throw err;
  }
}

/**
 * Fetch site settings for delivery rates & store details from Supabase or default config
 */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  const fallbackSettings: SiteSettings = {
    ...INITIAL_SETTINGS,
    brandName: 'AEVY',
    tagline: 'ESSENCE OF FRESH ELEGANCE',
    currency: '৳',
    contactPhone: '01629927898',
    contactEmail: 'concierge@aevyfragrance.com',
    whatsappNumber: '',
    deliveryInsideDhaka: 70,
    deliveryOutsideDhaka: 130,
    freeDeliveryThreshold: 2000,
    announcement: 'Complimentary shipping across Bangladesh on selections over ৳ 2,000.',
    storeActive: true,
    acceptOrders: true,
    maintenanceMode: false,
    socialLinks: {
      instagram: 'https://instagram.com/aevy.fragrance',
      facebook: 'https://facebook.com/aevyfragrance',
      tiktok: '',
      pinterest: ''
    }
  };

  try {
    const { data, error } = await supabase.from('settings').select('*').limit(1);
    if (!error && data && data.length > 0) {
      const row = data[0];
      return {
        ...fallbackSettings,
        ...(row.settings || row)
      };
    }
  } catch {
    // Non-blocking fallback to default configuration
  }

  return fallbackSettings;
}

/**
 * Validate promo coupon using existing Supabase validate_coupon RPC
 */
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<{ code: string; discount: number; description: string }> {
  return await validateSupabaseCoupon(code, subtotal);
}

/**
 * Create a new customer order directly in Supabase
 */
export async function createOrder(orderData: {
  customerName: string;
  phone: string;
  email?: string;
  district: string;
  thana: string;
  fullAddress: string;
  note?: string;
  items: { productId: string; productName: string; slug: string; size: string; quantity: number; unitPrice: number; image: string; bottleShape?: string }[];
  couponCode?: string;
  deliveryCharge?: number;
  discount?: number;
}): Promise<Order> {
  const isDhaka = orderData.district.toLowerCase().includes('dhaka');
  const deliveryCharge = typeof orderData.deliveryCharge === 'number' ? orderData.deliveryCharge : (isDhaka ? 70 : 130);
  const discount = Number(orderData.discount || 0);
  const subtotal = orderData.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = Math.max(0, subtotal + deliveryCharge - discount);

  return await createSupabaseOrder({
    customerName: orderData.customerName,
    phone: orderData.phone,
    email: orderData.email,
    district: orderData.district,
    thana: orderData.thana,
    fullAddress: orderData.fullAddress,
    note: orderData.note,
    items: orderData.items,
    couponCode: orderData.couponCode,
    deliveryCharge,
    discount,
    subtotal,
    total
  });
}

/**
 * Track an order by ID or order_number from Supabase
 */
export async function trackOrder(orderIdentifier: string, phone?: string): Promise<Order> {
  try {
    const cleanId = String(orderIdentifier || '').trim();
    if (!cleanId) {
      throw new Error('Please enter a valid order reference number.');
    }

    const order = await getSupabaseOrderByIdentifier(cleanId);
    if (!order) {
      throw new Error('Order not found with the provided reference ID.');
    }

    if (phone) {
      const cleanPhone = String(phone).replace(/\D/g, '');
      const orderPhone = String(order.phone || '').replace(/\D/g, '');
      if (cleanPhone && orderPhone && !orderPhone.includes(cleanPhone) && !cleanPhone.includes(orderPhone)) {
        throw new Error('Phone number does not match this order reference.');
      }
    }

    return order;
  } catch (err: any) {
    console.error('AEVY trackOrder failed:', err);
    throw err;
  }
}
