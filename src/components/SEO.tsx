import React, { useEffect } from 'react';
import { buildCanonicalUrl, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '../lib/seo';

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  noindex?: boolean;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = 'AEVY Fragrance Bangladesh | Premium Perfumes for Men & Women';
const DEFAULT_DESCRIPTION =
  'Discover AEVY fragrances in Bangladesh — fresh, elegant and modern perfumes for men, women and unisex wear. Shop your everyday signature scent online.';

export const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = '/',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
  jsonLd,
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to get or create a meta tag
    const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Helper to set link tags
    const setLinkTag = (rel: string, href: string) => {
      let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.rel = rel;
        document.head.appendChild(element);
      }
      element.href = href;
    };

    // 2. Canonical URL
    const canonicalUrl = buildCanonicalUrl(canonicalPath);
    setLinkTag('canonical', canonicalUrl);

    // 3. Meta Description
    setMetaTag('name', 'description', description);

    // 4. Robots Meta
    setMetaTag('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');

    // 5. Open Graph Meta
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', ogImage);

    // 6. Twitter Card Meta
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 7. JSON-LD Structured Data
    const SCRIPT_ID = 'aevy-schema-jsonld';
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = SCRIPT_ID;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      try {
        scriptTag.textContent = JSON.stringify(jsonLd);
      } catch (err) {
        console.error('Error stringifying JSON-LD payload:', err);
      }
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Clean up script on unmount
      const existingScript = document.getElementById(SCRIPT_ID);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [title, description, canonicalPath, ogImage, ogType, noindex, jsonLd]);

  return null;
};
