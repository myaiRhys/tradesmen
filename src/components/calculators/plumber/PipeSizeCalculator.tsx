'use client';

import React, { useState } from 'react';
import { Card, Button, Input, Select } from '@/components/ui';
import { CalculatorResultExtended } from '../CalculatorResult';
import { calculatePipeSize, fixtureUnits, type PipeSizeResult } from '@/lib/calculators/plumber';
import type { CalculatorResult as CalculatorResultType } from '@/types';

interface PipeSizeCalculatorProps {
  onAddToQuote?: (lineItem: NonNullable<CalculatorResultType['lineItem']>) => void;
  onClose?: () => void;
}

const fixtureOptions = Object.keys(fixtureUnits).map((key) => ({
  value: key,
  label: key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
}));

const simultaneousOptions = [
  { value: 'low', label: 'Low (1-2 fixtures)' },
  { value: 'medium', label: 'Medium (3-4 fixtures)' },
  { value: 'high', label: 'High (5+ fixtures)' },
];

export function PipeSizeCalculator({ onAddToQuote, onClose }: PipeSizeCalculatorProps) {
  const [fixtureType, setFixtureType] = useState('basin');
  const [fixtureCount, setFixtureCount] = useState(1);
  const [simultaneousUse, setSimultaneousUse] = useState<'low' | 'medium' | 'high'>('medium');
  const [result, setResult] = useState<PipeSizeResult | null>(null);

  const handleCalculate = () => {
    const calcResult = calculatePipeSize({
      fixtureType,
      fixtureCount,
      simultaneousUse,
    });
    setResult(calcResult);
  };

  const handleReset = () => {
    setFixtureType('basin');
    setFixtureCount(1);
    setSimultaneousUse('medium');
    setResult(null);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-zinc-900">Pipe Size Calculator</h3>
          <p className="text-sm text-zinc-500">Determine correct pipe diameter based on fixtures</p>
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
        <div className="grid gap-4 md:grid-cols-3">
          <Select
            label="Fixture Type"
            value={fixtureType}
            onChange={(e) => setFixtureType(e.target.value)}
            options={fixtureOptions}
          />
          <Input
            label="Number of Fixtures"
            type="number"
            value={fixtureCount}
            onChange={(e) => setFixtureCount(Number(e.target.value))}
            min={1}
            max={20}
          />
          <Select
            label="Simultaneous Use"
            value={simultaneousUse}
            onChange={(e) => setSimultaneousUse(e.target.value as 'low' | 'medium' | 'high')}
            options={simultaneousOptions}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCalculate} disabled={fixtureCount < 1}>
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
              { label: 'Fixture Units', value: result.totalFixtureUnits },
              { label: 'Flow Rate', value: result.flowRate, unit: 'L/min' },
            ]}
            onAddToQuote={onAddToQuote}
          />
        )}
      </div>
    </Card>
  );
}
