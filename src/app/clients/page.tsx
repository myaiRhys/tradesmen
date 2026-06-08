'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp, useFeedback } from '@/context';
import { Button, Modal } from '@/components/ui';
import { SplitLayout } from '@/components/layout';
import { ClientList, ClientDetail, ClientForm } from '@/components/clients';

function ClientsContent() {
  const searchParams = useSearchParams();
  const { addClient, isLoaded } = useApp();
  const { showToast } = useFeedback();

  const [selectedClientId, setSelectedClientId] = useState<string | null>(
    searchParams.get('id')
  );
  const [isCreating, setIsCreating] = useState(false);

  // Update selection from URL
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setSelectedClientId(id);
    }
  }, [searchParams]);

  const handleCreateClient = (data: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    tier?: 'standard' | 'premium' | 'vip';
    notes?: string;
  }) => {
    const newClient = addClient(data);
    setIsCreating(false);
    setSelectedClientId(newClient.id);
    showToast('Client added successfully', 'success');
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
          <h1 className="text-lg font-semibold text-zinc-900">Clients</h1>
          <Button size="sm" onClick={() => setIsCreating(true)}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Client
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <SplitLayout
            selectedId={selectedClientId}
            list={
              <ClientList
                selectedClientId={selectedClientId}
                onSelectClient={setSelectedClientId}
              />
            }
            detail={
              selectedClientId && (
                <ClientDetail
                  clientId={selectedClientId}
                  onBack={() => setSelectedClientId(null)}
                />
              )
            }
          />
        </div>
      </div>

      {/* Create Client Modal */}
      <Modal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Add New Client"
        size="lg"
      >
        <ClientForm
          onSave={handleCreateClient}
          onCancel={() => setIsCreating(false)}
        />
      </Modal>
    </>
  );
}

export default function ClientsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full text-zinc-400">Loading...</div>}>
      <ClientsContent />
    </Suspense>
  );
}
