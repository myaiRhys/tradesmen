'use client';

import React, { useState } from 'react';
import { useConfig } from '@/context';
import { Button, Input, Textarea, Select } from '@/components/ui';
import type { Client } from '@/types';

type ClientFormData = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  tier?: 'standard' | 'premium' | 'vip';
  notes?: string;
};

interface ClientFormProps {
  client?: Client;
  onSave: (data: ClientFormData) => void;
  onCancel: () => void;
}

export function ClientForm({ client, onSave, onCancel }: ClientFormProps) {
  const { config } = useConfig();

  const [formData, setFormData] = useState({
    name: client?.name || '',
    phone: client?.phone || '',
    email: client?.email || '',
    address: client?.address || '',
    tier: client?.tier || 'standard',
    notes: client?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSave({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      address: formData.address.trim() || undefined,
      tier: config.features.enableClientTiers
        ? (formData.tier as 'standard' | 'premium' | 'vip')
        : undefined,
      notes: formData.notes.trim() || undefined,
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

  const tierOptions = [
    { value: 'standard', label: 'Standard' },
    { value: 'premium', label: 'Premium' },
    { value: 'vip', label: 'VIP' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Client name"
        error={errors.name}
      />

      <Input
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        placeholder="+27 00 000 0000"
        error={errors.phone}
      />

      <Input
        label="Email (optional)"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="client@email.com"
        error={errors.email}
      />

      <Input
        label="Address (optional)"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Street address, suburb, city"
      />

      {config.features.enableClientTiers && (
        <Select
          label="Client Tier"
          name="tier"
          value={formData.tier}
          onChange={handleChange}
          options={tierOptions}
        />
      )}

      <Textarea
        label="Notes (optional)"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Any notes about this client..."
      />

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {client ? 'Save Changes' : 'Add Client'}
        </Button>
      </div>
    </form>
  );
}
