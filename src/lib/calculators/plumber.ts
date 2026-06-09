/**
 * Plumber Calculator Formulas
 *
 * These are simplified industry-standard calculations for common plumbing tasks.
 * For complex installations, always consult with a qualified engineer.
 */

import type { CalculatorResult } from '@/types';

// ============================================================================
// FIXTURE UNITS - Industry standard values for pipe sizing calculations
// ============================================================================

export const fixtureUnits: Record<string, number> = {
  basin: 1,
  toilet: 3,
  shower: 2,
  bath: 3,
  kitchen_sink: 2,
  washing_machine: 3,
  dishwasher: 2,
};

// ============================================================================
// CALCULATOR 1: PIPE SIZING
// Purpose: Determine correct pipe diameter based on fixtures served
// ============================================================================

export interface PipeSizeInput {
  fixtureType: string;
  fixtureCount: number;
  simultaneousUse: 'low' | 'medium' | 'high';
}

export interface PipeSizeResult extends CalculatorResult {
  pipeSize: number;
  totalFixtureUnits: number;
  flowRate: number;
}

export function calculatePipeSize(input: PipeSizeInput): PipeSizeResult {
  const fixtureUnit = fixtureUnits[input.fixtureType] || 1;
  const totalFU = fixtureUnit * input.fixtureCount;

  // Simultaneous use multiplier
  const simultaneousMultiplier = {
    low: 0.8,
    medium: 1.0,
    high: 1.3,
  };

  const adjustedFU = Math.ceil(totalFU * simultaneousMultiplier[input.simultaneousUse]);

  // Pipe sizing based on fixture units
  let pipeSize: number;
  let flowRate: number;

  if (adjustedFU <= 6) {
    pipeSize = 15;
    flowRate = 12;
  } else if (adjustedFU <= 15) {
    pipeSize = 22;
    flowRate = 30;
  } else if (adjustedFU <= 30) {
    pipeSize = 28;
    flowRate = 55;
  } else {
    pipeSize = 35;
    flowRate = 85;
  }

  let recommendation = `${pipeSize}mm pipe is suitable for your installation.`;
  if (adjustedFU > 40) {
    recommendation += ' For very high fixture loads, consult an engineer.';
  }

  return {
    value: pipeSize,
    unit: 'mm',
    label: 'Recommended Pipe Size',
    recommendation,
    pipeSize,
    totalFixtureUnits: adjustedFU,
    flowRate,
    lineItem: {
      description: `${pipeSize}mm Pipe Installation`,
      quantity: 1,
      unit: 'job',
      unitPrice: pipeSize * 50, // Rough estimate
    },
  };
}

// ============================================================================
// CALCULATOR 2: PIPE LENGTH ESTIMATOR
// Purpose: Estimate total pipe length + fittings for a job
// ============================================================================

export interface PipeLengthInput {
  roomCount: number;
  avgRoomWidth: number;
  avgRoomLength: number;
  fixturesPerRoom: number;
  routing: 'direct' | 'wall_mounted' | 'under_floor';
}

export interface PipeLengthResult extends CalculatorResult {
  totalLength: number;
  fittingsCount: number;
  wasteFactor: number;
}

export function calculatePipeLength(input: PipeLengthInput): PipeLengthResult {
  const wasteFactor = 1.2; // 20% waste factor

  // Routing multipliers
  const routingFactor = {
    direct: 1.0,
    wall_mounted: 1.3,
    under_floor: 1.5,
  };

  // Basic estimation: perimeter-based calculation per room
  const basePerRoom = (input.avgRoomWidth + input.avgRoomLength) * input.fixturesPerRoom;
  const baseLength = input.roomCount * basePerRoom;

  // Apply routing and waste factors
  const totalLength = Math.ceil(baseLength * routingFactor[input.routing] * wasteFactor);

  // Estimate fittings: roughly 1 fitting per 3m of pipe
  const fittingsCount = Math.ceil(totalLength / 3);

  const routingLabel = {
    direct: 'direct routing',
    wall_mounted: 'wall-mounted routing',
    under_floor: 'under-floor routing',
  };

  return {
    value: totalLength,
    unit: 'm',
    label: 'Total Pipe Length',
    recommendation: `Estimated ${totalLength}m of pipe with ${fittingsCount} fittings for ${routingLabel[input.routing]}. Includes 20% waste allowance.`,
    totalLength,
    fittingsCount,
    wasteFactor,
    lineItem: {
      description: 'Pipe Supply and Installation',
      quantity: totalLength,
      unit: 'meter',
      unitPrice: 85, // Average PVC price from config
    },
  };
}

// ============================================================================
// CALCULATOR 3: GEYSER SIZING
// Purpose: Recommend correct geyser capacity
// ============================================================================

export interface GeyserSizeInput {
  householdSize: number;
  bathroomCount: number;
  usagePattern: 'light' | 'normal' | 'heavy';
  geyserType: 'electric' | 'solar' | 'heat_pump';
}

export interface GeyserSizeResult extends CalculatorResult {
  recommendedCapacity: number;
  monthlyKwh: number;
  monthlyCostEstimate: number;
}

