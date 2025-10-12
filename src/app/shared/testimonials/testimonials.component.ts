import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TestimonialsComponent implements OnInit {
  testimonials = [
    {
      name: 'Kamau Wanjiru',
      role: 'Restaurant Owner, Nairobi',
      text: 'The Palace Farm’s fresh produce has truly elevated my restaurant’s dishes. Their dedication to quality is unmatched!',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739700821/images__3_-removebg-preview_c92x2d.png',
      rating: 5,
    },
    {
      name: 'Achieng Otieno',
      role: 'Local Farmer, Kisumu',
      text: 'Their farm is a source of inspiration! I learned so much about smart farming techniques during their training sessions.',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739700821/images__3_-removebg-preview_c92x2d.png',
      rating: 4,
    },
    {
      name: 'Mutiso Ndunge',
      role: 'Food Vendor, Machakos',
      text: 'The vegetables I source from The Palace Farm are always fresh and healthy. My customers notice the difference!',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739700821/images__3_-removebg-preview_c92x2d.png',
      rating: 5,
    },
    {
      name: 'Cherono Kiptoo',
      role: 'Cafe Owner, Eldoret',
      text: 'I only use Palace Farm’s organic milk for my coffee. The taste and freshness are unbeatable!',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739701483/person-gray-photo-placeholder-woman-vector-23522395-removebg-preview_innl1y.png',
      rating: 5,
    },
    {
      name: 'Abdi Hassan',
      role: 'Hotel Manager, Garissa',
      text: 'Their fresh produce has become a staple in our hotel’s kitchen. The quality is always top-notch!',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739700821/images__3_-removebg-preview_c92x2d.png',
      rating: 4,
    },
    
    {
      name: 'Kendi Mureithi',
      role: 'Nutritionist, Meru',
      text: 'I recommend The Palace Farm’s fresh produce to my clients. It’s nutritious and supports local communities.',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739701483/person-gray-photo-placeholder-woman-vector-23522395-removebg-preview_innl1y.png',
      rating: 5,
    },
    {
      name: 'Ahmed Noor',
      role: 'Restaurant Owner, Isiolo',
      text: 'Their fresh milk adds a unique taste to our dishes. Highly recommended!',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739700821/images__3_-removebg-preview_c92x2d.png',
      rating: 4,
    },
    {
      name: 'Moraa Bosibori',
      role: 'Vegetable Farmer, Nyamira',
      text: 'As a fellow farmer, I appreciate their transparency and community support.',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739701483/person-gray-photo-placeholder-woman-vector-23522395-removebg-preview_innl1y.png',
      rating: 5,
    },
    {
      name: 'Ndungu Kariuki',
      role: 'Wholesaler, Thika',
      text: 'Reliable deliveries and top-tier produce. Palace Farm is my go-to supplier!',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739700821/images__3_-removebg-preview_c92x2d.png',
      rating: 4,
    },
    {
      name: 'Njoki Wairimu',
      role: 'Pastry Chef, Nyeri',
      text: 'Their fresh cream makes my pastries taste incredible. My customers notice the difference!',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739701483/person-gray-photo-placeholder-woman-vector-23522395-removebg-preview_innl1y.png',
      rating: 5,
    },
    {
      name: 'Ali Mohamed',
      role: 'Retailer, Malindi',
      text: 'Always fresh, always delivered on time. Exceptional service!',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739700821/images__3_-removebg-preview_c92x2d.png',
      rating: 5,
    },
    {
      name: 'Faith Wanjiku',
      role: 'Eco-Activist, Kericho',
      text: 'Their commitment to eco-friendly farming is impressive. I fully support what they stand for!',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739701483/person-gray-photo-placeholder-woman-vector-23522395-removebg-preview_innl1y.png',
      rating: 5,
    },
    {
      name: 'John Kibet',
      role: 'Agribusiness Consultant, Kitale',
      text: 'The Palace Farm is leading the way in modern, sustainable farming. Highly impressed!',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739700821/images__3_-removebg-preview_c92x2d.png',
      rating: 5,
    },
    {
      name: 'Mary Naliaka',
      role: 'Urban Farmer, Nairobi',
      text: 'Urban farming with The Palace Farm has been a game-changer. Great partners!',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739701483/person-gray-photo-placeholder-woman-vector-23522395-removebg-preview_innl1y.png',
      rating: 4,
    },
    {
      name: 'Peter Kiprono',
      role: 'Youth Farmer, Nakuru',
      text: 'Their mentorship program helped me get started with organic farming. Life-changing support!',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739701483/person-gray-photo-placeholder-woman-vector-23522395-removebg-preview_innl1y.png',
      rating: 5,
    },
    {
      name: 'Lydia Chebet',
      role: 'School Nutrition Officer, Bomet',
      text: 'Our students love their fresh produce! A reliable partner for school nutrition programs.',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1739701483/person-gray-photo-placeholder-woman-vector-23522395-removebg-preview_innl1y.png',
      rating: 4,
    },
  ];

  currentIndex = 0;

  ngOnInit(): void {
    setInterval(() => {
      this.nextTestimonial();
    }, 3000);
  }

  nextTestimonial(): void {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  getTransform(index: number): string {
    const offset = (index - this.currentIndex) * 100;
    const scale = index === this.currentIndex ? 1.2 : 0.8;
    return `translateX(${offset}%) scale(${scale})`;
  }

  getRatingStars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => (i < rating ? '★' : '☆'));
  }
  trackByIndex(index: number, item: any): number {
  return index;
}

}
