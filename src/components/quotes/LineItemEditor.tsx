'use client';

import React, { useState } from 'react';
import { useConfig } from '@/context';
import { Button, Input, Select } from '@/components/ui';
import { formatCurrency } from '@/lib/pricing';
import type { LineItem } from '@/types';

interface LineItemEditorProps {
  items: LineItem[];
  onAdd: (item: Omit<LineItem, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<LineItem>) => void;
  onRemove: (id: string) => void;
}

export function LineItemEditor({ items, onAdd, onUpdate, onRemove }: LineItemEditorProps) {
  const { config } = useConfig();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newItem, setNewItem] = useState({
    category: config.quoteBuilder.defaultCategory,
    description: '',
    quantity: 1,
    unitPrice: 0,
    unit: '',
  });

  const categoryOptions = config.quoteBuilder.categories.map((cat) => ({
    value: cat.id,
    label: cat.label,
  }));

  const currentCategory = config.quoteBuilder.categories.find(
    (c) => c.id === newItem.category
  );

  const handleAddItem = () => {
    if (!newItem.description.trim() || newItem.unitPrice <= 0) {
      return;
    }

    onAdd({
      category: newItem.category,
      description: newItem.description.trim(),
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      unit: newItem.unit || currentCategory?.defaultUnit,
    });

    setNewItem({
      category: config.quoteBuilder.defaultCategory,
      description: '',
      quantity: 1,
      unitPrice: 0,
      unit: '',
    });
    setIsAdding(false);
  };

  const handleQuickAdd = (item: { description: string; defaultPrice: number; unit?: string }) => {
    onAdd({
      category: newItem.category,
      description: item.description,
      quantity: 1,
      unitPrice: item.defaultPrice,
      unit: item.unit || currentCategory?.defaultUnit,
    });
  };

  return (
    <div className="space-y-4">
      {/* Existing Items */}
      {items.length > 0 && (
        <div className="divide-y divide-zinc-100 border border-zinc-200">
          {items.map((item) => {
            const isEditing = editingId === item.id;
            const itemTotal = item.quantity * item.unitPrice;

            if (isEditing) {
              return (
                <div key={item.id} className="p-3 bg-zinc-50">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 md:col-span-5">
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          onUpdate(item.id, { description: e.target.value })
                        }
                        placeholder="Description"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          onUpdate(item.id, { quantity: Number(e.target.value) })
                        }
                        min="1"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <Input
                        value={item.unit || ''}
                        onChange={(e) => onUpdate(item.id, { unit: e.target.value })}
                        placeholder="Unit"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-3">
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          onUpdate(item.id, { unitPrice: Number(e.target.value) })
                        }
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      Done
                    </Button>
                  </div>
                </div>
              );
            }

            return (
              <div key={item.id} className="p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {item.description}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {item.quantity} × {formatCurrency(item.unitPrice, config.pricing.currencySymbol)}
                    {item.unit && ` / ${item.unit}`}
                  </p>
                </div>
                <div className="text-sm font-medium text-zinc-900">
                  {formatCurrency(itemTotal, config.pricing.currencySymbol)}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingId(item.id)}
                    className="p-1 text-zinc-400 hover:text-zinc-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-1 text-zinc-400 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Item Form */}
      {isAdding ? (
        <div className="border border-zinc-200 p-4 bg-zinc-50">
          <div className="space-y-3">
            <Select
              label="Category"
              value={newItem.category}
              onChange={(e) => setNewItem((prev) => ({ ...prev, category: e.target.value }))}
              options={categoryOptions}
            />

            {/* Quick Add from common items */}
            {currentCategory?.commonItems && currentCategory.commonItems.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Quick Add
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentCategory.commonItems.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleQuickAdd(item)}
                      className="text-xs px-2 py-1 bg-white border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 transition-colors"
                    >
                      {item.description} ({formatCurrency(item.defaultPrice, config.pricing.currencySymbol)})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Input
              label="Description"
              value={newItem.description}
              onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Item description"
            />

            <div className="grid grid-cols-3 gap-3">
              {config.quoteBuilder.showQuantity && (
                <Input
                  label="Quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                  min="1"
                />
              )}
              <Input
                label="Unit Price"
                type="number"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem((prev) => ({ ...prev, unitPrice: Number(e.target.value) }))}
                min="0"
                step="0.01"
              />
              {config.quoteBuilder.showUnit && (
                <Input
                  label="Unit"
                  value={newItem.unit || currentCategory?.defaultUnit || ''}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, unit: e.target.value }))}
                  placeholder={currentCategory?.defaultUnit || 'unit'}
                />
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAddItem}
              disabled={!newItem.description.trim() || newItem.unitPrice <= 0}
            >
              Add Item
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" onClick={() => setIsAdding(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Line Item
        </Button>
      )}
    </div>
  );
}
