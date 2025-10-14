import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-receipt-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-[#006633] to-[#008844] text-white p-6 relative">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <img src="https://res.cloudinary.com/dpls4kcqa/image/upload/v1747139956/download__5_-removebg-preview_thzusl.png" 
                 alt="The Palace Farm Logo" 
                 class="w-12 h-12 bg-white rounded-lg p-2 object-contain"
                 onerror="this.style.display='none'">
            <div>
              <h3 class="text-xl font-bold">Order Receipt</h3>
              <p class="text-sm opacity-90">#{{ order?.id }}</p>
            </div>
          </div>
          <button 
            (click)="onCloseClicked()" 
            class="text-white hover:text-gray-200 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Receipt Content -->
      <div id="receipt-content" class="overflow-auto flex-1 p-4" style="max-height: calc(90vh - 180px);">
        <!-- Company Header -->
        <div class="text-center mb-4 pb-4 border-b-2 border-[#006633]">
          <div class="flex items-center justify-center gap-4 mb-4">
            <img src="https://res.cloudinary.com/dpls4kcqa/image/upload/v1747139956/download__5_-removebg-preview_thzusl.png" 
                 alt="The Palace Farm Logo" 
                 class="w-16 h-16 bg-white rounded-lg p-2 object-contain shadow-lg"
                 onerror="this.style.display='none'">
            <div class="text-left">
              <h1 class="text-2xl font-bold text-[#006633] mb-1">The Palace Farm</h1>
              <p class="text-sm text-gray-600">Premium Fresh Produce & Farm Products</p>
            </div>
          </div>
          <div class="flex justify-center gap-6 text-sm text-gray-600">
            <span>📞 +254 713 209 541</span>
            <span>📧 info&#64;thepalacefarm.page</span>
            <span>🌐 www.thepalacefarm.page</span>
          </div>
        </div>

        <!-- Order Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-[#006633] mb-3 uppercase text-sm tracking-wider">Order Details</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Date:</span>
                <span class="font-medium">{{ order?.createdAt | date:'medium' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Items:</span>
                <span class="font-medium">{{ order?.items?.length || 0 }} product(s)</span>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-[#006633] mb-3 uppercase text-sm tracking-wider">Status</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Payment:</span>
                <span class="font-medium" [class.text-green-600]="order?.payment" [class.text-yellow-600]="!order?.payment">
                  {{ order?.payment ? 'Completed' : 'Pending' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Delivery:</span>
                <span class="font-medium">{{ order?.delivery?.address ? 'To Address' : 'Pickup' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="mb-4">
          <h4 class="font-semibold text-[#006633] mb-4 text-lg border-b-2 border-[#006633] pb-2">Order Items</h4>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
              <thead class="bg-[#006633] text-white">
                <tr>
                  <th class="text-left p-4 font-semibold">Product</th>
                  <th class="text-left p-4 font-semibold">Category</th>
                  <th class="text-center p-4 font-semibold">Qty</th>
                  <th class="text-right p-4 font-semibold">Unit Price</th>
                  <th class="text-right p-4 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr *ngFor="let it of order?.items; let i = index" 
                    class="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    [class.border-b-0]="i === (order?.items?.length || 0) - 1">
                  <td class="p-4 font-medium text-gray-900">{{ it.product.name }}</td>
                  <td class="p-4 text-sm text-gray-600 uppercase">{{ it.product.category || '-' }}</td>
                  <td class="p-4 text-center font-medium">{{ it.quantity }}</td>
                  <td class="p-4 text-right text-gray-700">KES {{ ((it.product.price.min + it.product.price.max) / 2) | number }}</td>
                  <td class="p-4 text-right font-semibold text-[#006633]">KES {{ (((it.product.price.min + it.product.price.max) / 2) * it.quantity) | number }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Totals -->
        <div class="bg-gray-50 p-4 rounded-lg mb-4">
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal:</span>
              <span class="font-medium">KES {{ order?.total | number }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Delivery:</span>
              <span class="font-medium text-green-600">Free</span>
            </div>
            <div class="border-t-2 border-[#006633] pt-3">
              <div class="flex justify-between text-xl font-bold text-[#006633]">
                <span>Total Amount:</span>
                <span>KES {{ order?.total | number }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Delivery Info -->
        <div *ngIf="order?.delivery" class="mb-4">
          <h4 class="font-semibold text-[#006633] mb-4 text-lg border-b-2 border-[#006633] pb-2">Delivery Information</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 p-3 rounded-lg flex justify-between">
              <span class="text-gray-600 font-medium">Name:</span>
              <span class="font-semibold">{{ order.delivery.name || 'N/A' }}</span>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg flex justify-between">
              <span class="text-gray-600 font-medium">Phone:</span>
              <span class="font-semibold">{{ order.delivery.phone || 'N/A' }}</span>
            </div>
            <div *ngIf="order.delivery.address" class="bg-gray-50 p-3 rounded-lg md:col-span-2">
              <div class="flex justify-between">
                <span class="text-gray-600 font-medium">Address:</span>
                <span class="font-semibold text-right">{{ order.delivery.address }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Info -->
        <div class="mb-4">
          <h4 class="font-semibold text-[#006633] mb-4 text-lg border-b-2 border-[#006633] pb-2">Payment Details</h4>
          <div *ngIf="order?.payment; else nopayment" 
               class="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-3">
              <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">✓ PAID</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 font-medium">Method:</span>
                <span class="font-semibold">{{ order.payment.method }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 font-medium">Transaction ID:</span>
                <span class="font-semibold">{{ order.payment.transactionId }}</span>
              </div>
              <div class="md:col-span-2 flex justify-between">
                <span class="text-gray-600 font-medium">Paid On:</span>
                <span class="font-semibold">{{ order.payment.paidAt | date:'medium' }}</span>
              </div>
            </div>
          </div>
          <ng-template #nopayment>
            <div class="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-3">
                <span class="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">⏳ PENDING</span>
              </div>
              <p class="text-sm text-yellow-800">Payment is pending. Please complete payment to process your order.</p>
            </div>
          </ng-template>
        </div>

        <!-- Footer -->
        <div class="bg-[#006633] text-white p-4 rounded-lg text-center">
          <h3 class="text-lg font-bold mb-3">Thank You for Your Order!</h3>
          <p class="text-sm mb-2">For any questions or support, please contact us:</p>
          <p class="text-sm mb-3">📞 +254 713 209 541 | 📧 info&#64;thepalacefarm.page</p>
          <div class="text-base font-bold">🌐 www.thepalacefarm.page</div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="bg-gray-50 p-4 border-t flex justify-end gap-3">
        <button 
          (click)="downloadPdf()" 
          class="bg-[#006633] hover:bg-[#008844] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <i class="fas fa-download"></i>
          Download PDF
        </button>
        <button 
          (click)="print()" 
          class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
        >
          <i class="fas fa-print"></i>
          Print
        </button>
        <button 
          (click)="onCloseClicked()" 
          class="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
  `
})
export class ReceiptModalComponent {
  @Input() order: any | null = null;
  @Output() close = new EventEmitter<void>();

  onCloseClicked() {
    this.close.emit();
  }

  print() {
    const w = window.open('', '_blank');
    if (w && this.order) {
      // Import the buildReceiptHtml function dynamically
      import('./receipt.util').then(({ buildReceiptHtml }) => {
        const receiptHtml = buildReceiptHtml(this.order);
        w.document.write(receiptHtml);
        w.document.close();
        w.focus();
        w.print();
      });
    }
  }

  async downloadPdf() {
    if (!this.order) return;
    
    try {
      // Use the professional receipt utility
      const { generateReceiptPdfDataUrl } = await import('./receipt.util');
      const dataUrl = await generateReceiptPdfDataUrl(this.order);
      
      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `receipt-${this.order.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('PDF generation failed:', e);
      // fallback to print
      this.print();
    }
  }
}
