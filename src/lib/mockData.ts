import {
  DBProduct,
  DBProductVariant,
  DBComboSlot,
  DBComboSlotAllowedVariant,
  ProductWithVariants,
  DBOrder,
  DBOrderItem,
  DBSettings,
} from '../types';

export const MOCK_SETTINGS: DBSettings = {
  delivery_charge_inside_narayanganj: 70,
  delivery_charge_outside_narayanganj: 130,
  free_delivery_threshold: 4500,
  store_active: true,
  accept_orders: true,
  maintenance_mode: false,
};

// Helper to build variants
function createVariants(
  productId: string,
  skuPrefix: string,
  base30Price: number
): DBProductVariant[] {
  const p3 = Math.round(base30Price * 0.22 / 10) * 10;
  const p10 = Math.round(base30Price * 0.48 / 10) * 10;
  const p15 = Math.round(base30Price * 0.65 / 10) * 10;
  const p30 = base30Price;
  const p50 = Math.round(base30Price * 1.48 / 10) * 10;

  return [
    {
      id: `${productId}-var-3ml`,
      product_id: productId,
      size: '3ml',
      price: p3,
      compare_at_price: Math.round(p3 * 1.15),
      stock: 45,
      sku: `${skuPrefix}-03ML`,
      is_active: true,
      is_default: false,
    },
    {
      id: `${productId}-var-10ml`,
      product_id: productId,
      size: '10ml',
      price: p10,
      compare_at_price: Math.round(p10 * 1.15),
      stock: 35,
      sku: `${skuPrefix}-10ML`,
      is_active: true,
      is_default: false,
    },
    {
      id: `${productId}-var-15ml`,
      product_id: productId,
      size: '15ml',
      price: p15,
      compare_at_price: Math.round(p15 * 1.15),
      stock: 28,
      sku: `${skuPrefix}-15ML`,
      is_active: true,
      is_default: false,
    },
    {
      id: `${productId}-var-30ml`,
      product_id: productId,
      size: '30ml',
      price: p30,
      compare_at_price: Math.round(p30 * 1.18),
      stock: 50,
      sku: `${skuPrefix}-30ML`,
      is_active: true,
      is_default: true,
    },
    {
      id: `${productId}-var-50ml`,
      product_id: productId,
      size: '50ml',
      price: p50,
      compare_at_price: Math.round(p50 * 1.18),
      stock: 20,
      sku: `${skuPrefix}-50ML`,
      is_active: true,
      is_default: false,
    },
  ];
}

// 1. Oceanis
const oceanisVariants = createVariants('prod-oceanis', 'AEVY-OCS', 1650);
const oceanisProduct: ProductWithVariants = {
  id: 'prod-oceanis',
  name: 'Oceanis',
  slug: 'oceanis',
  product_type: 'single',
  category: 'Aquatic / Fresh',
  gender: 'unisex',
  scent_descriptor: 'Crisp Sea Salt & Driftwood',
  description:
    'A pristine ode to marine air and salt-misted coastal cliffs. Oceanis opens with chilled Calabrian bergamot and crystalline sea salt, flowing seamlessly into herbal blue sage before drying down onto sun-bleached coastal amberwood.',
  top_notes: 'Calabrian Bergamot, Crisp Sea Salt, Coastal Ozone',
  heart_notes: 'French Blue Sage, Bitter Neroli, Marine Accords',
  base_notes: 'Sunlit Amberwood, Virginian Cedar, Clean White Musk',
  notes: {
    top: ['Calabrian Bergamot', 'Crisp Sea Salt', 'Coastal Ozone'],
    heart: ['French Blue Sage', 'Bitter Neroli', 'Marine Accords'],
    base: ['Sunlit Amberwood', 'Virginian Cedar', 'Clean White Musk'],
  },
  longevity: '10–12 Hours (Extrait de Parfum)',
  perfect_for: 'Everyday Signature, Warm Afternoons, Seaside Escapes',
  sku: 'AEVY-OCS-30ML',
  price: 1650,
  base_price: 1650,
  size: '30ml',
  featured: true,
  active: true,
  image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80',
  images: [
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80',
    '/images/aevy-formulation.jpg',
    '/images/logo_n.jpg',
  ],
  variants: oceanisVariants,
  defaultVariant: oceanisVariants.find((v) => v.size === '30ml') || oceanisVariants[0],
};

