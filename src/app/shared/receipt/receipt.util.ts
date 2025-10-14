export function buildReceiptHtml(order: any): string {
  const itemsHtml = order.items.map((it: any) => {
    const unitPrice = Math.round((it.product.price.min + it.product.price.max) / 2);
    const total = unitPrice * it.quantity;
    return `
      <tr class="item-row">
        <td class="item-name">${it.product.name}</td>
        <td class="item-category">${it.product.category || '-'}</td>
        <td class="item-qty">${it.quantity}</td>
        <td class="item-price">KES ${unitPrice.toLocaleString()}</td>
        <td class="item-total">KES ${total.toLocaleString()}</td>
      </tr>
    `;
  }).join('');

  const deliveryInfo = order.delivery ? `
    <div class="delivery-section">
      <h3 class="section-title">Delivery Information</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Name:</span>
          <span class="info-value">${order.delivery.name || 'N/A'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Phone:</span>
          <span class="info-value">${order.delivery.phone || 'N/A'}</span>
        </div>
        ${order.delivery.address ? `
          <div class="info-item full-width">
            <span class="info-label">Address:</span>
            <span class="info-value">${order.delivery.address}</span>
          </div>
        ` : ''}
      </div>
    </div>
  ` : '';

  const paymentInfo = order.payment ? `
    <div class="payment-section">
      <h3 class="section-title">Payment Details</h3>
      <div class="payment-status paid">
        <div class="status-badge">✓ PAID</div>
        <div class="payment-details">
          <div class="payment-item">
            <span class="payment-label">Method:</span>
            <span class="payment-value">${order.payment.method}</span>
          </div>
          <div class="payment-item">
            <span class="payment-label">Transaction ID:</span>
            <span class="payment-value">${order.payment.transactionId}</span>
          </div>
          <div class="payment-item">
            <span class="payment-label">Paid On:</span>
            <span class="payment-value">${new Date(order.payment.paidAt || order.createdAt).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>
      </div>
    </div>
  ` : `
    <div class="payment-section">
      <h3 class="section-title">Payment Status</h3>
      <div class="payment-status unpaid">
        <div class="status-badge">⏳ PENDING</div>
        <p class="payment-note">Payment is pending. Please complete payment to process your order.</p>
      </div>
    </div>
  `;

  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Receipt #${order.id} - The Palace Farm</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.3;
        color: #333;
        background: #fff;
        padding: 15px;
        max-width: 500px;
        margin: 0 auto;
        font-size: 12px;
      }
      
      .receipt-container {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      
      .header {
        background: linear-gradient(135deg, #006633 0%, #008844 100%);
        color: white;
        padding: 15px;
        text-align: center;
      }
      
      .logo-section {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 10px;
      }
      
      .logo-img {
        width: 45px;
        height: 45px;
        object-fit: contain;
        background: white;
        border-radius: 6px;
        padding: 4px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      }
      
      .company-info h1 {
        font-size: 16px;
        margin-bottom: 2px;
        font-weight: 700;
      }
      
      .company-info .tagline {
        font-size: 10px;
        opacity: 0.9;
        margin-bottom: 5px;
      }
      
      .contact-info {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
        font-size: 9px;
      }
      
      .contact-item {
        display: flex;
        align-items: center;
        gap: 3px;
      }
      
      .receipt-header {
        padding: 12px;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
      }
      
      .receipt-title {
        text-align: center;
        margin-bottom: 12px;
      }
      
      .receipt-title h2 {
        font-size: 14px;
        color: #006633;
        margin-bottom: 3px;
      }
      
      .receipt-id {
        font-size: 11px;
        color: #666;
        font-weight: 500;
      }
      
      .order-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-top: 10px;
      }
      
      .info-box {
        background: white;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #e9ecef;
      }
      
      .info-box h4 {
        color: #006633;
        margin-bottom: 5px;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      
      .info-box p {
        margin-bottom: 2px;
        font-size: 10px;
      }
      
      .content {
        padding: 12px;
      }
      
      .section-title {
        color: #006633;
        font-size: 12px;
        margin-bottom: 8px;
        padding-bottom: 3px;
        border-bottom: 1px solid #006633;
        font-weight: 600;
      }
      
      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        overflow: hidden;
      }
      
      .items-table thead {
        background: #006633;
        color: white;
      }
      
      .items-table th {
        padding: 6px 4px;
        text-align: left;
        font-weight: 600;
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 0.2px;
      }
      
      .items-table th:last-child,
      .items-table td:last-child {
        text-align: right;
      }
      
      .items-table th:nth-child(3),
      .items-table td:nth-child(3) {
        text-align: center;
      }
      
      .item-row {
        border-bottom: 1px solid #f0f0f0;
      }
      
      .item-row:last-child {
        border-bottom: none;
      }
      
      .items-table td {
        padding: 6px 4px;
        font-size: 10px;
      }
      
      .item-name {
        font-weight: 600;
        color: #333;
      }
      
      .item-category {
        color: #666;
        font-size: 8px;
        text-transform: uppercase;
      }
      
      .item-total {
        font-weight: 600;
        color: #006633;
      }
      
      .totals-section {
        background: #f8f9fa;
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 12px;
      }
      
      .totals-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3px;
        font-size: 10px;
      }
      
      .totals-row.final {
        font-size: 12px;
        font-weight: bold;
        color: #006633;
        border-top: 1px solid #006633;
        padding-top: 6px;
        margin-top: 6px;
        margin-bottom: 0;
      }
      
      .delivery-section,
      .payment-section {
        margin-bottom: 12px;
      }
      
      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
      }
      
      .info-item {
        display: flex;
        justify-content: space-between;
        padding: 5px;
        background: #f8f9fa;
        border-radius: 3px;
        font-size: 9px;
      }
      
      .info-item.full-width {
        grid-column: 1 / -1;
      }
      
      .info-label {
        font-weight: 600;
        color: #666;
      }
      
      .info-value {
        font-weight: 500;
        color: #333;
      }
      
      .payment-status {
        padding: 8px;
        border-radius: 4px;
        border: 1px solid;
      }
      
      .payment-status.paid {
        background: #d4edda;
        border-color: #28a745;
        color: #155724;
      }
      
      .payment-status.unpaid {
        background: #fff3cd;
        border-color: #ffc107;
        color: #856404;
      }
      
      .status-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 10px;
        font-weight: bold;
        font-size: 8px;
        text-transform: uppercase;
        letter-spacing: 0.2px;
        margin-bottom: 6px;
      }
      
      .paid .status-badge {
        background: #28a745;
        color: white;
      }
      
      .unpaid .status-badge {
        background: #ffc107;
        color: #856404;
      }
      
      .payment-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px;
      }
      
      .payment-item {
        display: flex;
        justify-content: space-between;
        font-size: 9px;
      }
      
      .payment-label {
        font-weight: 600;
        color: #666;
      }
      
      .payment-value {
        font-weight: 500;
      }
      
      .payment-note {
        font-size: 9px;
        margin-top: 4px;
      }
      
      .footer {
        background: #006633;
        color: white;
        padding: 10px;
        text-align: center;
      }
      
      .footer h3 {
        margin-bottom: 4px;
        font-size: 11px;
      }
      
      .footer p {
        margin-bottom: 2px;
        font-size: 9px;
      }
      
      .footer .website {
        font-weight: bold;
        font-size: 10px;
        margin-top: 3px;
      }
      
      @media print {
        body {
          padding: 0;
          margin: 0;
          font-size: 11px;
          max-width: none;
        }
        
        .receipt-container {
          box-shadow: none;
          border-radius: 0;
          page-break-inside: avoid;
        }
        
        .header {
          padding: 10px;
        }
        
        .content {
          padding: 8px;
        }
        
        .receipt-header {
          padding: 8px;
        }
        
        .footer {
          padding: 8px;
        }
        
        .section-title {
          margin-bottom: 6px;
          font-size: 11px;
        }
        
        .items-table th {
          padding: 4px 3px;
          font-size: 8px;
        }
        
        .items-table td {
          padding: 4px 3px;
          font-size: 9px;
        }
        
        .delivery-section,
        .payment-section {
          margin-bottom: 8px;
        }
        
        .totals-section {
          margin-bottom: 8px;
          padding: 8px;
        }
      }
    </style>
  </head>
  <body>
    <div class="receipt-container">
      <div class="header">
        <div class="logo-section">
          <img src="https://res.cloudinary.com/dpls4kcqa/image/upload/v1747139956/download__5_-removebg-preview_thzusl.png" 
               alt="The Palace Farm Logo" 
               class="logo-img"
               onerror="this.style.display='none'">
          <div class="company-info">
            <h1>The Palace Farm</h1>
            <div class="tagline">Premium Fresh Produce & Farm Products</div>
          </div>
        </div>
        <div class="contact-info">
          <div class="contact-item">📞 +254 713 209 541</div>
          <div class="contact-item">📧 info@thepalacefarm.page</div>
          <div class="contact-item">🌐 www.thepalacefarm.page</div>
        </div>
      </div>
      
      <div class="receipt-header">
        <div class="receipt-title">
          <h2>Order Receipt</h2>
          <div class="receipt-id">#${order.id}</div>
        </div>
        
        <div class="order-info">
          <div class="info-box">
            <h4>Order Details</h4>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p><strong>Items:</strong> ${order.items?.length || 0} product(s)</p>
          </div>
          
          <div class="info-box">
            <h4>Order Status</h4>
            <p><strong>Payment:</strong> ${order.payment ? 'Completed' : 'Pending'}</p>
            <p><strong>Delivery:</strong> ${order.delivery?.address ? 'To Address' : 'Pickup'}</p>
          </div>
        </div>
      </div>
      
      <div class="content">
        <h3 class="section-title">Order Items</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div class="totals-section">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>KES ${Math.round(order.total).toLocaleString()}</span>
          </div>
          <div class="totals-row">
            <span>Delivery:</span>
            <span>Free</span>
          </div>
          <div class="totals-row final">
            <span>Total Amount:</span>
            <span>KES ${Math.round(order.total).toLocaleString()}</span>
          </div>
        </div>
        
        ${deliveryInfo}
        ${paymentInfo}
      </div>
      
      <div class="footer">
        <h3>Thank You for Your Order!</h3>
        <p>For any questions or support, please contact us:</p>
        <p>📞 +254 713 209 541 | 📧 info@thepalacefarm.page</p>
        <div class="website">🌐 www.thepalacefarm.page</div>
      </div>
    </div>
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
    const canvas = await html2canvas(container as HTMLElement, { 
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      height: container.scrollHeight,
      width: container.scrollWidth
    } as any);
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const imgProps = (pdf as any).getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate scaling to fit on one page
    let imgWidth = pdfWidth - 40; // 20pt margin on each side
    let imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    
    // If height exceeds page, scale down further
    if (imgHeight > pdfHeight - 40) { // 20pt margin top/bottom
      imgHeight = pdfHeight - 40;
      imgWidth = (imgProps.width * imgHeight) / imgProps.height;
    }
    
    // Center the image
    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;
    
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

    // produce a data url string
    const dataUrl = pdf.output('datauristring');
    return dataUrl as string;
  } finally {
    // cleanup
    try { document.body.removeChild(container); } catch (e) {}
  }
}
