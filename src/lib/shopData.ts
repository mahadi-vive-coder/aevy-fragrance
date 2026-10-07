import { getSupabase } from './supabase';
import {
  DBProduct,
  DBProductVariant,
  DBComboSlot,
  DBComboSlotAllowedVariant,
  DBSettings,
  DBOrder,
  DBOrderItem,
  DBOrderItemComponent,
  ProductWithVariants,
  CartItem
} from '../types';
import {
  MOCK_SETTINGS,
  MOCK_PRODUCTS,
  getStoredOrders,
  saveStoredOrder
} from './mockData';

export const DEFAULT_SETTINGS: DBSettings = MOCK_SETTINGS;

// ==========================================
// 1. SETTINGS (public.settings)
// ==========================================
export async function fetchStoreSettings(): Promise<DBSettings> {
  const supabase = getSupabase();
  if (!supabase) {
    return DEFAULT_SETTINGS;
  }

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_SETTINGS;
    }

    return {
      id: data.id,
      delivery_charge_inside_narayanganj: Number(data.delivery_charge_inside_narayanganj ?? 70),
      delivery_charge_outside_narayanganj: Number(data.delivery_charge_outside_narayanganj ?? 130),
      free_delivery_threshold: Number(data.free_delivery_threshold ?? 4500),
      store_active: Boolean(data.store_active ?? true),
      accept_orders: Boolean(data.accept_orders ?? true),
      maintenance_mode: Boolean(data.maintenance_mode ?? false),
    };
  } catch (err) {
    console.warn('[AEVY] Error in fetchStoreSettings, using fallback settings:', err);
    return DEFAULT_SETTINGS;
  }
}

// Helper to calculate delivery fee dynamically from customer district & subtotal
export function calculateDeliveryFee(
  district: string,
  subtotal: number,
  settings: DBSettings
): number {
  if (settings.free_delivery_threshold > 0 && subtotal >= settings.free_delivery_threshold) {
    return 0;
  }

  const normalizedDistrict = (district || '').trim().toLowerCase();
  if (normalizedDistrict === 'narayanganj') {
    return settings.delivery_charge_inside_narayanganj;
  }

  return settings.delivery_charge_outside_narayanganj;
}

// ==========================================
// 2. PRODUCTS & VARIANTS
// ==========================================

export async function fetchActiveProducts(): Promise<ProductWithVariants[]> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('featured', { ascending: false })
        .order('name', { ascending: true });

      if (!productsError && productsData && productsData.length > 0) {
        const productIds = productsData.map((p) => p.id);

        const { data: variantsData, error: variantsError } = await supabase
          .from('product_variants')
          .select('*')
          .in('product_id', productIds)
          .eq('is_active', true)
          .order('price', { ascending: true });

        if (!variantsError) {
          const variantsByProduct: Record<string, DBProductVariant[]> = {};
          (variantsData || []).forEach((v) => {
            if (!variantsByProduct[v.product_id]) {
              variantsByProduct[v.product_id] = [];
            }
            variantsByProduct[v.product_id].push({
              id: v.id,
              product_id: v.product_id,
              size: v.size,
              price: Number(v.price),
              compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : null,
              stock: Number(v.stock ?? 0),
              sku: v.sku,
              is_active: Boolean(v.is_active),
              is_default: Boolean(v.is_default),
              created_at: v.created_at,
              updated_at: v.updated_at,
            });
          });

          return productsData.map((p: any) => {
            const variants = variantsByProduct[p.id] || [];
            const defaultVariant = variants.find((v) => v.is_default) || variants[0];
            const displayImages: string[] = [];

            if (p.image_url) displayImages.push(p.image_url);
            if (Array.isArray(p.images) && p.images.length > 0) {
              p.images.forEach((img: string) => {
                if (img && !displayImages.includes(img)) {
                  displayImages.push(img);
                }
              });
            }

            return {
              id: p.id,
              name: p.name,
              slug: p.slug,
              product_type: p.product_type || 'single',
              combo_type: p.combo_type,
              description: p.description,
              category: p.category,
              gender: p.gender,
              notes: p.notes,
              top_notes: p.top_notes,
              heart_notes: p.heart_notes,
              base_notes: p.base_notes,
              longevity: p.longevity,
              perfect_for: p.perfect_for || p.perfectFor,
              scent_descriptor: p.scent_descriptor,
              sku: p.sku,
              combo_sku: p.combo_sku,
              price: Number(p.price || defaultVariant?.price || 0),
              base_price: p.base_price ? Number(p.base_price) : undefined,
              combo_price: p.combo_price ? Number(p.combo_price) : null,
              combo_compare_at_price: p.combo_compare_at_price ? Number(p.combo_compare_at_price) : null,
              size: p.size,
              low_stock_threshold: p.low_stock_threshold,
              featured: Boolean(p.featured),
              active: Boolean(p.active),
              image_url: p.image_url || displayImages[0] || '',
              images: displayImages.length > 0 ? displayImages : (p.image_url ? [p.image_url] : []),
              created_at: p.created_at,
              updated_at: p.updated_at,
              variants,
              defaultVariant,
            };
          });
        }
      }
    } catch (err) {
      console.warn('[AEVY] Supabase query failed, falling back to mock catalog:', err);
    }
  }

  // Graceful fallback to rich built-in fragrance catalog
  return MOCK_PRODUCTS;
}