// 2. Aura Blanche
const auraVariants = createVariants('prod-aura', 'AEVY-AUR', 1750);
const auraProduct: ProductWithVariants = {
  id: 'prod-aura',
  name: 'Aura Blanche',
  slug: 'aura-blanche',
  product_type: 'single',
  category: 'Floral / Fresh',
  gender: 'feminine',
  scent_descriptor: 'Calabrian Mandarin & White Tea',
  description:
    'An ethereal veil of white tea, sparkling citrus, and silken Florentine iris. Aura Blanche exudes effortless purity with an intimate sillage that whispers refinement.',
  top_notes: 'Calabrian Mandarin, White Peach, Morning Dew',
  heart_notes: 'Imperial White Tea, Florentine Iris, Rosewater',
  base_notes: 'Cashmere Musk, White Cedarwood, Tonka Bean',
  notes: {
    top: ['Calabrian Mandarin', 'White Peach', 'Morning Dew'],
    heart: ['Imperial White Tea', 'Florentine Iris', 'Rosewater'],
    base: ['Cashmere Musk', 'White Cedarwood', 'Tonka Bean'],
  },
  longevity: '8–10 Hours (Extrait de Parfum)',
  perfect_for: 'Office & Daytime Wear, Minimalist Elegance, Spring Mornings',
  sku: 'AEVY-AUR-30ML',
  price: 1750,
  base_price: 1750,
  size: '30ml',
  featured: true,
  active: true,
  image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80',
  images: [
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80',
    '/images/aevy-formulation.jpg',
  ],
  variants: auraVariants,
  defaultVariant: auraVariants.find((v) => v.size === '30ml') || auraVariants[0],
};

// 3. Noir Santal
const noirVariants = createVariants('prod-noir', 'AEVY-NOS', 1850);
const noirProduct: ProductWithVariants = {
  id: 'prod-noir',
  name: 'Noir Santal',
  slug: 'noir-santal',
  product_type: 'single',
  category: 'Woody / Warm',
  gender: 'masculine',
  scent_descriptor: 'Australian Sandalwood & Smoked Cedar',
  description:
    'A quietly magnetic profile of buttery Australian sandalwood paired with cardamom and dry papyrus. A modern classic for those drawn to understated depth and warmth.',
  top_notes: 'Guatemalan Cardamom, Violet Leaf, Egyptian Papyrus',
  heart_notes: 'Australian Sandalwood, Orris Butter, Supple Suede',
  base_notes: 'Atlas Cedarwood, Golden Amber, Smoked Oak',
  notes: {
    top: ['Guatemalan Cardamom', 'Violet Leaf', 'Egyptian Papyrus'],
    heart: ['Australian Sandalwood', 'Orris Butter', 'Supple Suede'],
    base: ['Atlas Cedarwood', 'Golden Amber', 'Smoked Oak'],
  },
  longevity: '12–14 Hours (Extrait de Parfum)',
  perfect_for: 'Evening Soirées, Crisp Autumn, Signature Evening Presence',
  sku: 'AEVY-NOS-30ML',
  price: 1850,
  base_price: 1850,
  size: '30ml',
  featured: true,
  active: true,
  image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80',
  images: [
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80',
    '/images/aevy-formulation.jpg',
  ],
  variants: noirVariants,
  defaultVariant: noirVariants.find((v) => v.size === '30ml') || noirVariants[0],
};

