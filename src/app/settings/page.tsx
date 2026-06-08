'use client';

import React, { useState } from 'react';
import { useConfig, useFeedback } from '@/context';
import { Button, Card, Input, Textarea, Select } from '@/components/ui';
import { tradePresets, type TradePresetKey } from '@/config/trades';

export default function SettingsPage() {
  const { config, updateConfig, resetConfig, loadPreset, isLoaded } = useConfig();
  const { showToast, confirm } = useFeedback();

  const [activeTab, setActiveTab] = useState<'company' | 'pricing' | 'presets'>('company');

  // Company form state
  const [companyForm, setCompanyForm] = useState({
    name: config.company.name,
    tagline: config.company.tagline || '',
    phone: config.company.phone,
    email: config.company.email,
    address: config.company.address,
    registrationNumber: config.company.registrationNumber || '',
    vatNumber: config.company.vatNumber || '',
    bankName: config.company.bankName,
    bankAccountNumber: config.company.bankAccountNumber,
    bankBranchCode: config.company.bankBranchCode,
    bankAccountType: config.company.bankAccountType,
  });

  // Pricing form state
  const [pricingForm, setPricingForm] = useState({
    currency: config.pricing.currency,
    currencySymbol: config.pricing.currencySymbol,
    vatRate: config.pricing.vatRate,
    depositPercentage: config.pricing.depositPercentage,
    quoteValidityDays: config.pricing.quoteValidityDays,
    invoiceDueDays: config.pricing.invoiceDueDays,
  });

  // T&Cs state
  const [termsForm, setTermsForm] = useState(config.termsAndConditions);

  const handleSaveCompany = () => {
    updateConfig({
      company: {
        ...config.company,
        name: companyForm.name,
        tagline: companyForm.tagline || undefined,
        phone: companyForm.phone,
        email: companyForm.email,
        address: companyForm.address,
        registrationNumber: companyForm.registrationNumber || undefined,
        vatNumber: companyForm.vatNumber || undefined,
        bankName: companyForm.bankName,
        bankAccountNumber: companyForm.bankAccountNumber,
        bankBranchCode: companyForm.bankBranchCode,
        bankAccountType: companyForm.bankAccountType,
      },
      termsAndConditions: termsForm,
    });
    showToast('Company settings saved', 'success');
  };

  const handleSavePricing = () => {
    updateConfig({
      pricing: {
        ...config.pricing,
        currency: pricingForm.currency,
        currencySymbol: pricingForm.currencySymbol,
        vatRate: pricingForm.vatRate,
        depositPercentage: pricingForm.depositPercentage,
        quoteValidityDays: pricingForm.quoteValidityDays,
        invoiceDueDays: pricingForm.invoiceDueDays,
      },
    });
    showToast('Pricing settings saved', 'success');
  };

  const handleLoadPreset = async (presetKey: TradePresetKey) => {
    const confirmed = await confirm({
      title: 'Load Preset',
      message: `This will replace your current configuration with the ${presetKey} preset. Your company info will be reset. Continue?`,
      confirmText: 'Load Preset',
      variant: 'warning',
    });

    if (confirmed) {
      const preset = tradePresets[presetKey];
      loadPreset(preset);
      // Update local form state
      setCompanyForm({
        name: preset.company.name,
        tagline: preset.company.tagline || '',
        phone: preset.company.phone,
        email: preset.company.email,
        address: preset.company.address,
        registrationNumber: preset.company.registrationNumber || '',
        vatNumber: preset.company.vatNumber || '',
        bankName: preset.company.bankName,
        bankAccountNumber: preset.company.bankAccountNumber,
        bankBranchCode: preset.company.bankBranchCode,
        bankAccountType: preset.company.bankAccountType,
      });
      setPricingForm({
        currency: preset.pricing.currency,
        currencySymbol: preset.pricing.currencySymbol,
        vatRate: preset.pricing.vatRate,
        depositPercentage: preset.pricing.depositPercentage,
        quoteValidityDays: preset.pricing.quoteValidityDays,
        invoiceDueDays: preset.pricing.invoiceDueDays,
      });
      setTermsForm(preset.termsAndConditions);
      showToast(`Loaded ${presetKey} preset`, 'success');
    }
  };

  const handleReset = async () => {
    const confirmed = await confirm({
      title: 'Reset All Settings',
      message: 'This will reset all settings to defaults. Your data (jobs, clients, quotes) will NOT be affected. Continue?',
      confirmText: 'Reset Settings',
      variant: 'danger',
    });

    if (confirmed) {
      resetConfig();
      showToast('Settings reset to defaults', 'success');
      // Reload the page to refresh form state
      window.location.reload();
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Settings</h1>
          <p className="text-sm text-zinc-500">Configure your business settings</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-zinc-200">
          {[
            { id: 'company', label: 'Company' },
            { id: 'pricing', label: 'Pricing' },
            { id: 'presets', label: 'Trade Presets' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                px-4 py-2 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'text-zinc-900 border-zinc-900'
                  : 'text-zinc-500 border-transparent hover:text-zinc-700'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Company Tab */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            <Card>
              <h2 className="font-semibold text-zinc-900 mb-4">Business Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Company Name"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm((p) => ({ ...p, name: e.target.value }))}
                />
                <Input
                  label="Tagline (optional)"
                  value={companyForm.tagline}
                  onChange={(e) => setCompanyForm((p) => ({ ...p, tagline: e.target.value }))}
                />
                <Input
                  label="Phone"
                  value={companyForm.phone}
                  onChange={(e) => setCompanyForm((p) => ({ ...p, phone: e.target.value }))}
                />
                <Input
                  label="Email"
                  type="email"
                  value={companyForm.email}
                  onChange={(e) => setCompanyForm((p) => ({ ...p, email: e.target.value }))}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    value={companyForm.address}
                    onChange={(e) => setCompanyForm((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>
                <Input
                  label="Registration Number (optional)"
                  value={companyForm.registrationNumber}
                  onChange={(e) => setCompanyForm((p) => ({ ...p, registrationNumber: e.target.value }))}
                />
                <Input
                  label="VAT Number (optional)"
                  value={companyForm.vatNumber}
                  onChange={(e) => setCompanyForm((p) => ({ ...p, vatNumber: e.target.value }))}
                />
              </div>
            </Card>

            <Card>
              <h2 className="font-semibold text-zinc-900 mb-4">Banking Details</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Bank Name"
                  value={companyForm.bankName}
                  onChange={(e) => setCompanyForm((p) => ({ ...p, bankName: e.target.value }))}
                />
                <Input
                  label="Account Number"
                  value={companyForm.bankAccountNumber}
                  onChange={(e) => setCompanyForm((p) => ({ ...p, bankAccountNumber: e.target.value }))}
                />
                <Input
                  label="Branch Code"
                  value={companyForm.bankBranchCode}
                  onChange={(e) => setCompanyForm((p) => ({ ...p, bankBranchCode: e.target.value }))}
                />
                <Input
                  label="Account Type"
                  value={companyForm.bankAccountType}
                  onChange={(e) => setCompanyForm((p) => ({ ...p, bankAccountType: e.target.value }))}
                />
              </div>
            </Card>

            <Card>
              <h2 className="font-semibold text-zinc-900 mb-4">Terms & Conditions</h2>
              <Textarea
                value={termsForm}
                onChange={(e) => setTermsForm(e.target.value)}
                className="min-h-[200px]"
                placeholder="Enter your terms and conditions..."
              />
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveCompany}>Save Company Settings</Button>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <Card>
              <h2 className="font-semibold text-zinc-900 mb-4">Currency & Tax</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Currency Code"
                  value={pricingForm.currency}
                  onChange={(e) => setPricingForm((p) => ({ ...p, currency: e.target.value }))}
                  placeholder="ZAR"
                />
                <Input
                  label="Currency Symbol"
                  value={pricingForm.currencySymbol}
                  onChange={(e) => setPricingForm((p) => ({ ...p, currencySymbol: e.target.value }))}
                  placeholder="R"
                />
                <Input
                  label="VAT Rate (%)"
                  type="number"
                  value={pricingForm.vatRate}
                  onChange={(e) => setPricingForm((p) => ({ ...p, vatRate: Number(e.target.value) }))}
                  min="0"
                  max="100"
                />
                <Input
                  label="Default Deposit (%)"
                  type="number"
                  value={pricingForm.depositPercentage}
                  onChange={(e) => setPricingForm((p) => ({ ...p, depositPercentage: Number(e.target.value) }))}
                  min="0"
                  max="100"
                />
                <Input
                  label="Quote Valid (days)"
                  type="number"
                  value={pricingForm.quoteValidityDays}
                  onChange={(e) => setPricingForm((p) => ({ ...p, quoteValidityDays: Number(e.target.value) }))}
                  min="1"
                />
                <Input
                  label="Invoice Due (days)"
                  type="number"
                  value={pricingForm.invoiceDueDays}
                  onChange={(e) => setPricingForm((p) => ({ ...p, invoiceDueDays: Number(e.target.value) }))}
                  min="1"
                />
              </div>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSavePricing}>Save Pricing Settings</Button>
            </div>
          </div>
        )}

        {/* Presets Tab */}
        {activeTab === 'presets' && (
          <div className="space-y-6">
            <Card>
              <h2 className="font-semibold text-zinc-900 mb-2">Trade Presets</h2>
              <p className="text-sm text-zinc-500 mb-4">
                Load a preset configuration tailored for your trade. This will update
                your workflow, line item categories, and terms.
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                {(Object.keys(tradePresets) as TradePresetKey[]).map((key) => {
                  const preset = tradePresets[key];
                  return (
                    <Card
                      key={key}
                      hover
                      onClick={() => handleLoadPreset(key)}
                      className="cursor-pointer"
                    >
                      <h3 className="font-medium text-zinc-900 capitalize mb-1">{key}</h3>
                      <p className="text-xs text-zinc-500 mb-2">{preset.company.name}</p>
                      <p className="text-xs text-zinc-400">
                        {preset.workflow.statuses.length} statuses •{' '}
                        {preset.quoteBuilder.categories.length} categories
                      </p>
                    </Card>
                  );
                })}
              </div>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <h2 className="font-semibold text-red-800 mb-2">Reset to Defaults</h2>
              <p className="text-sm text-red-600 mb-4">
                Reset all settings to their default values. Your data (jobs, clients, quotes)
                will not be affected.
              </p>
              <Button variant="danger" onClick={handleReset}>
                Reset All Settings
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
