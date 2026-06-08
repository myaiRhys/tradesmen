# Tradesmen Management System Template

A reusable job tracking and quote management template for any trade business (plumber, electrician, builder, etc.).

## Quick Start

```bash
# Clone/fork the template
git clone <your-fork-url>
cd tradesmen-template

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features

- **Job Tracker** — Status workflow with configurable transitions
- **Quote Builder** — Line items, VAT, deposit/balance calculations
- **Client Database** — Searchable with optional tier support
- **PDF Generation** — HTML-to-print quote export
- **Dashboard** — Stats, alerts, and recent activity
- **Settings** — Company info, T&Cs, pricing config
- **PWA Ready** — Installable on mobile devices

## Tech Stack

- Next.js 15 + TypeScript
- Tailwind CSS
- GSAP (animations)
- Zod (validation)
- localStorage (MVP) — Firebase ready

## Customization

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for detailed instructions on:

1. Forking the template
2. Customizing company info
3. Modifying the workflow
4. Adding line item categories
5. Changing features and pricing

## Trade Presets

Pre-configured settings for common trades:

- `plumber` — Labour, materials, callout fees, drain work
- `electrician` — DB work, wiring, compliance/COC
- `shadeport` — Shadeports, carports, awnings, installation

Load a preset from Settings → Trade Presets.

## Project Structure

```
src/
├── app/                 # Next.js pages
│   ├── page.tsx        # Dashboard
│   ├── jobs/           # Job tracker
│   ├── clients/        # Client database
│   ├── quotes/         # Quote builder
│   └── settings/       # Configuration
├── components/
│   ├── ui/             # Button, Card, Modal, etc.
│   ├── layout/         # Sidebar, BottomNav, SplitLayout
│   ├── jobs/           # JobList, JobDetail, StatusTimeline
│   ├── clients/        # ClientList, ClientDetail
│   └── quotes/         # QuoteBuilder, LineItemEditor
├── config/
│   ├── schema.ts       # Zod config validation
│   ├── defaults.ts     # Default configuration
│   └── trades/         # Trade presets
├── context/            # React contexts (state management)
├── lib/
│   ├── storage/        # localStorage adapter
│   ├── pricing/        # Calculations, formatters
│   └── pdf/            # Quote PDF generation
└── types/              # TypeScript types
```

## License

MIT
