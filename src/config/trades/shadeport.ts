import type { AppConfig } from '@/types';

export const shadeportConfig: AppConfig = {
  company: {
    name: 'Pro Shade Solutions',
    tagline: 'Premium Shadeport & Carport Installations',
    phone: '+27 00 000 0000',
    email: 'info@proshade.co.za',
    address: '789 Cover Lane, Shadeville, GP',
    bankName: 'Nedbank',
    bankAccountNumber: '0000000000',
    bankBranchCode: '198765',
    bankAccountType: 'Business Current',
  },
  pricing: {
    currency: 'ZAR',
    currencySymbol: 'R',
    vatRate: 15,
    depositPercentage: 60,
    quoteValidityDays: 30,
    invoiceDueDays: 14,
    enableDiscounts: true,
    maxDiscountPercentage: 15,
  },
  workflow: {
    statuses: [
      { id: 'enquiry', label: 'Enquiry', color: '#6b7280' },
      { id: 'site_measure', label: 'Site Measure', color: '#a855f7' },
      { id: 'design', label: 'Design', color: '#ec4899' },
      { id: 'quoted', label: 'Quoted', color: '#3b82f6' },
      { id: 'accepted', label: 'Accepted', color: '#8b5cf6' },
      { id: 'deposit_received', label: 'Deposit Received', color: '#10b981' },
      { id: 'manufacturing', label: 'Manufacturing', color: '#f97316' },
      { id: 'ready_to_install', label: 'Ready to Install', color: '#06b6d4' },
      { id: 'installation', label: 'Installation', color: '#eab308' },
      { id: 'completed', label: 'Completed', color: '#22c55e' },
      { id: 'final_payment', label: 'Final Payment', color: '#14b8a6' },
      { id: 'closed', label: 'Closed', color: '#10b981' },
      { id: 'cancelled', label: 'Cancelled', color: '#ef4444' },
    ],
    transitions: [
      { from: 'enquiry', to: ['site_measure', 'quoted', 'cancelled'] },
      { from: 'site_measure', to: ['design', 'quoted', 'cancelled'] },
      { from: 'design', to: ['quoted', 'site_measure', 'cancelled'] },
      { from: 'quoted', to: ['accepted', 'design', 'cancelled'] },
      { from: 'accepted', to: ['deposit_received', 'cancelled'] },
      { from: 'deposit_received', to: ['manufacturing', 'cancelled'] },
      { from: 'manufacturing', to: ['ready_to_install', 'deposit_received'] },
      { from: 'ready_to_install', to: ['installation', 'manufacturing'] },
      { from: 'installation', to: ['completed', 'ready_to_install'] },
      { from: 'completed', to: ['final_payment', 'installation'] },
      { from: 'final_payment', to: ['closed', 'completed'] },
      { from: 'closed', to: [] },
      { from: 'cancelled', to: ['enquiry'] },
    ],
    initialStatus: 'enquiry',
    completedStatuses: ['closed', 'cancelled'],
  },
  quoteBuilder: {
    categories: [
      {
        id: 'shadeport',
        label: 'Shadeport',
        defaultUnit: 'sqm',
        commonItems: [
          { description: 'Single Shadeport (3x5m)', defaultPrice: 12500, unit: 'unit' },
          { description: 'Double Shadeport (6x5m)', defaultPrice: 22000, unit: 'unit' },
          { description: 'Triple Shadeport (9x5m)', defaultPrice: 31000, unit: 'unit' },
          { description: 'Custom Shadeport (per sqm)', defaultPrice: 850, unit: 'sqm' },
        ],
      },
      {
        id: 'carport',
        label: 'Carport',
        defaultUnit: 'unit',
        commonItems: [
          { description: 'Single Carport (IBR Roof)', defaultPrice: 25000, unit: 'unit' },
          { description: 'Double Carport (IBR Roof)', defaultPrice: 42000, unit: 'unit' },
          { description: 'Single Carport (Polycarbonate)', defaultPrice: 35000, unit: 'unit' },
          { description: 'Double Carport (Polycarbonate)', defaultPrice: 58000, unit: 'unit' },
        ],
      },
      {
        id: 'awning',
        label: 'Awning',
        defaultUnit: 'sqm',
        commonItems: [
          { description: 'Fixed Awning (per sqm)', defaultPrice: 1200, unit: 'sqm' },
          { description: 'Retractable Awning (per sqm)', defaultPrice: 2500, unit: 'sqm' },
          { description: 'Drop-arm Awning (per sqm)', defaultPrice: 1800, unit: 'sqm' },
        ],
      },
      {
        id: 'materials',
        label: 'Materials/Upgrades',
        defaultUnit: 'unit',
        commonItems: [
          { description: 'Shadecloth (340gsm Premium)', defaultPrice: 180, unit: 'sqm' },
          { description: 'Chrome-6 Steel Upgrade', defaultPrice: 2500, unit: 'unit' },
          { description: 'Gutter System', defaultPrice: 1500, unit: 'unit' },
          { description: 'LED Lighting Strip', defaultPrice: 850, unit: 'unit' },
        ],
      },
      {
        id: 'installation',
        label: 'Installation',
        defaultUnit: 'job',
        commonItems: [
          { description: 'Standard Installation', defaultPrice: 3500, unit: 'job' },
          { description: 'Complex Installation (slopes/obstacles)', defaultPrice: 5500, unit: 'job' },
          { description: 'Concrete Foundations', defaultPrice: 450, unit: 'unit' },
          { description: 'Chemical Anchors (existing slab)', defaultPrice: 350, unit: 'unit' },
        ],
      },
    ],
    showQuantity: true,
    showUnit: true,
    defaultCategory: 'shadeport',
  },
  features: {
    enablePhotos: true,
    enableScheduling: true,
    enableInvoices: true,
    enableClientTiers: true,
    enableNotes: true,
    enablePriorityLevels: true,
  },
  termsAndConditions: `SHADEPORT & CARPORT INSTALLATION TERMS

1. DEPOSIT & PAYMENT
   - 60% deposit required to commence manufacturing
   - Balance of 40% due upon completion
   - Manufacturing begins only after deposit clears

2. MANUFACTURING
   - Lead time: 7-14 working days after deposit
   - Custom colours may extend lead time
   - We will confirm installation date once complete

3. INSTALLATION
   - Client must ensure clear access to installation area
   - Underground services must be marked by client
   - Installation typically takes 1-2 days

4. WARRANTY
   - 5-year warranty on steel structure
   - 3-year warranty on shadecloth/fabric
   - 10-year warranty on polycarbonate sheets
   - Warranty void if structure altered

5. CANCELLATION
   - Orders may be cancelled before manufacturing
   - Deposit non-refundable once manufacturing starts
   - Changes to specifications may incur additional costs`,
};

export default shadeportConfig;
