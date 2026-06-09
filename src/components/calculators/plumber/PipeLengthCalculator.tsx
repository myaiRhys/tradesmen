'use client';

import React, { useState } from 'react';
import { Card, Button, Input, Select } from '@/components/ui';
import { CalculatorResultExtended } from '../CalculatorResult';
import { calculatePipeLength, type PipeLengthResult } from '@/lib/calculators/plumber';
import type { CalculatorResult as CalculatorResultType } from '@/types';

interface PipeLengthCalculatorProps {
  onAddToQuote?: (lineItem: NonNullable<CalculatorResultType['lineItem']>) => void;
  onClose?: () => void;
}

const routingOptions = [
  { value: 'direct', label: 'Direct (shortest path)' },
  { value: 'wall_mounted', label: 'Wall Mounted (+30%)' },
  { value: 'under_floor', label: 'Under Floor (+50%)' },
];

export function PipeLengthCalculator({ onAddToQuote, onClose }: PipeLengthCalculatorProps) {
  const [roomCount, setRoomCount] = useState(1);
  const [avgRoomWidth, setAvgRoomWidth] = useState(3);
  const [avgRoomLength, setAvgRoomLength] = useState(4);
  const [fixturesPerRoom, setFixturesPerRoom] = useState(2);
  const [routing, setRouting] = useState<'direct' | 'wall_mounted' | 'under_floor'>('direct');
  const [result, setResult] = useState<PipeLengthResult | null>(null);

  const handleCalculate = () => {
    const calcResult = calculatePipeLength({
      roomCount,
      avgRoomWidth,
      avgRoomLength,
      fixturesPerRoom,
      routing,
    });
    setResult(calcResult);
  };

  const handleReset = () => {
    setRoomCount(1);
    setAvgRoomWidth(3);
    setAvgRoomLength(4);
    setFixturesPerRoom(2);
    setRouting('direct');
    setResult(null);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-zinc-900">Pipe Length Estimator</h3>
          <p className="text-sm text-zinc-500">Estimate total pipe length and fittings for a job</p>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Number of Rooms"
            type="number"
            value={roomCount}
            onChange={(e) => setRoomCount(Number(e.target.value))}
            min={1}
            max={10}
          />
          <Input
            label="Avg Room Width (m)"
            type="number"
            value={avgRoomWidth}
            onChange={(e) => setAvgRoomWidth(Number(e.target.value))}
            min={1}
            max={20}
            step={0.5}
          />
          <Input
            label="Avg Room Length (m)"
            type="number"
            value={avgRoomLength}
            onChange={(e) => setAvgRoomLength(Number(e.target.value))}
            min={1}
            max={20}
            step={0.5}
          />
          <Input
            label="Fixtures per Room"
            type="number"
            value={fixturesPerRoom}
            onChange={(e) => setFixturesPerRoom(Number(e.target.value))}
            min={1}
            max={5}
          />
          <Select
            label="Pipe Routing"
            value={routing}
            onChange={(e) => setRouting(e.target.value as 'direct' | 'wall_mounted' | 'under_floor')}
            options={routingOptions}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCalculate} disabled={roomCount < 1}>
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
              { label: 'Est. Fittings', value: result.fittingsCount, unit: 'pcs' },
              { label: 'Waste Factor', value: `${Math.round(result.wasteFactor * 100 - 100)}%` },
            ]}
            onAddToQuote={onAddToQuote}
          />
        )}
      </div>
    </Card>
  );
}
