import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Order } from '../types.ts';

/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL =
  ((import.meta as any)?.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  'https://ypixntqllgqjzcoyafix.supabase.co';

const SUPABASE_ANON_KEY =
  ((import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_RgtrxBhQTFhcoPX8roM0rg_ZZ0f_sNH';

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);

/* =========================================================
   PARSE NOTES
========================================================= */

export function parseNotes(notes: any): string[] {
  if (!notes) return [];

  if (Array.isArray(notes)) {
    return notes
      .map(String)
      .filter(Boolean);
  }

  if (typeof notes === 'string') {
    try {
      const parsed = JSON.parse(notes);

      if (Array.isArray(parsed)) {
        return parsed
          .map(String)
          .filter(Boolean);
      }
    } catch {
      return notes
        .split(/[•,\/|]/)
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
  }

  return [];
}

/* =========================================================
   MAP SUPABASE PRODUCT
========================================================= */

export function mapSupabaseProduct(row: any): Product {
  const topNotes = parseNotes(row.top_notes);
  const heartNotes = parseNotes(row.heart_notes);
  const baseNotes = parseNotes(row.base_notes);

  const stock =
    typeof row.stock === 'number'
      ? row.stock
      : Number(row.stock ?? 0);

  const lowStockThreshold =
    Number(row.low_stock_threshold ?? 5);

  const price =
    Number(row.price ?? 0);

  const size =
    row.size || '30ml';

  const bottleShape =
    row.bottle_shape === 'Square'
      ? 'Square'
      : 'Round';

  const defaultPlaceholder =
    '/src/assets/images/aevy_oceanis_bottle_1786864368427.jpg';

  const img =
    typeof row.image_url === 'string' &&
    row.image_url.trim()
      ? row.image_url.trim()
      : defaultPlaceholder;

  const isActive =
    row.active !== false;

  let status:
    | 'active'
    | 'inactive'
    | 'out_of_stock'
    | 'draft' = 'active';

  if (!isActive) {
    status = 'inactive';
  } else if (stock <= 0) {
    status = 'out_of_stock';
  }

  /* =======================================================
     FRAGRANCE FAMILY
  ======================================================= */

  let family: Product['fragranceFamily'] = 'Fresh';

  const rawCat =
    String(row.category || '').toLowerCase();

  if (rawCat.includes('woody')) {
    family = 'Woody';
  } else if (rawCat.includes('clean')) {
    family = 'Clean';
  } else if (rawCat.includes('floral')) {
    family = 'Floral';
  } else if (rawCat.includes('amber')) {
    family = 'Amber';
  } else if (rawCat.includes('unisex')) {
    family = 'Unisex';
  }

  const defaultNotesTop =
    topNotes.length
      ? topNotes
      : ['Bergamot', 'Fresh Citrus'];

  const defaultNotesHeart =
    heartNotes.length
      ? heartNotes
      : ['Lavender', 'White Musk'];

  const defaultNotesBase =
    baseNotes.length
      ? baseNotes
      : ['Amberwood', 'Cedarwood'];

  /* =======================================================
     RETURN PRODUCT
  ======================================================= */

  return {
    id: String(row.id),

    name:
      row.name ||
      'AEVY Fragrance',

    slug:
      row.slug ||
      String(row.id),

    tagline:
      row.short_description ||
      'Essence of Fresh Elegance',

    brandTagline:
      'Essence of Fresh Elegance',

    shortDescription:
      row.short_description ||
      row.description ||
      'A modern artisanal fragrance.',

    description:
      row.description ||
      row.short_description ||
      'Handcrafted in small batches with premium olfactive oils.',

    price,

    comparePrice:
      row.compare_price
        ? Number(row.compare_price)
        : undefined,

    size,

    bottleShape,

    category:
      row.category ||
      'Extrait de Parfum',

    fragranceFamily:
      family,

    gender:
      row.gender === 'Men' ||
      row.gender === 'Women'
        ? row.gender
        : 'Unisex',

    sizes: [
      {
        size,

        price,

        sku:
          row.sku ||
          `AEVY-${(
            row.slug || 'PRD'
          ).toUpperCase()}-${size}`,

        stock,

        inStock:
          stock > 0
      }
    ],

    images: [
      img
    ],

    notes: {
      top:
        defaultNotesTop,

      heart:
        defaultNotesHeart,

      base:
        defaultNotesBase
    },

    story:
      row.description ||
      'Formulated in Dhaka for those who appreciate quiet refinement over loud statements.',

    details: {
      concentration:
        row.category ||
        'Extrait de Parfum',

      sillage:
        'Moderate & Sophisticated',

      longevity:
        '8 – 12 Hours on skin',

      season:
        'All Seasons',

      occasion:
        'Daily Signature & Quiet Evenings',

      applicationGuide:
        'Apply 2-4 sprays to pulse points: neck, collarbones, and inner wrists.'
    },

    sku:
      row.sku ||
      `AEVY-${(
        row.slug || 'PRD'
      ).toUpperCase()}-${size}`,

    stock,

    lowStockThreshold,

    status,

    featured:
      Boolean(row.featured),

    rating:
      5.0,

    reviewCount:
      12,

    createdAt:
      row.created_at ||
      new Date().toISOString(),

    updatedAt:
      row.updated_at ||
      new Date().toISOString()
  };
}

/* =========================================================
   GET ALL PRODUCTS
========================================================= */

export async function getSupabaseProducts(
  forAdmin: boolean = false
): Promise<Product[]> {

  try {

    let query =
      supabase
        .from('products')
        .select('*');

    if (!forAdmin) {
      query =
        query.eq(
          'active',
          true
        );
    }

    query =
      query.order(
        'created_at',
        {
          ascending: false
        }
      );

    const {
      data,
      error
    } = await query;

    console.log(
      'AEVY products:',
      data
    );

    if (error) {

      console.error(
        'AEVY products error:',
        error
      );

      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(
      mapSupabaseProduct
    );

  } catch (err) {

    console.error(
      'AEVY products query exception:',
      err
    );

    throw err;
  }
}

/* =========================================================
   GET SINGLE PRODUCT BY SLUG
========================================================= */

export async function getSupabaseProductBySlug(
  slug: string
): Promise<Product | null> {

  try {

    const {
      data,
      error
    } = await supabase
      .from('products')
      .select('*')
      .or(
        `slug.eq.${slug},id.eq.${slug}`
      )
      .single();

    if (
      error ||
      !data
    ) {

      if (error) {

        console.error(
          'AEVY product detail error:',
          error
        );

      }

      return null;
    }

    return mapSupabaseProduct(
      data
    );

  } catch (err) {

    console.error(
      'AEVY product detail query exception:',
      err
    );

    return null;
  }
}

/* =========================================================
   CREATE ORDER
========================================================= */

export async function createSupabaseOrder(
  orderData: {
    customerName: string;
    phone: string;
    email?: string;

    district: string;
    thana: string;
    fullAddress: string;

    note?: string;

    items: {
      productId: string;
      productName: string;
      slug: string;
      size: string;
      quantity: number;
      unitPrice: number;
      image: string;
      bottleShape?: string;
    }[];

    couponCode?: string;

    deliveryCharge: number;
    discount: number;
    subtotal: number;
    total: number;
  }
): Promise<Order> {

  /* =======================================================
     BASIC VALIDATION
  ======================================================= */

  const customerName =
    String(
      orderData.customerName || ''
    ).trim();

  const phone =
    String(
      orderData.phone || ''
    ).trim();

  const email =
    String(
      orderData.email || ''
    ).trim();

  const district =
    String(
      orderData.district || ''
    ).trim();

  const thana =
    String(
      orderData.thana || ''
    ).trim();

  const fullAddress =
    String(
      orderData.fullAddress || ''
    ).trim();

  if (!customerName) {
    throw new Error(
      'Customer name is required.'
    );
  }

  if (!phone) {
    throw new Error(
      'Customer phone number is required.'
    );
  }

  if (!district) {
    throw new Error(
      'District is required.'
    );
  }

  if (!fullAddress) {
    throw new Error(
      'Full address is required.'
    );
  }

  if (
    !orderData.items ||
    orderData.items.length === 0
  ) {
    throw new Error(
      'Your cart is empty.'
    );
  }

  const now =
    new Date();

  /* =======================================================
     HUMAN-READABLE ORDER NUMBER
     
     Example:
     AEVY-20260817-6633
     
     This is NOT the database UUID.
  ======================================================= */

  const dateStr =
    now
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');

  const randomSuffix =
    Math.floor(
      1000 +
      Math.random() * 9000
    );

  const orderNumber =
    `AEVY-${dateStr}-${randomSuffix}`;

  console.log(
    'AEVY ORDER:',
    orderNumber
  );

  /* =======================================================
     1. CREATE ORDER
     
     VERY IMPORTANT:
     
     DO NOT send:
     
     id: orderNumber
     
     Supabase generates orders.id UUID automatically.
  ======================================================= */

  const orderPayload: any = {

    order_number:
      orderNumber,

    customer_name:
      customerName,

    customer_phone:
      phone,

    customer_email:
      email || null,

    district:
      district,

    thana:
      thana,

    full_address:
      fullAddress,

    customer_note:
      orderData.note
        ? String(
            orderData.note
          ).trim()
        : null,

    subtotal:
      Number(
        orderData.subtotal
      ) || 0,

    delivery_charge:
      Number(
        orderData.deliveryCharge
      ) || 0,

    total:
      Number(
        orderData.total
      ) || 0,

    payment_method:
      'COD',

    status:
      'NEW',

    created_at:
      now.toISOString(),

    updated_at:
      now.toISOString()
  };

  /*
   * Only confirmed columns are sent here.
   *
   * We intentionally DO NOT send:
   *
   * phone
   * email
   * note
   * discount
   * coupon_code
   *
   * because these previously caused schema errors.
   */

  console.log(
    'AEVY order payload:',
    orderPayload
  );

  /* =======================================================
     INSERT ORDER
  ======================================================= */

  const {
    data: createdOrder,
    error: orderError
  } = await supabase
    .from('orders')
    .insert(
      orderPayload
    )
    .select(
      'id, order_number'
    )
    .single();

  if (
    orderError ||
    !createdOrder ||
    !createdOrder.id
  ) {

    console.error(
      'AEVY order insert failed:',
      orderError
    );

    throw new Error(
      `Failed to place order in database: ${
        orderError?.message ||
        'Order could not be created.'
      }`
    );
  }

  /* =======================================================
     REAL DATABASE UUID
  ======================================================= */

  const orderUuid =
    createdOrder.id;

  console.log(
    'AEVY database UUID:',
    orderUuid
  );

  console.log(
    'AEVY order number:',
    orderNumber
  );

  /* =======================================================
     2. ORDER ITEMS
     
     order_items.order_id MUST receive UUID.
  ======================================================= */

  const orderItemsToInsert =
    orderData.items.map(
      item => {

        const quantity =
          Number(
            item.quantity
          ) || 1;

        const unitPrice =
          Number(
            item.unitPrice
          ) || 0;

        return {

          order_id:
            orderUuid,

          product_id:
            item.productId,

          product_name:
            item.productName,

          size:
            item.size ||
            '30ml',

          bottle_shape:
            item.bottleShape ===
            'Square'
              ? 'Square'
              : 'Round',

          quantity,

          unit_price:
            unitPrice,

          subtotal:
            unitPrice *
            quantity,

          image_url:
            item.image ||
            null
        };
      }
    );

  const {
    error: itemsError
  } = await supabase
    .from('order_items')
    .insert(
      orderItemsToInsert
    );

  if (itemsError) {

    console.error(
      'AEVY order_items insert failed:',
      itemsError
    );

    /*
     * Do not hide this error.
     */

    throw new Error(
      `Failed to save order items: ${
        itemsError.message
      }`
    );
  }

  console.log(
    'AEVY ORDER ITEMS SAVED'
  );

  /* =======================================================
     3. CUSTOMER
     
     Non-blocking.
     
     If customer RLS/schema prevents this,
     the order still remains successful.
  ======================================================= */

  try {

    const {
      data: existingCustomer,
      error: customerLookupError
    } = await supabase
      .from('customers')
      .select('*')
      .eq(
        'phone',
        phone
      )
      .maybeSingle();

    if (
      customerLookupError
    ) {

      console.warn(
        'Customer lookup notice:',
        customerLookupError.message
      );

    } else if (
      existingCustomer
    ) {

      const previousOrders =
        Number(
          existingCustomer.total_orders ||
          0
        );

      const previousSpent =
        Number(
          existingCustomer.total_spent ||
          0
        );

      const {
        error:
          customerUpdateError
      } = await supabase
        .from('customers')
        .update({

          name:
            customerName,

          email:
            email ||
            existingCustomer.email ||
            null,

          address:
            fullAddress,

          district:
            district,

          thana:
            thana,

          total_orders:
            previousOrders +
            1,

          total_spent:
            previousSpent +
            Number(
              orderData.total ||
              0
            ),

          last_order_date:
            now.toISOString(),

          updated_at:
            now.toISOString()

        })
        .eq(
          'id',
          existingCustomer.id
        );

      if (
        customerUpdateError
      ) {

        console.warn(
          'Customer update notice:',
          customerUpdateError.message
        );
      }

    } else {

      const {
        error:
          customerInsertError
      } = await supabase
        .from('customers')
        .insert({

          name:
            customerName,

          phone:
            phone,

          email:
            email ||
            null,

          address:
            fullAddress,

          district:
            district,

          thana:
            thana,

          total_orders:
            1,

          total_spent:
            Number(
              orderData.total ||
              0
            ),

          last_order_date:
            now.toISOString(),

          created_at:
            now.toISOString(),

          updated_at:
            now.toISOString()
        });

      if (
        customerInsertError
      ) {

        console.warn(
          'Customer insert notice:',
          customerInsertError.message
        );
      }
    }

  } catch (
    customerError
  ) {

    console.warn(
      'Customer save notice:',
      customerError
    );
  }

  /* =======================================================
     4. STOCK UPDATE
     
     Non-blocking.
  ======================================================= */

  for (
    const item of orderData.items
  ) {

    try {

      const {
        data: product,
        error:
          productError
      } = await supabase
        .from('products')
        .select(
          'id, stock'
        )
        .eq(
          'id',
          item.productId
        )
        .single();

      if (
        productError
      ) {

        console.warn(
          'Stock lookup notice:',
          productError.message
        );

        continue;
      }

      if (!product) {
        continue;
      }

      const currentStock =
        Number(
          product.stock ||
          0
        );

      const quantity =
        Number(
          item.quantity ||
          0
        );

      const newStock =
        Math.max(
          0,
          currentStock -
          quantity
        );

      const {
        error:
          stockUpdateError
      } = await supabase
        .from('products')
        .update({

          stock:
            newStock,

          updated_at:
            now.toISOString()

        })
        .eq(
          'id',
          item.productId
        );

      if (
        stockUpdateError
      ) {

        console.warn(
          'Stock update notice:',
          stockUpdateError.message
        );
      }

    } catch (
      stockError
    ) {

      console.warn(
        'Stock decrement notice:',
        stockError
      );
    }
  }

  /* =======================================================
     5. RETURN APPLICATION ORDER
  ======================================================= */

  const resultOrder =
    {

      id:
        orderUuid,

      customerName:
        customerName,

      phone:
        phone,

      email:
        email ||
        undefined,

      district:
        district,

      thana:
        thana,

      fullAddress:
        fullAddress,

      note:
        orderData.note,

      items:
        orderData.items.map(
          item => ({

            productId:
              item.productId,

            productName:
              item.productName,

            slug:
              item.slug,

            size:
              item.size,

            bottleShape:
              item.bottleShape ===
              'Square'
                ? 'Square'
                : 'Round',

            quantity:
              Number(
                item.quantity
              ) || 1,

            unitPrice:
              Number(
                item.unitPrice
              ) || 0,

            subtotal:
              (
                Number(
                  item.unitPrice
                ) || 0
              ) *
              (
                Number(
                  item.quantity
                ) || 1
              ),

            image:
              item.image
          })
        ),

      subtotal:
        Number(
          orderData.subtotal
        ) || 0,

      deliveryCharge:
        Number(
          orderData.deliveryCharge
        ) || 0,

      discount:
        Number(
          orderData.discount
        ) || 0,

      couponCode:
        orderData.couponCode,

      total:
        Number(
          orderData.total
        ) || 0,

      paymentMethod:
        'Cash on Delivery',

      status:
        'New',

      internalNotes: [
        {
          text:
            `Order ${orderNumber} placed via online store checkout.`,

          date:
            now.toISOString()
        }
      ],

      createdAt:
        now.toISOString(),

      updatedAt:
        now.toISOString()
    } as Order;

  console.log(
    '===================================='
  );

  console.log(
    'AEVY ORDER COMPLETE:',
    resultOrder
  );

  console.log(
    '===================================='
  );

  return resultOrder;
}