// Standard geyser sizes in South Africa
const standardSizes = [100, 150, 200, 250, 300];

function roundToNearestStandardSize(capacity: number): number {
  // Find the smallest standard size that's >= the calculated capacity
  for (const size of standardSizes) {
    if (size >= capacity) {
      return size;
    }
  }
  return standardSizes[standardSizes.length - 1]; // Return largest if exceeds all
}

export function calculateGeyserSize(input: GeyserSizeInput): GeyserSizeResult {
  // Base: 50L per person
  const baseCapacity = input.householdSize * 50;

  // Additional capacity for extra bathrooms
  const bathroomExtra = Math.max(0, input.bathroomCount - 1) * 25;

  // Usage multiplier
  const usageMultiplier = {
    light: 0.8,
    normal: 1.0,
    heavy: 1.3,
  };

  const calculatedCapacity = (baseCapacity + bathroomExtra) * usageMultiplier[input.usagePattern];
  const recommendedCapacity = roundToNearestStandardSize(calculatedCapacity);

  // Energy consumption estimates (kWh per month)
  // Based on typical SA electricity usage for water heating
  const energyEfficiency = {
    electric: 1.0,      // Baseline
    solar: 0.3,         // ~70% savings
    heat_pump: 0.35,    // ~65% savings
  };

  // Rough estimate: 3-4 kWh per person per day for hot water
  const baseKwhPerMonth = input.householdSize * 3.5 * 30;
  const monthlyKwh = Math.round(baseKwhPerMonth * energyEfficiency[input.geyserType]);

  // R2.50/kWh average Eskom rate (2024)
  const monthlyCostEstimate = Math.round(monthlyKwh * 2.5);

  const geyserTypeLabel = {
    electric: 'Electric geyser',
    solar: 'Solar geyser',
    heat_pump: 'Heat pump',
  };

  return {
    value: recommendedCapacity,
    unit: 'L',
    label: 'Recommended Capacity',
    recommendation: `${geyserTypeLabel[input.geyserType]} of ${recommendedCapacity}L recommended. Estimated monthly electricity: ${monthlyKwh} kWh (~R${monthlyCostEstimate}).`,
    recommendedCapacity,
    monthlyKwh,
    monthlyCostEstimate,
    lineItem: {
      description: `${recommendedCapacity}L ${geyserTypeLabel[input.geyserType]} Supply & Installation`,
      quantity: 1,
      unit: 'unit',
      unitPrice: recommendedCapacity * 45 + (input.geyserType === 'solar' ? 8000 : input.geyserType === 'heat_pump' ? 12000 : 0),
    },
  };
}

// ============================================================================
// CALCULATOR 4: WATER PRESSURE CALCULATOR
// Purpose: Calculate expected water pressure at outlet
// ============================================================================

export interface WaterPressureInput {
  tankHeight: number;      // metres above outlet
  pipeLength: number;      // total metres of pipe run
  pipeDiameter: '15' | '22' | '28';
  fittingsCount: number;   // elbows, tees, valves
}

export interface WaterPressureResult extends CalculatorResult {
  staticPressure: number;
  frictionLoss: number;
  deliveredPressure: number;
  pressureRating: 'low' | 'normal' | 'high';
}

export function calculateWaterPressure(input: WaterPressureInput): WaterPressureResult {
  // Static head pressure: 1m = 9.81 kPa (we'll use 10 for simplicity)
  const staticPressure = input.tankHeight * 9.81;

  // Friction loss per metre (simplified Hazen-Williams approximation)
  const frictionLossPerMetre: Record<string, number> = {
    '15': 0.5,  // kPa per metre
    '22': 0.2,
    '28': 0.1,
  };

  // Fitting equivalent length (~0.5m per fitting)
  const fittingEquivalent = input.fittingsCount * 0.5;

  const effectiveLength = input.pipeLength + fittingEquivalent;
  const frictionLoss = effectiveLength * frictionLossPerMetre[input.pipeDiameter];

  const deliveredPressure = Math.max(0, staticPressure - frictionLoss);

  // Determine pressure rating
  let pressureRating: 'low' | 'normal' | 'high';
  if (deliveredPressure < 100) {
    pressureRating = 'low';
  } else if (deliveredPressure <= 300) {
    pressureRating = 'normal';
  } else {
    pressureRating = 'high';
  }

  let recommendation = `Expected pressure: ${Math.round(deliveredPressure)} kPa (${pressureRating}).`;

  if (deliveredPressure < 80) {
    recommendation += ' Consider installing a pressure pump.';
  } else if (deliveredPressure > 400) {
    recommendation += ' Consider installing a pressure reducing valve.';
  }

  return {
    value: Math.round(deliveredPressure),
    unit: 'kPa',
    label: 'Delivered Pressure',
    recommendation,
    staticPressure: Math.round(staticPressure),
    frictionLoss: Math.round(frictionLoss),
    deliveredPressure: Math.round(deliveredPressure),
    pressureRating,
    lineItem: pressureRating === 'low' ? {
      description: 'Pressure Pump Supply & Installation',
      quantity: 1,
      unit: 'unit',
      unitPrice: 3500,
    } : undefined,
  };
}
