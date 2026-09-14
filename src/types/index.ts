// AEVY Live Supabase Schema & Shop Types
// Follows CURRENT AEVY ADMIN PANEL as the source of truth.

export type VariantSize = '3ml' | '10ml' | '30ml';

export type OrderStatus =
  | 'New'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type ProductType = 'single' | 'combo';

export interface DBProduct {
  id: string;
  name: string;
  slug: string;
  product_type: ProductType;
  combo_type?: string | null;
  description?: string | null;
  category?: string | null;
  gender?: 'unisex' | 'masculine' | 'feminine' | string | null;
  notes?: any; // JSON or text
  top_notes?: string | null;
  heart_notes?: string | null;
  base_notes?: string | null;
  longevity?: string | null;
  perfect_for?: string | null;
  perfectFor?: string | null;
  scent_descriptor?: string | null;
  sku?: string | null;
  combo_sku?: string | null;
  price: number;
  base_price?: number;
  combo_price?: number | null;
  combo_compare_at_price?: number | null;
  size?: string | null;
  low_stock_threshold?: number | null;
  featured: boolean;
  is_featured?: boolean;
  active: boolean;
  image_url?: string | null;
  images?: string[];
  variants?: DBProductVariant[];
  created_at?: string;
  updated_at?: string;
}

export interface DBProductVariant {
  id: string;
  product_id: string;
  size: VariantSize;
  price: number;
  compare_at_price?: number | null;
  stock: number;
  sku?: string | null;
  is_active: boolean;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DBComboSlot {
  id: string;
  combo_product_id: string;
  slot_title: string;
  required_quantity: number;
  slot_order: number;
  created_at?: string;
}

export interface DBComboSlotAllowedVariant {
  id: string;
  combo_slot_id: string;
  product_variant_id: string;
  created_at?: string;
  // Resolved join properties
  variant?: DBProductVariant;
  product?: DBProduct;
}

export interface DBSettings {
  id?: string;
  delivery_charge_inside_narayanganj: number;
  delivery_charge_outside_narayanganj: number;
  free_delivery_threshold: number;
  store_active: boolean;
  accept_orders: boolean;
  maintenance_mode: boolean;
}

export interface DBOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  district: string;
  thana_upazila: string;
  full_address: string;
  status: OrderStatus;
  payment_method: string;
  delivery_charge: number;
  subtotal: number;
  coupon_code?: string | null;
  discount: number;
  total: number;
  customer_note?: string | null;
  created_at: string;
  updated_at?: string;
  items?: DBOrderItem[];
}

export interface DBOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string | null;
  product_name: string;
  size: string;
  sku?: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  item_type: 'single' | 'combo';
  bottle_shape?: string | null;
  image_url?: string | null;
  created_at?: string;
  components?: DBOrderItemComponent[];
}

export interface DBOrderItemComponent {
  id: string;
  order_item_id: string;
  slot_id: string;
  component_variant_id: string;
  created_at?: string;
  // Resolved info for display
  slot_title?: string;
  variant_size?: string;
  product_name?: string;
}

export interface DBCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  district?: string | null;
  thana?: string | null;
  address?: string | null;
  orders_count: number;
  total_spent: number;
  last_order_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Frontend Product with joined active variants for UI convenience
export interface ProductWithVariants extends DBProduct {
  variants: DBProductVariant[];
  defaultVariant?: DBProductVariant;
  comboSlots?: (DBComboSlot & {
    allowedVariants: DBComboSlotAllowedVariant[];
  })[];
  combo_slots?: any[];
}

export interface ComboComponentSelection {
  slotId: string;
  slotTitle: string;
  slotName?: string;
  variantId: string;
  variantSize: string;
  size?: string;
  productName: string;
  price?: number;
}

export interface CartItem {
  id: string; // unique cart entry id
  productId: string;
  variantId?: string | null;
  productName: string;
  productSlug: string;
  size: string;
  sku?: string | null;
  price: number;
  compareAtPrice?: number | null;
  quantity: number;
  itemType: 'single' | 'combo';
  bottleShape?: string | null;
  imageUrl?: string | null;
  comboSelections?: ComboComponentSelection[];
  stock: number;
}