export async function fetchProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  const supabase = getSupabase();
  const normalizedSlug = (slug || '').trim().toLowerCase();

  if (supabase) {
    try {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .maybeSingle();

      if (!productError && product) {
        const { data: variantsData, error: variantsError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', product.id)
          .eq('is_active', true)
          .order('price', { ascending: true });

        if (!variantsError && variantsData) {
          const variants: DBProductVariant[] = variantsData.map((v) => ({
            id: v.id,
            product_id: v.product_id,
            size: v.size,
            price: Number(v.price),
            compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : null,
            stock: Number(v.stock ?? 0),
            sku: v.sku,
            is_active: Boolean(v.is_active),
            is_default: Boolean(v.is_default),
            created_at: v.created_at,
            updated_at: v.updated_at,
          }));

          const defaultVariant = variants.find((v) => v.is_default) || variants[0];

          let comboSlotsWithAllowed: (DBComboSlot & { allowedVariants: DBComboSlotAllowedVariant[] })[] = [];

          if (product.product_type === 'combo') {
            const { data: slots } = await supabase
              .from('combo_slots')
              .select('*')
              .eq('combo_product_id', product.id)
              .order('slot_order', { ascending: true });

            if (slots && slots.length > 0) {
              const slotIds = slots.map((s) => s.id);
              const { data: allowedData } = await supabase
                .from('combo_slot_allowed_variants')
                .select('*')
                .in('combo_slot_id', slotIds);

              const allowedVariantIds = (allowedData || []).map((a) => a.product_variant_id);
              let allowedVariantsDetailsMap: Record<string, { variant: DBProductVariant; product: DBProduct }> = {};

              if (allowedVariantIds.length > 0) {
                const { data: avData } = await supabase
                  .from('product_variants')
                  .select('*, products(*)')
                  .in('id', allowedVariantIds)
                  .eq('is_active', true);

                if (avData) {
                  avData.forEach((row: any) => {
                    if (row.products && row.products.active) {
                      allowedVariantsDetailsMap[row.id] = {
                        variant: {
                          id: row.id,
                          product_id: row.product_id,
                          size: row.size,
                          price: Number(row.price),
                          compare_at_price: row.compare_at_price ? Number(row.compare_at_price) : null,
                          stock: Number(row.stock ?? 0),
                          sku: row.sku,
                          is_active: Boolean(row.is_active),
                          is_default: Boolean(row.is_default),
                        },
                        product: row.products,
                      };
                    }
                  });
                }
              }

              comboSlotsWithAllowed = slots.map((slot) => {
                const matchingAllowed = (allowedData || [])
                  .filter((a) => a.combo_slot_id === slot.id)
                  .map((a) => ({
                    id: a.id,
                    combo_slot_id: a.combo_slot_id,
                    product_variant_id: a.product_variant_id,
                    created_at: a.created_at,
                    variant: allowedVariantsDetailsMap[a.product_variant_id]?.variant,
                    product: allowedVariantsDetailsMap[a.product_variant_id]?.product,
                  }))
                  .filter((a) => a.variant && a.product);

                return {
                  id: slot.id,
                  combo_product_id: slot.combo_product_id,
                  slot_title: slot.slot_title,
                  required_quantity: Number(slot.required_quantity ?? 1),
                  slot_order: Number(slot.slot_order ?? 0),
                  created_at: slot.created_at,
                  allowedVariants: matchingAllowed,
                };
              });
            }
          }

          const displayImages: string[] = [];
          if (product.image_url) displayImages.push(product.image_url);
          if (Array.isArray(product.images) && product.images.length > 0) {
            product.images.forEach((img: string) => {
              if (img && !displayImages.includes(img)) {
                displayImages.push(img);
              }
            });
          }

          return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            product_type: product.product_type || 'single',
            combo_type: product.combo_type,
            description: product.description,
            category: product.category,
            gender: product.gender,
            notes: product.notes,
            top_notes: product.top_notes,
            heart_notes: product.heart_notes,
            base_notes: product.base_notes,
            longevity: product.longevity,
            perfect_for: product.perfect_for || product.perfectFor,
            scent_descriptor: product.scent_descriptor,
            sku: product.sku,
            combo_sku: product.combo_sku,
            price: Number(product.price || defaultVariant?.price || 0),
            base_price: product.base_price ? Number(product.base_price) : undefined,
            combo_price: product.combo_price ? Number(product.combo_price) : null,
            combo_compare_at_price: product.combo_compare_at_price ? Number(product.combo_compare_at_price) : null,
            size: product.size,
            low_stock_threshold: product.low_stock_threshold,
            featured: Boolean(product.featured),
            active: Boolean(product.active),
            image_url: product.image_url || displayImages[0] || '',
            images: displayImages.length > 0 ? displayImages : (product.image_url ? [product.image_url] : []),
            created_at: product.created_at,
            updated_at: product.updated_at,
            variants,
            defaultVariant,
            comboSlots: comboSlotsWithAllowed,
          };
        }
      }
    } catch (err) {
      console.warn('[AEVY] Supabase product lookup failed, falling back to mock catalog:', err);
    }
  }

  // Fallback to mock catalog
  const found = MOCK_PRODUCTS.find((p) => p.slug.toLowerCase() === normalizedSlug);
  return found || MOCK_PRODUCTS[0] || null;
}

