'use client';

import React from 'react';
import { Card, Button } from '@/components/ui';
import type { CalculatorResult as CalculatorResultType } from '@/types';

interface CalculatorResultProps {
  result: CalculatorResultType;
  onAddToQuote?: (lineItem: NonNullable<CalculatorResultType['lineItem']>) => void;
}

export function CalculatorResult({ result, onAddToQuote }: CalculatorResultProps) {
  return (
    <Card className="bg-zinc-50 border-zinc-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-zinc-600">{result.label}</h4>
        <div className="text-right">
          <span className="text-3xl font-semibold text-zinc-900">{result.value}</span>
          <span className="text-lg text-zinc-500 ml-1">{result.unit}</span>
        </div>
      </div>

      <p className="text-sm text-zinc-600 mb-4">{result.recommendation}</p>

      {result.lineItem && onAddToQuote && (
        <div className="pt-3 border-t border-zinc-200">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-zinc-900">{result.lineItem.description}</p>
              <p className="text-zinc-500">
                {result.lineItem.quantity} {result.lineItem.unit} @ R{result.lineItem.unitPrice}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onAddToQuote(result.lineItem!)}
            >
              Add to Quote
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

// Extended result display for calculators with multiple outputs
interface ExtendedResultProps {
  mainResult: CalculatorResultType;
  details: Array<{ label: string; value: string | number; unit?: string }>;
  onAddToQuote?: (lineItem: NonNullable<CalculatorResultType['lineItem']>) => void;
}

export function CalculatorResultExtended({
  mainResult,
  details,
  onAddToQuote,
}: ExtendedResultProps) {
  return (
    <Card className="bg-zinc-50 border-zinc-200">
      {/* Main result */}
      <div className="text-center pb-4 border-b border-zinc-200 mb-4">
        <p className="text-sm text-zinc-500 mb-1">{mainResult.label}</p>
        <div>
          <span className="text-4xl font-semibold text-zinc-900">{mainResult.value}</span>
          <span className="text-xl text-zinc-500 ml-1">{mainResult.unit}</span>
        </div>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {details.map((detail, index) => (
          <div key={index} className="text-center p-2 bg-white border border-zinc-100">
            <p className="text-xs text-zinc-500">{detail.label}</p>
            <p className="text-lg font-medium text-zinc-900">
              {detail.value}
              {detail.unit && <span className="text-sm text-zinc-500 ml-0.5">{detail.unit}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <p className="text-sm text-zinc-600 mb-4">{mainResult.recommendation}</p>

      {/* Add to quote action */}
      {mainResult.lineItem && onAddToQuote && (
        <div className="pt-3 border-t border-zinc-200">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-zinc-900">{mainResult.lineItem.description}</p>
              <p className="text-zinc-500">
                {mainResult.lineItem.quantity} {mainResult.lineItem.unit} @ R{mainResult.lineItem.unitPrice}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onAddToQuote(mainResult.lineItem!)}
            >
              Add to Quote
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
