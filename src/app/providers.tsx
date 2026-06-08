'use client';

import React from 'react';
import { ConfigProvider, FeedbackProvider, AppProvider } from '@/context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider>
      <FeedbackProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </FeedbackProvider>
    </ConfigProvider>
  );
}