// ==========================================
// 3. ORDER TRACKING
// ==========================================

export async function trackOrder(
  orderNumber: string,
  customerPhone: string
): Promise<DBOrder | null> {
  const cleanOrderNumber = (orderNumber || '').trim().toUpperCase();
  const cleanPhone = (customerPhone || '').trim().replace(/[- ]/g, '');

  if (!cleanOrderNumber || !cleanPhone) {
    return null;
  }

  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .ilike('order_number', cleanOrderNumber)
        .eq('customer_phone', cleanPhone)
        .maybeSingle();

      if (!orderError && order) {
        const { data: items } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        const itemIds = (items || []).map((it) => it.id);
        let componentsByItem: Record<string, DBOrderItemComponent[]> = {};

        if (itemIds.length > 0) {
          const { data: components } = await supabase
            .from('order_item_components')
            .select('*')
            .in('order_item_id', itemIds);

          if (components) {
            components.forEach((c) => {
              if (!componentsByItem[c.order_item_id]) {
                componentsByItem[c.order_item_id] = [];
              }
              componentsByItem[c.order_item_id].push(c);
            });
          }
        }

        const formattedItems: DBOrderItem[] = (items || []).map((it) => ({
          id: it.id,
          order_id: it.order_id,
          product_id: it.product_id,
          variant_id: it.variant_id,
          product_name: it.product_name,
          size: it.size,
          sku: it.sku,
          quantity: Number(it.quantity),
          unit_price: Number(it.unit_price),
          subtotal: Number(it.subtotal),
          item_type: it.item_type || 'single',
          bottle_shape: it.bottle_shape,
          image_url: it.image_url,
          created_at: it.created_at,
          components: componentsByItem[it.id] || [],
        }));

        return {
          id: order.id,
          order_number: order.order_number,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          customer_email: order.customer_email,
          district: order.district,
          thana_upazila: order.thana_upazila,
          full_address: order.full_address,
          status: order.status,
          payment_method: order.payment_method,
          delivery_charge: Number(order.delivery_charge ?? 0),
          subtotal: Number(order.subtotal ?? 0),
          coupon_code: order.coupon_code,
          discount: Number(order.discount ?? 0),
          total: Number(order.total ?? 0),
          customer_note: order.customer_note,
          created_at: order.created_at,
          updated_at: order.updated_at,
          items: formattedItems,
        };
      }
    } catch (err) {
      console.warn('[AEVY] Supabase order tracking exception, checking stored orders:', err);
    }
  }

  // Fallback to local stored orders
  const storedOrders = getStoredOrders();
  const match = storedOrders.find(
    (o) =>
      o.order_number.toUpperCase() === cleanOrderNumber &&
      o.customer_phone.replace(/[- ]/g, '') === cleanPhone
  );

  return match || null;
}

// ==========================================
// 4. CHECKOUT
// ==========================================

export interface CheckoutPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  district: string;
  thanaUpazila: string;
  fullAddress: string;
  paymentMethod: string;
  customerNote?: string;
  couponCode?: string | null;
  items: CartItem[];
}

export interface CheckoutResult {
  success: boolean;
  orderNumber?: string;
  orderId?: string;
  error?: string;
  total?: number;
  subtotal?: number;
  deliveryCharge?: number;
}

