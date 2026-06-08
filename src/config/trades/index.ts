export { plumberConfig } from './plumber';
export { electricianConfig } from './electrician';
export { shadeportConfig } from './shadeport';

import { plumberConfig } from './plumber';
import { electricianConfig } from './electrician';
import { shadeportConfig } from './shadeport';
import type { AppConfig } from '@/types';

export const tradePresets: Record<string, AppConfig> = {
  plumber: plumberConfig,
  electrician: electricianConfig,
  shadeport: shadeportConfig,
};

export type TradePresetKey = keyof typeof tradePresets;
