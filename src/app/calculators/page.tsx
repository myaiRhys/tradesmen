'use client';

import React, { useState } from 'react';
import { useConfig } from '@/context';
import { Card } from '@/components/ui';
import {
  PipeSizeCalculator,
  PipeLengthCalculator,
  GeyserSizeCalculator,
  WaterPressureCalculator,
} from '@/components/calculators';

// Calculator definitions with their component mappings
const calculatorComponents: Record<string, React.ComponentType<{
  onAddToQuote?: (lineItem: { description: string; quantity: number; unit: string; unitPrice: number }) => void;
  onClose?: () => void;
}>> = {
  pipe_size: PipeSizeCalculator,
  pipe_length: PipeLengthCalculator,
  geyser_size: GeyserSizeCalculator,
  water_pressure: WaterPressureCalculator,
};

// Default calculator definitions when config doesn't have them
const defaultPlumberCalculators = [
  {
    id: 'pipe_size',
    label: 'Pipe Size Calculator',
    description: 'Determine correct pipe diameter based on fixtures served',
    icon: '🔧',
  },
  {
    id: 'pipe_length',
    label: 'Pipe Length Estimator',
    description: 'Estimate total pipe length and fittings for a job',
    icon: '📏',
  },
  {
    id: 'geyser_size',
    label: 'Geyser Size Calculator',
    description: 'Recommend correct geyser capacity for household',
    icon: '🔥',
  },
  {
    id: 'water_pressure',
    label: 'Water Pressure Calculator',
    description: 'Calculate expected water pressure at outlet',
    icon: '💧',
  },
];

export default function CalculatorsPage() {
  const { config, isLoaded } = useConfig();
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  // Use calculators from config if available, otherwise use defaults
  const calculators = config.calculators && config.calculators.length > 0
    ? config.calculators
    : defaultPlumberCalculators;

  const handleAddToQuote = (lineItem: { description: string; quantity: number; unit: string; unitPrice: number }) => {
    // TODO: Integrate with quote builder context
    // For now, just show an alert
    alert(`Added to quote:\n${lineItem.description}\n${lineItem.quantity} ${lineItem.unit} @ R${lineItem.unitPrice}`);
  };

  const ActiveCalculatorComponent = activeCalculator
    ? calculatorComponents[activeCalculator]
    : null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Calculators</h1>
          <p className="text-sm text-zinc-500">
            Quick tools to help with estimates and sizing
          </p>
        </div>

        {/* Active Calculator */}
        {ActiveCalculatorComponent && (
          <div>
            <ActiveCalculatorComponent
              onAddToQuote={handleAddToQuote}
              onClose={() => setActiveCalculator(null)}
            />
          </div>
        )}

        {/* Calculator Grid */}
        {!activeCalculator && (
          <div className="grid gap-4 md:grid-cols-2">
            {calculators.map((calc) => {
              const hasComponent = calculatorComponents[calc.id];
              return (
                <Card
                  key={calc.id}
                  hover={!!hasComponent}
                  onClick={hasComponent ? () => setActiveCalculator(calc.id) : undefined}
                  className={hasComponent ? 'cursor-pointer' : 'opacity-50'}
                >
                  <div className="flex items-start gap-3">
                    {calc.icon && (
                      <span className="text-2xl" role="img" aria-label={calc.label}>
                        {calc.icon}
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-zinc-900 mb-1">{calc.label}</h3>
                      <p className="text-sm text-zinc-500">{calc.description}</p>
                    </div>
                    {hasComponent && (
                      <svg
                        className="w-5 h-5 text-zinc-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {calculators.length === 0 && (
          <Card className="text-center py-8">
            <div className="text-4xl mb-3">🧮</div>
            <h3 className="font-medium text-zinc-900 mb-1">No Calculators Available</h3>
            <p className="text-sm text-zinc-500">
              Calculators for your trade will appear here
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