export async function createOrder(payload: CheckoutPayload): Promise<CheckoutResult> {
  if (!payload.items || payload.items.length === 0) {
    return { success: false, error: 'Your bag is empty.' };
  }

  const settings = await fetchStoreSettings();
  if (!settings.store_active || !settings.accept_orders || settings.maintenance_mode) {
    return {
      success: false,
      error: 'We are currently not accepting new orders. Please check back shortly.',
    };
  }

  const supabase = getSupabase();

  if (supabase) {
    const rpcItems = payload.items.map((item) => {
      if (item.itemType === 'combo') {
        return {
          product_id: item.productId,
          variant_id: null,
          quantity: item.quantity,
          components: (item.comboSelections || []).map((sel) => ({
            slot_id: sel.slotId,
            component_variant_id: sel.variantId,
          })),
        };
      } else {
        return {
          product_id: item.productId,
          variant_id: item.variantId || null,
          quantity: item.quantity,
          components: [],
        };
      }
    });

    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('create_checkout_order', {
        p_customer_name: payload.customerName.trim(),
        p_customer_phone: payload.customerPhone.trim(),
        p_customer_email: payload.customerEmail?.trim() || null,
        p_district: payload.district.trim(),
        p_thana_upazila: payload.thanaUpazila.trim(),
        p_full_address: payload.fullAddress.trim(),
        p_payment_method: 'COD',
        p_customer_note: payload.customerNote?.trim() || null,
        p_coupon_code: payload.couponCode?.trim() || null,
        p_items: rpcItems,
      });

      if (!rpcError && rpcData) {
        const orderNumber = typeof rpcData === 'string'
          ? rpcData
          : (rpcData.order_number || rpcData.orderNumber || rpcData.order_id || rpcData.id || String(rpcData));
        const orderId = typeof rpcData === 'object' && rpcData !== null
          ? (rpcData.order_id || rpcData.id || orderNumber)
          : orderNumber;
        const total = typeof rpcData === 'object' && rpcData !== null && rpcData.total !== undefined
          ? Number(rpcData.total)
          : undefined;
        const subtotal = typeof rpcData === 'object' && rpcData !== null && rpcData.subtotal !== undefined
          ? Number(rpcData.subtotal)
          : undefined;
        const deliveryCharge = typeof rpcData === 'object' && rpcData !== null && rpcData.delivery_charge !== undefined
          ? Number(rpcData.delivery_charge)
          : undefined;

        return {
          success: true,
          orderNumber,
          orderId,
          total,
          subtotal,
          deliveryCharge,
        };
      }
      console.warn('[AEVY] Supabase checkout RPC returned error, using local fallback:', rpcError);
    } catch (err: any) {
      console.warn('[AEVY] Supabase checkout RPC exception, using local fallback:', err);
    }
  }

  // Local in-memory/localStorage order creation fallback
  const subtotal = payload.items.reduce((s, item) => s + (item.price || 0) * item.quantity, 0);
  const deliveryCharge = calculateDeliveryFee(payload.district, subtotal, settings);
  const discount = payload.couponCode?.trim().toUpperCase() === 'AEVY10' ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal + deliveryCharge - discount);

  const orderNumSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `AEVY-${orderNumSuffix}`;
  const orderId = `ord-${Date.now()}`;

  const orderItems: DBOrderItem[] = payload.items.map((item, idx) => ({
    id: `item-${orderId}-${idx}`,
    order_id: orderId,
    product_id: item.productId,
    variant_id: item.variantId || null,
    product_name: item.productName,
    size: item.size || '30ml',
    sku: item.sku || null,
    quantity: item.quantity,
    unit_price: item.price,
    subtotal: item.price * item.quantity,
    item_type: item.itemType,
    bottle_shape: item.bottleShape || null,
    image_url: item.imageUrl || null,
    created_at: new Date().toISOString(),
  }));

  const newOrder: DBOrder = {
    id: orderId,
    order_number: orderNumber,
    customer_name: payload.customerName.trim(),
    customer_phone: payload.customerPhone.trim(),
    customer_email: payload.customerEmail?.trim() || null,
    district: payload.district.trim(),
    thana_upazila: payload.thanaUpazila.trim(),
    full_address: payload.fullAddress.trim(),
    status: 'New',
    payment_method: 'COD',
    delivery_charge: deliveryCharge,
    subtotal,
    coupon_code: payload.couponCode?.trim() || null,
    discount,
    total,
    customer_note: payload.customerNote?.trim() || null,
    created_at: new Date().toISOString(),
    items: orderItems,
  };

  saveStoredOrder(newOrder);

  return {
    success: true,
    orderNumber,
    orderId,
    total,
    subtotal,
    deliveryCharge,
  };
}
