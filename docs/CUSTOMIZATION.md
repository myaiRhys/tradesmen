# Customization Guide

This guide explains how to fork and customize the tradesmen template for a new client.

## Quick Customization (No Code Required)

For basic customization, use the Settings page in the app:

1. **Settings → Company** — Update business name, contact, banking
2. **Settings → Pricing** — Set VAT rate, deposit %, currency
3. **Settings → Trade Presets** — Load a pre-configured trade

Changes are saved to localStorage and persist across sessions.

---

## Advanced Customization (Code Changes)

### 1. Fork & Clone

```bash
# Fork on GitHub, then clone
git clone https://github.com/YOUR_USERNAME/tradesmen-template.git my-client-app
cd my-client-app
npm install
```

### 2. Create a Custom Trade Preset

Create a new file in `src/config/trades/`:

```typescript
// src/config/trades/my-trade.ts
import type { AppConfig } from '@/types';

export const myTradeConfig: AppConfig = {
  company: {
    name: 'My Trade Business',
    tagline: 'Quality You Can Trust',
    phone: '+27 00 000 0000',
    email: 'info@mybusiness.co.za',
    address: '123 Street, City',
    bankName: 'Bank Name',
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
      { id: 'in_progress', label: 'In Progress', color: '#06b6d4' },
      { id: 'completed', label: 'Completed', color: '#22c55e' },
      { id: 'paid', label: 'Paid', color: '#10b981' },
    ],
    transitions: [
      { from: 'enquiry', to: ['quoted'] },
      { from: 'quoted', to: ['accepted', 'enquiry'] },
      { from: 'accepted', to: ['in_progress'] },
      { from: 'in_progress', to: ['completed'] },
      { from: 'completed', to: ['paid'] },
      { from: 'paid', to: [] },
    ],
    initialStatus: 'enquiry',
    completedStatuses: ['paid'],
  },
  quoteBuilder: {
    categories: [
      {
        id: 'labour',
        label: 'Labour',
        defaultUnit: 'hour',
        commonItems: [
          { description: 'Standard Rate', defaultPrice: 500, unit: 'hour' },
        ],
      },
      {
        id: 'materials',
        label: 'Materials',
        defaultUnit: 'unit',
        commonItems: [],
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
  termsAndConditions: `Your terms here...`,
};

export default myTradeConfig;
```

### 3. Register the Preset

Add to `src/config/trades/index.ts`:

```typescript
export { myTradeConfig } from './my-trade';
import { myTradeConfig } from './my-trade';

export const tradePresets = {
  // ... existing presets
  my_trade: myTradeConfig,
};
```

### 4. Set as Default (Optional)

To use your preset as the default, update `src/config/defaults.ts`:

```typescript
import { myTradeConfig } from './trades/my-trade';
export const defaultConfig = myTradeConfig;
```

---

## Workflow Customization

### Adding a New Status

1. Add to `workflow.statuses`:
```typescript
{ id: 'site_visit', label: 'Site Visit', color: '#a855f7' }
```

2. Update `workflow.transitions`:
```typescript
{ from: 'enquiry', to: ['site_visit', 'quoted'] },
{ from: 'site_visit', to: ['quoted'] },
```

### Changing Colors

Use hex color codes. Suggested palette:
- Grey: `#6b7280`
- Blue: `#3b82f6`
- Purple: `#8b5cf6`
- Cyan: `#06b6d4`
- Green: `#22c55e`
- Yellow: `#f59e0b`
- Orange: `#f97316`
- Red: `#ef4444`

---

## Quote Builder Categories

Add industry-specific line item categories:

```typescript
quoteBuilder: {
  categories: [
    {
      id: 'plumbing',
      label: 'Plumbing Work',
      defaultUnit: 'job',
      commonItems: [
        { description: 'Tap Replacement', defaultPrice: 650, unit: 'unit' },
        { description: 'Geyser Service', defaultPrice: 1500, unit: 'job' },
      ],
    },
    // Add more categories...
  ],
},
```

---

## Feature Toggles

Enable or disable features in `features`:

```typescript
features: {
  enablePhotos: true,        // Job photo uploads (future)
  enableScheduling: true,    // Show scheduled date field
  enableInvoices: true,      // Invoice generation
  enableClientTiers: true,   // Standard/Premium/VIP tiers
  enableNotes: true,         // Job notes field
  enablePriorityLevels: true, // Low/Medium/High/Urgent
},
```

---

## PWA Customization

### Update Manifest

Edit `public/manifest.json`:
- `name` — Full app name
- `short_name` — Short name for home screen
- `theme_color` — Status bar color

### Add App Icons

Replace these files in `public/`:
- `icon-192.png` — 192x192 PNG
- `icon-512.png` — 512x512 PNG

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Deploy

### Other Platforms

```bash
npm run build
npm run start
```

Or export as static:
```bash
npm run build
# Output in .next/
```
