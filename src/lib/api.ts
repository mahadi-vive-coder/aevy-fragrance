import { Product, Order, SiteSettings } from '../types.ts';
import {
  supabase,
  getSupabaseProducts,
  getSupabaseProductBySlug,
  createSupabaseOrder
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
 * Fetch site settings for delivery rates & store details
 */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  const fallbackSettings: SiteSettings = {
    brandName: 'AEVY',
    tagline: 'ESSENCE OF FRESH ELEGANCE',
    contactPhone: '+880 1700-000000',
    contactEmail: 'concierge@aevyfragrance.com',
    whatsappNumber: '01700000000',
    deliveryInsideDhaka: 70,
    deliveryOutsideDhaka: 130,
    freeDeliveryThreshold: 2000,
    socialLinks: {
      instagram: 'https://instagram.com/aevyfragrance',
      facebook: 'https://facebook.com/aevyfragrance',
      tiktok: 'https://tiktok.com/@aevyfragrance',
    }
  };

  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data?.settings) return data.settings;
    }
  } catch {
    // Non-blocking fallback to default configuration
  }
  return fallbackSettings;
}

/**
 * Validate promo coupon
 */
export async function validateCoupon(code: string, subtotal: number): Promise<{ code: string; discount: number; description: string }> {
  const res = await fetch('/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, subtotal })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Invalid promotional code');
  return data.coupon;
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
 * Track an order by ID & phone from Supabase
 */
export async function trackOrder(orderId: string, phone?: string): Promise<Order> {
  try {
    const cleanId = orderId.trim();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', cleanId)
      .single();

    if (error || !data) {
      throw new Error('Order not found with the provided reference ID.');
    }

    if (phone) {
      const cleanPhone = String(phone).replace(/\D/g, '');
      const orderPhone = (data.phone || '').replace(/\D/g, '');
      if (cleanPhone && orderPhone && !orderPhone.includes(cleanPhone) && !cleanPhone.includes(orderPhone)) {
        throw new Error('Phone number does not match this order reference.');
      }
    }

    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', cleanId);

    return {
      id: data.id,
      customerName: data.customer_name,
      phone: data.phone,
      email: data.email,
      district: data.district,
      thana: data.thana,
      fullAddress: data.full_address,
      note: data.note,
      items: (items || []).map((i: any) => ({
        productId: i.product_id,
        productName: i.product_name,
        slug: i.product_name?.toLowerCase().replace(/\s+/g, '-') || 'fragrance',
        size: i.size || '30ml',
        bottleShape: i.bottle_shape || 'Round',
        quantity: Number(i.quantity || 1),
        unitPrice: Number(i.unit_price || 0),
        subtotal: Number(i.subtotal || 0),
        image: i.image_url
      })),
      subtotal: Number(data.subtotal || 0),
      deliveryCharge: Number(data.delivery_charge || 0),
      discount: Number(data.discount || 0),
      couponCode: data.coupon_code,
      total: Number(data.total || 0),
      paymentMethod: data.payment_method || 'Cash on Delivery',
      status: data.status || 'New',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (err: any) {
    console.error('AEVY trackOrder failed:', err);
    throw err;
  }
}
