import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ServicesService } from '../../shared/services/services.service';

interface CreateFarmDto {
  title: string;
  imageUrl: string;
  practiceType: string;
  description: string;
}

interface Farm extends CreateFarmDto {
  _id?: string;
}

@Component({
  selector: 'app-farmadmin',
  templateUrl: './farmadmin.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class FarmadminComponent implements OnInit {
  farms: Farm[] = [];
  newFarm: CreateFarmDto = this.getEmptyFarm();
  loading = false;
  editMode = false;
  editingFarmId: string | null = null;
  creatingNew = false;

  constructor(private servicesService: ServicesService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.fetchFarms();
  }

  // Called when "+ Add New Farm" button is clicked
  startNewFarm(): void {
    this.creatingNew = true;
    this.editMode = false;
    this.editingFarmId = null;
    this.newFarm = this.getEmptyFarm();
  }

  // Fetch all farms from backend
  fetchFarms(): void {
    this.loading = true;
    this.servicesService.getAllFarms().subscribe({
      next: (data) => {
        this.farms = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching farms:', err);
        this.loading = false;
      },
    });
  }

  // Validate URL string format
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Submit form - create or update farm
  submitFarm(): void {
    if (!this.isValidUrl(this.newFarm.imageUrl)) {
      if (isPlatformBrowser(this.platformId)) {
        alert('Please enter a valid image URL.');
      }
      return;
    }

    this.loading = true;

    const farmToSubmit: CreateFarmDto = {
      ...this.newFarm,
    };

    const action = this.editMode && this.editingFarmId
      ? this.servicesService.updateFarm(this.editingFarmId, farmToSubmit)
      : this.servicesService.createFarm(farmToSubmit);

    action.subscribe({
      next: () => {
        if (isPlatformBrowser(this.platformId)) {
          alert(`Farm ${this.editMode ? 'updated' : 'created'} successfully!`);
        }
        this.resetForm();
        this.fetchFarms();
      },
      error: (err) => {
        console.error(`Error ${this.editMode ? 'updating' : 'creating'} farm:`, err);
        if (isPlatformBrowser(this.platformId)) {
          alert(`Failed to ${this.editMode ? 'update' : 'create'} farm.`);
        }
        this.loading = false;
      },
    });
  }
  // Edit farm: populate form with farm data
  editFarm(farm: Farm): void {
    this.editMode = true;
    this.creatingNew = false;
    this.editingFarmId = farm._id ?? null;
    this.newFarm = {
      title: farm.title,
      imageUrl: farm.imageUrl,
      practiceType: farm.practiceType,
      description: farm.description,
    };
  }

  // Delete farm by ID with confirmation
  deleteFarm(id: string): void {
    if (confirm('Are you sure you want to delete this farm?')) {
      this.servicesService.deleteFarm(id).subscribe({
        next: () => {
          if (isPlatformBrowser(this.platformId)) {
            alert('Farm deleted successfully.');
          }
          this.fetchFarms();
        },
        error: (err) => {
          console.error('Error deleting farm:', err);
          if (isPlatformBrowser(this.platformId)) {
            alert('Failed to delete farm.');
          }
        },
      });
    }
  }

  // Reset form and flags to default state
  resetForm(): void {
    this.newFarm = this.getEmptyFarm();
    this.editMode = false;
    this.editingFarmId = null;
    this.creatingNew = false;
    this.loading = false;
  }

  // Returns empty Farm DTO object for initialization
  private getEmptyFarm(): CreateFarmDto {
    return {
      title: '',
      imageUrl: '',
      practiceType: '',
      description: '',
    };
  }
}