// 4. Velvet Oud
const velvetVariants = createVariants('prod-velvet', 'AEVY-VEL', 1950);
const velvetProduct: ProductWithVariants = {
  id: 'prod-velvet',
  name: 'Velvet Oud',
  slug: 'velvet-oud',
  product_type: 'single',
  category: 'Oriental / Amber',
  gender: 'unisex',
  scent_descriptor: 'Silken Cambodian Oud & Damask Rose',
  description:
    'A harmonious reinvention of traditional oriental accords. Natural Cambodian oud softened with velvety Damask rose, warm saffron, and Madagascar bourbon vanilla.',
  top_notes: 'Kashmiri Saffron, Pink Peppercorn, Turkish Rose Petals',
  heart_notes: 'Damask Rose Absolute, Frankincense, Silken Oud Accord',
  base_notes: 'Cambodian Agarwood, Bourbon Vanilla Bean, Dark Labdanum',
  notes: {
    top: ['Kashmiri Saffron', 'Pink Peppercorn', 'Turkish Rose Petals'],
    heart: ['Damask Rose Absolute', 'Frankincense', 'Silken Oud Accord'],
    base: ['Cambodian Agarwood', 'Bourbon Vanilla Bean', 'Dark Labdanum'],
  },
  longevity: '14–16 Hours (Extrait de Parfum)',
  perfect_for: 'Formal Occasions, Winter Nights, Special Celebrations',
  sku: 'AEVY-VEL-30ML',
  price: 1950,
  base_price: 1950,
  size: '30ml',
  featured: true,
  active: true,
  image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80',
  images: [
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80',
    '/images/aevy-formulation.jpg',
  ],
  variants: velvetVariants,
  defaultVariant: velvetVariants.find((v) => v.size === '30ml') || velvetVariants[0],
};

// 5. Soleil D'Or
const soleilVariants = createVariants('prod-soleil', 'AEVY-SOL', 1650);
const soleilProduct: ProductWithVariants = {
  id: 'prod-soleil',
  name: "Soleil D'Or",
  slug: 'soleil-dor',
  product_type: 'single',
  category: 'Citrus / Bright',
  gender: 'unisex',
  scent_descriptor: 'Italian Neroli & Golden Amber',
  description:
    'Like sunlight caught in glass. Italian orange blossoms kissed by sea breeze and grounded in glowing solar amber. Uplifting, sparkling, and vibrant.',
  top_notes: 'Italian Neroli, Petitgrain, Lemon Verbena',
  heart_notes: 'Orange Blossom, Jasmine Sambac, Wild Thyme',
  base_notes: 'Golden Amber Accord, Sun-bleached Driftwood, White Musk',
  notes: {
    top: ['Italian Neroli', 'Petitgrain', 'Lemon Verbena'],
    heart: ['Orange Blossom', 'Jasmine Sambac', 'Wild Thyme'],
    base: ['Golden Amber Accord', 'Sun-bleached Driftwood', 'White Musk'],
  },
  longevity: '8–10 Hours (Extrait de Parfum)',
  perfect_for: 'Sunny Days, Leisure Weekends, Energizing Mornings',
  sku: 'AEVY-SOL-30ML',
  price: 1650,
  base_price: 1650,
  size: '30ml',
  featured: false,
  active: true,
  image_url: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=900&q=80',
  images: [
    'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=900&q=80',
  ],
  variants: soleilVariants,
  defaultVariant: soleilVariants.find((v) => v.size === '30ml') || soleilVariants[0],
};

// 6. Verdant Vetiver
const vetiverVariants = createVariants('prod-vetiver', 'AEVY-VER', 1750);
const vetiverProduct: ProductWithVariants = {
  id: 'prod-vetiver',
  name: 'Verdant Vetiver',
  slug: 'verdant-vetiver',
  product_type: 'single',
  category: 'Woody / Earthy',
  gender: 'unisex',
  scent_descriptor: 'Haitian Vetiver & Grapefruit Rind',
  description:
    'A sophisticated contrast of tart pink grapefruit peel and damp Haitian vetiver roots. Fresh, earthy, intellectual, and effortlessly clean.',
  top_notes: 'Sparkling Grapefruit Rind, Crushed Pink Peppercorn, Fresh Mint',
  heart_notes: 'Haitian Vetiver, Tart Rhubarb, French Geranium',
  base_notes: 'Smoky Oakmoss, Vetiver Roots, Iso E Super',
  notes: {
    top: ['Sparkling Grapefruit Rind', 'Crushed Pink Peppercorn', 'Fresh Mint'],
    heart: ['Haitian Vetiver', 'Tart Rhubarb', 'French Geranium'],
    base: ['Smoky Oakmoss', 'Vetiver Roots', 'Iso E Super'],
  },
  longevity: '10–12 Hours (Extrait de Parfum)',
  perfect_for: 'Creative Studios, Rainy Days, Modern Professional Elegance',
  sku: 'AEVY-VER-30ML',
  price: 1750,
  base_price: 1750,
  size: '30ml',
  featured: false,
  active: true,
  image_url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80',
  images: [
    'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80',
  ],
  variants: vetiverVariants,
  defaultVariant: vetiverVariants.find((v) => v.size === '30ml') || vetiverVariants[0],
};

