import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ToastService, ToastMessage } from './toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="fixed bottom-6 right-6 z-50 space-y-2">
    <div *ngFor="let t of toasts" [ngClass]="{ 'bg-green-600': t.type==='success', 'bg-red-600': t.type==='error', 'bg-gray-600': t.type==='info' }" class="text-white px-4 py-2 rounded shadow-lg max-w-xs">
      {{ t.text }}
    </div>
  </div>
  `
})
export class ToastComponent implements OnDestroy {
  toasts: ToastMessage[] = [];
  sub: Subscription;

  constructor(private toastService: ToastService) {
    this.sub = this.toastService.onToast.subscribe(msg => this.show(msg));
  }

  show(msg: ToastMessage) {
    this.toasts.push(msg);
    const idx = this.toasts.length - 1;
    setTimeout(() => {
      this.toasts.splice(idx, 1);
    }, msg.timeout ?? 4000);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
