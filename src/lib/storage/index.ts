import type { Job, Client, Quote, Invoice, AppConfig, AppState } from '@/types';
import { defaultConfig } from '@/config/defaults';

const STORAGE_KEYS = {
  JOBS: 'tradesmen_jobs',
  CLIENTS: 'tradesmen_clients',
  QUOTES: 'tradesmen_quotes',
  INVOICES: 'tradesmen_invoices',
  CONFIG: 'tradesmen_config',
} as const;

// Type-safe storage interface
interface StorageAdapter {
  getJobs(): Job[];
  setJobs(jobs: Job[]): void;
  getClients(): Client[];
  setClients(clients: Client[]): void;
  getQuotes(): Quote[];
  setQuotes(quotes: Quote[]): void;
  getInvoices(): Invoice[];
  setInvoices(invoices: Invoice[]): void;
  getConfig(): AppConfig;
  setConfig(config: AppConfig): void;
  getState(): AppState;
  clearAll(): void;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Safe JSON parse with fallback
function safeJSONParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

// localStorage adapter
export const localStorageAdapter: StorageAdapter = {
  getJobs(): Job[] {
    if (!isBrowser) return [];
    return safeJSONParse(localStorage.getItem(STORAGE_KEYS.JOBS), []);
  },

  setJobs(jobs: Job[]): void {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  },

  getClients(): Client[] {
    if (!isBrowser) return [];
    return safeJSONParse(localStorage.getItem(STORAGE_KEYS.CLIENTS), []);
  },

  setClients(clients: Client[]): void {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  },

  getQuotes(): Quote[] {
    if (!isBrowser) return [];
    return safeJSONParse(localStorage.getItem(STORAGE_KEYS.QUOTES), []);
  },

  setQuotes(quotes: Quote[]): void {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
  },

  getInvoices(): Invoice[] {
    if (!isBrowser) return [];
    return safeJSONParse(localStorage.getItem(STORAGE_KEYS.INVOICES), []);
  },

  setInvoices(invoices: Invoice[]): void {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  },

  getConfig(): AppConfig {
    if (!isBrowser) return defaultConfig;
    return safeJSONParse(localStorage.getItem(STORAGE_KEYS.CONFIG), defaultConfig);
  },

  setConfig(config: AppConfig): void {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  },

  getState(): AppState {
    return {
      jobs: this.getJobs(),
      clients: this.getClients(),
      quotes: this.getQuotes(),
      invoices: this.getInvoices(),
      config: this.getConfig(),
    };
  },

  clearAll(): void {
    if (!isBrowser) return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};

// Export the default adapter (localStorage for MVP)
export const storage = localStorageAdapter;

// Export keys for external use
export { STORAGE_KEYS };

// Export the type for use in other modules
export type { StorageAdapter };
