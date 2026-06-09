import { z } from 'zod';

export const CompanyInfoSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().optional(),
  logo: z.string().optional(),
  phone: z.string().min(1),
  email: z.string().email(),
  website: z.string().url().optional(),
  address: z.string().min(1),
  registrationNumber: z.string().optional(),
  vatNumber: z.string().optional(),
  bankName: z.string().min(1),
  bankAccountNumber: z.string().min(1),
  bankBranchCode: z.string().min(1),
  bankAccountType: z.string().min(1),
});

export const PricingConfigSchema = z.object({
  currency: z.string().default('ZAR'),
  currencySymbol: z.string().default('R'),
  vatRate: z.number().min(0).max(100).default(15),
  depositPercentage: z.number().min(0).max(100).default(50),
  quoteValidityDays: z.number().positive().default(14),
  invoiceDueDays: z.number().positive().default(30),
  enableDiscounts: z.boolean().default(false),
  maxDiscountPercentage: z.number().min(0).max(100).optional(),
});

export const StatusSchema = z.object({
  id: z.string(),
  label: z.string(),
  color: z.string(),
  icon: z.string().optional(),
});

export const StatusTransitionSchema = z.object({
  from: z.string(),
  to: z.array(z.string()),
});

export const WorkflowConfigSchema = z.object({
  statuses: z.array(StatusSchema).min(1),
  transitions: z.array(StatusTransitionSchema),
  initialStatus: z.string(),
  completedStatuses: z.array(z.string()),
});

export const CommonItemSchema = z.object({
  description: z.string(),
  defaultPrice: z.number(),
  unit: z.string().optional(),
});

export const LineItemCategorySchema = z.object({
  id: z.string(),
  label: z.string(),
  defaultUnit: z.string().optional(),
  commonItems: z.array(CommonItemSchema).optional(),
});

export const QuoteBuilderConfigSchema = z.object({
  categories: z.array(LineItemCategorySchema).min(1),
  showQuantity: z.boolean().default(true),
  showUnit: z.boolean().default(true),
  defaultCategory: z.string(),
});

export const FeaturesConfigSchema = z.object({
  enablePhotos: z.boolean().default(false),
  enableScheduling: z.boolean().default(true),
  enableInvoices: z.boolean().default(true),
  enableClientTiers: z.boolean().default(false),
  enableNotes: z.boolean().default(true),
  enablePriorityLevels: z.boolean().default(true),
});

// Calculator field configuration
export const CalculatorFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['number', 'select', 'text']),
  unit: z.string().optional(),
  options: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).optional(),
  required: z.boolean().default(true),
  min: z.number().optional(),
  max: z.number().optional(),
  defaultValue: z.union([z.string(), z.number()]).optional(),
});

// Calculator configuration
export const CalculatorSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  fields: z.array(CalculatorFieldSchema),
  outputUnit: z.string().optional(),
  outputLabel: z.string(),
});

export const AppConfigSchema = z.object({
  company: CompanyInfoSchema,
  pricing: PricingConfigSchema,
  workflow: WorkflowConfigSchema,
  quoteBuilder: QuoteBuilderConfigSchema,
  features: FeaturesConfigSchema,
  termsAndConditions: z.string().default(''),
  calculators: z.array(CalculatorSchema).optional().default([]),
});

export type ValidatedAppConfig = z.infer<typeof AppConfigSchema>;

export function validateConfig(config: unknown): ValidatedAppConfig {
  return AppConfigSchema.parse(config);
}

export function validateConfigSafe(config: unknown): { success: true; data: ValidatedAppConfig } | { success: false; error: z.ZodError } {
  const result = AppConfigSchema.safeParse(config);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