// 7. Curated Duo Set (Combo)
const comboSingleList = [oceanisProduct, auraProduct, noirProduct, velvetProduct];

const duoSlotAllowed: DBComboSlotAllowedVariant[] = comboSingleList.map((prod) => {
  const v15 = prod.variants.find((v) => v.size === '15ml') || prod.variants[0];
  return {
    id: `duo-allowed-${prod.id}`,
    combo_slot_id: 'slot-duo-1',
    product_variant_id: v15.id,
    variant: v15,
    product: prod,
  };
});

const duoComboSlots: (DBComboSlot & { allowedVariants: DBComboSlotAllowedVariant[] })[] = [
  {
    id: 'slot-duo-1',
    combo_product_id: 'prod-curated-duo',
    slot_title: 'First Fragrance (15ml)',
    required_quantity: 1,
    slot_order: 1,
    allowedVariants: duoSlotAllowed,
  },
  {
    id: 'slot-duo-2',
    combo_product_id: 'prod-curated-duo',
    slot_title: 'Second Fragrance (15ml)',
    required_quantity: 1,
    slot_order: 2,
    allowedVariants: duoSlotAllowed,
  },
];

const duoVariants: DBProductVariant[] = [
  {
    id: 'var-duo-set',
    product_id: 'prod-curated-duo',
    size: '15ml',
    price: 1950,
    compare_at_price: 2300,
    stock: 25,
    sku: 'AEVY-SET-DUO',
    is_active: true,
    is_default: true,
  },
];

const curatedDuoProduct: ProductWithVariants = {
  id: 'prod-curated-duo',
  name: 'Curated Duo Set',
  slug: 'curated-duo-set',
  product_type: 'combo',
  combo_type: 'duo',
  category: 'Discovery Sets',
  gender: 'unisex',
  scent_descriptor: 'Two 15ml Travel Editions',
  description:
    'Select any two signature scents in our portable 15ml travel editions. Housed together in an artisanal debossed gift box for personal exploration or gifting.',
  sku: 'AEVY-SET-DUO',
  combo_sku: 'AEVY-SET-DUO',
  price: 1950,
  combo_price: 1950,
  combo_compare_at_price: 2300,
  size: '2 x 15ml',
  featured: true,
  active: true,
  image_url: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=900&q=80',
  images: [
    'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=900&q=80',
    '/images/aevy-formulation.jpg',
  ],
  variants: duoVariants,
  defaultVariant: duoVariants[0],
  comboSlots: duoComboSlots,
};

// 8. Discovery Trio Box (Combo)
const trioSlotAllowed: DBComboSlotAllowedVariant[] = comboSingleList.map((prod) => {
  const v10 = prod.variants.find((v) => v.size === '10ml') || prod.variants[0];
  return {
    id: `trio-allowed-${prod.id}`,
    combo_slot_id: 'slot-trio-1',
    product_variant_id: v10.id,
    variant: v10,
    product: prod,
  };
});

const trioComboSlots: (DBComboSlot & { allowedVariants: DBComboSlotAllowedVariant[] })[] = [
  {
    id: 'slot-trio-1',
    combo_product_id: 'prod-discovery-trio',
    slot_title: 'Fragrance 1 (10ml)',
    required_quantity: 1,
    slot_order: 1,
    allowedVariants: trioSlotAllowed,
  },
  {
    id: 'slot-trio-2',
    combo_product_id: 'prod-discovery-trio',
    slot_title: 'Fragrance 2 (10ml)',
    required_quantity: 1,
    slot_order: 2,
    allowedVariants: trioSlotAllowed,
  },
  {
    id: 'slot-trio-3',
    combo_product_id: 'prod-discovery-trio',
    slot_title: 'Fragrance 3 (10ml)',
    required_quantity: 1,
    slot_order: 3,
    allowedVariants: trioSlotAllowed,
  },
];

