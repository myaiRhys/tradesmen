'use client';

import React, { useState } from 'react';
import { useApp, useConfig } from '@/context';
import { Button, Input, Textarea, Select } from '@/components/ui';
import type { Job } from '@/types';

type JobFormData = {
  clientId: string;
  title: string;
  description: string;
  address?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate?: string;
  status: string;
};

interface JobFormProps {
  job?: Job;
  onSave: (data: JobFormData) => void;
  onCancel: () => void;
}

export function JobForm({ job, onSave, onCancel }: JobFormProps) {
  const { clients } = useApp();
  const { config } = useConfig();

  const [formData, setFormData] = useState({
    clientId: job?.clientId || '',
    title: job?.title || '',
    description: job?.description || '',
    address: job?.address || '',
    priority: job?.priority || 'medium',
    scheduledDate: job?.scheduledDate || '',
    status: job?.status || config.workflow.initialStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Client is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSave({
      clientId: formData.clientId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      address: formData.address.trim() || undefined,
      priority: formData.priority as 'low' | 'medium' | 'high' | 'urgent',
      scheduledDate: formData.scheduledDate || undefined,
      status: formData.status,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const clientOptions = [
    { value: '', label: 'Select a client...' },
    ...clients.map((c) => ({ value: c.id, label: c.name })),
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const statusOptions = config.workflow.statuses.map((s) => ({
    value: s.id,
    label: s.label,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Client"
        name="clientId"
        value={formData.clientId}
        onChange={handleChange}
        options={clientOptions}
        error={errors.clientId}
      />

      <Input
        label="Job Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g., Fix leaking tap in bathroom"
        error={errors.title}
      />

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Details about the job..."
      />

      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Job location address"
      />

      {config.features.enablePriorityLevels && (
        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={priorityOptions}
        />
      )}

      {config.features.enableScheduling && (
        <Input
          label="Scheduled Date"
          name="scheduledDate"
          type="date"
          value={formData.scheduledDate}
          onChange={handleChange}
        />
      )}

      {job && (
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />
      )}

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {job ? 'Save Changes' : 'Create Job'}
        </Button>
      </div>
    </form>
  );
}
