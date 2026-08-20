import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { Product, Order, SiteSettings, Coupon, CustomerSummary, AdminStats } from './src/types.ts';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_COUPONS, INITIAL_ORDERS } from './src/data/initialData.ts';

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  settings: SiteSettings;
  coupons: Coupon[];
  adminKey: string;
}

function ensureDbDirectory() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadDatabase(): DatabaseSchema {
  try {
    ensureDbDirectory();
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(data);
      return {
        products: (parsed.products || []).map((p: any) => ({
          ...p,
          bottleShape: p.bottleShape || 'Round',
          size: p.size || '30ml',
          sku: p.sku || `AEVY-${(p.slug || 'PRD').toUpperCase()}-30ML`
        })),
        orders: parsed.orders || [],
        settings: {
          ...INITIAL_SETTINGS,
          ...(parsed.settings || {})
        },
        coupons: parsed.coupons || [],
        adminKey: parsed.adminKey || 'aevy2026!'
      };
    }
  } catch (err) {
    console.error('Error loading database, initializing clean database:', err);
  }

  const initialDb: DatabaseSchema = {
    products: [],
    orders: [],
    settings: INITIAL_SETTINGS,
    coupons: [],
    adminKey: 'aevy2026!'
  };
  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    ensureDbDirectory();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

