/**
 * Calculator Engine
 *
 * Trade-specific calculation functions for the Tradesmen Management System.
 * Each trade has its own module with specialized calculations.
 */

// Import everything from plumber module
import {
  calculatePipeSize,
  calculatePipeLength,
  calculateGeyserSize,
  calculateWaterPressure,
  fixtureUnits,
  type PipeSizeInput,
  type PipeSizeResult,
  type PipeLengthInput,
  type PipeLengthResult,
  type GeyserSizeInput,
  type GeyserSizeResult,
  type WaterPressureInput,
  type WaterPressureResult,
} from './plumber';

import type { CalculatorResult } from '@/types';

// Re-export plumber calculators and types
export {
  calculatePipeSize,
  calculatePipeLength,
  calculateGeyserSize,
  calculateWaterPressure,
  fixtureUnits,
  type PipeSizeInput,
  type PipeSizeResult,
  type PipeLengthInput,
  type PipeLengthResult,
  type GeyserSizeInput,
  type GeyserSizeResult,
  type WaterPressureInput,
  type WaterPressureResult,
};

// Re-export the CalculatorResult type for convenience
export type { CalculatorResult };

// Calculator registry - maps calculator IDs to their execution functions
export type CalculatorFunction = (input: Record<string, unknown>) => CalculatorResult;

// This registry allows dynamic execution of calculators by ID
export const calculatorRegistry: Record<string, CalculatorFunction> = {
  pipe_size: (input) => calculatePipeSize(input as unknown as PipeSizeInput),
  pipe_length: (input) => calculatePipeLength(input as unknown as PipeLengthInput),
  geyser_size: (input) => calculateGeyserSize(input as unknown as GeyserSizeInput),
  water_pressure: (input) => calculateWaterPressure(input as unknown as WaterPressureInput),
};

/**
 * Execute a calculator by ID with the given input
 */
export function executeCalculator(
  calculatorId: string,
  input: Record<string, unknown>
): CalculatorResult | null {
  const calculatorFn = calculatorRegistry[calculatorId];
  if (!calculatorFn) {
    console.warn(`Calculator not found: ${calculatorId}`);
    return null;
  }
  return calculatorFn(input);
}
