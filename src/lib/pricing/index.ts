import type { LineItem, PricingConfig } from '@/types';

export interface PricingCalculation {
  subtotal: number;
  vatAmount: number;
  total: number;
  depositAmount: number;
  balanceAmount: number;
}

export function calculateLineItemTotal(item: LineItem): number {
  return item.quantity * item.unitPrice;
}

export function calculateSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + calculateLineItemTotal(item), 0);
}

export function calculateVAT(subtotal: number, vatRate: number): number {
  return subtotal * (vatRate / 100);
}

export function calculateTotal(subtotal: number, vatAmount: number): number {
  return subtotal + vatAmount;
}

export function calculateDeposit(total: number, depositPercentage: number): number {
  return total * (depositPercentage / 100);
}

export function calculateQuotePricing(
  items: LineItem[],
  config: PricingConfig
): PricingCalculation {
  const subtotal = calculateSubtotal(items);
  const vatAmount = calculateVAT(subtotal, config.vatRate);
  const total = calculateTotal(subtotal, vatAmount);
  const depositAmount = calculateDeposit(total, config.depositPercentage);
  const balanceAmount = total - depositAmount;

  return {
    subtotal,
    vatAmount,
    total,
    depositAmount,
    balanceAmount,
  };
}

export function formatCurrency(
  amount: number,
  currencySymbol: string = 'R'
): string {
  const formatted = Math.abs(amount).toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currencySymbol}${formatted}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function applyDiscount(
  total: number,
  discountPercentage: number,
  maxDiscount?: number
): { discountedTotal: number; discountAmount: number } {
  const effectiveDiscount = maxDiscount
    ? Math.min(discountPercentage, maxDiscount)
    : discountPercentage;

  const discountAmount = total * (effectiveDiscount / 100);
  const discountedTotal = total - discountAmount;

  return {
    discountedTotal,
    discountAmount,
  };
}

export function getQuoteValidUntilDate(validityDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + validityDays);
  return date.toISOString().split('T')[0];
}

export function getInvoiceDueDate(dueDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + dueDays);
  return date.toISOString().split('T')[0];
}

export function isOverdue(dueDate: string): boolean {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export function getDaysUntilDue(dueDate: string): number {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = due.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
