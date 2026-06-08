'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp, useConfig, useFeedback } from '@/context';
import { Button, Modal } from '@/components/ui';
import { SplitLayout } from '@/components/layout';
import { JobList, JobDetail, JobForm } from '@/components/jobs';

function JobsContent() {
  const searchParams = useSearchParams();
  const { addJob, isLoaded } = useApp();
  const { config } = useConfig();
  const { showToast } = useFeedback();

  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    searchParams.get('id')
  );
  const [isCreating, setIsCreating] = useState(false);

  // Update selection from URL
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setSelectedJobId(id);
    }
  }, [searchParams]);

  const handleCreateJob = (data: {
    clientId: string;
    title: string;
    description: string;
    address?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    scheduledDate?: string;
    status: string;
  }) => {
    const newJob = addJob({
      ...data,
      address: data.address || '',
    });
    setIsCreating(false);
    setSelectedJobId(newJob.id);
    showToast('Job created successfully', 'success');
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
          <h1 className="text-lg font-semibold text-zinc-900">Jobs</h1>
          <Button size="sm" onClick={() => setIsCreating(true)}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Job
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <SplitLayout
            selectedId={selectedJobId}
            list={
              <JobList
                selectedJobId={selectedJobId}
                onSelectJob={setSelectedJobId}
              />
            }
            detail={
              selectedJobId && (
                <JobDetail
                  jobId={selectedJobId}
                  onBack={() => setSelectedJobId(null)}
                />
              )
            }
          />
        </div>
      </div>

      {/* Create Job Modal */}
      <Modal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Create New Job"
        size="lg"
      >
        <JobForm
          onSave={handleCreateJob}
          onCancel={() => setIsCreating(false)}
        />
      </Modal>
    </>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full text-zinc-400">Loading...</div>}>
      <JobsContent />
    </Suspense>
  );
}
