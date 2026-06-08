'use client';

import React from 'react';
import Link from 'next/link';
import { useApp, useConfig } from '@/context';
import { Card, StatusBadge, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/pricing';

export default function Dashboard() {
  const { jobs, clients, quotes, isLoaded } = useApp();
  const { config } = useConfig();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  // Calculate stats
  const activeJobs = jobs.filter(
    (j) => !config.workflow.completedStatuses.includes(j.status)
  );
  const pendingQuotes = quotes.filter((q) => q.status === 'sent');
  const acceptedQuotes = quotes.filter((q) => q.status === 'accepted');
  const totalQuoteValue = acceptedQuotes.reduce((sum, q) => sum + q.total, 0);

  // Get jobs by status
  const jobsByStatus = config.workflow.statuses.reduce((acc, status) => {
    acc[status.id] = jobs.filter((j) => j.status === status.id);
    return acc;
  }, {} as Record<string, typeof jobs>);

  // Recent jobs
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Urgent jobs
  const urgentJobs = activeJobs.filter((j) => j.priority === 'urgent' || j.priority === 'high');

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
            <p className="text-sm text-zinc-500">{config.company.name}</p>
          </div>
          <Link href="/jobs">
            <Button>New Job</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-sm text-zinc-500">Active Jobs</p>
            <p className="text-3xl font-semibold text-zinc-900 mt-1">{activeJobs.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-500">Total Clients</p>
            <p className="text-3xl font-semibold text-zinc-900 mt-1">{clients.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-500">Pending Quotes</p>
            <p className="text-3xl font-semibold text-zinc-900 mt-1">{pendingQuotes.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-500">Accepted Value</p>
            <p className="text-2xl font-semibold text-zinc-900 mt-1">
              {formatCurrency(totalQuoteValue, config.pricing.currencySymbol)}
            </p>
          </Card>
        </div>

        {/* Alerts */}
        {urgentJobs.length > 0 && (
          <Card className="border-l-4 border-l-red-500 bg-red-50">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="font-medium text-red-800">
                  {urgentJobs.length} urgent/high priority job{urgentJobs.length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {urgentJobs.map((j) => j.title).join(', ')}
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Jobs by Status */}
          <Card padding="none">
            <div className="p-4 border-b border-zinc-200">
              <h2 className="font-semibold text-zinc-900">Jobs by Status</h2>
            </div>
            <div className="p-4 space-y-3">
              {config.workflow.statuses
                .filter((s) => !config.workflow.completedStatuses.includes(s.id))
                .map((status) => {
                  const count = jobsByStatus[status.id]?.length || 0;
                  return (
                    <div key={status.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3"
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-sm text-zinc-700">{status.label}</span>
                      </div>
                      <span className="text-sm font-medium text-zinc-900">{count}</span>
                    </div>
                  );
                })}
            </div>
          </Card>

          {/* Recent Jobs */}
          <Card padding="none">
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
              <h2 className="font-semibold text-zinc-900">Recent Jobs</h2>
              <Link href="/jobs" className="text-sm text-zinc-500 hover:text-zinc-700">
                View all
              </Link>
            </div>
            <div className="divide-y divide-zinc-100">
              {recentJobs.length === 0 ? (
                <div className="p-8 text-center text-zinc-400">
                  <p className="text-sm">No jobs yet</p>
                  <Link href="/jobs" className="text-sm text-zinc-600 hover:underline mt-2 inline-block">
                    Create your first job
                  </Link>
                </div>
              ) : (
                recentJobs.map((job) => {
                  const client = clients.find((c) => c.id === job.clientId);
                  return (
                    <Link
                      key={job.id}
                      href={`/jobs?id=${job.id}`}
                      className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-900 truncate">
                          {job.title}
                        </p>
                        <p className="text-xs text-zinc-500">{client?.name || 'Unknown'}</p>
                      </div>
                      <StatusBadge status={job.status} size="sm" />
                    </Link>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/jobs">
            <Card hover className="text-center">
              <svg
                className="w-8 h-8 mx-auto text-zinc-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="text-sm font-medium text-zinc-700">New Job</p>
            </Card>
          </Link>
          <Link href="/clients">
            <Card hover className="text-center">
              <svg
                className="w-8 h-8 mx-auto text-zinc-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <p className="text-sm font-medium text-zinc-700">Add Client</p>
            </Card>
          </Link>
          <Link href="/quotes">
            <Card hover className="text-center">
              <svg
                className="w-8 h-8 mx-auto text-zinc-400 mb-2"
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
              <p className="text-sm font-medium text-zinc-700">New Quote</p>
            </Card>
          </Link>
          <Link href="/settings">
            <Card hover className="text-center">
              <svg
                className="w-8 h-8 mx-auto text-zinc-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-sm font-medium text-zinc-700">Settings</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
