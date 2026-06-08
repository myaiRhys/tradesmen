'use client';

import React, { useState } from 'react';

interface SplitLayoutProps {
  list: React.ReactNode;
  detail: React.ReactNode;
  selectedId?: string | null;
  emptyState?: React.ReactNode;
  listWidth?: string;
}

export function SplitLayout({
  list,
  detail,
  selectedId,
  emptyState,
  listWidth = 'w-80 lg:w-96',
}: SplitLayoutProps) {
  const hasSelection = selectedId !== null && selectedId !== undefined;

  return (
    <div className="flex h-full">
      {/* List Panel - Hidden on mobile when detail is shown */}
      <div
        className={`
          ${listWidth} flex-shrink-0 border-r border-zinc-200 bg-zinc-50
          h-full overflow-hidden flex flex-col
          ${hasSelection ? 'hidden md:flex' : 'flex w-full md:w-auto'}
        `}
      >
        {list}
      </div>

      {/* Detail Panel */}
      <div
        className={`
          flex-1 bg-white h-full overflow-hidden
          ${hasSelection ? 'flex flex-col' : 'hidden md:flex md:flex-col'}
        `}
      >
        {hasSelection ? (
          detail
        ) : emptyState ? (
          emptyState
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-400">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-sm">Select an item to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MobileBackButtonProps {
  onBack: () => void;
  label?: string;
}

export function MobileBackButton({ onBack, label = 'Back' }: MobileBackButtonProps) {
  return (
    <button
      onClick={onBack}
      className="md:hidden flex items-center gap-2 text-zinc-600 hover:text-zinc-900 px-4 py-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
