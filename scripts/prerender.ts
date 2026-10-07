import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { MOCK_PRODUCTS } from '../src/lib/mockData';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  buildCanonicalUrl,
  generateProductSeo,
  buildProductJsonLd,
  buildProductBreadcrumbJsonLd,
  buildOrganizationJsonLd,
} from '../src/lib/seo';

dotenv.config();
dotenv.config({ path: '.env.local' });

interface RouteMeta {
  path: string;
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  ogType: string;
  noindex?: boolean;
  jsonLd?: any;
}

async function getRoutes(): Promise<RouteMeta[]> {
  const routes: RouteMeta[] = [
    {
      path: '/',
      title: 'AEVY Fragrance Bangladesh | Premium Perfumes for Men & Women',
      description:
        'Discover AEVY fragrances in Bangladesh — fresh, elegant and modern perfumes for men, women and unisex wear. Shop your everyday signature scent online.',
      canonicalUrl: `${SITE_URL}`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'website',
      jsonLd: buildOrganizationJsonLd(),
    },
    {
      path: '/shop',
      title: 'Shop Perfumes in Bangladesh | AEVY Fragrance',
      description:
        "Explore AEVY's collection of refined perfumes in Bangladesh. Long-lasting Extrait de Parfum in 3ml, 10ml, 15ml, 30ml and 50ml editions with nationwide delivery.",
      canonicalUrl: `${SITE_URL}/shop`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'website',
    },
    {
      path: '/collections',
      title: 'Fragrance Collections | AEVY Fragrance Bangladesh',
      description:
        'Discover AEVY perfume collections and curated discovery sets in Bangladesh. Modern olfactory creations crafted for understated elegance.',
      canonicalUrl: `${SITE_URL}/collections`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'website',
    },
    {
      path: '/about',
      title: 'About AEVY | Modern Fragrance Atelier Bangladesh',
      description:
        'AEVY creates fresh, modern perfumes with quiet elegance in Bangladesh. Learn about our philosophy, high-concentration formulations and craftsmanship.',
      canonicalUrl: `${SITE_URL}/about`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'website',
    },
    {
      path: '/contact',
      title: 'Contact AEVY Atelier | Customer Concierge Bangladesh',
      description:
        'Get in touch with AEVY customer care for perfume consultations, order inquiries, or assistance. Prompt support across Bangladesh.',
      canonicalUrl: `${SITE_URL}/contact`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'website',
    },
    {
      path: '/faq',
      title: 'Frequently Asked Questions | AEVY Fragrance',
      description:
        'Find answers about AEVY perfumes, bottle sizes, fragrance concentration, delivery across Bangladesh, cash on delivery and return policies.',
      canonicalUrl: `${SITE_URL}/faq`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'website',
    },
    {
      path: '/shipping',
      title: 'Shipping & Delivery Policy | AEVY Fragrance Bangladesh',
      description:
        'AEVY offers reliable nationwide delivery across Bangladesh with Cash on Delivery. Learn about delivery times, rates, and tracking your order.',
      canonicalUrl: `${SITE_URL}/shipping`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'website',
    },
    {
      path: '/returns',
      title: 'Return & Exchange Policy | AEVY Fragrance',
      description:
        "Read AEVY's 7-day return and exchange policy for unopened fragrance flacons in Bangladesh. Hassle-free support for every client.",
      canonicalUrl: `${SITE_URL}/returns`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'website',
    },
    {
      path: '/privacy',
      title: 'Privacy Policy | AEVY Fragrance',
      description:
        'AEVY is committed to protecting your personal information and privacy. Read how we collect, store, and safeguard your data.',
      canonicalUrl: `${SITE_URL}/privacy`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'website',
    },
    {
      path: '/terms',
      title: 'Terms of Service | AEVY Fragrance',
      description:
        'Review terms and conditions for ordering perfumes, purchasing discovery sets, and using the AEVY fragrance online store in Bangladesh.',
      canonicalUrl: `${SITE_URL}/terms`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: 'website',
    },
  ];

  // Try fetching live products
  let productsToPrerender = MOCK_PRODUCTS;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true);
      if (!error && data && data.length > 0) {
        productsToPrerender = data as any;
      }
    } catch {
      // ignore
    }
  }

  // Add product pages
  productsToPrerender.forEach((product) => {
    const seo = generateProductSeo(product);
    const productJsonLd = buildProductJsonLd(product, seo.canonicalUrl);
    const breadcrumbJsonLd = buildProductBreadcrumbJsonLd(product, seo.canonicalUrl);

    routes.push({
      path: `/products/${product.slug}`,
      title: seo.title,
      description: seo.description,
      canonicalUrl: seo.canonicalUrl,
      ogImage: seo.ogImage,
      ogType: 'product',
      jsonLd: [productJsonLd, breadcrumbJsonLd],
    });
  });

  return routes;
}

