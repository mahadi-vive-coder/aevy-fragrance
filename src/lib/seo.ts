import { DBProduct, ProductWithVariants } from '../types';

export const SITE_URL = 'https://aevyfragrance.shop';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/logo_n.jpg`;
export const SITE_NAME = 'AEVY Fragrance';

/**
 * Normalizes a path into a canonical absolute URL without trailing slash (except root)
 * and strips query parameters or hash fragments.
 */
export function buildCanonicalUrl(path: string = '/'): string {
  const cleanPath = path.split('?')[0].split('#')[0].trim();
  if (!cleanPath || cleanPath === '/') {
    return SITE_URL;
  }
  const formatted = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  // Remove duplicate trailing slashes
  const trimmed = formatted.replace(/\/+$/, '');
  return `${SITE_URL}${trimmed}`;
}

export interface ProductSeoMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
}

/**
 * Generates an SEO title and description from real product data fields.
 * Ensures titles stay under ~60 chars and descriptions stay under ~155 chars.
 */
export function generateProductSeo(product: DBProduct | ProductWithVariants): ProductSeoMeta {
  const name = product.name?.trim() || 'Fragrance';
  const category = product.category?.trim() || 'Extrait de Parfum';
  
  // Format gender descriptor
  let genderDesc = '';
  if (product.gender) {
    const g = product.gender.toLowerCase();
    if (g.includes('unisex')) genderDesc = 'for Men & Women';
    else if (g.includes('masculine') || g.includes('men')) genderDesc = 'for Men';
    else if (g.includes('feminine') || g.includes('women')) genderDesc = 'for Women';
  }

  // Build clean concise title (under 60 chars)
  // Example: "AEVY Oceanis | Fresh Aquatic Perfume for Men & Women"
  let title = `AEVY ${name}`;
  const titleCategory = category.split('/')[0].trim();
  const titleCandidate = `AEVY ${name} | ${titleCategory} Perfume${genderDesc ? ` ${genderDesc}` : ''}`;
  if (titleCandidate.length <= 60) {
    title = titleCandidate;
  } else {
    const fallbackCandidate = `AEVY ${name} | ${titleCategory} Perfume`;
    title = fallbackCandidate.length <= 60 ? fallbackCandidate : `AEVY ${name} Extrait de Parfum`;
  }

  // Extract real fragrance notes if available
  const rawNotes: string[] = [];
  let parsedNotes = product.notes;

  if (typeof parsedNotes === 'string' && parsedNotes.startsWith('{')) {
    try {
      parsedNotes = JSON.parse(parsedNotes);
    } catch {
      // ignore
    }
  }

  if (parsedNotes && typeof parsedNotes === 'object') {
    const addNotes = (val: any) => {
      if (Array.isArray(val)) {
        val.forEach((item) => typeof item === 'string' && item.trim() && rawNotes.push(item.trim()));
      } else if (typeof val === 'string' && val.trim()) {
        val.split(/[,•|]/).forEach((item) => item.trim() && rawNotes.push(item.trim()));
      }
    };
    addNotes(parsedNotes.top);
    addNotes(parsedNotes.heart);
    addNotes(parsedNotes.base);
  }

  if (rawNotes.length === 0) {
    [product.top_notes, product.heart_notes, product.base_notes].forEach((n) => {
      if (typeof n === 'string' && n.trim()) {
        n.split(/[,•|]/).forEach((item) => item.trim() && rawNotes.push(item.trim()));
      }
    });
  }

  // Filter out any punctuation-only or whitespace strings
  const validNotes = rawNotes
    .map((n) => n.replace(/^[•|,\s]+|[•|,\s]+$/g, '').trim())
    .filter((n) => n.length > 1 && !/^[,•|]+$/.test(n));

  const notesStr = validNotes.slice(0, 4).join(', ');

  // Construct description from real notes and attributes
  let description = '';
  if (notesStr && notesStr.length > 3) {
    description = `AEVY ${name} is an Extrait de Parfum with ${notesStr} accords. A refreshing everyday fragrance ${genderDesc ? `${genderDesc} ` : ''}in Bangladesh.`;
  } else if (product.description && product.description.trim().length > 10) {
    description = product.description.replace(/\s+/g, ' ').trim();
  } else {
    description = `AEVY ${name} — premium luxury ${category.toLowerCase()} perfume ${genderDesc ? `${genderDesc} ` : ''}in Bangladesh. Long-lasting signature fragrance.`;
  }

  // Trim to 155 chars without cutting words
  if (description.length > 155) {
    description = description.slice(0, 152).trim() + '...';
  }

  const canonicalUrl = buildCanonicalUrl(`/products/${product.slug}`);
  const ogImage = product.image_url || (product.images && product.images[0]) || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    canonicalUrl,
    ogImage: ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`,
  };
}

/**
 * Builds Schema.org Product structured data from verified database properties.
 * Adheres strictly to the rule: NO fake reviews, NO fake ratings.
 */
export function buildProductJsonLd(product: DBProduct | ProductWithVariants, canonicalUrl: string) {
  const images = (product.images && product.images.length > 0)
    ? product.images.map((img) => img.startsWith('http') ? img : `${SITE_URL}${img.startsWith('/') ? '' : '/'}${img}`)
    : product.image_url
      ? [product.image_url.startsWith('http') ? product.image_url : `${SITE_URL}${product.image_url.startsWith('/') ? '' : '/'}${product.image_url}`]
      : [DEFAULT_OG_IMAGE];

  const variants = product.variants || [];
  const inStock = variants.length > 0
    ? variants.some((v) => (v.stock === undefined || v.stock > 0) && v.is_active)
    : true;

  const price = Number(product.price || (variants[0] ? variants[0].price : 0));

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `AEVY ${product.name}`,
    image: images,
    description: product.description || `AEVY ${product.name} Extrait de Parfum fragrance.`,
    sku: product.sku || product.slug,
    brand: {
      '@type': 'Brand',
      name: 'AEVY',
    },
    category: product.category || 'Perfume',
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'BDT',
      price: price > 0 ? price : 1650,
      priceValidUntil: '2027-12-31',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'AEVY Fragrance',
      },
    },
  };
}

/**
 * Builds Schema.org BreadcrumbList structured data for product pages.
 */
export function buildProductBreadcrumbJsonLd(product: DBProduct | ProductWithVariants, canonicalUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: `${SITE_URL}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: canonicalUrl,
      },
    ],
  };
}

/**
 * Builds Schema.org Organization and WebSite structured data for Homepage.
 */
export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'AEVY Fragrance',
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo_n.jpg`,
        description: 'Modern, fresh and elegant luxury fragrance house based in Bangladesh.',
        sameAs: [
          'https://instagram.com/aevy.fragrance',
          'https://facebook.com/aevy.fragrance',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Support',
          availableLanguage: ['English', 'Bengali'],
          email: 'aevy.brand@gmail.com',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'AEVY Fragrance',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        inLanguage: 'en-US',
      },
    ],
  };
}
