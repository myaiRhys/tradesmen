'use client';

import React from 'react';
import { Input, Select, Button } from '@/components/ui';
import type { Calculator, CalculatorField } from '@/types';

interface CalculatorFormProps {
  calculator: Calculator;
  values: Record<string, string | number>;
  onChange: (fieldId: string, value: string | number) => void;
  onCalculate: () => void;
  onReset: () => void;
}

export function CalculatorForm({
  calculator,
  values,
  onChange,
  onCalculate,
  onReset,
}: CalculatorFormProps) {
  const renderField = (field: CalculatorField) => {
    const value = values[field.id] ?? field.defaultValue ?? '';

    switch (field.type) {
      case 'select':
        return (
          <Select
            key={field.id}
            label={field.label}
            value={String(value)}
            onChange={(e) => onChange(field.id, e.target.value)}
            options={
              field.options?.map((opt) => ({
                value: opt.value,
                label: opt.label,
              })) || []
            }
          />
        );

      case 'number':
        return (
          <Input
            key={field.id}
            label={`${field.label}${field.unit ? ` (${field.unit})` : ''}`}
            type="number"
            value={value}
            onChange={(e) => onChange(field.id, Number(e.target.value))}
            min={field.min}
            max={field.max}
            required={field.required}
          />
        );

      case 'text':
      default:
        return (
          <Input
            key={field.id}
            label={field.label}
            type="text"
            value={String(value)}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.required}
          />
        );
    }
  };

  const isFormValid = calculator.fields.every((field) => {
    if (!field.required) return true;
    const value = values[field.id];
    if (value === undefined || value === '') return false;
    if (field.type === 'number' && (isNaN(Number(value)) || Number(value) <= 0)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {calculator.fields.map(renderField)}
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={onCalculate} disabled={!isFormValid}>
          Calculate
        </Button>
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
