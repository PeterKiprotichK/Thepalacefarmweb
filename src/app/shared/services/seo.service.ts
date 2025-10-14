import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private defaultImage = 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1747141318/473177143_999405852207518_3242457423913962176_n_tfhsxg.jpg';
  private baseUrl = 'https://www.thepalacefarm.page';

  private pageData: { [key: string]: SEOData } = {
    '/': {
      title: 'The Palace Farm - Kenya\'s Premier Smart Farming Hub | Sustainable Agriculture Solutions',
      description: 'Transform your agricultural journey with The Palace Farm - Kenya\'s leading smart farming center. Premium poultry, hydroponic systems, farming training, and cutting-edge agricultural technology solutions.',
      keywords: 'smart farming Kenya, agriculture Kenya, sustainable farming, hydroponic farming, poultry farming, Kienyeji chicks, vertical farming, precision agriculture, agricultural training, farming technology, organic farming Kenya',
      type: 'website'
    },
    '/about': {
      title: 'About The Palace Farm - Agricultural Innovation Leaders in Kenya | Smart Farming Experts',
      description: 'Discover Kenya\'s premier agricultural innovation center. Learn about our sustainable farming practices, smart agriculture technology, comprehensive training programs, and commitment to food security.',
      keywords: 'agricultural innovation Kenya, smart farming experts, sustainable agriculture, farming technology Kenya, agricultural education, precision farming, modern agriculture Kenya, farming consultancy',
      type: 'article'
    },
    '/services': {
      title: 'Agricultural Services - Smart Farming Solutions & Training | The Palace Farm Kenya',
      description: 'Comprehensive agricultural services including hydroponic systems, poultry farming, vertical gardens, farming training, agricultural consultancy, and modern farming technology solutions.',
      keywords: 'agricultural services Kenya, farming training, hydroponic systems, poultry farming services, vertical farming, agricultural consultancy, farming technology, modern farming solutions Kenya',
      type: 'service'
    },
    '/farm': {
      title: 'Visit Our Smart Farm - Modern Agriculture Showcase | The Palace Farm Kenya',
      description: 'Experience Kenya\'s most advanced agricultural facility. Tour our hydroponic systems, precision farming technology, sustainable livestock operations, and innovative farming practices.',
      keywords: 'farm tour Kenya, smart farm visit, agricultural technology showcase, modern farming Kenya, precision agriculture, sustainable farming practices, agricultural innovation center',
      type: 'place'
    },
    '/shop': {
      title: 'Farm Products Shop - Premium Agricultural Products & Equipment | The Palace Farm',
      description: 'Shop premium agricultural products including Kienyeji chicks, hydroponic systems, farming equipment, organic produce, and modern farming solutions. Quality guaranteed.',
      keywords: 'agricultural products Kenya, Kienyeji chicks for sale, hydroponic systems Kenya, farming equipment, organic produce, agricultural supplies, farm products shop Kenya',
      type: 'product'
    },
    '/contact': {
      title: 'Contact The Palace Farm - Agricultural Consultancy & Support | Kenya Smart Farming',
      description: 'Get expert agricultural advice and support. Contact Kenya\'s leading smart farming consultants for personalized farming solutions, training, and agricultural guidance.',
      keywords: 'agricultural consultancy Kenya, farming advice, smart farming support, agricultural experts Kenya, farming consultation, agricultural guidance, farming help Kenya',
      type: 'organization'
    },
    '/blogs': {
      title: 'Agricultural Blog - Smart Farming Tips & Agricultural News | The Palace Farm Kenya',
      description: 'Stay updated with the latest smart farming techniques, agricultural innovations, farming tips, crop management advice, and agricultural industry news from Kenya\'s farming experts.',
      keywords: 'farming blog Kenya, agricultural news, smart farming tips, farming techniques, agricultural advice, crop management, farming innovation, agriculture Kenya blog',
      type: 'blog'
    }
  };

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router
  ) {
    // Listen to route changes and update SEO metadata
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateSEOData(event.url);
    });
  }

  updateSEOData(url: string): void {
    // Clean the URL (remove query params and fragments)
    const cleanUrl = url.split('?')[0].split('#')[0];
    const seoData = this.pageData[cleanUrl] || this.pageData['/'];

    // Update title
    this.title.setTitle(seoData.title);

    // Update meta description
    this.meta.updateTag({ name: 'description', content: seoData.description });
    this.meta.updateTag({ name: 'keywords', content: seoData.keywords });

    // Update Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: seoData.title });
    this.meta.updateTag({ property: 'og:description', content: seoData.description });
    this.meta.updateTag({ property: 'og:url', content: `${this.baseUrl}${cleanUrl}` });
    this.meta.updateTag({ property: 'og:type', content: seoData.type || 'website' });
    this.meta.updateTag({ property: 'og:image', content: seoData.image || this.defaultImage });

    // Update Twitter Card tags
    this.meta.updateTag({ name: 'twitter:title', content: seoData.title });
    this.meta.updateTag({ name: 'twitter:description', content: seoData.description });
    this.meta.updateTag({ name: 'twitter:image', content: seoData.image || this.defaultImage });
    this.meta.updateTag({ name: 'twitter:url', content: `${this.baseUrl}${cleanUrl}` });

    // Update canonical URL
    this.updateCanonicalUrl(`${this.baseUrl}${cleanUrl}`);

    // Add structured data for specific pages
    this.addStructuredData(cleanUrl, seoData);
  }

  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private addStructuredData(url: string, seoData: SEOData): void {
    // Remove existing structured data script if present
    const existingScript = document.querySelector('script[data-seo-structured]');
    if (existingScript) {
      existingScript.remove();
    }

    let structuredData: any = null;

    switch (url) {
      case '/':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "The Palace Farm",
          "url": "https://www.thepalacefarm.page",
          "logo": "https://res.cloudinary.com/dpls4kcqa/image/upload/v1747139956/download__5_-removebg-preview_thzusl.png",
          "description": seoData.description,
          "areaServed": "Kenya",
          "knowsAbout": ["Smart Farming", "Sustainable Agriculture", "Hydroponic Farming", "Poultry Farming", "Agricultural Technology"]
        };
        break;

      case '/services':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Agricultural Services",
          "provider": {
            "@type": "Organization",
            "name": "The Palace Farm"
          },
          "areaServed": "Kenya",
          "description": seoData.description
        };
        break;

      case '/shop':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "The Palace Farm Shop",
          "url": "https://www.thepalacefarm.page/shop",
          "description": seoData.description,
          "paymentAccepted": "M-Pesa, Cash"
        };
        break;
    }

    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-structured', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }

  // Method to manually update SEO data for dynamic content
  updatePageSEO(title: string, description: string, keywords?: string, image?: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    
    if (keywords) {
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }

    // Update Open Graph
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    
    if (image) {
      this.meta.updateTag({ property: 'og:image', content: image });
      this.meta.updateTag({ name: 'twitter:image', content: image });
    }

    // Update Twitter
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }
}