function injectMetadata(htmlTemplate: string, meta: RouteMeta): string {
  let html = htmlTemplate;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${meta.title}</title>`);

  // Replace Meta Description
  html = html.replace(
    /<meta name="description" content=".*?"\s*\/?>/i,
    `<meta name="description" content="${meta.description.replace(/"/g, '&quot;')}" />`
  );

  // Replace or add Canonical
  if (/<link rel="canonical"/i.test(html)) {
    html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/i, `<link rel="canonical" href="${meta.canonicalUrl}" />`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${meta.canonicalUrl}" />\n</head>`);
  }

  // Replace or update OG tags
  html = html.replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${meta.title.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${meta.description.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta property="og:url" content=".*?"\s*\/?>/i, `<meta property="og:url" content="${meta.canonicalUrl}" />`);
  html = html.replace(/<meta property="og:image" content=".*?"\s*\/?>/i, `<meta property="og:image" content="${meta.ogImage}" />`);
  html = html.replace(/<meta property="og:type" content=".*?"\s*\/?>/i, `<meta property="og:type" content="${meta.ogType}" />`);

  // Replace or update Twitter tags
  html = html.replace(/<meta name="twitter:title" content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${meta.title.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${meta.description.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta name="twitter:image" content=".*?"\s*\/?>/i, `<meta name="twitter:image" content="${meta.ogImage}" />`);

  // Robots meta
  const robotsTag = meta.noindex ? '<meta name="robots" content="noindex,nofollow" />' : '<meta name="robots" content="index,follow" />';
  if (/<meta name="robots"/i.test(html)) {
    html = html.replace(/<meta name="robots" content=".*?"\s*\/?>/i, robotsTag);
  } else {
    html = html.replace('</head>', `  ${robotsTag}\n</head>`);
  }

  // Inject JSON-LD
  if (meta.jsonLd) {
    const jsonLdString = JSON.stringify(meta.jsonLd);
    const jsonLdTag = `  <script type="application/ld+json" id="aevy-schema-jsonld">${jsonLdString}</script>\n`;
    html = html.replace('</head>', `${jsonLdTag}</head>`);
  }

  return html;
}

export async function prerender() {
  const distDir = path.resolve('dist');
  const indexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.warn('[Prerender] dist/index.html not found. Run "vite build" first.');
    return;
  }

  const template = fs.readFileSync(indexHtmlPath, 'utf-8');
  const routes = await getRoutes();

  console.log(`[Prerender] Starting static HTML head injection for ${routes.length} routes...`);

  routes.forEach((route) => {
    const populatedHtml = injectMetadata(template, route);

    if (route.path === '/') {
      // Overwrite dist/index.html with homepage metadata
      fs.writeFileSync(indexHtmlPath, populatedHtml, 'utf-8');
    } else {
      const cleanSubPath = route.path.replace(/^\//, '');
      const targetDir = path.join(distDir, cleanSubPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetFile = path.join(targetDir, 'index.html');
      fs.writeFileSync(targetFile, populatedHtml, 'utf-8');
    }
  });

  console.log('[Prerender] Successfully generated static route HTML files for all pages and products.');
}

prerender().catch((err) => {
  console.error('[Prerender] Error during prerender:', err);
  process.exit(1);
});
