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
  ComboComponentSelection,
  CartItem
} from '../types';

export const DEFAULT_SETTINGS: DBSettings = {
  delivery_charge_inside_narayanganj: 70,
  delivery_charge_outside_narayanganj: 130,
  free_delivery_threshold: 2500,
  store_active: true,
  accept_orders: true,
  maintenance_mode: false,
};

// ==========================================
// 1. SETTINGS
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
      console.warn('Could not fetch settings from Supabase, using defaults:', error?.message);
      return DEFAULT_SETTINGS;
    }

    return {
      id: data.id,
      delivery_charge_inside_narayanganj: Number(data.delivery_charge_inside_narayanganj ?? 70),
      delivery_charge_outside_narayanganj: Number(data.delivery_charge_outside_narayanganj ?? 130),
      free_delivery_threshold: Number(data.free_delivery_threshold ?? 2500),
      store_active: Boolean(data.store_active ?? true),
      accept_orders: Boolean(data.accept_orders ?? true),
      maintenance_mode: Boolean(data.maintenance_mode ?? false),
    };
  } catch (err) {
    console.error('Error in fetchStoreSettings:', err);
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

  const normalizedDistrict = district.trim().toLowerCase();
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
  if (!supabase) {
    throw new Error('Supabase client is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  // Fetch active products
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('name', { ascending: true });

  if (productsError) {
    console.error('Error fetching products:', productsError);
    throw new Error(`Failed to load products: ${productsError.message}`);
  }

  if (!productsData || productsData.length === 0) {
    return [];
  }

  const productIds = productsData.map((p) => p.id);

  // Fetch active variants for these products
  // STRICT SIZE CONSTRAINT: ONLY '3ml', '10ml', '30ml'
  const { data: variantsData, error: variantsError } = await supabase
    .from('product_variants')
    .select('*')
    .in('product_id', productIds)
    .eq('is_active', true)
    .in('size', ['3ml', '10ml', '30ml'])
    .order('price', { ascending: true });

  if (variantsError) {
    console.error('Error fetching variants:', variantsError);
    throw new Error(`Failed to load product variants: ${variantsError.message}`);
  }

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

    if (p.image_url) {
      displayImages.push(p.image_url);
    }
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
      sku: p.sku,
      price: Number(p.price || defaultVariant?.price || 0),
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

export async function fetchProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();

  if (productError) {
    console.error('Error fetching product by slug:', productError);
    throw new Error(`Failed to load product: ${productError.message}`);
  }

  if (!product) {
    return null;
  }

  // Fetch active variants
  const { data: variantsData, error: variantsError } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', product.id)
    .eq('is_active', true)
    .in('size', ['3ml', '10ml', '30ml'])
    .order('price', { ascending: true });

  if (variantsError) {
    console.error('Error fetching variants for product:', variantsError);
    throw new Error(`Failed to load variants: ${variantsError.message}`);
  }

  const variants: DBProductVariant[] = (variantsData || []).map((v) => ({
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

  // If combo product, load combo slots and allowed variants
  let comboSlotsWithAllowed: (DBComboSlot & { allowedVariants: DBComboSlotAllowedVariant[] })[] = [];

  if (product.product_type === 'combo') {
    const { data: slots, error: slotsError } = await supabase
      .from('combo_slots')
      .select('*')
      .eq('combo_product_id', product.id)
      .order('slot_order', { ascending: true });

    if (slotsError) {
      console.error('Error fetching combo slots:', slotsError);
    } else if (slots && slots.length > 0) {
      const slotIds = slots.map((s) => s.id);

      const { data: allowedData, error: allowedError } = await supabase
        .from('combo_slot_allowed_variants')
        .select(`
          id,
          combo_slot_id,
          product_variant_id,
          created_at
        `)
        .in('combo_slot_id', slotIds);

      if (allowedError) {
        console.error('Error fetching combo slot allowed variants:', allowedError);
      }

      // Fetch variant details for allowed variants
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
          .filter((a) => a.variant && a.variant.stock > 0); // Only available in-stock variants

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
    sku: product.sku,
    price: Number(product.price || defaultVariant?.price || 0),
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

// ==========================================
// 3. ORDER TRACKING (PRODUCTION DATABASE)
// ==========================================

export async function trackOrder(
  orderNumber: string,
  customerPhone: string
): Promise<DBOrder | null> {
  const cleanOrderNumber = orderNumber.trim().toUpperCase();
  const cleanPhone = customerPhone.trim().replace(/[- ]/g, '');

  const supabase = getSupabase();
  if (!supabase) {
    return null;
  }

  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .ilike('order_number', cleanOrderNumber)
      .eq('customer_phone', cleanPhone)
      .maybeSingle();

    if (orderError || !order) {
      return null;
    }

    // Load order items from cloud
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    if (itemsError) {
      console.error('Error loading order items:', itemsError);
    }

    // If there are combo items, load their components
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

    const cloudOrder: DBOrder = {
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

    return cloudOrder;
  } catch (err) {
    console.error('Order lookup exception:', err);
    return null;
  }
}

// ==========================================
// 4. CHECKOUT & ORDER CREATION
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
  const supabase = getSupabase();
  if (!supabase) {
    return { success: false, error: 'Supabase database is not configured.' };
  }

  // Check store status
  const settings = await fetchStoreSettings();
  if (!settings.store_active || !settings.accept_orders || settings.maintenance_mode) {
    return {
      success: false,
      error: 'We are currently not accepting new orders. Please check back shortly.',
    };
  }

  if (!payload.items || payload.items.length === 0) {
    return { success: false, error: 'Your bag is empty.' };
  }

  // Separate single items and combo items to ensure raw database UUID validation
  const singleItems = payload.items.filter((i) => i.itemType !== 'combo');
  const comboItems = payload.items.filter((i) => i.itemType === 'combo');

  let authoritativeSubtotal = 0;
  const verifiedOrderItems: Array<{
    product_id: string;
    variant_id: string | null;
    product_name: string;
    size: string;
    sku: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
    item_type: 'single' | 'combo';
    bottle_shape: string | null;
    image_url: string | null;
    comboSelections?: ComboComponentSelection[];
  }> = [];

  // 1a. Authoritative Stock & Price Check for Single Items
  if (singleItems.length > 0) {
    const singleVariantIds = singleItems
      .map((i) => i.variantId)
      .filter((id): id is string => Boolean(id));

    if (singleVariantIds.length !== singleItems.length) {
      return { success: false, error: 'Please choose a size for each fragrance in your bag.' };
    }

    const { data: dbVariants, error: vErr } = await supabase
      .from('product_variants')
      .select('id, product_id, size, price, stock, is_active, sku, products(id, name, image_url, active)')
      .in('id', singleVariantIds);

    if (vErr || !dbVariants) {
      return {
        success: false,
        error: `Failed to verify product availability: ${vErr?.message || 'Database error'}`,
      };
    }

    const variantMap = new Map<string, any>();
    dbVariants.forEach((v) => variantMap.set(v.id, v));

    for (const item of singleItems) {
      if (!item.variantId) {
        return { success: false, error: `Please choose a size for "${item.productName}".` };
      }
      const dbVariant = variantMap.get(item.variantId);
      if (!dbVariant || !dbVariant.is_active || !dbVariant.products?.active) {
        return {
          success: false,
          error: `"${item.productName}" (${item.size}) is currently unavailable.`,
        };
      }

      if (dbVariant.stock < item.quantity) {
        return {
          success: false,
          error: `"${item.productName}" (${item.size}) has only ${dbVariant.stock} left in stock.`,
        };
      }

      const unitPrice = Number(dbVariant.price);
      const lineSubtotal = unitPrice * item.quantity;
      authoritativeSubtotal += lineSubtotal;

      verifiedOrderItems.push({
        product_id: dbVariant.product_id,
        variant_id: dbVariant.id,
        product_name: dbVariant.products?.name || item.productName,
        size: dbVariant.size,
        sku: dbVariant.sku || null,
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal: lineSubtotal,
        item_type: 'single',
        bottle_shape: item.bottleShape || null,
        image_url: dbVariant.products?.image_url || item.imageUrl || null,
      });
    }
  }

  // 1b. Authoritative Availability & Combo Slot Check for Combo Items
  if (comboItems.length > 0) {
    const comboProductIds = Array.from(new Set(comboItems.map((i) => i.productId)));
    const { data: dbComboProducts, error: cpErr } = await supabase
      .from('products')
      .select('id, name, active, product_type, combo_price, price, image_url, sku, combo_sku')
      .in('id', comboProductIds);

    if (cpErr || !dbComboProducts) {
      return {
        success: false,
        error: `Failed to verify combo availability: ${cpErr?.message || 'Database error'}`,
      };
    }

    const comboProductMap = new Map<string, any>();
    dbComboProducts.forEach((p) => comboProductMap.set(p.id, p));

    // Fetch combo slots for these combo products
    const { data: dbSlots, error: slotsErr } = await supabase
      .from('combo_slots')
      .select('id, combo_product_id, slot_title, required_quantity, slot_order')
      .in('combo_product_id', comboProductIds)
      .order('slot_order', { ascending: true });

    if (slotsErr || !dbSlots) {
      return {
        success: false,
        error: `Failed to verify combo configuration: ${slotsErr?.message || 'Database error'}`,
      };
    }

    // Fetch allowed variants for all these slots
    const slotIds = dbSlots.map((s) => s.id);
    const { data: allowedVariantsData, error: allowedErr } = await supabase
      .from('combo_slot_allowed_variants')
      .select('id, combo_slot_id, product_variant_id')
      .in('combo_slot_id', slotIds);

    if (allowedErr) {
      return {
        success: false,
        error: `Failed to verify combo slot options: ${allowedErr.message}`,
      };
    }

    const allowedSet = new Set<string>();
    (allowedVariantsData || []).forEach((a) => {
      allowedSet.add(`${a.combo_slot_id}:${a.product_variant_id}`);
    });

    // Gather all selected component variant UUIDs
    const allCompVariantIds: string[] = [];
    for (const item of comboItems) {
      if (!item.comboSelections || item.comboSelections.length === 0) {
        return { success: false, error: `Please configure fragrances for "${item.productName}".` };
      }
      for (const sel of item.comboSelections) {
        allCompVariantIds.push(sel.variantId);
      }
    }

    // Fetch component variants to check status and stock
    const { data: dbCompVariants, error: compVErr } = await supabase
      .from('product_variants')
      .select('id, product_id, size, price, stock, is_active, sku, products(id, name, active)')
      .in('id', allCompVariantIds);

    if (compVErr || !dbCompVariants) {
      return {
        success: false,
        error: `Failed to verify component availability: ${compVErr?.message || 'Database error'}`,
      };
    }

    const compVariantMap = new Map<string, any>();
    dbCompVariants.forEach((v) => compVariantMap.set(v.id, v));

    for (const item of comboItems) {
      const dbProduct = comboProductMap.get(item.productId);
      if (!dbProduct || !dbProduct.active || dbProduct.product_type !== 'combo') {
        return { success: false, error: `"${item.productName}" is currently unavailable.` };
      }

      const productSlots = dbSlots.filter((s) => s.combo_product_id === dbProduct.id);
      for (const slot of productSlots) {
        const sel = item.comboSelections?.find((s) => s.slotId === slot.id);
        if (!sel) {
          return {
            success: false,
            error: `Please select a fragrance for "${slot.slot_title}" in "${dbProduct.name}".`,
          };
        }

        // Verify variant is allowed in this slot
        if (!allowedSet.has(`${slot.id}:${sel.variantId}`)) {
          return {
            success: false,
            error: `Invalid fragrance selection for "${slot.slot_title}" in "${dbProduct.name}".`,
          };
        }

        // Verify component variant status & stock
        const compVariant = compVariantMap.get(sel.variantId);
        if (!compVariant || !compVariant.is_active || !compVariant.products?.active) {
          return {
            success: false,
            error: `Selected fragrance "${sel.productName}" for "${slot.slot_title}" is currently unavailable.`,
          };
        }

        if (compVariant.stock < item.quantity) {
          return {
            success: false,
            error: `Selected fragrance "${sel.productName}" has insufficient stock (${compVariant.stock} left).`,
          };
        }
      }

      const comboPrice = Number(dbProduct.combo_price ?? dbProduct.price ?? 0);
      const lineSubtotal = comboPrice * item.quantity;
      authoritativeSubtotal += lineSubtotal;

      verifiedOrderItems.push({
        product_id: dbProduct.id,
        variant_id: item.variantId || null,
        product_name: dbProduct.name,
        size: item.size || 'Curated Set',
        sku: dbProduct.combo_sku || dbProduct.sku || null,
        quantity: item.quantity,
        unit_price: comboPrice,
        subtotal: lineSubtotal,
        item_type: 'combo',
        bottle_shape: item.bottleShape || null,
        image_url: dbProduct.image_url || item.imageUrl || null,
        comboSelections: item.comboSelections,
      });
    }
  }

  // 2. Authoritative Delivery Calculation
  const deliveryCharge = calculateDeliveryFee(payload.district, authoritativeSubtotal, settings);
  const discount = 0;
  const total = authoritativeSubtotal + deliveryCharge - discount;

  // 3. Attempt Production Checkout RPC if available
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
      p_items: verifiedOrderItems.map((it) => ({
        product_id: it.product_id,
        variant_id: it.variant_id,
        quantity: it.quantity,
        components: (it.comboSelections || []).map((sel) => ({
          slot_id: sel.slotId,
          component_variant_id: sel.variantId,
        })),
      })),
    });

    if (!rpcError && rpcData) {
      return {
        success: true,
        orderNumber: rpcData.order_number || rpcData,
        orderId: rpcData.id || rpcData.order_id,
        total,
        subtotal: authoritativeSubtotal,
        deliveryCharge,
      };
    } else if (rpcError && rpcError.code !== 'PGRST202') {
      // RPC was present but returned a business logic validation error
      return {
        success: false,
        error: rpcError.message || 'Order creation failed in checkout RPC.',
      };
    }
  } catch {
    // Continue to standard insert attempt
  }

  // 4. Attempt Direct Order Insertion into Supabase
  const timestampPart = Date.now().toString().slice(-6);
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const orderNumber = `AEVY-${timestampPart}${randomSuffix}`;

  const { data: insertedOrder, error: orderInsertError } = await supabase
    .from('orders')
    .insert({
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
      subtotal: authoritativeSubtotal,
      coupon_code: null,
      discount: discount,
      total: total,
      customer_note: payload.customerNote?.trim() || null,
    })
    .select('id, order_number')
    .single();

  if (orderInsertError || !insertedOrder) {
    // If Supabase order creation fails:
    // - show the real error
    // - do not fake success
    // - do not create a fake order number
    // - do not save a fake order locally
    // - do not clear the cart
    const rlsHelp =
      orderInsertError?.code === '42501'
        ? 'Product/cart flow is fixed, but production order creation requires the checkout RPC/database function.'
        : (orderInsertError?.message || 'Failed to insert order into database.');

    return {
      success: false,
      error: rlsHelp,
    };
  }

  // 5. Insert Order Items into Supabase
  const itemsToInsert = verifiedOrderItems.map((item) => ({
    order_id: insertedOrder.id,
    product_id: item.product_id,
    variant_id: item.variant_id,
    product_name: item.product_name,
    size: item.size,
    sku: item.sku,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.subtotal,
    item_type: item.item_type,
    bottle_shape: item.bottle_shape,
    image_url: item.image_url,
  }));

  const { data: insertedItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToInsert)
    .select('id, item_type');

  if (itemsError) {
    return {
      success: false,
      error: `Order created (${insertedOrder.order_number}), but saving items failed: ${itemsError.message}`,
    };
  }

  // 6. Insert Order Item Components for Combos
  const componentsToInsert: any[] = [];
  if (insertedItems && insertedItems.length > 0) {
    insertedItems.forEach((dbItem, index) => {
      const sourceItem = verifiedOrderItems[index];
      if (sourceItem.item_type === 'combo' && sourceItem.comboSelections) {
        sourceItem.comboSelections.forEach((sel) => {
          componentsToInsert.push({
            order_item_id: dbItem.id,
            slot_id: sel.slotId,
            component_variant_id: sel.variantId,
          });
        });
      }
    });

    if (componentsToInsert.length > 0) {
      const { error: compInsertErr } = await supabase
        .from('order_item_components')
        .insert(componentsToInsert);
      if (compInsertErr) {
        console.error('Failed to insert order item components:', compInsertErr);
      }
    }
  }

  // 7. Upsert Customer Record Safely
  try {
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id, orders_count, total_spent')
      .eq('phone', payload.customerPhone.trim())
      .maybeSingle();

    if (existingCustomer) {
      await supabase
        .from('customers')
        .update({
          name: payload.customerName.trim(),
          email: payload.customerEmail?.trim() || undefined,
          district: payload.district.trim(),
          thana: payload.thanaUpazila.trim(),
          address: payload.fullAddress.trim(),
          orders_count: (existingCustomer.orders_count || 0) + 1,
          total_spent: (Number(existingCustomer.total_spent) || 0) + total,
          last_order_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingCustomer.id);
    } else {
      await supabase.from('customers').insert({
        name: payload.customerName.trim(),
        phone: payload.customerPhone.trim(),
        email: payload.customerEmail?.trim() || null,
        district: payload.district.trim(),
        thana: payload.thanaUpazila.trim(),
        address: payload.fullAddress.trim(),
        orders_count: 1,
        total_spent: total,
        last_order_date: new Date().toISOString(),
      });
    }
  } catch (custErr) {
    console.warn('Customer upsert notice:', custErr);
  }

  return {
    success: true,
    orderNumber: insertedOrder.order_number,
    orderId: insertedOrder.id,
    total,
    subtotal: authoritativeSubtotal,
    deliveryCharge,
  };
}
