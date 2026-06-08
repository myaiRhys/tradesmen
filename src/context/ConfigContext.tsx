'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AppConfig } from '@/types';
import { defaultConfig } from '@/config/defaults';
import { storage } from '@/lib/storage';
import { validateConfigSafe } from '@/config/schema';

interface ConfigContextValue {
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
  resetConfig: () => void;
  loadPreset: (preset: AppConfig) => void;
  isLoaded: boolean;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load config from storage on mount
  useEffect(() => {
    const savedConfig = storage.getConfig();
    const validation = validateConfigSafe(savedConfig);

    if (validation.success) {
      setConfig(validation.data);
    } else {
      console.warn('Invalid config in storage, using defaults');
      setConfig(defaultConfig);
    }
    setIsLoaded(true);
  }, []);

  // Save config to storage when it changes
  useEffect(() => {
    if (isLoaded) {
      storage.setConfig(config);
    }
  }, [config, isLoaded]);

  const updateConfig = useCallback((updates: Partial<AppConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
    storage.setConfig(defaultConfig);
  }, []);

  const loadPreset = useCallback((preset: AppConfig) => {
    const validation = validateConfigSafe(preset);
    if (validation.success) {
      setConfig(validation.data);
    } else {
      console.error('Invalid preset config:', validation.error);
    }
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        loadPreset,
        isLoaded,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
