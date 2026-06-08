'use client';

import React, { useMemo } from 'react';
import { useConfig } from '@/context';

interface StatusTimelineProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

export function StatusTimeline({ currentStatus, onStatusChange }: StatusTimelineProps) {
  const { config } = useConfig();

  // Get available transitions from current status
  const availableTransitions = useMemo(() => {
    const transition = config.workflow.transitions.find(
      (t) => t.from === currentStatus
    );
    return transition?.to || [];
  }, [config.workflow.transitions, currentStatus]);

  // Get all statuses in order
  const statuses = config.workflow.statuses;
  const currentIndex = statuses.findIndex((s) => s.id === currentStatus);

  return (
    <div className="space-y-4">
      {/* Visual Timeline */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {statuses.map((status, index) => {
          const isPast = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isCompleted = config.workflow.completedStatuses.includes(status.id);

          return (
            <div key={status.id} className="flex items-center">
              <div
                className={`
                  flex items-center justify-center w-8 h-8 text-xs font-medium flex-shrink-0
                  ${isCurrent
                    ? 'ring-2 ring-offset-2'
                    : isPast
                    ? 'opacity-60'
                    : 'opacity-30'
                  }
                `}
                style={{
                  backgroundColor: isCurrent ? status.color : isPast ? `${status.color}80` : '#e5e7eb',
                  color: isCurrent || isPast ? 'white' : '#9ca3af',
                  ['--tw-ring-color' as string]: isCurrent ? status.color : undefined,
                }}
                title={status.label}
              >
                {isPast ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {index < statuses.length - 1 && (
                <div
                  className={`w-4 h-0.5 ${
                    isPast ? 'bg-zinc-400' : 'bg-zinc-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Status */}
      <div
        className="px-4 py-2 text-sm font-medium"
        style={{
          backgroundColor: `${statuses[currentIndex]?.color}20`,
          color: statuses[currentIndex]?.color,
          borderLeft: `3px solid ${statuses[currentIndex]?.color}`,
        }}
      >
        Current: {statuses[currentIndex]?.label}
      </div>

      {/* Available Actions */}
      {availableTransitions.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 mb-2">Move to:</p>
          <div className="flex flex-wrap gap-2">
            {availableTransitions.map((statusId) => {
              const status = statuses.find((s) => s.id === statusId);
              if (!status) return null;

              return (
                <button
                  key={status.id}
                  onClick={() => onStatusChange(status.id)}
                  className="px-3 py-1.5 text-sm font-medium transition-all hover:scale-105"
                  style={{
                    backgroundColor: `${status.color}20`,
                    color: status.color,
                    border: `1px solid ${status.color}40`,
                  }}
                >
                  {status.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {availableTransitions.length === 0 && (
        <p className="text-sm text-zinc-500 italic">
          No further transitions available from this status.
        </p>
      )}
    </div>
  );
}