let db = loadDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Settings: Public
  app.get('/api/settings', (_req: Request, res: Response) => {
    res.json({ success: true, settings: db.settings });
  });

  // Products: Public listing
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, family, search, status } = req.query;
    let list = [...db.products];

    // Filter by status if not specified (default to active for public)
    if (status) {
      list = list.filter(p => p.status === status);
    } else {
      list = list.filter(p => p.status === 'active');
    }

    if (category && category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }

    if (family && family !== 'All') {
      list = list.filter(p => 
        p.fragranceFamily.toLowerCase() === String(family).toLowerCase() ||
        (family === 'Unisex' && p.gender === 'Unisex') ||
        (family === 'Clean' && (p.tagline.toLowerCase().includes('clean') || p.description.toLowerCase().includes('clean')))
      );
    }

    if (search && String(search).trim()) {
      const q = String(search).toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.notes.top.some(n => n.toLowerCase().includes(q)) ||
        p.notes.heart.some(n => n.toLowerCase().includes(q)) ||
        p.notes.base.some(n => n.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: list.length, products: list });
  });

  // Product by Slug / ID
  app.get('/api/products/:slug', (req: Request, res: Response) => {
    const { slug } = req.params;
    const product = db.products.find(p => p.slug === slug || p.id === slug);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  });

  // Coupon validation
  app.post('/api/coupons/validate', (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Coupon code required' });
    }

    const coupon = db.coupons.find(c => c.code.toUpperCase() === String(code).trim().toUpperCase() && c.isActive);
    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Invalid or inactive promotional code.' });
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        error: `Minimum order amount of ৳${coupon.minOrderAmount} required for this code.`
      });
    }

    let discount = 0;
    if (coupon.discountAmount) {
      discount = coupon.discountAmount;
    } else if (coupon.discountPercent) {
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discount,
        description: coupon.discountPercent ? `${coupon.discountPercent}% off` : `৳${coupon.discountAmount} off`
      }
    });
  });

  // Create Order (Checkout)
  app.post('/api/orders', (req: Request, res: Response) => {
    // Check if store is accepting orders or in maintenance mode
    if (db.settings.maintenanceMode) {
      return res.status(400).json({
        success: false,
        error: 'The boutique is currently undergoing scheduled atelier maintenance. Orders are temporarily paused.'
      });
    }

    if (db.settings.acceptOrders === false || db.settings.storeActive === false) {
      return res.status(400).json({
        success: false,
        error: 'We are currently not accepting new orders at this time. Please check back shortly.'
      });
    }

    const {
      customerName,
      phone,
      email,
      district,
      thana,
      fullAddress,
      note,
      items,
      couponCode
    } = req.body;

    if (!customerName || !phone || !district || !thana || !fullAddress || !items || !items.length) {
      return res.status(400).json({ success: false, error: 'Please provide all required delivery details.' });
    }

    // Verify stock and calculate subtotal
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = db.products.find(p => p.id === item.productId || p.slug === item.slug);
      if (!product) {
        return res.status(400).json({ success: false, error: `Product ${item.productName} is unavailable.` });
      }

      if (product.status === 'inactive' || product.status === 'out_of_stock') {
        return res.status(400).json({
          success: false,
          error: `Product ${product.name} is currently out of stock or inactive.`
        });
      }

      const sizeVariant = product.sizes.find(s => s.size === item.size) || product.sizes[0];
      const availableStock = sizeVariant ? sizeVariant.stock : product.stock;

      if (availableStock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name} (${item.size}). Available: ${availableStock}`
        });
      }

      const unitPrice = sizeVariant ? sizeVariant.price : product.price;
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        slug: product.slug,
        size: item.size || '30ml',
        bottleShape: item.bottleShape || product.bottleShape || 'Round',
        quantity: item.quantity,
        unitPrice,
        subtotal: itemSubtotal,
        image: product.images[0] || item.image
      });

      // Reduce inventory
      if (sizeVariant) {
        sizeVariant.stock -= item.quantity;
        sizeVariant.inStock = sizeVariant.stock > 0;
      }
      product.stock -= item.quantity;
      if (product.stock <= 0) {
        product.status = 'out_of_stock';
      }
      product.updatedAt = new Date().toISOString();
    }

    // Delivery charge calculation
    const isInsideDhaka = district.toLowerCase().includes('dhaka');
    let deliveryCharge = isInsideDhaka ? db.settings.deliveryInsideDhaka : db.settings.deliveryOutsideDhaka;

    // Check free delivery threshold if set
    if (db.settings.freeDeliveryThreshold > 0 && subtotal >= db.settings.freeDeliveryThreshold) {
      deliveryCharge = 0;
    }

    // Discount calculation
    let discount = 0;
    if (couponCode) {
      const coupon = db.coupons.find(c => c.code.toUpperCase() === String(couponCode).trim().toUpperCase() && c.isActive);
      if (coupon && (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount)) {
        if (coupon.discountAmount) discount = coupon.discountAmount;
        else if (coupon.discountPercent) discount = Math.round((subtotal * coupon.discountPercent) / 100);
      }
    }

    const total = Math.max(0, subtotal + deliveryCharge - discount);

    // Generate Order ID: AEVY-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `AEVY-${dateStr}-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      district: district.trim(),
      thana: thana.trim(),
      fullAddress: fullAddress.trim(),
      note: note ? note.trim() : undefined,
      items: validatedItems,
      subtotal,
      deliveryCharge,
      discount,
      couponCode: discount > 0 ? couponCode : undefined,
      total,
      paymentMethod: 'Cash on Delivery',
      status: 'New',
      internalNotes: [
        { text: 'Order created via web store checkout.', date: now.toISOString() }
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    db.orders.unshift(newOrder);
    saveDatabase(db);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: newOrder
    });
  });

  // Track Order / Lookup
  app.get('/api/orders/track/:orderId', (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { phone } = req.query;

    const cleanId = String(orderId).trim().toUpperCase();
    const order = db.orders.find(o => o.id.toUpperCase() === cleanId);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found. Please verify your Order ID.' });
    }

    if (phone) {
      const cleanPhone = String(phone).replace(/\D/g, '');
      const orderPhone = order.phone.replace(/\D/g, '');
      if (!orderPhone.includes(cleanPhone) && !cleanPhone.includes(orderPhone)) {
        return res.status(403).json({ success: false, error: 'Phone number does not match this order.' });
      }
    }

    res.json({ success: true, order });
  });

  // Single Order details
  app.get('/api/orders/:orderId', (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = db.orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order });
  });

  // --- ADMIN AUTH & DASHBOARD ROUTES ---

  // Admin Login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (
      (username === 'admin' || username === 'aevy' || username === 'aevy.brand@gmail.com') &&
      password === db.adminKey
    ) {
      const token = `aevy_session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      return res.json({
        success: true,
        token,
        user: { name: 'AEVY Administrator', role: 'SuperAdmin' }
      });
    }
    res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  });

  // Admin Stats
  app.get('/api/admin/stats', (_req: Request, res: Response) => {
    const totalOrders = db.orders.length;
    const deliveredOrders = db.orders.filter(o => o.status === 'Delivered').length;
    const shippedOrders = db.orders.filter(o => o.status === 'Shipped').length;
    const confirmedOrders = db.orders.filter(o => o.status === 'Confirmed').length;
    const processingOrders = db.orders.filter(o => o.status === 'Processing').length;
    const newOrders = db.orders.filter(o => o.status === 'New').length;
    const cancelledOrders = db.orders.filter(o => o.status === 'Cancelled').length;

    // Revenue only counts non-cancelled orders
    const totalRevenue = db.orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const productsSold = db.orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

    const lowStockCount = db.products.filter(p => p.stock <= p.lowStockThreshold).length;

    const stats: AdminStats = {
      totalRevenue,
      totalOrders,
      newOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      productsSold,
      lowStockCount,
      recentOrders: db.orders.slice(0, 8)
    };

    res.json({ success: true, stats });
  });

  // Admin Orders List
  app.get('/api/admin/orders', (req: Request, res: Response) => {
    const { status, search } = req.query;
    let list = [...db.orders];

    if (status && status !== 'All') {
      list = list.filter(o => o.status === status);
    }

    if (search && String(search).trim()) {
      const q = String(search).toLowerCase();
      list = list.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.district.toLowerCase().includes(q) ||
        o.thana.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: list.length, orders: list });
  });

  // Admin Update Order Status
  app.put('/api/admin/orders/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, restoreStock } = req.body;

    const orderIndex = db.orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const prevStatus = db.orders[orderIndex].status;
    db.orders[orderIndex].status = status;
    db.orders[orderIndex].updatedAt = new Date().toISOString();

    if (!db.orders[orderIndex].internalNotes) {
      db.orders[orderIndex].internalNotes = [];
    }
    db.orders[orderIndex].internalNotes?.push({
      text: `Status changed from ${prevStatus} to ${status}.`,
      date: new Date().toISOString()
    });

    // If cancelled and restoreStock is true, return inventory
    if (status === 'Cancelled' && restoreStock && prevStatus !== 'Cancelled') {
      for (const item of db.orders[orderIndex].items) {
        const prod = db.products.find(p => p.id === item.productId);
        if (prod) {
          prod.stock += item.quantity;
          const sz = prod.sizes.find(s => s.size === item.size);
          if (sz) {
            sz.stock += item.quantity;
            sz.inStock = sz.stock > 0;
          }
        }
      }
    }

    saveDatabase(db);
    res.json({ success: true, order: db.orders[orderIndex] });
  });

  // Admin Add Note to Order
  app.post('/api/admin/orders/:id/note', (req: Request, res: Response) => {
    const { id } = req.params;
    const { text } = req.body;

    const order = db.orders.find(o => o.id === id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (!order.internalNotes) order.internalNotes = [];
    order.internalNotes.push({
      text: text.trim(),
      date: new Date().toISOString()
    });

    saveDatabase(db);
    res.json({ success: true, order });
  });

  // Admin Customers Aggregate
  app.get('/api/admin/customers', (_req: Request, res: Response) => {
    const customerMap = new Map<string, CustomerSummary>();

    for (const order of db.orders) {
      const key = order.phone.trim();
      const existing = customerMap.get(key);

      if (existing) {
        existing.ordersCount += 1;
        if (order.status !== 'Cancelled') {
          existing.totalSpent += order.total;
        }
        if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.createdAt;
          existing.address = order.fullAddress;
          existing.district = order.district;
        }
      } else {
        customerMap.set(key, {
          phone: order.phone,
          name: order.customerName,
          email: order.email,
          ordersCount: 1,
          totalSpent: order.status !== 'Cancelled' ? order.total : 0,
          lastOrderDate: order.createdAt,
          address: order.fullAddress,
          district: order.district
        });
      }
    }

    const customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
    res.json({ success: true, count: customers.length, customers });
  });

  // Admin Inventory List
  app.get('/api/admin/inventory', (_req: Request, res: Response) => {
    const inventory = db.products.map(p => ({
      productId: p.id,
      name: p.name,
      slug: p.slug,
      image: p.images[0],
      totalStock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      status: p.status,
      sizes: p.sizes
    }));
    res.json({ success: true, inventory });
  });

  // Admin Quick Stock Update
  app.put('/api/admin/inventory/:productId', (req: Request, res: Response) => {
    const { productId } = req.params;
    const { stock, lowStockThreshold, sizes } = req.body;

    const prod = db.products.find(p => p.id === productId);
    if (!prod) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (typeof stock === 'number') prod.stock = stock;
    if (typeof lowStockThreshold === 'number') prod.lowStockThreshold = lowStockThreshold;
    if (sizes && Array.isArray(sizes)) prod.sizes = sizes;

    prod.updatedAt = new Date().toISOString();
    saveDatabase(db);
    res.json({ success: true, product: prod });
  });

  // Admin Product Creation
  app.post('/api/admin/products', (req: Request, res: Response) => {
    const data = req.body;
    if (!data.name || !data.price) {
      return res.status(400).json({ success: false, error: 'Product name and price are required.' });
    }

    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `prod-${Date.now()}`;
    const bottleShape = data.bottleShape === 'Square' ? 'Square' : 'Round';

    const newProduct: Product = {
      id,
      name: data.name,
      slug,
      tagline: data.tagline || 'Modern Fragrance',
      brandTagline: data.brandTagline || db.settings.tagline,
      shortDescription: data.shortDescription || data.description || '',
      description: data.description || '',
      price: Number(data.price),
      comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
      size: data.size || '30ml',
      bottleShape,
      category: data.category || 'Perfume',
      fragranceFamily: data.fragranceFamily || 'Fresh',
      gender: data.gender || 'Unisex',
      sizes: data.sizes || [
        {
          size: '30ml',
          price: Number(data.price),
          sku: data.sku || `AEVY-${slug.toUpperCase()}-30ML-${bottleShape.substring(0, 3).toUpperCase()}`,
          stock: Number(data.stock || 30),
          inStock: Number(data.stock || 30) > 0
        }
      ],
      images: data.images && data.images.length ? data.images : ['/src/assets/images/aevy_oceanis_bottle_1786864368427.jpg'],
      notes: data.notes || { top: [], heart: [], base: [] },
      story: data.story || '',
      details: data.details || {
        concentration: 'Extrait de Parfum',
        sillage: 'Moderate & Elegant',
        longevity: '8-10 Hours',
        season: 'All-Year Signature',
        occasion: 'Everyday & Special Occasions',
        applicationGuide: 'Spray on pulse points'
      },
      sku: data.sku || `AEVY-${slug.toUpperCase()}-30ML-${bottleShape.substring(0, 3).toUpperCase()}`,
      stock: Number(data.stock || 30),
      lowStockThreshold: Number(data.lowStockThreshold || 10),
      status: data.status || (Number(data.stock || 30) > 0 ? 'active' : 'out_of_stock'),
      featured: Boolean(data.featured),
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.products.push(newProduct);
    saveDatabase(db);
    res.status(201).json({ success: true, product: newProduct });
  });

  // Admin Product Edit
  app.put('/api/admin/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.products.findIndex(p => p.id === id || p.slug === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const current = db.products[index];
    const incoming = req.body;

    const updated: Product = {
      ...current,
      ...incoming,
      price: incoming.price !== undefined ? Number(incoming.price) : current.price,
      comparePrice: incoming.comparePrice !== undefined ? (incoming.comparePrice ? Number(incoming.comparePrice) : undefined) : current.comparePrice,
      stock: incoming.stock !== undefined ? Number(incoming.stock) : current.stock,
      lowStockThreshold: incoming.lowStockThreshold !== undefined ? Number(incoming.lowStockThreshold) : current.lowStockThreshold,
      bottleShape: incoming.bottleShape === 'Square' ? 'Square' : (incoming.bottleShape === 'Round' ? 'Round' : current.bottleShape),
      updatedAt: new Date().toISOString()
    };

    // Update sizes variant stock if provided
    if (updated.sizes && updated.sizes.length > 0) {
      updated.sizes[0].price = updated.price;
      updated.sizes[0].stock = updated.stock;
      updated.sizes[0].inStock = updated.stock > 0;
    }

    db.products[index] = updated;
    saveDatabase(db);
    res.json({ success: true, product: updated });
  });

  // Admin Product Delete (Safe Deletion)
  app.delete('/api/admin/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const prod = db.products.find(p => p.id === id || p.slug === id);
    if (!prod) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Check if product is referenced in historical customer orders
    const isReferencedInOrders = db.orders.some(o =>
      o.items.some(item => item.productId === prod.id || item.slug === prod.slug)
    );

    if (isReferencedInOrders) {
      // Soft delete: deactivate product so order histories are preserved safely
      prod.status = 'inactive';
      prod.updatedAt = new Date().toISOString();
      saveDatabase(db);
      return res.json({
        success: true,
        softDeleted: true,
        message: 'Product has historical orders. It has been deactivated and archived from the active store catalog.'
      });
    }

    db.products = db.products.filter(p => p.id !== id && p.slug !== id);
    saveDatabase(db);
    res.json({ success: true, message: 'Product permanently removed.' });
  });

  // Admin Image Upload
  app.post('/api/admin/upload-image', (req: Request, res: Response) => {
    const { image, fileName } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'No image data provided' });
    }

    // If it's already a valid path or data URL, return it
    if (image.startsWith('data:') || image.startsWith('http') || image.startsWith('/')) {
      return res.json({ success: true, imageUrl: image });
    }

    res.json({ success: true, imageUrl: image });
  });

  // Admin Settings Update
  app.put('/api/admin/settings', (req: Request, res: Response) => {
    const {
      brandName,
      tagline,
      currency,
      deliveryInsideDhaka,
      deliveryOutsideDhaka,
      freeDeliveryThreshold,
      contactPhone,
      contactEmail,
<<<<<<< HEAD
      whatsappNumber,
=======
>>>>>>> af95be52be9b46ae1ac7f36af859ae95e0d5ee08
      announcement,
      socialLinks,
      storeActive,
      acceptOrders,
      maintenanceMode,
      newAdminPassword
    } = req.body;

    if (brandName) db.settings.brandName = brandName;
    if (tagline) db.settings.tagline = tagline;
    if (currency) db.settings.currency = currency;
    if (typeof deliveryInsideDhaka === 'number') db.settings.deliveryInsideDhaka = deliveryInsideDhaka;
    if (typeof deliveryOutsideDhaka === 'number') db.settings.deliveryOutsideDhaka = deliveryOutsideDhaka;
    if (typeof freeDeliveryThreshold === 'number') db.settings.freeDeliveryThreshold = freeDeliveryThreshold;
    if (contactPhone) db.settings.contactPhone = contactPhone;
    if (contactEmail) db.settings.contactEmail = contactEmail;
<<<<<<< HEAD
    if (whatsappNumber) db.settings.whatsappNumber = whatsappNumber;
=======
>>>>>>> af95be52be9b46ae1ac7f36af859ae95e0d5ee08
    if (announcement !== undefined) db.settings.announcement = announcement;
    if (socialLinks) db.settings.socialLinks = socialLinks;
    if (typeof storeActive === 'boolean') db.settings.storeActive = storeActive;
    if (typeof acceptOrders === 'boolean') db.settings.acceptOrders = acceptOrders;
    if (typeof maintenanceMode === 'boolean') db.settings.maintenanceMode = maintenanceMode;
    if (newAdminPassword) db.adminKey = newAdminPassword;

    saveDatabase(db);
    res.json({ success: true, settings: db.settings });
  });

  // --- VITE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
<<<<<<< HEAD
    console.log(`AEVY Fragrance Server running on port ${PORT}`);
=======
    console.log(`AEVY Fragrance Server running on http://0.0.0.0:${PORT}`);
>>>>>>> af95be52be9b46ae1ac7f36af859ae95e0d5ee08
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
