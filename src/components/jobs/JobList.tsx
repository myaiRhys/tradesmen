'use client';

import React, { useState, useMemo } from 'react';
import { useApp, useConfig } from '@/context';
import { StatusBadge, PriorityBadge } from '@/components/ui';
import type { Job } from '@/types';

interface JobListProps {
  onSelectJob: (jobId: string) => void;
  selectedJobId?: string | null;
}

export function JobList({ onSelectJob, selectedJobId }: JobListProps) {
  const { jobs, clients } = useApp();
  const { config } = useConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Status filter
        if (statusFilter !== 'all' && job.status !== statusFilter) {
          return false;
        }

        // Search filter
        if (searchQuery) {
          const client = clients.find((c) => c.id === job.clientId);
          const searchLower = searchQuery.toLowerCase();
          return (
            job.title.toLowerCase().includes(searchLower) ||
            job.description.toLowerCase().includes(searchLower) ||
            client?.name.toLowerCase().includes(searchLower) ||
            job.address?.toLowerCase().includes(searchLower)
          );
        }

        return true;
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [jobs, clients, searchQuery, statusFilter]);

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with search and filter */}
      <div className="p-4 border-b border-zinc-200 bg-white">
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
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
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
        >
          <option value="all">All Statuses</option>
          {config.workflow.statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Job List */}
      <div className="flex-1 overflow-y-auto">
        {filteredJobs.length === 0 ? (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-sm text-center">
              {searchQuery || statusFilter !== 'all'
                ? 'No jobs match your filters'
                : 'No jobs yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => onSelectJob(job.id)}
                className={`
                  w-full text-left p-4 hover:bg-zinc-100 transition-colors
                  ${selectedJobId === job.id ? 'bg-zinc-100' : ''}
                `}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-zinc-900 text-sm line-clamp-1">
                    {job.title}
                  </h3>
                  <StatusBadge status={job.status} size="sm" />
                </div>
                <p className="text-xs text-zinc-500 mb-2">
                  {getClientName(job.clientId)}
                </p>
                {job.address && (
                  <p className="text-xs text-zinc-400 line-clamp-1">
                    {job.address}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  {config.features.enablePriorityLevels && (
                    <PriorityBadge priority={job.priority} size="sm" />
                  )}
                  <span className="text-xs text-zinc-400">
                    {new Date(job.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
