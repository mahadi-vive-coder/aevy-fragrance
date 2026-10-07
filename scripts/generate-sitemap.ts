import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load local environment files if present
dotenv.config();
dotenv.config({ path: '.env.local' });

const SITE_URL = 'https://aevyfragrance.shop';

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Built-in fallback products if Supabase environment is unconfigured
const FALLBACK_PRODUCT_SLUGS = [
  'oceanis',
  'aura-blanche',
  'noir-santal',
  'velvet-oud',
  'soleil-dor',
  'verdant-vetiver',
  'curated-duo-set',
  'discovery-trio-box',
];

async function fetchProductSlugs(): Promise<{ slug: string; lastmod?: string }[]> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    !supabaseUrl.includes('your-project')
  ) {
    try {
      console.log('[Sitemap] Fetching active products from live Supabase instance...');
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase
        .from('products')
        .select('slug, updated_at, created_at, active')
        .eq('active', true);

      if (error) {
        console.warn(`[Sitemap] Supabase query returned an error: ${error.message}`);
      } else if (data && data.length > 0) {
        console.log(`[Sitemap] Found ${data.length} active products from Supabase.`);
        return data.map((p) => ({
          slug: p.slug,
          lastmod: (p.updated_at || p.created_at || new Date().toISOString()).split('T')[0],
        }));
      }
    } catch (err: any) {
      console.warn(`[Sitemap] Failed to connect to Supabase: ${err?.message || err}`);
    }
  } else {
    console.log('[Sitemap] Supabase credentials not found or placeholder in environment. Using active catalogue fallback.');
  }

  const today = new Date().toISOString().split('T')[0];
  return FALLBACK_PRODUCT_SLUGS.map((slug) => ({
    slug,
    lastmod: today,
  }));
}

async function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];

  const staticRoutes: SitemapEntry[] = [
    { loc: `${SITE_URL}/`, lastmod: today, changefreq: 'daily', priority: 1.0 },
    { loc: `${SITE_URL}/shop`, lastmod: today, changefreq: 'daily', priority: 0.9 },
    { loc: `${SITE_URL}/collections`, lastmod: today, changefreq: 'weekly', priority: 0.8 },
    { loc: `${SITE_URL}/about`, lastmod: today, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/faq`, lastmod: today, changefreq: 'weekly', priority: 0.7 },
    { loc: `${SITE_URL}/contact`, lastmod: today, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/shipping`, lastmod: today, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/returns`, lastmod: today, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/privacy`, lastmod: today, changefreq: 'yearly', priority: 0.5 },
    { loc: `${SITE_URL}/terms`, lastmod: today, changefreq: 'yearly', priority: 0.5 },
  ];

  const products = await fetchProductSlugs();
  const productRoutes: SitemapEntry[] = products.map((prod) => ({
    loc: `${SITE_URL}/products/${prod.slug}`,
    lastmod: prod.lastmod || today,
    changefreq: 'weekly',
    priority: 0.8,
  }));

  const allEntries = [...staticRoutes, ...productRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}${
      entry.changefreq ? `\n    <changefreq>${entry.changefreq}</changefreq>` : ''
    }${entry.priority !== undefined ? `\n    <priority>${entry.priority.toFixed(1)}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>
`;

  // Ensure public folder exists
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPublicPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPublicPath, xml, 'utf-8');
  console.log(`[Sitemap] Generated ${sitemapPublicPath} with ${allEntries.length} URLs.`);

  // Also write to dist/sitemap.xml if dist exists
  const distDir = path.resolve('dist');
  if (fs.existsSync(distDir)) {
    const sitemapDistPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(sitemapDistPath, xml, 'utf-8');
    console.log(`[Sitemap] Copied to ${sitemapDistPath}`);
  }
}

generateSitemap().catch((err) => {
  console.error('[Sitemap] Critical error generating sitemap:', err);
  process.exit(1);
});
