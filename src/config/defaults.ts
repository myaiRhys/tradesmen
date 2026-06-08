import type { AppConfig } from '@/types';

export const defaultConfig: AppConfig = {
  company: {
    name: 'Your Trade Business',
    tagline: 'Quality Service You Can Trust',
    phone: '+27 00 000 0000',
    email: 'info@yourbusiness.co.za',
    address: '123 Main Street, City, Province',
    bankName: 'Your Bank',
    bankAccountNumber: '0000000000',
    bankBranchCode: '000000',
    bankAccountType: 'Current',
  },
  pricing: {
    currency: 'ZAR',
    currencySymbol: 'R',
    vatRate: 15,
    depositPercentage: 50,
    quoteValidityDays: 14,
    invoiceDueDays: 30,
    enableDiscounts: false,
  },
  workflow: {
    statuses: [
      { id: 'enquiry', label: 'Enquiry', color: '#6b7280' },
      { id: 'quoted', label: 'Quoted', color: '#3b82f6' },
      { id: 'accepted', label: 'Accepted', color: '#8b5cf6' },
      { id: 'scheduled', label: 'Scheduled', color: '#f59e0b' },
      { id: 'in_progress', label: 'In Progress', color: '#06b6d4' },
      { id: 'completed', label: 'Completed', color: '#22c55e' },
      { id: 'invoiced', label: 'Invoiced', color: '#14b8a6' },
      { id: 'paid', label: 'Paid', color: '#10b981' },
      { id: 'cancelled', label: 'Cancelled', color: '#ef4444' },
    ],
    transitions: [
      { from: 'enquiry', to: ['quoted', 'cancelled'] },
      { from: 'quoted', to: ['accepted', 'enquiry', 'cancelled'] },
      { from: 'accepted', to: ['scheduled', 'cancelled'] },
      { from: 'scheduled', to: ['in_progress', 'accepted', 'cancelled'] },
      { from: 'in_progress', to: ['completed', 'scheduled'] },
      { from: 'completed', to: ['invoiced', 'in_progress'] },
      { from: 'invoiced', to: ['paid', 'completed'] },
      { from: 'paid', to: [] },
      { from: 'cancelled', to: ['enquiry'] },
    ],
    initialStatus: 'enquiry',
    completedStatuses: ['paid', 'cancelled'],
  },
  quoteBuilder: {
    categories: [
      {
        id: 'labour',
        label: 'Labour',
        defaultUnit: 'hour',
        commonItems: [
          { description: 'Standard Labour', defaultPrice: 350, unit: 'hour' },
          { description: 'Overtime Labour', defaultPrice: 525, unit: 'hour' },
        ],
      },
      {
        id: 'materials',
        label: 'Materials',
        defaultUnit: 'unit',
        commonItems: [],
      },
      {
        id: 'callout',
        label: 'Callout Fee',
        defaultUnit: 'flat',
        commonItems: [
          { description: 'Standard Callout', defaultPrice: 500, unit: 'flat' },
          { description: 'After Hours Callout', defaultPrice: 750, unit: 'flat' },
        ],
      },
    ],
    showQuantity: true,
    showUnit: true,
    defaultCategory: 'labour',
  },
  features: {
    enablePhotos: false,
    enableScheduling: true,
    enableInvoices: true,
    enableClientTiers: false,
    enableNotes: true,
    enablePriorityLevels: true,
  },
  termsAndConditions: `1. A 50% deposit is required before work commences.
2. Final payment is due upon completion of work.
3. This quote is valid for 14 days from the date of issue.
4. All prices are inclusive of VAT.
5. Any additional work not specified in this quote will be charged separately.`,
};

export const defaultWorkflowColors: Record<string, string> = {
  enquiry: '#6b7280',
  quoted: '#3b82f6',
  accepted: '#8b5cf6',
  scheduled: '#f59e0b',
  in_progress: '#06b6d4',
  completed: '#22c55e',
  invoiced: '#14b8a6',
  paid: '#10b981',
  cancelled: '#ef4444',
};
