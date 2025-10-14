export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'service';
  structuredData?: any;
}

export const AGRICULTURE_KEYWORDS = [
  'smart farming Kenya',
  'sustainable agriculture',
  'precision farming',
  'hydroponic farming',
  'vertical farming',
  'poultry farming Kenya',
  'Kienyeji chickens',
  'agricultural technology',
  'farming training',
  'agricultural consultancy',
  'organic farming',
  'greenhouse farming',
  'crop production',
  'livestock management',
  'agricultural innovation',
  'modern farming Kenya',
  'agricultural equipment',
  'farming solutions',
  'agribusiness Kenya',
  'agricultural education',
  'farming techniques',
  'agricultural development',
  'food security',
  'rural development',
  'farm management'
];

export const PAGE_SEO_CONFIG: { [key: string]: SEOConfig } = {
  '/': {
    title: 'The Palace Farm - Kenya\'s Premier Smart Farming Hub | Sustainable Agriculture Solutions',
    description: 'Transform your agricultural journey with The Palace Farm - Kenya\'s leading smart farming center. Premium poultry, hydroponic systems, farming training, and cutting-edge agricultural technology solutions.',
    keywords: [...AGRICULTURE_KEYWORDS, 'The Palace Farm', 'agriculture Kenya', 'smart farming hub'],
    ogType: 'website',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "The Palace Farm",
      "url": "https://www.thepalacefarm.page",
      "logo": "https://res.cloudinary.com/dpls4kcqa/image/upload/v1747139956/download__5_-removebg-preview_thzusl.png",
      "sameAs": ["https://www.thepalacefarm.page"],
      "areaServed": "Kenya",
      "knowsAbout": AGRICULTURE_KEYWORDS
    }
  },
  '/about': {
    title: 'About The Palace Farm - Agricultural Innovation Leaders in Kenya | Smart Farming Experts',
    description: 'Discover Kenya\'s premier agricultural innovation center. Learn about our sustainable farming practices, smart agriculture technology, comprehensive training programs, and commitment to food security.',
    keywords: ['agricultural innovation Kenya', 'smart farming experts', 'sustainable agriculture', 'farming technology Kenya', 'agricultural education'],
    ogType: 'article'
  },
  '/services': {
    title: 'Agricultural Services - Smart Farming Solutions & Training | The Palace Farm Kenya',
    description: 'Comprehensive agricultural services including hydroponic systems, poultry farming, vertical gardens, farming training, agricultural consultancy, and modern farming technology solutions.',
    keywords: ['agricultural services Kenya', 'farming training', 'hydroponic systems', 'poultry farming services', 'agricultural consultancy'],
    ogType: 'service'
  },
  '/farm': {
    title: 'Visit Our Smart Farm - Modern Agriculture Showcase | The Palace Farm Kenya',
    description: 'Experience Kenya\'s most advanced agricultural facility. Tour our hydroponic systems, precision farming technology, sustainable livestock operations, and innovative farming practices.',
    keywords: ['farm tour Kenya', 'smart farm visit', 'agricultural technology showcase', 'modern farming Kenya', 'precision agriculture'],
    ogType: 'article'
  },
  '/shop': {
    title: 'Farm Products Shop - Premium Agricultural Products & Equipment | The Palace Farm',
    description: 'Shop premium agricultural products including Kienyeji chicks, hydroponic systems, farming equipment, organic produce, and modern farming solutions. Quality guaranteed.',
    keywords: ['agricultural products Kenya', 'Kienyeji chicks for sale', 'hydroponic systems Kenya', 'farming equipment', 'agricultural supplies'],
    ogType: 'product'
  },
  '/contact': {
    title: 'Contact The Palace Farm - Agricultural Consultancy & Support | Kenya Smart Farming',
    description: 'Get expert agricultural advice and support. Contact Kenya\'s leading smart farming consultants for personalized farming solutions, training, and agricultural guidance.',
    keywords: ['agricultural consultancy Kenya', 'farming advice', 'smart farming support', 'agricultural experts Kenya', 'farming consultation'],
    ogType: 'article'
  },
  '/blogs': {
    title: 'Agricultural Blog - Smart Farming Tips & Agricultural News | The Palace Farm Kenya',
    description: 'Stay updated with the latest smart farming techniques, agricultural innovations, farming tips, crop management advice, and agricultural industry news from Kenya\'s farming experts.',
    keywords: ['farming blog Kenya', 'agricultural news', 'smart farming tips', 'farming techniques', 'agricultural advice'],
    ogType: 'article'
  }
};

export function getPageSEO(path: string): SEOConfig {
  const cleanPath = path.split('?')[0].split('#')[0];
  return PAGE_SEO_CONFIG[cleanPath] || PAGE_SEO_CONFIG['/'];
}