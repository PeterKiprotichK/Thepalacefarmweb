import { Component } from '@angular/core';
import { ServicesService } from '../../shared/services/services.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-farm',
  imports: [CommonModule],
  templateUrl: './farm.component.html',
  styleUrls: ['./farm.component.scss'],
  standalone: true
})
export class FarmComponent {
  farms$: Observable<any[]>;  // Observable of farms
  loading = true;             // Keep loading for template if needed

  constructor(private servicesService: ServicesService) {
    // Assign the observable from the service directly
    this.farms$ = this.servicesService.getAllFarms();
  }
}
