import type { Quote, Client, AppConfig, LineItem } from '@/types';
import { formatCurrency } from '@/lib/pricing';

interface QuoteData {
  quote: Quote;
  client: Client;
  config: AppConfig;
}

function generateLineItemsHTML(items: LineItem[], config: AppConfig): string {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          ${config.quoteBuilder.showUnit ? `<td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.unit || '-'}</td>` : ''}
          <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.unitPrice, config.pricing.currencySymbol)}</td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.quantity * item.unitPrice, config.pricing.currencySymbol)}</td>
        </tr>
      `
    )
    .join('');
}

export function generateQuoteHTML({ quote, client, config }: QuoteData): string {
  const today = new Date().toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const validUntil = new Date(quote.validUntil).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quote - ${quote.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #1f2937;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
    }
    .company-info h1 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .company-info p {
      color: #6b7280;
      font-size: 13px;
    }
    .quote-info {
      text-align: right;
    }
    .quote-info h2 {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }
    .quote-info p {
      font-size: 13px;
      color: #6b7280;
    }
    .addresses {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .address-block h3 {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      margin-bottom: 8px;
    }
    .address-block p {
      font-size: 14px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .items-table th {
      background: #f9fafb;
      padding: 12px 8px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      border-bottom: 2px solid #e5e7eb;
    }
    .items-table th:nth-child(2),
    .items-table th:nth-child(3) {
      text-align: center;
    }
    .items-table th:nth-child(4),
    .items-table th:nth-child(5) {
      text-align: right;
    }
    .totals {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 40px;
    }
    .totals-table {
      width: 280px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .totals-row.total {
      font-weight: 700;
      font-size: 18px;
      border-bottom: 2px solid #111827;
      padding: 12px 0;
    }
    .totals-row.deposit {
      color: #059669;
      font-weight: 600;
    }
    .banking {
      background: #f9fafb;
      padding: 20px;
      margin-bottom: 40px;
    }
    .banking h3 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .banking-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .banking-item {
      font-size: 13px;
    }
    .banking-item span {
      color: #6b7280;
    }
    .terms {
      font-size: 12px;
      color: #6b7280;
      white-space: pre-line;
    }
    .terms h3 {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 12px;
    }
    .print-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #111827;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    .print-button:hover {
      background: #374151;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <h1>${config.company.name}</h1>
      ${config.company.tagline ? `<p>${config.company.tagline}</p>` : ''}
      <p>${config.company.phone}</p>
      <p>${config.company.email}</p>
    </div>
    <div class="quote-info">
      <h2>QUOTE</h2>
      <p><strong>Quote #:</strong> ${quote.id.slice(0, 8).toUpperCase()}</p>
      <p><strong>Date:</strong> ${today}</p>
      <p><strong>Valid Until:</strong> ${validUntil}</p>
    </div>
  </div>

  <div class="addresses">
    <div class="address-block">
      <h3>From</h3>
      <p><strong>${config.company.name}</strong></p>
      <p>${config.company.address}</p>
      ${config.company.vatNumber ? `<p>VAT: ${config.company.vatNumber}</p>` : ''}
    </div>
    <div class="address-block">
      <h3>To</h3>
      <p><strong>${client.name}</strong></p>
      ${client.address ? `<p>${client.address}</p>` : ''}
      <p>${client.phone}</p>
      ${client.email ? `<p>${client.email}</p>` : ''}
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Description</th>
        <th>Qty</th>
        ${config.quoteBuilder.showUnit ? '<th>Unit</th>' : ''}
        <th>Unit Price</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${generateLineItemsHTML(quote.lineItems, config)}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-table">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>${formatCurrency(quote.subtotal, config.pricing.currencySymbol)}</span>
      </div>
      <div class="totals-row">
        <span>VAT (${config.pricing.vatRate}%)</span>
        <span>${formatCurrency(quote.vatAmount, config.pricing.currencySymbol)}</span>
      </div>
      <div class="totals-row total">
        <span>Total</span>
        <span>${formatCurrency(quote.total, config.pricing.currencySymbol)}</span>
      </div>
      <div class="totals-row deposit">
        <span>Deposit (${config.pricing.depositPercentage}%)</span>
        <span>${formatCurrency(quote.depositAmount, config.pricing.currencySymbol)}</span>
      </div>
      <div class="totals-row">
        <span>Balance Due</span>
        <span>${formatCurrency(quote.balanceAmount, config.pricing.currencySymbol)}</span>
      </div>
    </div>
  </div>

  <div class="banking">
    <h3>Banking Details</h3>
    <div class="banking-grid">
      <div class="banking-item"><span>Bank:</span> ${config.company.bankName}</div>
      <div class="banking-item"><span>Account:</span> ${config.company.bankAccountNumber}</div>
      <div class="banking-item"><span>Branch Code:</span> ${config.company.bankBranchCode}</div>
      <div class="banking-item"><span>Account Type:</span> ${config.company.bankAccountType}</div>
    </div>
    <p style="margin-top: 12px; font-size: 13px;"><strong>Reference:</strong> ${quote.id.slice(0, 8).toUpperCase()}</p>
  </div>

  <div class="terms">
    <h3>Terms & Conditions</h3>
    ${config.termsAndConditions}
  </div>

  <button class="print-button no-print" onclick="window.print()">Print / Save PDF</button>
</body>
</html>
  `.trim();
}

export function openQuotePrintWindow(data: QuoteData): void {
  const html = generateQuoteHTML(data);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

export function downloadQuoteHTML(data: QuoteData, filename?: string): void {
  const html = generateQuoteHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `quote-${data.quote.id.slice(0, 8)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