const trioVariants: DBProductVariant[] = [
  {
    id: 'var-trio-set',
    product_id: 'prod-discovery-trio',
    size: '10ml',
    price: 2150,
    compare_at_price: 2550,
    stock: 30,
    sku: 'AEVY-SET-TRIO',
    is_active: true,
    is_default: true,
  },
];

const discoveryTrioProduct: ProductWithVariants = {
  id: 'prod-discovery-trio',
  name: 'Discovery Trio Box',
  slug: 'discovery-trio-box',
  product_type: 'combo',
  combo_type: 'trio',
  category: 'Discovery Sets',
  gender: 'unisex',
  scent_descriptor: 'Three 10ml Discovery Atomizers',
  description:
    'The complete olfactory journey. Select three distinct fragrances in 10ml travel atomizers to experience the multifaceted spectrum of AEVY.',
  sku: 'AEVY-SET-TRIO',
  combo_sku: 'AEVY-SET-TRIO',
  price: 2150,
  combo_price: 2150,
  combo_compare_at_price: 2550,
  size: '3 x 10ml',
  featured: true,
  active: true,
  image_url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=900&q=80',
  images: [
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=900&q=80',
    '/images/aevy-formulation.jpg',
  ],
  variants: trioVariants,
  defaultVariant: trioVariants[0],
  comboSlots: trioComboSlots,
};

export const MOCK_PRODUCTS: ProductWithVariants[] = [
  oceanisProduct,
  auraProduct,
  noirProduct,
  velvetProduct,
  soleilProduct,
  vetiverProduct,
  curatedDuoProduct,
  discoveryTrioProduct,
];

// Sample initial orders so order tracking works out of the box
export const SAMPLE_ORDERS: DBOrder[] = [
  {
    id: 'ord-seed-1',
    order_number: 'AEVY-2401',
    customer_name: 'Tanvir Ahmed',
    customer_phone: '01711000000',
    customer_email: 'tanvir.ahmed@example.com',
    district: 'Dhaka',
    thana_upazila: 'Gulshan',
    full_address: 'House 14, Road 11, Block D, Gulshan-1',
    status: 'Shipped',
    payment_method: 'COD',
    delivery_charge: 130,
    subtotal: 1650,
    discount: 0,
    total: 1780,
    customer_note: 'Please call before delivery.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      {
        id: 'ord-item-1',
        order_id: 'ord-seed-1',
        product_id: 'prod-oceanis',
        variant_id: 'prod-oceanis-var-30ml',
        product_name: 'Oceanis',
        size: '30ml',
        sku: 'AEVY-OCS-30ML',
        quantity: 1,
        unit_price: 1650,
        subtotal: 1650,
        item_type: 'single',
        image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
  },
  {
    id: 'ord-seed-2',
    order_number: 'AEVY-1082',
    customer_name: 'Sabrina Chowdhury',
    customer_phone: '01819000000',
    customer_email: 'sabrina.c@example.com',
    district: 'Narayanganj',
    thana_upazila: 'Narayanganj Sadar',
    full_address: 'Chashara, BBS Road',
    status: 'Delivered',
    payment_method: 'COD',
    delivery_charge: 70,
    subtotal: 1950,
    discount: 0,
    total: 2020,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    items: [
      {
        id: 'ord-item-2',
        order_id: 'ord-seed-2',
        product_id: 'prod-velvet',
        variant_id: 'prod-velvet-var-30ml',
        product_name: 'Velvet Oud',
        size: '30ml',
        sku: 'AEVY-VEL-30ML',
        quantity: 1,
        unit_price: 1950,
        subtotal: 1950,
        item_type: 'single',
        image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ],
  },
];

// Persistent local store for mock orders
const ORDERS_STORAGE_KEY = 'aevy_mock_orders';

export function getStoredOrders(): DBOrder[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(ORDERS_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  return [...SAMPLE_ORDERS];
}

export function saveStoredOrder(order: DBOrder): void {
  try {
    const current = getStoredOrders();
    const updated = [order, ...current.filter((o) => o.id !== order.id)];
    if (typeof window !== 'undefined') {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch {
    // ignore
  }
}
