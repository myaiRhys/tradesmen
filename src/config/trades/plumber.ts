import type { AppConfig } from '@/types';

export const plumberConfig: AppConfig = {
  company: {
    name: 'Premium Plumbing',
    tagline: 'Expert Plumbing Services',
    phone: '+27 00 000 0000',
    email: 'info@premiumplumbing.co.za',
    address: '123 Pipe Street, Plumberton, GP',
    bankName: 'First National Bank',
    bankAccountNumber: '0000000000',
    bankBranchCode: '250655',
    bankAccountType: 'Business Cheque',
  },
  pricing: {
    currency: 'ZAR',
    currencySymbol: 'R',
    vatRate: 15,
    depositPercentage: 50,
    quoteValidityDays: 14,
    invoiceDueDays: 30,
    enableDiscounts: true,
    maxDiscountPercentage: 10,
  },
  workflow: {
    statuses: [
      { id: 'enquiry', label: 'Enquiry', color: '#6b7280' },
      { id: 'site_visit', label: 'Site Visit', color: '#a855f7' },
      { id: 'quoted', label: 'Quoted', color: '#3b82f6' },
      { id: 'accepted', label: 'Accepted', color: '#8b5cf6' },
      { id: 'parts_ordered', label: 'Parts Ordered', color: '#f97316' },
      { id: 'scheduled', label: 'Scheduled', color: '#f59e0b' },
      { id: 'in_progress', label: 'In Progress', color: '#06b6d4' },
      { id: 'completed', label: 'Completed', color: '#22c55e' },
      { id: 'invoiced', label: 'Invoiced', color: '#14b8a6' },
      { id: 'paid', label: 'Paid', color: '#10b981' },
      { id: 'cancelled', label: 'Cancelled', color: '#ef4444' },
    ],
    transitions: [
      { from: 'enquiry', to: ['site_visit', 'quoted', 'cancelled'] },
      { from: 'site_visit', to: ['quoted', 'cancelled'] },
      { from: 'quoted', to: ['accepted', 'site_visit', 'cancelled'] },
      { from: 'accepted', to: ['parts_ordered', 'scheduled', 'cancelled'] },
      { from: 'parts_ordered', to: ['scheduled', 'cancelled'] },
      { from: 'scheduled', to: ['in_progress', 'parts_ordered', 'cancelled'] },
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
          { description: 'Standard Labour', defaultPrice: 450, unit: 'hour' },
          { description: 'After Hours Labour', defaultPrice: 675, unit: 'hour' },
          { description: 'Emergency Call-out', defaultPrice: 850, unit: 'hour' },
        ],
      },
      {
        id: 'callout',
        label: 'Callout Fee',
        defaultUnit: 'flat',
        commonItems: [
          { description: 'Standard Callout (Metro)', defaultPrice: 500, unit: 'flat' },
          { description: 'Extended Callout (50km+)', defaultPrice: 750, unit: 'flat' },
          { description: 'After Hours Callout', defaultPrice: 850, unit: 'flat' },
        ],
      },
      {
        id: 'materials',
        label: 'Materials',
        defaultUnit: 'unit',
        commonItems: [
          { description: 'PVC Pipe (per meter)', defaultPrice: 85, unit: 'meter' },
          { description: 'Copper Pipe (per meter)', defaultPrice: 250, unit: 'meter' },
          { description: 'Ball Valve', defaultPrice: 180, unit: 'unit' },
          { description: 'Gate Valve', defaultPrice: 220, unit: 'unit' },
          { description: 'Geyser Element', defaultPrice: 450, unit: 'unit' },
          { description: 'Thermostat', defaultPrice: 350, unit: 'unit' },
        ],
      },
      {
        id: 'fixtures',
        label: 'Fixtures',
        defaultUnit: 'unit',
        commonItems: [
          { description: 'Basin Installation', defaultPrice: 1200, unit: 'unit' },
          { description: 'Toilet Installation', defaultPrice: 1500, unit: 'unit' },
          { description: 'Shower Installation', defaultPrice: 2500, unit: 'unit' },
          { description: 'Bath Installation', defaultPrice: 3000, unit: 'unit' },
          { description: 'Tap Replacement', defaultPrice: 650, unit: 'unit' },
        ],
      },
      {
        id: 'drains',
        label: 'Drain Work',
        defaultUnit: 'job',
        commonItems: [
          { description: 'Drain Unblocking (Standard)', defaultPrice: 950, unit: 'job' },
          { description: 'Drain Unblocking (Complex)', defaultPrice: 1800, unit: 'job' },
          { description: 'CCTV Inspection', defaultPrice: 1500, unit: 'job' },
          { description: 'High Pressure Jetting', defaultPrice: 2500, unit: 'job' },
        ],
      },
    ],
    showQuantity: true,
    showUnit: true,
    defaultCategory: 'labour',
  },
  features: {
    enablePhotos: true,
    enableScheduling: true,
    enableInvoices: true,
    enableClientTiers: true,
    enableNotes: true,
    enablePriorityLevels: true,
  },
  termsAndConditions: `PLUMBING SERVICES TERMS & CONDITIONS

1. PAYMENT TERMS
   - A 50% deposit is required before work commences
   - Balance due upon completion of work
   - Emergency work requires full upfront payment

2. WARRANTY
   - 90-day warranty on workmanship
   - Material warranties as per manufacturer

3. PRICING
   - All prices include VAT at 15%
   - Quote valid for 14 days
   - Additional work will be quoted separately

4. LIABILITY
   - We are insured for all work performed
   - Client responsible for accurate site information

5. CANCELLATION
   - 24-hour notice required for rescheduling
   - Same-day cancellation may incur callout fee`,
};

export default plumberConfig;
