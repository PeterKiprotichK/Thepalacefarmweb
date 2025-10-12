import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  blog: any = null;

  blogs = [
    {
      id: 0,
      category: 'ORGANIC FARMING',
      title: 'The Benefits of Organic Vegetables',
      short: 'Explore the health and environmental advantages of growing and consuming organic vegetables at The Palace Farm',
      full: 'Organic vegetables are grown without synthetic pesticides, fertilizers, or genetically modified organisms, making them healthier for consumers and the environment. At The Palace Farm, our organic produce is rich in nutrients, free from harmful chemicals, and supports biodiversity. Learn how organic farming practices contribute to soil health, reduce pollution, and promote sustainable agriculture. Organic farming relies on natural methods to maintain soil fertility and control pests. We use compost, crop rotation, and beneficial insects to keep our fields healthy. This approach not only produces tastier vegetables but also helps preserve the ecosystem. Consumers benefit from higher antioxidant levels and fewer residues, leading to better health outcomes. At The Palace Farm, we prioritize sustainability. Our organic methods reduce water usage through efficient irrigation and prevent soil erosion. By avoiding chemicals, we protect local wildlife and waterways. Join us in supporting organic agriculture for a greener future.',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1748436537/WhatsApp_Image_2025-05-26_at_18.17.19_56a2337c_toikcw.jpg',
      author: 'Silas Kipruto',
      authorImg: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1760127558/images_cdc5v2.jpg',
      role: 'The Palace Farm CEO',
    },
    {
      id: 1,
      category: 'SUSTAINABILITY',
      title: 'Sustainable Vegetable Farming Methods',
      short: 'Learn about eco-friendly practices we use to grow healthy, organic vegetables for our community',
      full: 'Our farm uses crop rotation, organic fertilizers, and integrated pest management to maintain soil health and reduce chemical use. We also employ water-saving irrigation techniques and encourage biodiversity by planting cover crops. These methods not only benefit the environment but also produce tastier, healthier vegetables for our customers.',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1748436537/WhatsApp_Image_2025-05-26_at_18.17.19_56a2337c_toikcw.jpg',
      author: 'Silas Kipruto',
      authorImg: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1760127558/images_cdc5v2.jpg',
      role: 'The Palace Farm CEO',
    },
    {
      id: 2,
      category: 'COMMUNITY',
      title: 'Empowering Local Farmers',
      short: 'See how The Palace Farm supports local farmers through training and resources',
      full: 'We regularly host workshops and provide access to modern farming tools for local farmers. By sharing knowledge and resources, we help uplift the community and promote sustainable agriculture. Our farm is a hub for innovation and collaboration, making a positive impact on the region. Through our community programs, we offer training in organic farming techniques, sustainable practices, and modern technology adoption. Farmers learn about crop rotation, soil health management, and efficient water use. We also provide mentorship and networking opportunities to connect local producers with markets and resources. Our goal is to build a resilient agricultural community that thrives economically and environmentally.',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1748249717/WhatsApp_Image_2025-05-26_at_11.28.42_88d73486_nclwlb.jpg',
      author: 'Silas Kipruto',
      authorImg: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1760127558/images_cdc5v2.jpg',
      role: 'The Palace Farm CEO',
    },
    {
      id: 3,
      category: 'INNOVATION',
      title: 'Vertical Farming at The Palace',
      short: 'Discover our new vertical farming initiative and its benefits',
      full: 'Vertical farming allows us to grow more produce in less space, using less water and energy. Our new facility features stacked growing beds, LED lighting, and climate control systems. This approach is ideal for urban environments and helps us supply fresh vegetables year-round. Vertical farming maximizes space efficiency by growing crops in vertically stacked layers, often indoors under controlled conditions. This method uses 95% less water than traditional farming and eliminates the need for pesticides. At The Palace Farm, our vertical farm integrates hydroponic systems, automated nutrient delivery, and AI-monitored growth cycles. We produce a variety of leafy greens, herbs, and microgreens year-round, ensuring fresh, local produce even in challenging climates. This innovation not only boosts productivity but also reduces transportation emissions and supports urban food security.',
      image: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1748249718/WhatsApp_Image_2025-05-26_at_11.28.36_a950ebb3_cgtqke.jpg',
      author: 'Silas Kipruto',
      authorImg: 'https://res.cloudinary.com/dpls4kcqa/image/upload/v1760127558/images_cdc5v2.jpg',
      role: 'The Palace Farm CEO',
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blog = this.blogs[parseInt(id)];
    }
    if (!this.blog) {
      this.router.navigate(['/blogs']);
    }
  }

  goBack() {
    this.router.navigate(['/blogs']);
  }
}