import type { AppConfig } from '@/types';

export const electricianConfig: AppConfig = {
  company: {
    name: 'Volt Electric',
    tagline: 'Certified Electrical Solutions',
    phone: '+27 00 000 0000',
    email: 'info@voltelectric.co.za',
    address: '456 Current Road, Sparkton, GP',
    bankName: 'Standard Bank',
    bankAccountNumber: '0000000000',
    bankBranchCode: '051001',
    bankAccountType: 'Business Current',
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
      { id: 'inspection', label: 'Inspection', color: '#a855f7' },
      { id: 'quoted', label: 'Quoted', color: '#3b82f6' },
      { id: 'accepted', label: 'Accepted', color: '#8b5cf6' },
      { id: 'materials_sourced', label: 'Materials Sourced', color: '#f97316' },
      { id: 'scheduled', label: 'Scheduled', color: '#f59e0b' },
      { id: 'in_progress', label: 'In Progress', color: '#06b6d4' },
      { id: 'testing', label: 'Testing & COC', color: '#ec4899' },
      { id: 'completed', label: 'Completed', color: '#22c55e' },
      { id: 'invoiced', label: 'Invoiced', color: '#14b8a6' },
      { id: 'paid', label: 'Paid', color: '#10b981' },
      { id: 'cancelled', label: 'Cancelled', color: '#ef4444' },
    ],
    transitions: [
      { from: 'enquiry', to: ['inspection', 'quoted', 'cancelled'] },
      { from: 'inspection', to: ['quoted', 'cancelled'] },
      { from: 'quoted', to: ['accepted', 'inspection', 'cancelled'] },
      { from: 'accepted', to: ['materials_sourced', 'scheduled', 'cancelled'] },
      { from: 'materials_sourced', to: ['scheduled', 'cancelled'] },
      { from: 'scheduled', to: ['in_progress', 'materials_sourced', 'cancelled'] },
      { from: 'in_progress', to: ['testing', 'scheduled'] },
      { from: 'testing', to: ['completed', 'in_progress'] },
      { from: 'completed', to: ['invoiced', 'testing'] },
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
          { description: 'Electrician (Standard)', defaultPrice: 550, unit: 'hour' },
          { description: 'Electrician (After Hours)', defaultPrice: 825, unit: 'hour' },
          { description: 'Apprentice/Assistant', defaultPrice: 280, unit: 'hour' },
        ],
      },
      {
        id: 'callout',
        label: 'Callout Fee',
        defaultUnit: 'flat',
        commonItems: [
          { description: 'Standard Callout', defaultPrice: 600, unit: 'flat' },
          { description: 'Emergency Callout (24/7)', defaultPrice: 950, unit: 'flat' },
        ],
      },
      {
        id: 'db_work',
        label: 'DB Board Work',
        defaultUnit: 'unit',
        commonItems: [
          { description: 'DB Board (8-way)', defaultPrice: 2800, unit: 'unit' },
          { description: 'DB Board (12-way)', defaultPrice: 3500, unit: 'unit' },
          { description: 'Circuit Breaker', defaultPrice: 450, unit: 'unit' },
          { description: 'Earth Leakage', defaultPrice: 850, unit: 'unit' },
          { description: 'Surge Protector', defaultPrice: 650, unit: 'unit' },
        ],
      },
      {
        id: 'wiring',
        label: 'Wiring & Cabling',
        defaultUnit: 'meter',
        commonItems: [
          { description: 'Surflex Cable (2.5mm)', defaultPrice: 45, unit: 'meter' },
          { description: 'Surflex Cable (4mm)', defaultPrice: 65, unit: 'meter' },
          { description: 'Conduit (20mm)', defaultPrice: 55, unit: 'meter' },
          { description: 'Cat6 Network Cable', defaultPrice: 35, unit: 'meter' },
        ],
      },
      {
        id: 'installations',
        label: 'Installations',
        defaultUnit: 'unit',
        commonItems: [
          { description: 'Light Point Installation', defaultPrice: 850, unit: 'point' },
          { description: 'Plug Point Installation', defaultPrice: 750, unit: 'point' },
          { description: 'Stove Connection', defaultPrice: 1200, unit: 'unit' },
          { description: 'Geyser Connection', defaultPrice: 1500, unit: 'unit' },
          { description: 'Pool Pump Connection', defaultPrice: 950, unit: 'unit' },
        ],
      },
      {
        id: 'compliance',
        label: 'Compliance',
        defaultUnit: 'job',
        commonItems: [
          { description: 'Certificate of Compliance (COC)', defaultPrice: 2500, unit: 'job' },
          { description: 'Electrical Inspection', defaultPrice: 1200, unit: 'job' },
          { description: 'Earth Testing', defaultPrice: 800, unit: 'job' },
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
  termsAndConditions: `ELECTRICAL SERVICES TERMS & CONDITIONS

1. COMPLIANCE
   - All work performed by registered electrician
   - Certificate of Compliance (COC) issued where required
   - Work compliant with SANS 10142-1

2. PAYMENT TERMS
   - 50% deposit required before commencement
   - Balance due upon COC issue
   - Materials must be paid upfront if special order

3. WARRANTY
   - 12-month warranty on workmanship
   - Material warranties as per manufacturer
   - COC valid for 2 years

4. SAFETY
   - Client must ensure safe access to work areas
   - Client responsible for isolating sensitive electronics
   - We are fully insured

5. CANCELLATION
   - 48-hour notice required for rescheduling
   - Deposit non-refundable if cancelled within 24 hours`,
};

export default electricianConfig;
