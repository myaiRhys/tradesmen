'use client';

import React, { useState, useMemo } from 'react';
import { useApp, useConfig, useFeedback } from '@/context';
import { Button, Card, Modal, StatusBadge } from '@/components/ui';
import { QuoteBuilder } from '@/components/quotes';
import { formatCurrency } from '@/lib/pricing';
import { openQuotePrintWindow } from '@/lib/pdf';
import type { Quote } from '@/types';

export default function QuotesPage() {
  const { quotes, jobs, clients, getClient, getJob, addQuote, updateQuote, deleteQuote, isLoaded } = useApp();
  const { config } = useConfig();
  const { showToast, confirm } = useFeedback();

  const [isCreating, setIsCreating] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredQuotes = useMemo(() => {
    return quotes
      .filter((q) => filterStatus === 'all' || q.status === filterStatus)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [quotes, filterStatus]);

  const handleCreateQuote = (data: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) => {
    addQuote(data);
    setIsCreating(false);
    showToast('Quote created successfully', 'success');
  };

  const handleUpdateQuote = (data: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingQuote) {
      updateQuote(editingQuote.id, data);
      setEditingQuote(null);
      showToast('Quote updated successfully', 'success');
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    const confirmed = await confirm({
      title: 'Delete Quote',
      message: 'Are you sure you want to delete this quote?',
      confirmText: 'Delete',
      variant: 'danger',
    });

    if (confirmed) {
      deleteQuote(quoteId);
      showToast('Quote deleted', 'success');
    }
  };

  const handlePrintQuote = (quote: Quote) => {
    const client = getClient(quote.clientId);
    if (client) {
      openQuotePrintWindow({ quote, client, config });
    }
  };

  const getStatusColor = (status: Quote['status']) => {
    const colors: Record<Quote['status'], string> = {
      draft: '#6b7280',
      sent: '#3b82f6',
      accepted: '#22c55e',
      rejected: '#ef4444',
      expired: '#9ca3af',
    };
    return colors[status];
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-white">
          <h1 className="text-lg font-semibold text-zinc-900">Quotes</h1>
          <Button size="sm" onClick={() => setIsCreating(true)}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Quote
          </Button>
        </div>

        {/* Filter */}
        <div className="px-4 py-3 border-b border-zinc-200 bg-white">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            <option value="all">All Quotes</option>
            <option value="draft">Drafts</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Quotes List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredQuotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
              <svg
                className="w-16 h-16 mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm">
                {filterStatus !== 'all' ? 'No quotes match your filter' : 'No quotes yet'}
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="mt-2 text-sm text-zinc-600 hover:underline"
              >
                Create your first quote
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredQuotes.map((quote) => {
                const job = getJob(quote.jobId);
                const client = getClient(quote.clientId);

                return (
                  <Card key={quote.id} padding="none">
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-zinc-900 truncate">
                            {job?.title || 'Unknown Job'}
                          </p>
                          <p className="text-sm text-zinc-500">{client?.name || 'Unknown'}</p>
                        </div>
                        <span
                          className="text-xs px-2 py-1 font-medium"
                          style={{
                            backgroundColor: `${getStatusColor(quote.status)}20`,
                            color: getStatusColor(quote.status),
                          }}
                        >
                          {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                        </span>
                      </div>

                      {/* Totals */}
                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Total</span>
                          <span className="font-semibold text-zinc-900">
                            {formatCurrency(quote.total, config.pricing.currencySymbol)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-zinc-400">
                          <span>Deposit</span>
                          <span>
                            {formatCurrency(quote.depositAmount, config.pricing.currencySymbol)}
                          </span>
                        </div>
                      </div>

                      {/* Meta */}
                      <p className="text-xs text-zinc-400 mb-3">
                        Valid until: {new Date(quote.validUntil).toLocaleDateString()}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingQuote(quote)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handlePrintQuote(quote)}
                        >
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Quote Modal */}
      <Modal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Create New Quote"
        size="full"
      >
        <QuoteBuilder
          onSave={handleCreateQuote}
          onCancel={() => setIsCreating(false)}
        />
      </Modal>

      {/* Edit Quote Modal */}
      <Modal
        isOpen={!!editingQuote}
        onClose={() => setEditingQuote(null)}
        title="Edit Quote"
        size="full"
      >
        {editingQuote && (
          <QuoteBuilder
            quote={editingQuote}
            jobId={editingQuote.jobId}
            onSave={handleUpdateQuote}
            onCancel={() => setEditingQuote(null)}
          />
        )}
      </Modal>
    </>
  );
}
