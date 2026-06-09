'use client';

import React, { useState } from 'react';
import { Card, Button, Input, Select } from '@/components/ui';
import { CalculatorResultExtended } from '../CalculatorResult';
import { calculateGeyserSize, type GeyserSizeResult } from '@/lib/calculators/plumber';
import type { CalculatorResult as CalculatorResultType } from '@/types';

interface GeyserSizeCalculatorProps {
  onAddToQuote?: (lineItem: NonNullable<CalculatorResultType['lineItem']>) => void;
  onClose?: () => void;
}

const usageOptions = [
  { value: 'light', label: 'Light (quick showers)' },
  { value: 'normal', label: 'Normal (standard usage)' },
  { value: 'heavy', label: 'Heavy (long showers, baths)' },
];

const geyserTypeOptions = [
  { value: 'electric', label: 'Electric' },
  { value: 'solar', label: 'Solar' },
  { value: 'heat_pump', label: 'Heat Pump' },
];

export function GeyserSizeCalculator({ onAddToQuote, onClose }: GeyserSizeCalculatorProps) {
  const [householdSize, setHouseholdSize] = useState(4);
  const [bathroomCount, setBathroomCount] = useState(2);
  const [usagePattern, setUsagePattern] = useState<'light' | 'normal' | 'heavy'>('normal');
  const [geyserType, setGeyserType] = useState<'electric' | 'solar' | 'heat_pump'>('electric');
  const [result, setResult] = useState<GeyserSizeResult | null>(null);

  const handleCalculate = () => {
    const calcResult = calculateGeyserSize({
      householdSize,
      bathroomCount,
      usagePattern,
      geyserType,
    });
    setResult(calcResult);
  };

  const handleReset = () => {
    setHouseholdSize(4);
    setBathroomCount(2);
    setUsagePattern('normal');
    setGeyserType('electric');
    setResult(null);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-zinc-900">Geyser Size Calculator</h3>
          <p className="text-sm text-zinc-500">Recommend correct geyser capacity for household</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Household Size (people)"
            type="number"
            value={householdSize}
            onChange={(e) => setHouseholdSize(Number(e.target.value))}
            min={1}
            max={10}
          />
          <Input
            label="Number of Bathrooms"
            type="number"
            value={bathroomCount}
            onChange={(e) => setBathroomCount(Number(e.target.value))}
            min={1}
            max={5}
          />
          <Select
            label="Usage Pattern"
            value={usagePattern}
            onChange={(e) => setUsagePattern(e.target.value as 'light' | 'normal' | 'heavy')}
            options={usageOptions}
          />
          <Select
            label="Geyser Type"
            value={geyserType}
            onChange={(e) => setGeyserType(e.target.value as 'electric' | 'solar' | 'heat_pump')}
            options={geyserTypeOptions}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCalculate} disabled={householdSize < 1}>
            Calculate
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {result && (
          <CalculatorResultExtended
            mainResult={result}
            details={[
              { label: 'Est. Monthly', value: result.monthlyKwh, unit: 'kWh' },
              { label: 'Est. Cost', value: `R${result.monthlyCostEstimate}`, unit: '/mo' },
            ]}
            onAddToQuote={onAddToQuote}
          />
        )}
      </div>
    </Card>
  );
}
