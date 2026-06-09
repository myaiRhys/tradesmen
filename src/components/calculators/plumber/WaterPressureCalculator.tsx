'use client';

import React, { useState } from 'react';
import { Card, Button, Input, Select } from '@/components/ui';
import { CalculatorResultExtended } from '../CalculatorResult';
import { calculateWaterPressure, type WaterPressureResult } from '@/lib/calculators/plumber';
import type { CalculatorResult as CalculatorResultType } from '@/types';

interface WaterPressureCalculatorProps {
  onAddToQuote?: (lineItem: NonNullable<CalculatorResultType['lineItem']>) => void;
  onClose?: () => void;
}

const pipeDiameterOptions = [
  { value: '15', label: '15mm' },
  { value: '22', label: '22mm' },
  { value: '28', label: '28mm' },
];

export function WaterPressureCalculator({ onAddToQuote, onClose }: WaterPressureCalculatorProps) {
  const [tankHeight, setTankHeight] = useState(3);
  const [pipeLength, setPipeLength] = useState(10);
  const [pipeDiameter, setPipeDiameter] = useState<'15' | '22' | '28'>('22');
  const [fittingsCount, setFittingsCount] = useState(5);
  const [result, setResult] = useState<WaterPressureResult | null>(null);

  const handleCalculate = () => {
    const calcResult = calculateWaterPressure({
      tankHeight,
      pipeLength,
      pipeDiameter,
      fittingsCount,
    });
    setResult(calcResult);
  };

  const handleReset = () => {
    setTankHeight(3);
    setPipeLength(10);
    setPipeDiameter('22');
    setFittingsCount(5);
    setResult(null);
  };

  const getPressureColor = (rating: 'low' | 'normal' | 'high') => {
    switch (rating) {
      case 'low':
        return 'text-red-600';
      case 'high':
        return 'text-amber-600';
      default:
        return 'text-green-600';
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-zinc-900">Water Pressure Calculator</h3>
          <p className="text-sm text-zinc-500">Calculate expected water pressure at outlet</p>
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
            label="Tank/Header Height (m)"
            type="number"
            value={tankHeight}
            onChange={(e) => setTankHeight(Number(e.target.value))}
            min={0}
            max={30}
            step={0.5}
          />
          <Input
            label="Total Pipe Length (m)"
            type="number"
            value={pipeLength}
            onChange={(e) => setPipeLength(Number(e.target.value))}
            min={1}
            max={100}
          />
          <Select
            label="Pipe Diameter"
            value={pipeDiameter}
            onChange={(e) => setPipeDiameter(e.target.value as '15' | '22' | '28')}
            options={pipeDiameterOptions}
          />
          <Input
            label="Number of Fittings"
            type="number"
            value={fittingsCount}
            onChange={(e) => setFittingsCount(Number(e.target.value))}
            min={0}
            max={50}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCalculate} disabled={tankHeight < 0}>
            Calculate
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {result && (
          <>
            <CalculatorResultExtended
              mainResult={result}
              details={[
                { label: 'Static Pressure', value: result.staticPressure, unit: 'kPa' },
                { label: 'Friction Loss', value: result.frictionLoss, unit: 'kPa' },
              ]}
              onAddToQuote={result.lineItem ? onAddToQuote : undefined}
            />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500">Pressure Rating:</span>
              <span className={`font-medium capitalize ${getPressureColor(result.pressureRating)}`}>
                {result.pressureRating}
              </span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
