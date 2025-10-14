import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SEOService } from '../../shared/services/seo.service';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  image: string;
  slug: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white">
      <!-- Header -->
      <header class="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div class="max-w-6xl mx-auto px-6 text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Agricultural Knowledge Hub
          </h1>
          <p class="text-xl text-green-100 max-w-3xl mx-auto">
            Expert insights, farming tips, and agricultural innovations to help you succeed in modern farming
          </p>
        </div>
      </header>

      <!-- Blog Posts Grid -->
      <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article *ngFor="let post of blogPosts" class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img [src]="post.image" [alt]="post.title" class="w-full h-48 object-cover">
              <div class="p-6">
                <div class="flex items-center gap-2 mb-3">
                  <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{{ post.category }}</span>
                  <time class="text-gray-500 text-sm">{{ formatDate(post.date) }}</time>
                </div>
                <h2 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{{ post.title }}</h2>
                <p class="text-gray-600 mb-4 line-clamp-3">{{ post.excerpt }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500">By {{ post.author }}</span>
                  <a [routerLink]="['/blogs', post.slug]" class="text-green-600 hover:text-green-800 font-semibold">
                    Read More →
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="bg-gray-50 py-12 px-6">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-2xl font-bold text-center mb-8">Explore Topics</h2>
          <div class="flex flex-wrap justify-center gap-4">
            <button *ngFor="let category of categories" 
                    (click)="filterByCategory(category)"
                    class="bg-white hover:bg-green-50 text-gray-700 hover:text-green-800 px-4 py-2 rounded-full border border-gray-200 hover:border-green-300 transition-colors">
              {{ category }}
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class BlogComponent implements OnInit {
  blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Smart Farming Technologies Revolutionizing Kenyan Agriculture',
      excerpt: 'Discover how precision agriculture, IoT sensors, and data-driven farming are transforming crop yields and efficiency in Kenya\'s agricultural sector.',
      content: 'Full content here...',
      author: 'The Palace Farm Team',
      date: '2025-01-26',
      category: 'Smart Farming',
      tags: ['precision agriculture', 'IoT', 'technology', 'Kenya farming'],
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1747141318/473177143_999405852207518_3242457423913962176_n_tfhsxg.jpg',
      slug: 'smart-farming-technologies-kenya'
    },
    {
      id: '2',
      title: 'Hydroponic Farming: The Future of Sustainable Agriculture',
      excerpt: 'Learn about soil-less cultivation methods, nutrient management, and how hydroponic systems can increase yields while conserving water.',
      content: 'Full content here...',
      author: 'Agricultural Experts',
      date: '2025-01-25',
      category: 'Hydroponics',
      tags: ['hydroponic farming', 'sustainable agriculture', 'water conservation', 'vertical farming'],
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1748249718/WhatsApp_Image_2025-05-26_at_11.28.33_3727ddd9_ryzxqd.jpg',
      slug: 'hydroponic-farming-sustainable-agriculture'
    },
    {
      id: '3',
      title: 'Kienyeji Poultry Farming: Complete Guide to Success',
      excerpt: 'Comprehensive guide to raising healthy Kienyeji chickens, from chick selection to market-ready birds, including feeding, housing, and disease management.',
      content: 'Full content here...',
      author: 'Poultry Specialists',
      date: '2025-01-24',
      category: 'Poultry Farming',
      tags: ['Kienyeji chickens', 'poultry management', 'livestock farming', 'poultry business'],
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1748249716/WhatsApp_Image_2025-05-26_at_11.28.47_4e3e2ef6_mixeoc.jpg',
      slug: 'kienyeji-poultry-farming-guide'
    },
    {
      id: '4',
      title: 'Vertical Farming Solutions for Urban Agriculture',
      excerpt: 'Maximize space and productivity with vertical farming systems perfect for urban environments and small-scale commercial operations.',
      content: 'Full content here...',
      author: 'Urban Farming Experts',
      date: '2025-01-23',
      category: 'Vertical Farming',
      tags: ['vertical farming', 'urban agriculture', 'space optimization', 'modern farming'],
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1748249717/WhatsApp_Image_2025-05-26_at_11.28.39_81ad0955_mmaps3.jpg',
      slug: 'vertical-farming-urban-agriculture'
    },
    {
      id: '5',
      title: 'Sustainable Farming Practices for Climate Resilience',
      excerpt: 'Build climate-resilient farming systems through regenerative agriculture, soil health management, and sustainable farming techniques.',
      content: 'Full content here...',
      author: 'Sustainability Team',
      date: '2025-01-22',
      category: 'Sustainable Farming',
      tags: ['climate resilience', 'regenerative agriculture', 'soil health', 'sustainability'],
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1747141318/473177143_999405852207518_3242457423913962176_n_tfhsxg.jpg',
      slug: 'sustainable-farming-climate-resilience'
    },
    {
      id: '6',
      title: 'Agricultural Business Planning and Market Access',
      excerpt: 'Strategic planning for profitable farming ventures, including market analysis, financial planning, and value chain optimization.',
      content: 'Full content here...',
      author: 'Business Development Team',
      date: '2025-01-21',
      category: 'Agribusiness',
      tags: ['agribusiness', 'farm planning', 'market access', 'agricultural finance'],
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1748249716/WhatsApp_Image_2025-05-26_at_11.28.47_4e3e2ef6_mixeoc.jpg',
      slug: 'agricultural-business-planning'
    }
  ];

  categories = [
    'All Topics',
    'Smart Farming',
    'Hydroponics',
    'Poultry Farming',
    'Vertical Farming',
    'Sustainable Farming',
    'Agribusiness',
    'Crop Management',
    'Livestock',
    'Agricultural Technology'
  ];

  constructor(private seoService: SEOService) {}

  ngOnInit(): void {
    this.seoService.updatePageSEO(
      'Agricultural Blog - Smart Farming Tips & Agricultural News | The Palace Farm Kenya',
      'Stay updated with the latest smart farming techniques, agricultural innovations, farming tips, crop management advice, and agricultural industry news from Kenya\'s farming experts.',
      'farming blog Kenya, agricultural news, smart farming tips, farming techniques, agricultural advice, crop management, farming innovation, agriculture Kenya blog'
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  filterByCategory(category: string): void {
    if (category === 'All Topics') {
      // Show all posts
      return;
    }
    // Filter posts by category (implement filtering logic)
    console.log('Filtering by:', category);
  }
}