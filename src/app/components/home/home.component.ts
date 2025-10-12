import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TestimonialsComponent } from '../../shared/testimonials/testimonials.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
initTestimonials() {
throw new Error('Method not implemented.');
}
currentImage: any;
images: any;
currentIndex: any;


}
