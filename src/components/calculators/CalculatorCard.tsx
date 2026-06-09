'use client';

import React from 'react';
import { Card } from '@/components/ui';
import type { Calculator } from '@/types';

interface CalculatorCardProps {
  calculator: Calculator;
  onClick: () => void;
  isActive?: boolean;
}

export function CalculatorCard({ calculator, onClick, isActive }: CalculatorCardProps) {
  return (
    <Card
      hover
      onClick={onClick}
      className={`cursor-pointer transition-all ${
        isActive ? 'ring-2 ring-zinc-900 bg-zinc-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {calculator.icon && (
          <span className="text-2xl" role="img" aria-label={calculator.label}>
            {calculator.icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-zinc-900 mb-1">{calculator.label}</h3>
          <p className="text-sm text-zinc-500 line-clamp-2">{calculator.description}</p>
        </div>
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
      </div>
    </Card>
  );
}
