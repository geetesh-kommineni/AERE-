import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db;

export function getDb() {
  if (!db) {
    const isVercel = process.env.VERCEL || process.env.NOW_BUILDER || process.env.LAMBDA_TASK_ROOT;
    let dbPath = path.join(process.cwd(), 'aere.db');

    if (isVercel) {
      const tempPath = path.join('/tmp', 'aere.db');
      try {
        if (!fs.existsSync(tempPath)) {
          fs.copyFileSync(dbPath, tempPath);
          console.log('Successfully copied fresh aere.db to /tmp for writing');
        } else {
          console.log('Using existing aere.db in /tmp');
        }
      } catch (e) {
        console.error('Failed to copy database to /tmp:', e);
      }
      dbPath = tempPath;
    }

    db = new Database(dbPath);
    db.pragma('synchronous = NORMAL');
    db.pragma('journal_mode = WAL');
    db.pragma('temp_store = MEMORY');
    db.pragma('cache_size = -64000'); // 64MB Cache
    db.pragma('foreign_keys = ON');
    initTables();
    seedIfEmpty();

    // DYNAMIC SYNC FOR WOMEN'S SECTION ON STARTUP
    try {
      const womensProds = db.prepare("SELECT id, colors FROM products WHERE department = 'Women'").all();
      for (const prod of womensProds) {
        let colorsList = [];
        try {
          colorsList = typeof prod.colors === 'string' ? JSON.parse(prod.colors) : (prod.colors || []);
        } catch (e) {
          colorsList = [];
        }
        if (colorsList.length > 1) {
          const primaryColor = [colorsList[0]];
          db.prepare("UPDATE products SET colors = ? WHERE id = ?").run(JSON.stringify(primaryColor), prod.id);
        }
      }
      console.log("Successfully enforced primary colors for Women's department dynamically.");
    } catch (e) {
      console.error("Failed to dynamically sync Women's colors:", e);
    }
  }
  return db;
}

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT DEFAULT '',
      address TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS email_verifications (
      email TEXT PRIMARY KEY,
      otp TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      tag TEXT DEFAULT '',
      image TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      material TEXT DEFAULT '',
      price REAL NOT NULL,
      original_price REAL DEFAULT NULL,
      category TEXT DEFAULT '',
      department TEXT DEFAULT 'Women',
      collection_id INTEGER,
      badge TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      sizes TEXT DEFAULT '["XS","S","M","L","XL"]',
      colors TEXT DEFAULT '[]',
      care TEXT DEFAULT '',
      fit TEXT DEFAULT '',
      in_stock INTEGER DEFAULT 1,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (collection_id) REFERENCES collections(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      status TEXT DEFAULT 'confirmed',
      subtotal REAL NOT NULL,
      shipping REAL DEFAULT 0,
      total REAL NOT NULL,
      shipping_name TEXT DEFAULT '',
      shipping_email TEXT DEFAULT '',
      shipping_phone TEXT DEFAULT '',
      shipping_address TEXT DEFAULT '',
      shipping_city TEXT DEFAULT '',
      shipping_state TEXT DEFAULT '',
      shipping_pincode TEXT DEFAULT '',
      payment_method TEXT DEFAULT 'card',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      product_image TEXT DEFAULT '',
      size TEXT DEFAULT '',
      color TEXT DEFAULT '',
      quantity INTEGER DEFAULT 1,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id),
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS newsletter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT DEFAULT '',
      email TEXT UNIQUE NOT NULL,
      subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      user_id INTEGER,
      user_name TEXT DEFAULT 'Anonymous',
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

function seedIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) as c FROM products').get();
  if (count.c > 0) return;

  // Seed collections
  const insertCol = db.prepare(`INSERT INTO collections (name, slug, description, tag, image) VALUES (?, ?, ?, ?, ?)`);
  const collections = [
    ['Summer Linen', 'summer-linen', 'Light, breathable pieces crafted from the finest European linens. Designed for warm days and unhurried living.', "SS '26", 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80&auto=format'],
    ['Silk Evenings', 'silk-evenings', 'Refined silhouettes in pure silk for evenings that call for quiet elegance.', 'Occasion', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&auto=format'],
    ['Everyday Edit', 'everyday-edit', 'Considered essentials that move with you — from morning to midnight.', 'Essentials', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80&auto=format'],
    ['Resort Wear', 'resort-wear', 'Holiday dressing in natural fibres. Pack light, feel luxurious.', 'Holiday', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80&auto=format'],
    ['Knitwear', 'knitwear', 'Transitional knitwear in certified organic wool and cashmere blends.', 'Transitional', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format'],
  ];
  for (const c of collections) insertCol.run(...c);

  // Seed products
  const insertProd = db.prepare(`INSERT INTO products (name, slug, description, material, price, original_price, category, collection_id, badge, images, sizes, colors, care, fit, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const products = [
    ['Ivory Linen Dress', 'ivory-linen-dress', 'A flowing midi dress in crisp Belgian linen. Features a relaxed silhouette with gentle pleats at the waist and mother-of-pearl buttons. The kind of dress that becomes more beautiful with every wash.', '100% Belgian Linen', 7490, null, 'Dresses', 1, 'New',
      JSON.stringify(['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80&auto=format','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80&auto=format','https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80&auto=format','https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80&auto=format']),
      JSON.stringify(['XS','S','M','L','XL']), JSON.stringify([{name:'Ivory',hex:'#F2EDE6'}]),
      'Hand wash cold. Lay flat to dry. Iron on medium heat.', 'Relaxed fit. Model wears size S. Model height: 5\'8".', 1],

    ['Dusty Rose Silk Blouse', 'dusty-rose-silk-blouse', 'A liquid silk blouse in our signature dusty rose. Features a concealed button placket and French seams throughout. Tuck in or wear loose — it moves beautifully either way.', 'Silk Charmeuse', 5290, null, 'Tops', 2, '',
      JSON.stringify(['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500&q=80&auto=format','https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&q=80&auto=format']),
      JSON.stringify(['XS','S','M','L']), JSON.stringify([{name:'Dusty Rose',hex:'#C9927A'}]),
      'Dry clean only. Store on padded hanger.', 'Regular fit. Model wears size S.', 1],

    ['Camel Wide-Leg Trousers', 'camel-wide-leg-trousers', 'High-waisted wide-leg trousers in a refined wool blend. Featuring pressed creases and side pockets. Pairs with everything — the definition of a considered wardrobe staple.', 'Wool Blend', 8990, 10490, 'Bottoms', 3, 'Best Seller',
      JSON.stringify(['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80&auto=format','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80&auto=format']),
      JSON.stringify(['XS','S','M','L','XL']), JSON.stringify([{name:'Camel',hex:'#C4A882'}]),
      'Dry clean recommended. Steam to remove creases.', 'High-rise, wide leg. Model wears size S.', 1],

    ['Sand Linen Co-ord Set', 'sand-linen-coord-set', 'A two-piece set in washed Belgian linen — relaxed shirt and matching wide-leg trousers. The kind of effortless pairing that feels both considered and completely natural.', 'Belgian Linen', 11990, null, 'Co-ords', 1, '',
      JSON.stringify(['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80&auto=format','https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80&auto=format']),
      JSON.stringify(['XS','S','M','L','XL']), JSON.stringify([{name:'Sand',hex:'#D4C5B2'}]),
      'Machine wash gentle. Hang dry. Iron while damp.', 'Oversized fit. Model wears size S.', 1],

    ['Ecru Cotton Midi Dress', 'ecru-cotton-midi-dress', 'An organic cotton midi dress with a softly gathered waist and puff sleeves. Hand-finished details throughout. Designed to be worn barefoot or with intention.', 'Organic Cotton', 6490, null, 'Dresses', 3, 'New',
      JSON.stringify(['https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&q=80&auto=format','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80&auto=format']),
      JSON.stringify(['XS','S','M','L']), JSON.stringify([{name:'Ecru',hex:'#F2EDE6'}]),
      'Machine wash cold. Tumble dry low.', 'Regular fit with gathered waist. Model wears size S.', 1],

    ['Terracotta Wrap Skirt', 'terracotta-wrap-skirt', 'A wrap skirt in fine cotton voile with a natural vegetable dye. The adjustable waist tie makes it endlessly versatile.', 'Cotton Voile', 4290, null, 'Bottoms', 4, '',
      JSON.stringify(['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80&auto=format']),
      JSON.stringify(['XS','S','M','L','XL']), JSON.stringify([{name:'Terracotta',hex:'#C9927A'}]),
      'Hand wash cold. Lay flat to dry.', 'Adjustable wrap fit. Model wears size S.', 1],

    ['Soft White Linen Shirt', 'soft-white-linen-shirt', 'A stone-washed linen shirt that gets softer with every wear. Relaxed collar, two chest pockets, and slightly longer back hem. Already feels lived-in.', 'Stone-Washed Linen', 4990, null, 'Tops', 1, 'Best Seller',
      JSON.stringify(['https://images.unsplash.com/photo-1604575408851-ddc3d70f2b4e?w=500&q=80&auto=format','https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80&auto=format']),
      JSON.stringify(['XS','S','M','L','XL']), JSON.stringify([{name:'White',hex:'#FFFFFF'}]),
      'Machine wash gentle. Hang dry.', 'Relaxed oversized fit. Model wears size S.', 1],

    ['Blush Pleated Jumpsuit', 'blush-pleated-jumpsuit', 'An elegant jumpsuit in TENCEL™ lyocell with knife pleats throughout. Wide leg, cinched waist, and a subtle V-neckline. From afternoon to evening without missing a beat.', 'TENCEL™ Blend', 9490, null, 'Jumpsuits', 2, '',
      JSON.stringify(['https://images.unsplash.com/photo-1548624149-f9e74d14f9e1?w=500&q=80&auto=format','https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&q=80&auto=format']),
      JSON.stringify(['XS','S','M','L']), JSON.stringify([{name:'Blush',hex:'#E8C4B0'}]),
      'Dry clean only.', 'Tailored fit at waist, wide leg. Model wears size S.', 1],

    ['Oat Cashmere Cardigan', 'oat-cashmere-cardigan', 'An ultra-soft cardigan in Grade A Mongolian cashmere. Ribbed cuffs and hem, horn buttons, and a weight that drapes just right.', 'Grade A Cashmere', 14990, null, 'Knitwear', 5, 'New',
      JSON.stringify(['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80&auto=format']),
      JSON.stringify(['XS','S','M','L','XL']), JSON.stringify([{name:'Oat',hex:'#D4C5B2'}]),
      'Hand wash in cold water with cashmere shampoo. Lay flat to dry.', 'Relaxed fit. Model wears size S.', 1],

    ['Sage Linen Palazzo Pants', 'sage-linen-palazzo-pants', 'Flowing palazzo pants in enzyme-washed linen with an elasticated waist and deep pockets. The ultimate in relaxed summer dressing.', 'French Linen', 5990, null, 'Bottoms', 1, '',
      JSON.stringify(['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80&auto=format']),
      JSON.stringify(['XS','S','M','L','XL']), JSON.stringify([{name:'Sage',hex:'#9E8B7C'}]),
      'Machine wash gentle. Iron on medium heat.', 'Wide-leg relaxed fit. Elasticated waist. Model wears size S.', 1],

    ['Midnight Silk Slip Dress', 'midnight-silk-slip-dress', 'A bias-cut slip dress in heavy-weight mulberry silk. Adjustable straps, French seams, and a length that skims the mid-calf. Pure evening elegance.', 'Mulberry Silk', 12490, null, 'Dresses', 2, '',
      JSON.stringify(['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&q=80&auto=format','https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500&q=80&auto=format']),
      JSON.stringify(['XS','S','M','L']), JSON.stringify([{name:'Midnight',hex:'#1A1410'}]),
      'Dry clean only. Store on padded hanger.', 'Bias-cut, slim fit. Model wears size S.', 1],

    ['Stone Cotton Oversized Blazer', 'stone-cotton-oversized-blazer', 'A deconstructed blazer in heavy organic cotton canvas. Unlined for warmth without weight, with patch pockets and a single-button closure.', 'Organic Cotton Canvas', 8490, 9990, 'Outerwear', 3, 'Best Seller',
      JSON.stringify(['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80&auto=format','https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80&auto=format']),
      JSON.stringify(['XS','S','M','L','XL']), JSON.stringify([{name:'Stone',hex:'#6B5E54'}]),
      'Spot clean or dry clean. Steam to refresh.', 'Oversized fit. Model wears size S.', 1],
  ];
  for (const p of products) insertProd.run(...p);

  // Seed reviews
  const insertRev = db.prepare(`INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)`);
  const reviews = [
    [1, 'Meera K.', 5, 'The most beautiful linen dress I own. Gets softer with every wash. Worth every rupee.'],
    [1, 'Ananya S.', 4, 'Lovely quality and the fit is perfect. Runs slightly large — I sized down.'],
    [3, 'Priya R.', 5, 'These trousers are incredible. The drape, the fabric — everything. My new favourites.'],
    [3, 'Divya M.', 5, 'Bought these on a whim and now I want every colour. The quality is exceptional.'],
    [7, 'Ishani P.', 4, 'Perfect oversized fit. The linen is pre-softened which is a lovely touch.'],
    [7, 'Kavya N.', 5, 'I live in this shirt. Genuinely the best linen I have found in India.'],
    [9, 'Riya T.', 5, 'The cashmere is unbelievably soft. This is luxury at its finest.'],
    [4, 'Neha J.', 4, 'Great co-ord set. The linen wrinkles naturally but that is part of the charm.'],
    [8, 'Aisha V.', 5, 'Wore this to a wedding reception and got so many compliments. The pleating is exquisite.'],
    [12, 'Tara B.', 5, 'This blazer goes with absolutely everything. The organic cotton has such a beautiful texture.'],
  ];
  for (const r of reviews) insertRev.run(...r);
}
