import heroCampaign from '../assets/images/aevy_hero_campaign_1786864385152.jpg';
import oceanisBottle from '../assets/images/aevy_oceanis_bottle_1786864368427.jpg';
import bottleDetail from '../assets/images/aevy_bottle_detail_1786864433720.jpg';
import brandEditorial from '../assets/images/aevy_brand_editorial_1786864411002.jpg';
import packagingBox from '../assets/images/aevy_packaging_box_1786864454271.jpg';

export const HERO_CAMPAIGN_IMAGE = heroCampaign;
export const EDITORIAL_LIFESTYLE_IMAGE = brandEditorial;
export const OCEANIS_BOTTLE_IMAGE = oceanisBottle;
export const BOTTLE_DETAIL_IMAGE = bottleDetail;
export const BRAND_EDITORIAL_IMAGE = brandEditorial;
export const PACKAGING_BOX_IMAGE = packagingBox;

/**
 * Resolves an image URL so that:
 * 1. Valid HTTP/HTTPS URLs (e.g. Supabase Storage public URLs) are preserved as-is.
 * 2. Broken local string paths like `/src/assets/images/...` are converted to the bundled/hashed production asset.
 * 3. Empty or null image values fallback safely to a valid bottle image.
 */
export function resolveImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return oceanisBottle;
  }

  const trimmed = url.trim();

  // If already a full public URL (e.g. Supabase Storage, CDN, external), use directly
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // If it's a data URL or blob
  if (/^(data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  // Handle local asset paths
  if (trimmed.includes('hero_campaign')) {
    return heroCampaign;
  }
  if (trimmed.includes('editorial_lifestyle')) {
    return brandEditorial;
  }
  if (trimmed.includes('bottle_detail')) {
    return bottleDetail;
  }
  if (trimmed.includes('brand_editorial')) {
    return brandEditorial;
  }
  if (trimmed.includes('packaging_box')) {
    return packagingBox;
  }
  if (trimmed.includes('oceanis_bottle') || trimmed.includes('oceanis')) {
    return oceanisBottle;
  }

  // If starts with /images/ or /assets/
  if (trimmed.startsWith('/')) {
    // If it was /src/assets/images/xyz, point to /images/xyz
    if (trimmed.startsWith('/src/assets/images/')) {
      return trimmed.replace('/src/assets/images/', '/images/');
    }
    return trimmed;
  }

  return oceanisBottle;
}
