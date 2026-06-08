'use client';

import React, { useState, useMemo } from 'react';
import { useApp, useConfig } from '@/context';
import type { Client } from '@/types';

interface ClientListProps {
  onSelectClient: (clientId: string) => void;
  selectedClientId?: string | null;
}

export function ClientList({ onSelectClient, selectedClientId }: ClientListProps) {
  const { clients, jobs } = useApp();
  const { config } = useConfig();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    return clients
      .filter((client) => {
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          return (
            client.name.toLowerCase().includes(searchLower) ||
            client.phone.includes(searchQuery) ||
            client.email?.toLowerCase().includes(searchLower) ||
            client.address?.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [clients, searchQuery]);

  const getClientJobCount = (clientId: string) => {
    return jobs.filter((j) => j.clientId === clientId).length;
  };

  const getActiveJobCount = (clientId: string) => {
    return jobs.filter(
      (j) => j.clientId === clientId && !config.workflow.completedStatuses.includes(j.status)
    ).length;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with search */}
      <div className="p-4 border-b border-zinc-200 bg-white">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>
      </div>

      {/* Client List */}
      <div className="flex-1 overflow-y-auto">
        {filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 p-8">
            <svg
              className="w-12 h-12 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-sm text-center">
              {searchQuery ? 'No clients match your search' : 'No clients yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredClients.map((client) => {
              const jobCount = getClientJobCount(client.id);
              const activeJobs = getActiveJobCount(client.id);

              return (
                <button
                  key={client.id}
                  onClick={() => onSelectClient(client.id)}
                  className={`
                    w-full text-left p-4 hover:bg-zinc-100 transition-colors
                    ${selectedClientId === client.id ? 'bg-zinc-100' : ''}
                  `}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-zinc-900 text-sm truncate">
                          {client.name}
                        </h3>
                        {config.features.enableClientTiers && client.tier && (
                          <span
                            className={`
                              text-xs px-1.5 py-0.5 font-medium
                              ${client.tier === 'vip' ? 'bg-yellow-100 text-yellow-700' : ''}
                              ${client.tier === 'premium' ? 'bg-purple-100 text-purple-700' : ''}
                              ${client.tier === 'standard' ? 'bg-zinc-100 text-zinc-600' : ''}
                            `}
                          >
                            {client.tier.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500">{client.phone}</p>
                      {client.email && (
                        <p className="text-xs text-zinc-400 truncate">{client.email}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {jobCount > 0 && (
                        <div className="text-xs">
                          <span className="text-zinc-500">{jobCount} job{jobCount !== 1 ? 's' : ''}</span>
                          {activeJobs > 0 && (
                            <span className="ml-1 text-blue-600">({activeJobs} active)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
