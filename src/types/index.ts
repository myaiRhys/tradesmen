// Core Types for Tradesmen Management System

export type JobStatus = string;

export interface StatusTransition {
  from: JobStatus;
  to: JobStatus[];
}

export interface Job {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: JobStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  address?: string;
  scheduledDate?: string;
  completedDate?: string;
  quoteId?: string;
  invoiceId?: string;
  notes: string[];
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  tier?: 'standard' | 'premium' | 'vip';
  notes?: string;
  jobIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LineItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit?: string;
}

export interface Quote {
  id: string;
  jobId: string;
  clientId: string;
  lineItems: LineItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
  depositAmount: number;
  balanceAmount: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  quoteId: string;
  jobId: string;
  clientId: string;
  lineItems: LineItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'partial';
  createdAt: string;
  updatedAt: string;
}

export interface CompanyInfo {
  name: string;
  tagline?: string;
  logo?: string;
  phone: string;
  email: string;
  website?: string;
  address: string;
  registrationNumber?: string;
  vatNumber?: string;
  bankName: string;
  bankAccountNumber: string;
  bankBranchCode: string;
  bankAccountType: string;
}

export interface PricingConfig {
  currency: string;
  currencySymbol: string;
  vatRate: number;
  depositPercentage: number;
  quoteValidityDays: number;
  invoiceDueDays: number;
  enableDiscounts: boolean;
  maxDiscountPercentage?: number;
}

export interface WorkflowConfig {
  statuses: Array<{
    id: JobStatus;
    label: string;
    color: string;
    icon?: string;
  }>;
  transitions: StatusTransition[];
  initialStatus: JobStatus;
  completedStatuses: JobStatus[];
}

export interface LineItemCategory {
  id: string;
  label: string;
  defaultUnit?: string;
  commonItems?: Array<{
    description: string;
    defaultPrice: number;
    unit?: string;
  }>;
}

export interface QuoteBuilderConfig {
  categories: LineItemCategory[];
  showQuantity: boolean;
  showUnit: boolean;
  defaultCategory: string;
}

export interface FeaturesConfig {
  enablePhotos: boolean;
  enableScheduling: boolean;
  enableInvoices: boolean;
  enableClientTiers: boolean;
  enableNotes: boolean;
  enablePriorityLevels: boolean;
}

export interface AppConfig {
  company: CompanyInfo;
  pricing: PricingConfig;
  workflow: WorkflowConfig;
  quoteBuilder: QuoteBuilderConfig;
  features: FeaturesConfig;
  termsAndConditions: string;
}

export interface AppState {
  jobs: Job[];
  clients: Client[];
  quotes: Quote[];
  invoices: Invoice[];
  config: AppConfig;
}
