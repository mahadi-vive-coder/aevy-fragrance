import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Order, OrderItem } from '../types.ts';
import { resolveImageUrl, OCEANIS_BOTTLE_IMAGE } from './images.ts';

const SUPABASE_URL =
  ((import.meta as any)?.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  'https://ypixntqllgqjzcoyafix.supabase.co';

const SUPABASE_ANON_KEY =
  ((import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_RgtrxBhQTFhcoPX8roM0rg_ZZ0f_sNH';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false
  }
});

/**
 * Parses fragrance notes from string, array, or JSON
 */
export function parseNotes(notes: any): string[] {
  if (!notes) return [];
  if (Array.isArray(notes)) return notes.map(String).filter(Boolean);
  if (typeof notes === 'string') {
    try {
      const parsed = JSON.parse(notes);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      // Split by bullet, comma, slash, or pipe
      return notes
        .split(/[•,\/|]/)
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}

/**
 * Maps a row from public.products table to the application Product interface.
 */
export function mapSupabaseProduct(row: any): Product {
  const topNotes = parseNotes(row.top_notes);
  const heartNotes = parseNotes(row.heart_notes);
  const baseNotes = parseNotes(row.base_notes);

  const stock = typeof row.stock === 'number' ? row.stock : Number(row.stock ?? 0);
  const lowStockThreshold = Number(row.low_stock_threshold ?? 5);
  const price = Number(row.price ?? 0);
  const size = row.size || '30ml';
  const bottleShape = row.bottle_shape === 'Square' ? 'Square' : 'Round';
  
  const img = resolveImageUrl(row.image_url);

  const isActive = row.active !== false;
  let status: 'active' | 'inactive' | 'out_of_stock' | 'draft' = 'active';
  if (!isActive) {
    status = 'inactive';
  } else if (stock <= 0) {
    status = 'out_of_stock';
  }

  let family: Product['fragranceFamily'] = 'Fresh';
  const rawCat = (row.category || '').toLowerCase();
  if (rawCat.includes('woody')) family = 'Woody';
  else if (rawCat.includes('clean')) family = 'Clean';
  else if (rawCat.includes('floral')) family = 'Floral';
  else if (rawCat.includes('amber')) family = 'Amber';
  else if (rawCat.includes('unisex')) family = 'Unisex';

  const defaultNotesTop = topNotes.length ? topNotes : ['Bergamot', 'Fresh Citrus'];
  const defaultNotesHeart = heartNotes.length ? heartNotes : ['Lavender', 'White Musk'];
  const defaultNotesBase = baseNotes.length ? baseNotes : ['Amberwood', 'Cedarwood'];

  return {
    id: String(row.id),
    name: row.name || 'AEVY Fragrance',
    slug: row.slug || String(row.id),
    tagline: row.short_description || 'Essence of Fresh Elegance',
    brandTagline: 'Essence of Fresh Elegance',
    shortDescription: row.short_description || row.description || 'A modern artisanal fragrance.',
    description: row.description || row.short_description || 'Handcrafted in small batches with premium olfactive oils.',
    price: price,
    comparePrice: row.compare_price ? Number(row.compare_price) : undefined,
    size: size,
    bottleShape: bottleShape,
    category: row.category || 'Extrait de Parfum',
    fragranceFamily: family,
    gender: (row.gender === 'Men' || row.gender === 'Women' ? row.gender : 'Unisex') as any,
    sizes: [
      {
        size: size,
        price: price,
        sku: row.sku || `AEVY-${(row.slug || 'PRD').toUpperCase()}-${size}`,
        stock: stock,
        inStock: stock > 0
      }
    ],
    images: [img],
    notes: {
      top: defaultNotesTop,
      heart: defaultNotesHeart,
      base: defaultNotesBase
    },
    story: row.description || 'Formulated in Dhaka for those who appreciate quiet refinement over loud statements.',
    details: {
      concentration: row.category || 'Extrait de Parfum',
      sillage: 'Moderate & Sophisticated',
      longevity: '8 – 12 Hours on skin',
      season: 'All Seasons',
      occasion: 'Daily Signature & Quiet Evenings',
      applicationGuide: 'Apply 2-4 sprays to pulse points: neck, collarbones, and inner wrists.'
    },
    sku: row.sku || `AEVY-${(row.slug || 'PRD').toUpperCase()}-${size}`,
    stock: stock,
    lowStockThreshold: lowStockThreshold,
    status: status,
    featured: Boolean(row.featured),
    rating: 5.0,
    reviewCount: 12,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

/**
 * Fetch products from Supabase public.products
 */
export async function getSupabaseProducts(forAdmin: boolean = false): Promise<Product[]> {
  try {
    let query = supabase.from('products').select('*');
    if (!forAdmin) {
      query = query.eq('active', true);
    }
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error('AEVY products error:', error);
      throw error;
    }
    if (!data) return [];
    return data.map(mapSupabaseProduct);
  } catch (err) {
    console.error('AEVY products query exception:', err);
    throw err;
  }
}

/**
 * Fetch a single product from Supabase public.products by slug or ID
 */
export async function getSupabaseProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .single();

    if (error || !data) {
      if (error) console.error('AEVY product detail error:', error);
      return null;
    }
    return mapSupabaseProduct(data);
  } catch (err) {
    console.error('AEVY product detail query exception:', err);
    return null;
  }
}

/**
 * Generate permanent, sequential order reference number (e.g. 001, 002, 003, ..., 027, ..., 100)
 * Uses database sequence / RPC if configured, with resilient persistent high-water-mark tracking.
 */
/**
 * Generate the next order number based ONLY on currently existing orders.
 *
 * Examples:
 * - No orders exist -> 001
 * - 001, 002, 003 exist -> 004
 * - All orders deleted -> 001 again
 */
export async function getNextPermanentOrderNumber(): Promise<string> {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('order_number, order_id');

    if (error) {
      console.error('Failed to read existing order numbers:', error);
      throw error;
    }

    let maxOrderNumber = 0;

    if (orders && orders.length > 0) {
      for (const order of orders) {
        const rawNumber = order.order_number || order.order_id;

        if (!rawNumber) continue;

        const match = String(rawNumber).match(/\d+/g);

        if (match) {
          const number = parseInt(match[match.length - 1], 10);

          if (!isNaN(number) && number > maxOrderNumber) {
            maxOrderNumber = number;
          }
        }
      }
    }

    const nextNumber = maxOrderNumber + 1;

    return String(nextNumber).padStart(3, '0');
  } catch (error) {
    console.error('Error generating order number:', error);

    // If the orders table cannot be read,
    // do not silently continue with a wrong sequence.
    throw new Error('Unable to generate order number.');
  }
}

