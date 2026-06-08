'use client';

import React, { useState } from 'react';
import { useApp, useConfig, useFeedback } from '@/context';
import { Button, StatusBadge, PriorityBadge } from '@/components/ui';
import { MobileBackButton } from '@/components/layout';
import { StatusTimeline } from './StatusTimeline';
import { JobForm } from './JobForm';
import type { Job } from '@/types';

interface JobDetailProps {
  jobId: string;
  onBack: () => void;
}

export function JobDetail({ jobId, onBack }: JobDetailProps) {
  const { getJob, getClient, updateJob, deleteJob } = useApp();
  const { config } = useConfig();
  const { showToast, confirm } = useFeedback();
  const [isEditing, setIsEditing] = useState(false);

  const job = getJob(jobId);
  const client = job ? getClient(job.clientId) : undefined;

  if (!job) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        <p>Job not found</p>
      </div>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    updateJob(jobId, { status: newStatus });
    showToast(`Status updated to ${config.workflow.statuses.find(s => s.id === newStatus)?.label || newStatus}`, 'success');
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Job',
      message: `Are you sure you want to delete "${job.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger',
    });

    if (confirmed) {
      deleteJob(jobId);
      showToast('Job deleted', 'success');
      onBack();
    }
  };

  const handleSave = (updates: {
    clientId: string;
    title: string;
    description: string;
    address?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    scheduledDate?: string;
    status: string;
  }) => {
    updateJob(jobId, {
      ...updates,
      address: updates.address || '',
    });
    setIsEditing(false);
    showToast('Job updated', 'success');
  };

  if (isEditing) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b border-zinc-200 bg-white">
          <MobileBackButton onBack={() => setIsEditing(false)} label="Cancel" />
          <div className="px-4 py-3 hidden md:block">
            <h2 className="text-lg font-semibold">Edit Job</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <JobForm
            job={job}
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
        <MobileBackButton onBack={onBack} label="Jobs" />
        <div className="px-4 py-3 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-semibold text-zinc-900 truncate">
                {job.title}
              </h2>
              <StatusBadge status={job.status} />
            </div>
            {client && (
              <p className="text-sm text-zinc-500">{client.name}</p>
            )}
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
          {/* Status Timeline */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">Status</h3>
            <StatusTimeline
              currentStatus={job.status}
              onStatusChange={handleStatusChange}
            />
          </section>

          {/* Details */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">Details</h3>
            <div className="space-y-3">
              {job.description && (
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Description</label>
                  <p className="text-sm text-zinc-900">{job.description}</p>
                </div>
              )}
              {job.address && (
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Address</label>
                  <p className="text-sm text-zinc-900">{job.address}</p>
                </div>
              )}
              {config.features.enablePriorityLevels && (
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Priority</label>
                  <PriorityBadge priority={job.priority} />
                </div>
              )}
              {job.scheduledDate && (
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Scheduled Date</label>
                  <p className="text-sm text-zinc-900">
                    {new Date(job.scheduledDate).toLocaleDateString('en-ZA', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Client Info */}
          {client && (
            <section>
              <h3 className="text-sm font-semibold text-zinc-700 mb-3">Client</h3>
              <div className="bg-zinc-50 p-3 space-y-2">
                <p className="text-sm font-medium text-zinc-900">{client.name}</p>
                <p className="text-sm text-zinc-600">{client.phone}</p>
                {client.email && (
                  <p className="text-sm text-zinc-600">{client.email}</p>
                )}
                {client.address && (
                  <p className="text-sm text-zinc-600">{client.address}</p>
                )}
              </div>
            </section>
          )}

          {/* Notes */}
          {config.features.enableNotes && job.notes.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-zinc-700 mb-3">Notes</h3>
              <div className="space-y-2">
                {job.notes.map((note, index) => (
                  <div key={index} className="bg-zinc-50 p-3">
                    <p className="text-sm text-zinc-900">{note}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Timestamps */}
          <section className="pt-4 border-t border-zinc-200">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Created: {new Date(job.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(job.updatedAt).toLocaleDateString()}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
