'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp, useConfig, useFeedback } from '@/context';
import { Button, Select, Input, Textarea } from '@/components/ui';
import { LineItemEditor } from './LineItemEditor';
import { calculateQuotePricing, formatCurrency, getQuoteValidUntilDate } from '@/lib/pricing';
import { openQuotePrintWindow } from '@/lib/pdf';
import type { LineItem, Quote } from '@/types';

interface QuoteBuilderProps {
  jobId?: string;
  quote?: Quote;
  onSave: (quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function QuoteBuilder({ jobId, quote, onSave, onCancel }: QuoteBuilderProps) {
  const { jobs, clients, getJob, getClient } = useApp();
  const { config } = useConfig();
  const { showToast } = useFeedback();

  const [selectedJobId, setSelectedJobId] = useState(jobId || quote?.jobId || '');
  const [lineItems, setLineItems] = useState<LineItem[]>(quote?.lineItems || []);
  const [notes, setNotes] = useState(quote?.notes || '');
  const [status, setStatus] = useState<Quote['status']>(quote?.status || 'draft');

  const selectedJob = selectedJobId ? getJob(selectedJobId) : undefined;
  const client = selectedJob ? getClient(selectedJob.clientId) : undefined;

  // Calculate pricing
  const pricing = useMemo(() => {
    return calculateQuotePricing(lineItems, config.pricing);
  }, [lineItems, config.pricing]);

  const handleAddLineItem = (item: Omit<LineItem, 'id'>) => {
    const newItem: LineItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };
    setLineItems((prev) => [...prev, newItem]);
  };

  const handleUpdateLineItem = (id: string, updates: Partial<LineItem>) => {
    setLineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (!selectedJobId || !client) {
      showToast('Please select a job', 'error');
      return;
    }

    if (lineItems.length === 0) {
      showToast('Please add at least one line item', 'error');
      return;
    }

    onSave({
      jobId: selectedJobId,
      clientId: client.id,
      lineItems,
      subtotal: pricing.subtotal,
      vatAmount: pricing.vatAmount,
      total: pricing.total,
      depositAmount: pricing.depositAmount,
      balanceAmount: pricing.balanceAmount,
      validUntil: quote?.validUntil || getQuoteValidUntilDate(config.pricing.quoteValidityDays),
      status,
      notes: notes.trim() || undefined,
    });
  };

  const handlePreview = () => {
    if (!client) return;

    const previewQuote: Quote = {
      id: quote?.id || 'preview',
      jobId: selectedJobId,
      clientId: client.id,
      lineItems,
      subtotal: pricing.subtotal,
      vatAmount: pricing.vatAmount,
      total: pricing.total,
      depositAmount: pricing.depositAmount,
      balanceAmount: pricing.balanceAmount,
      validUntil: quote?.validUntil || getQuoteValidUntilDate(config.pricing.quoteValidityDays),
      status,
      notes: notes.trim() || undefined,
      createdAt: quote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    openQuotePrintWindow({ quote: previewQuote, client, config });
  };

  const jobOptions = [
    { value: '', label: 'Select a job...' },
    ...jobs
      .filter((j) => !config.workflow.completedStatuses.includes(j.status))
      .map((j) => {
        const c = getClient(j.clientId);
        return {
          value: j.id,
          label: `${j.title} (${c?.name || 'Unknown'})`,
        };
      }),
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      {/* Job Selection */}
      {!jobId && (
        <Select
          label="Job"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          options={jobOptions}
        />
      )}

      {/* Client Info */}
      {client && (
        <div className="bg-zinc-50 p-4">
          <h3 className="text-sm font-semibold text-zinc-700 mb-2">Client</h3>
          <p className="text-sm font-medium text-zinc-900">{client.name}</p>
          <p className="text-sm text-zinc-600">{client.phone}</p>
          {client.address && (
            <p className="text-sm text-zinc-600">{client.address}</p>
          )}
        </div>
      )}

      {/* Line Items */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-700 mb-3">Line Items</h3>
        <LineItemEditor
          items={lineItems}
          onAdd={handleAddLineItem}
          onUpdate={handleUpdateLineItem}
          onRemove={handleRemoveLineItem}
        />
      </div>

      {/* Totals */}
      {lineItems.length > 0 && (
        <div className="bg-zinc-50 p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Subtotal</span>
              <span className="font-medium">
                {formatCurrency(pricing.subtotal, config.pricing.currencySymbol)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">VAT ({config.pricing.vatRate}%)</span>
              <span className="font-medium">
                {formatCurrency(pricing.vatAmount, config.pricing.currencySymbol)}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold border-t border-zinc-200 pt-2 mt-2">
              <span>Total</span>
              <span>{formatCurrency(pricing.total, config.pricing.currencySymbol)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Deposit ({config.pricing.depositPercentage}%)</span>
              <span className="font-medium">
                {formatCurrency(pricing.depositAmount, config.pricing.currencySymbol)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Balance Due</span>
              <span className="font-medium">
                {formatCurrency(pricing.balanceAmount, config.pricing.currencySymbol)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <Textarea
        label="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any additional notes for this quote..."
      />

      {/* Status */}
      <Select
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value as Quote['status'])}
        options={statusOptions}
      />

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handlePreview}
          disabled={lineItems.length === 0 || !client}
        >
          Preview PDF
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={lineItems.length === 0 || !selectedJobId}
        >
          {quote ? 'Update Quote' : 'Create Quote'}
        </Button>
      </div>
    </div>
  );
}