/**
 * Maps a row from public.orders to the application Order interface.
 */
export function mapSupabaseOrder(row: any, items: OrderItem[] = []): Order {
  const subtotal = Number(row.subtotal || 0);
  const deliveryCharge = Number(row.delivery_charge || 0);
  const discount = Number(row.discount || 0);
  const total = Number(row.total || (subtotal + deliveryCharge - discount));

  // Determine display order number (3-digit or formatted number)
  const rawNum = row.order_number || row.order_id || '001';
  let formattedNumber = String(rawNum);
  if (/^\d+$/.test(formattedNumber) && formattedNumber.length < 3) {
    formattedNumber = formattedNumber.padStart(3, '0');
  }

  return {
    id: String(row.id),
    orderNumber: formattedNumber,
    customerName: row.customer_name || 'Valued Patron',
    phone: row.customer_phone || row.phone || '',
    email: row.customer_email || row.email || undefined,
    district: row.district || 'Dhaka',
    thana: row.thana || row.thana_upazila || '',
    fullAddress: row.full_address || row.address || '',
    note: row.customer_note || row.note || undefined,
    items: items,
    subtotal: subtotal,
    deliveryCharge: deliveryCharge,
    discount: discount,
    couponCode: row.coupon_code || undefined,
    total: total,
    paymentMethod: 'Cash on Delivery',
    status: (row.status === 'NEW' ? 'New' : (row.status || 'New')) as any,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

/**
 * Create order in Supabase:
 * 1. public.orders (UUID generated automatically by database; order_number receives permanent short number)
 * 2. public.order_items (order_id references the generated orders.id UUID)
 * 3. public.customers (upsert if permitted)
 * 4. decrement stock in public.products
 */
export async function createSupabaseOrder(orderData: {
  customerName: string;
  phone: string;
  email?: string;
  district: string;
  thana: string;
  fullAddress: string;
  note?: string;
  items: { productId: string; productName: string; slug: string; size: string; quantity: number; unitPrice: number; image: string; bottleShape?: string }[];
  couponCode?: string;
  deliveryCharge: number;
  discount: number;
  subtotal: number;
  total: number;
}): Promise<Order> {
  const now = new Date();
  
  // 1. Get next permanent 3-digit order sequence number (e.g. "001", "002")
  const orderNumber = await getNextPermanentOrderNumber();

  // 2. Insert into public.orders WITHOUT specifying "id" (let database generate UUID)
  const orderPayload = {
    order_number: orderNumber,
    order_id: orderNumber,
    customer_name: orderData.customerName,
    customer_phone: orderData.phone,
    phone: orderData.phone,
    customer_email: orderData.email || null,
    email: orderData.email || null,
    district: orderData.district,
    thana: orderData.thana,
    thana_upazila: orderData.thana,
    address: orderData.fullAddress,
    full_address: orderData.fullAddress,
    note: orderData.note || null,
    customer_note: orderData.note || null,
    subtotal: orderData.subtotal,
    delivery_charge: orderData.deliveryCharge,
    discount: orderData.discount,
    coupon_code: orderData.couponCode || null,
    total: orderData.total,
    payment_method: 'COD',
    status: 'NEW',
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  };

  const { data: createdOrderRow, error: orderError } = await supabase
    .from('orders')
    .insert(orderPayload)
    .select('*')
    .single();

  if (orderError) {
    console.error('Supabase insert orders failed:', orderError);
    throw new Error(`Failed to place order in database: ${orderError.message}`);
  }

  const generatedDbUuid = createdOrderRow.id;
  const authoritativeOrderNumber = createdOrderRow.order_number || orderNumber;

  // 3. Insert into public.order_items using generated UUID as order_id
  const orderItemsToInsert = orderData.items.map(item => ({
    order_id: generatedDbUuid,
    product_id: item.productId,
    product_name: item.productName,
    size: item.size || '30ml',
    bottle_shape: item.bottleShape || 'Round',
    quantity: item.quantity,
    unit_price: item.unitPrice,
    subtotal: item.unitPrice * item.quantity,
    image_url: item.image
  }));

  try {
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.warn('Supabase order_items notice (non-blocking):', itemsError.message);
    }
  } catch (itemCatchErr) {
    console.warn('Supabase order_items catch notice:', itemCatchErr);
  }

  // 4. Update customer in public.customers
  try {
    const { data: existingCust } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', orderData.phone)
      .single();

    if (existingCust) {
      await supabase
        .from('customers')
        .update({
          name: orderData.customerName,
          email: orderData.email || existingCust.email,
          address: orderData.fullAddress,
          district: orderData.district,
          orders_count: (existingCust.orders_count || 0) + 1,
          total_spent: (existingCust.total_spent || 0) + orderData.total,
          last_order_date: now.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('phone', orderData.phone);
    } else {
      await supabase
        .from('customers')
        .insert({
          name: orderData.customerName,
          phone: orderData.phone,
          email: orderData.email || null,
          address: orderData.fullAddress,
          district: orderData.district,
          orders_count: 1,
          total_spent: orderData.total,
          last_order_date: now.toISOString(),
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        });
    }
  } catch (custErr) {
    console.warn('Customer upsert non-blocking notice:', custErr);
  }

  // 5. Decrement inventory on public.products
  for (const item of orderData.items) {
    try {
      const { data: prod } = await supabase
        .from('products')
        .select('id, stock')
        .eq('id', item.productId)
        .single();

      if (prod) {
        const newStock = Math.max(0, (prod.stock || 0) - item.quantity);
        await supabase
          .from('products')
          .update({
            stock: newStock,
            updated_at: now.toISOString()
          })
          .eq('id', item.productId);
      }
    } catch (stockErr) {
      console.warn('Stock decrement notice:', stockErr);
    }
  }

  // 6. Increment coupon usage in Supabase after successful order creation
  if (orderData.couponCode && String(orderData.couponCode).trim()) {
    try {
      const cleanCouponCode = String(orderData.couponCode).trim();
      const { data: incData, error: incError } = await supabase.rpc('increment_coupon_usage', {
        p_code: cleanCouponCode
      });
      if (incError) {
        console.warn('increment_coupon_usage notice:', incError.message);
      } else {
        console.log('increment_coupon_usage logged for order:', cleanCouponCode, incData);
      }
    } catch (couponCatchErr) {
      console.warn('increment_coupon_usage catch notice:', couponCatchErr);
    }
  }

  const mappedItems: OrderItem[] = orderData.items.map(i => ({
    productId: i.productId,
    productName: i.productName,
    slug: i.slug,
    size: i.size,
    bottleShape: (i.bottleShape === 'Square' ? 'Square' : 'Round'),
    quantity: i.quantity,
    unitPrice: i.unitPrice,
    subtotal: i.unitPrice * i.quantity,
    image: resolveImageUrl(i.image)
  }));

  return {
    id: generatedDbUuid,
    orderNumber: authoritativeOrderNumber,
    customerName: orderData.customerName,
    phone: orderData.phone,
    email: orderData.email,
    district: orderData.district,
    thana: orderData.thana,
    fullAddress: orderData.fullAddress,
    note: orderData.note,
    items: mappedItems,
    subtotal: orderData.subtotal,
    deliveryCharge: orderData.deliveryCharge,
    discount: orderData.discount,
    couponCode: orderData.couponCode,
    total: orderData.total,
    paymentMethod: 'Cash on Delivery',
    status: 'New',
    createdAt: createdOrderRow.created_at || now.toISOString(),
    updatedAt: createdOrderRow.updated_at || now.toISOString()
  };
}

/**
 * Validate a promotional coupon using existing Supabase validate_coupon RPC
 */
export async function validateSupabaseCoupon(code: string, subtotal: number): Promise<{
  code: string;
  discount: number;
  description: string;
  discountType?: string;
  discountValue?: number;
  minimumOrder?: number;
  maximumDiscount?: number | null;
}> {
  const cleanCode = String(code || '').trim();
  if (!cleanCode) {
    throw new Error('Please enter a coupon code.');
  }

  const { data, error } = await supabase.rpc('validate_coupon', {
    p_code: cleanCode,
    p_subtotal: Number(subtotal || 0)
  });

  if (error) {
    console.error('Supabase validate_coupon RPC error:', error);
    throw new Error(error.message || 'Unable to validate coupon.');
  }

  if (!data || data.valid === false) {
    throw new Error(data?.error || 'Invalid or expired coupon code.');
  }

  const discountAmount = Number(data.discount_amount ?? data.discount_value ?? 0);
  const discountType = data.discount_type || 'fixed';
  const discountValue = Number(data.discount_value || 0);

  let description = `${data.code || cleanCode.toUpperCase()}`;
  if (discountType === 'percentage') {
    description += ` (${discountValue}% OFF)`;
  } else {
    description += ` (৳${discountAmount} OFF)`;
  }

  return {
    code: data.code || cleanCode.toUpperCase(),
    discount: discountAmount,
    description,
    discountType,
    discountValue,
    minimumOrder: data.minimum_order ? Number(data.minimum_order) : undefined,
    maximumDiscount: data.maximum_discount ? Number(data.maximum_discount) : null
  };
}

/**
 * Fetch an order by order_number or UUID id
 */
export async function getSupabaseOrderByIdentifier(identifier: string): Promise<Order | null> {
  try {
    const cleanId = String(identifier || '').trim();
    if (!cleanId) return null;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
    
    let query = supabase.from('orders').select('*');
    if (isUuid) {
      query = query.eq('id', cleanId);
    } else {
      query = query.or(`order_number.eq.${cleanId},order_id.eq.${cleanId}`);
    }

    const { data: orderRow, error: orderError } = await query.single();
    if (orderError || !orderRow) {
      // Fallback search
      const { data: fallbackList } = await supabase
        .from('orders')
        .select('*')
        .or(`order_number.ilike.%${cleanId}%,order_id.ilike.%${cleanId}%`)
        .limit(1);

      if (!fallbackList || fallbackList.length === 0) return null;
      return mapSupabaseOrder(fallbackList[0], []);
    }

    // Fetch order items if exists
    let items: OrderItem[] = [];
    try {
      const { data: itemsRows } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderRow.id);

      if (itemsRows && itemsRows.length > 0) {
        items = itemsRows.map((r: any) => ({
          productId: r.product_id,
          productName: r.product_name || 'AEVY Fragrance',
          slug: (r.product_name || 'fragrance').toLowerCase().replace(/\s+/g, '-'),
          size: r.size || '30ml',
          bottleShape: r.bottle_shape || 'Round',
          quantity: Number(r.quantity || 1),
          unitPrice: Number(r.unit_price || 0),
          subtotal: Number(r.subtotal || (r.unit_price * r.quantity)),
          image: resolveImageUrl(r.image_url)
        }));
      }
    } catch {
      // Non-blocking
    }

    return mapSupabaseOrder(orderRow, items);
  } catch (err) {
    console.error('Error fetching order by identifier:', err);
    return null;
  }
}
