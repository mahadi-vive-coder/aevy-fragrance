export interface FaqItem {
  id: string;
  category: 'Product & Scent' | 'Ordering & Delivery' | 'Usage & Longevity' | 'Returns & Authenticity';
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Product & Scent',
    question: 'What is the fragrance concentration of AEVY perfumes?',
    answer: 'All AEVY fragrances are crafted in Extrait de Parfum concentration (25%–30% pure fragrance oil essence). This provides a significantly richer depth, smoother dry-down, and longer skin retention compared to conventional Eau de Toilette or Eau de Parfum.'
  },
  {
    id: 'faq-2',
    category: 'Product & Scent',
    question: 'Are AEVY fragrances suitable for both men and women?',
    answer: 'Yes. AEVY designs fragrances around the philosophy of quiet luxury and effortless mood. Our scents, like OCEANIS, balance sparkling citrus top notes with soft lavender and warm amber-sandalwood bases, making them perfectly unisex and universally flattering.'
  },
  {
    id: 'faq-3',
    category: 'Ordering & Delivery',
    question: 'How long does delivery take across Bangladesh?',
    answer: 'For orders inside Dhaka, delivery takes 24 to 48 hours. For deliveries outside Dhaka across all 64 districts, delivery typically takes 2 to 4 business days via our partner express couriers.'
  },
  {
    id: 'faq-4',
    category: 'Ordering & Delivery',
    question: 'Is Cash on Delivery (COD) available?',
    answer: 'Yes! We provide Cash on Delivery for all addresses across Bangladesh. You can inspect the package exterior upon arrival and pay the courier directly in cash.'
  },
  {
    id: 'faq-5',
    category: 'Usage & Longevity',
    question: 'How long will OCEANIS last on my skin?',
    answer: 'Under normal conditions, OCEANIS delivers 8 to 12 hours of longevity on skin and over 24 hours on clothing fabrics. It is specially formulated to resist disappearing in high humidity.'
  },
  {
    id: 'faq-6',
    category: 'Usage & Longevity',
    question: 'What is the best way to apply Extrait de Parfum?',
    answer: 'Apply 2–3 sprays to pulse points: behind the earlobes, base of the neck, and inner wrists. Avoid rubbing your wrists together, as friction crushes the delicate top note molecules.'
  },
  {
    id: 'faq-7',
    category: 'Returns & Authenticity',
    question: 'Are AEVY fragrances authentic and small-batch?',
    answer: '100% authentic. Every single flacon is blended, macerated, and bottled in small batches right here in our Dhaka atelier using sustainably sourced niche oils.'
  },
  {
    id: 'faq-8',
    category: 'Returns & Authenticity',
    question: 'What is your damage or replacement policy?',
    answer: 'If your flacon arrives damaged or compromised during courier transit, please notify our WhatsApp concierge within 24 hours with photos, and we will issue an immediate priority replacement at no cost.'
  }
];
