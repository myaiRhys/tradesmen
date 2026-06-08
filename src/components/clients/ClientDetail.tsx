'use client';

import React, { useState } from 'react';
import { useApp, useConfig, useFeedback } from '@/context';
import { Button, StatusBadge } from '@/components/ui';
import { MobileBackButton } from '@/components/layout';
import { ClientForm } from './ClientForm';
import type { Client } from '@/types';

interface ClientDetailProps {
  clientId: string;
  onBack: () => void;
}

export function ClientDetail({ clientId, onBack }: ClientDetailProps) {
  const { getClient, updateClient, deleteClient, getJobsByClient } = useApp();
  const { config } = useConfig();
  const { showToast, confirm } = useFeedback();
  const [isEditing, setIsEditing] = useState(false);

  const client = getClient(clientId);
  const clientJobs = getJobsByClient(clientId);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        <p>Client not found</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (clientJobs.length > 0) {
      const confirmed = await confirm({
        title: 'Delete Client',
        message: `This client has ${clientJobs.length} job(s). Deleting will also remove all associated jobs. Are you sure?`,
        confirmText: 'Delete All',
        variant: 'danger',
      });

      if (!confirmed) return;
    } else {
      const confirmed = await confirm({
        title: 'Delete Client',
        message: `Are you sure you want to delete "${client.name}"?`,
        confirmText: 'Delete',
        variant: 'danger',
      });

      if (!confirmed) return;
    }

    deleteClient(clientId);
    showToast('Client deleted', 'success');
    onBack();
  };

  const handleSave = (updates: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    tier?: 'standard' | 'premium' | 'vip';
    notes?: string;
  }) => {
    updateClient(clientId, updates);
    setIsEditing(false);
    showToast('Client updated', 'success');
  };

  if (isEditing) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b border-zinc-200 bg-white">
          <MobileBackButton onBack={() => setIsEditing(false)} label="Cancel" />
          <div className="px-4 py-3 hidden md:block">
            <h2 className="text-lg font-semibold">Edit Client</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <ClientForm
            client={client}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white">
        <MobileBackButton onBack={onBack} label="Clients" />
        <div className="px-4 py-3 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-semibold text-zinc-900 truncate">
                {client.name}
              </h2>
              {config.features.enableClientTiers && client.tier && (
                <span
                  className={`
                    text-xs px-2 py-0.5 font-medium
                    ${client.tier === 'vip' ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${client.tier === 'premium' ? 'bg-purple-100 text-purple-700' : ''}
                    ${client.tier === 'standard' ? 'bg-zinc-100 text-zinc-600' : ''}
                  `}
                >
                  {client.tier.toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-500">{client.phone}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Contact Info */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Phone</label>
                <a
                  href={`tel:${client.phone}`}
                  className="text-sm text-zinc-900 hover:text-blue-600 transition-colors"
                >
                  {client.phone}
                </a>
              </div>
              {client.email && (
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Email</label>
                  <a
                    href={`mailto:${client.email}`}
                    className="text-sm text-zinc-900 hover:text-blue-600 transition-colors"
                  >
                    {client.email}
                  </a>
                </div>
              )}
              {client.address && (
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Address</label>
                  <p className="text-sm text-zinc-900">{client.address}</p>
                </div>
              )}
            </div>
          </section>

          {/* Notes */}
          {client.notes && (
            <section>
              <h3 className="text-sm font-semibold text-zinc-700 mb-3">Notes</h3>
              <p className="text-sm text-zinc-600">{client.notes}</p>
            </section>
          )}

          {/* Jobs */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">
              Jobs ({clientJobs.length})
            </h3>
            {clientJobs.length === 0 ? (
              <p className="text-sm text-zinc-400 italic">No jobs for this client yet.</p>
            ) : (
              <div className="space-y-2">
                {clientJobs
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 5)
                  .map((job) => (
                    <div
                      key={job.id}
                      className="bg-zinc-50 p-3 flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 truncate">
                          {job.title}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {new Date(job.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={job.status} size="sm" />
                    </div>
                  ))}
                {clientJobs.length > 5 && (
                  <p className="text-xs text-zinc-500 text-center pt-2">
                    +{clientJobs.length - 5} more jobs
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Timestamps */}
          <section className="pt-4 border-t border-zinc-200">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Added: {new Date(client.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(client.updatedAt).toLocaleDateString()}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
