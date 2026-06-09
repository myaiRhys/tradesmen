'use client';

import React from 'react';
import { tradePresets, type TradePresetKey } from '@/config/trades';
import { useConfig } from '@/context';

const SELECTED_TRADE_KEY = 'tradesmen_selected_trade';

interface TradeSelectorProps {
  onSelect: () => void;
}

const tradeIcons: Record<TradePresetKey, string> = {
  plumber: '🔧',
  electrician: '⚡',
  shadeport: '🏗️',
};

const tradeDescriptions: Record<TradePresetKey, string> = {
  plumber: 'Pipe fitting, drain work, geyser installations, and bathroom fixtures',
  electrician: 'Wiring, DB boards, COC compliance, and electrical installations',
  shadeport: 'Shadeports, carports, awnings, and outdoor structures',
};

export function TradeSelector({ onSelect }: TradeSelectorProps) {
  const { loadPreset } = useConfig();

  const handleSelectTrade = (tradeKey: TradePresetKey) => {
    const preset = tradePresets[tradeKey];
    loadPreset(preset);

    // Persist the selection
    if (typeof window !== 'undefined') {
      localStorage.setItem(SELECTED_TRADE_KEY, tradeKey);
    }

    onSelect();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Welcome to Tradesmen
          </h1>
          <p className="text-zinc-400">
            Select your trade to get started with a customized workflow
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {(Object.keys(tradePresets) as TradePresetKey[]).map((key) => {
            const preset = tradePresets[key];
            return (
              <button
                key={key}
                onClick={() => handleSelectTrade(key)}
                className="group bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 p-6 text-left transition-all"
              >
                <div className="text-4xl mb-3">{tradeIcons[key]}</div>
                <h2 className="text-lg font-medium text-white capitalize mb-1">
                  {key}
                </h2>
                <p className="text-xs text-zinc-400 mb-3">
                  {tradeDescriptions[key]}
                </p>
                <div className="text-xs text-zinc-500">
                  {preset.workflow.statuses.length} statuses &bull;{' '}
                  {preset.quoteBuilder.categories.length} categories
                  {preset.calculators && preset.calculators.length > 0 && (
                    <> &bull; {preset.calculators.length} calculators</>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          You can change your trade preset anytime in Settings
        </p>
      </div>
    </div>
  );
}

// Utility function to check if trade is selected
export function getSelectedTrade(): TradePresetKey | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SELECTED_TRADE_KEY) as TradePresetKey | null;
}

// Utility function to clear trade selection (for testing/reset)
export function clearSelectedTrade(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SELECTED_TRADE_KEY);
}
