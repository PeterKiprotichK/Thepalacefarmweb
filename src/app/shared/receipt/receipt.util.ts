export function buildReceiptHtml(order: any): string {
  const itemsHtml = order.items.map((it: any) => `<tr><td>${it.product.name}</td><td>${it.quantity}</td><td>KES ${Math.round(((it.product.price.min + it.product.price.max)/2)).toLocaleString()}</td></tr>`).join('');
  const paidInfo = order.payment ? `<p><strong>Paid:</strong> ${order.payment.method} (${order.payment.providerNumber})</p><p><strong>Transaction:</strong> ${order.payment.transactionId}</p><p><strong>Paid At:</strong> ${new Date(order.payment.paidAt).toLocaleString()}</p>` : '<p><strong>Payment:</strong> Not paid</p>';

  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Receipt ${order.id}</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; padding: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px }
      td, th { padding: 8px; border: 1px solid #ddd }
      .total { text-align: right; font-weight: bold }
    </style>
  </head>
  <body>
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;">
  <img src="/assets/logo.svg" alt="The Palace Farm" style="height:64px;object-fit:contain;" onerror="this.style.display='none'" />
      <div>
        <h2 style="margin:0">The Palace Farm</h2>
        <div style="font-size:12px;color:#555">Contact: +254713209541 | info@thepalacefarm.page</div>
        <div style="font-size:12px;color:#555">Website: https://www.thepalacefarm.page</div>
      </div>
    </div>
    <p><strong>Receipt ID:</strong> ${order.id}</p>
    <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
    ${paidInfo}
    <h3>Items</h3>
    <table>
      <thead><tr><th>Product</th><th>Qty</th><th>Unit</th></tr></thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    <p class="total">Total: KES ${Math.round(order.total).toLocaleString()}</p>
    <hr />
    <p>Thank you for your order. Contact +254713209541 for support.</p>
  </body>
  </html>
  `;
}

// Generate a PDF data URL for the given order using html2canvas + jsPDF.
// Returns a data:application/pdf;base64,... string when successful.
export async function generateReceiptPdfDataUrl(order: any): Promise<string> {
  if (typeof window === 'undefined') throw new Error('PDF generation requires a browser environment');

  // dynamic import to avoid bundling on server
  const [{ default: jsPDF }] = await Promise.all([import('jspdf')]);
  const html2canvas = (await import('html2canvas')).default;

  // create an offscreen container to render the HTML
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.innerHTML = buildReceiptHtml(order);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container as HTMLElement, { scale: 2 } as any);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const imgProps = (pdf as any).getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // produce a data url string
    const dataUrl = pdf.output('datauristring');
    return dataUrl as string;
  } finally {
    // cleanup
    try { document.body.removeChild(container); } catch (e) {}
  }
}
