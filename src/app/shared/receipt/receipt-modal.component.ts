import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-receipt-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">Receipt - {{ order?.id }}</h3>
        <button (click)="onCloseClicked()" class="text-gray-500">✕</button>
      </div>

      <div id="receipt-content" class="overflow-auto max-h-[60vh]">
        <p><strong>Date:</strong> {{ order?.createdAt | date:'medium' }}</p>
        <div *ngIf="order?.delivery">
          <p><strong>Delivery:</strong> {{ order.delivery.name || '—' }} — {{ order.delivery.phone || '—' }}</p>
          <p *ngIf="order.delivery.address">{{ order.delivery.address }}</p>
        </div>

        <h4 class="mt-4 font-semibold">Items</h4>
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="text-left">Product</th>
              <th>Qty</th>
              <th class="text-right">Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let it of order?.items">
              <td>{{ it.product.name }}</td>
              <td class="text-center">{{ it.quantity }}</td>
              <td class="text-right">KES {{ ((it.product.price.min + it.product.price.max) / 2) | number }}</td>
            </tr>
          </tbody>
        </table>

        <p class="text-right font-bold mt-4">Total: KES {{ order?.total | number }}</p>

        <div *ngIf="order?.payment" class="mt-4">
          <h4 class="font-semibold">Payment</h4>
          <p>Method: {{ order.payment.method }}</p>
          <p>Transaction: {{ order.payment.transactionId }}</p>
          <p>Paid At: {{ order.payment.paidAt | date:'medium' }}</p>
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <button (click)="downloadPdf()" class="bg-green-600 text-white px-4 py-2 rounded">Download PDF</button>
        <button (click)="print()" class="bg-gray-200 px-3 py-2 rounded">Print</button>
        <button (click)="onCloseClicked()" class="px-3 py-2 rounded border">Close</button>
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
    if (w) {
      w.document.write(document.getElementById('receipt-content')?.innerHTML || '');
      w.document.close();
      w.focus();
      w.print();
    }
  }

  async downloadPdf() {
    // Try to use jsPDF + html2canvas if available, otherwise fallback to print
    try {
      // dynamic import to avoid hard dependency during SSR/build
      const [{ default: jsPDF }] = await Promise.all([import('jspdf')]);
      const html2canvas = (await import('html2canvas')).default;

  const el = document.getElementById('receipt-content');
  if (!el) return;
  // cast options to any because Html2CanvasOptions typings may not include 'scale'
  const canvas = await html2canvas(el as HTMLElement, { scale: 2 } as any);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgProps = (pdf as any).getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt-${this.order?.id || 'order'}.pdf`);
    } catch (e) {
      // fallback to print
      this.print();
    }
  }
}
